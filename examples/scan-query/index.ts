process.env.YDB_SDK_PRETTY_LOGS = '1';

import { Column, Logger, Primitive, Session, TableDescription, withRetries, Ydb } from 'ydb-sdk';
import { Row } from './data-helpers';
import { initYDBdriver, logger, databaseName, driver } from '../utils/ydb-functions';

const TABLE = 'table';

export async function createTable(session: Session, logger: Logger) {
    logger.info('Dropping old table...');
    await session.dropTable(TABLE);

    logger.info('Creating table...');
    await session.createTable(
        TABLE,
        new TableDescription()
            .withColumn(
                new Column(
                    'key',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UTF8 } } })
                )
            )
            .withColumn(
                new Column(
                    'hash',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UINT64 } } })
                )
            )
            .withColumn(
                new Column(
                    'value',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UTF8 } } })
                )
            )
            .withPrimaryKey('key')
    );
}

export async function fillTableWithData(tablePathPrefix: string, session: Session, logger: Logger) {
    const query = `
PRAGMA TablePathPrefix("${tablePathPrefix}");

DECLARE $data AS List<Struct<
    key: Utf8,
    hash: Uint64,
    value: Utf8>>;

REPLACE INTO ${TABLE}
SELECT
    key,
    hash,
    value
FROM AS_TABLE($data);`;

    let preparedQuery: Ydb.Table.PrepareQueryResult;

    async function prepareQueryTable() {
        logger.info('Inserting data to table, preparing query...');
        preparedQuery = await session.prepareQuery(query);
        logger.info('Query has been prepared, executing...');
    }

    async function fillTable() {
        const rows: Row[] = [];

        for (let i = 0; i < 30000; ++i) {
            rows.push(new Row({ key: String(i), hash: i, value: i % 2 === 0 ? 'even' : 'odd' }));
            if (rows.length === 1000) {
                await session.executeQuery(preparedQuery, {
                    $data: Row.asTypedCollection(rows),
                });
                rows.length = 0;
            }
        }
    }

    await prepareQueryTable();
    await withRetries(fillTable);
}

function formatFirstRows(rows?: Ydb.IValue[] | null) {
    if (!rows || rows.length === 0) {
        return '[]';
    }
    return JSON.stringify(rows.slice(0, 5)) + (rows.length > 5 ? '...' : 0);
}

function formatPartialResult(result: Ydb.Table.ExecuteScanQueryPartialResult) {
    if (!result.resultSet) {
        return 'No result set';
    }
    return `
row count: ${result.resultSet.rows?.length},
first rows: ${formatFirstRows(result.resultSet.rows)}`;
}

export async function executeScanQueryWithParams(
    tablePathPrefix: string,
    session: Session,
    logger: Logger
): Promise<void> {
    const query = `
        PRAGMA TablePathPrefix("${tablePathPrefix}");

        DECLARE $value AS Utf8;

        SELECT key
        FROM ${TABLE}
        WHERE value = $value;`;

    logger.info('Making a stream execute scan query...');

    const params = {
        $value: Primitive.utf8('odd'),
    };

    let count = 0;
    await session.streamExecuteScanQuery(
        query,
        (result) => {
            logger.info(`Stream scan query partial result #${++count}: ${formatPartialResult(result)}`);
        },
        params
    );

    logger.info(`Stream scan query completed, partial result count: ${count}`);
}

async function run() {
    await driver.tableClient.withSession(async (session) => {
        // await createTable(session, logger);
        // await fillTableWithData(databaseName, session, logger);
        await executeScanQueryWithParams(databaseName, session, logger);
    });
    await driver.destroy();
}

(async function () {
    await initYDBdriver();
    await run();
})();
