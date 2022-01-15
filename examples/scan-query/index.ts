process.env.YDB_SDK_PRETTY_LOGS = '1';

import { Column, Logger, Primitive, Session, TableDescription, withRetries, Ydb } from 'ydb-sdk';
import { Row } from './data-helpers';
import { initYDBdriver, logger, databaseName, driver } from '../utils/ydb-functions';

const TABLE = 'scan_query';

function fillRows(startBatch: number) {
    const rows: Row[] = [];

    for (let i = startBatch; i < startBatch + 1000; ++i) {
        rows.push(new Row({ key: String(i), hash: i, value: i % 2 === 0 ? 'even' : 'odd' }));
    }
    return Row.asTypedCollection(rows);
}

export async function fillTableWithData(session: Session) {
    // вставим 10 тысяч строк
    for (let i = 0; i < 10; i++) {
        const rows = fillRows(i * 1000);
        await session.bulkUpsert(`${databaseName}/${TABLE}`, rows as Ydb.TypedValue);
    }
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

export async function executeScanQueryWithParams(session: Session): Promise<void> {
    const query = `
        PRAGMA TablePathPrefix("${databaseName}");

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

(async function () {
    await initYDBdriver();

    await driver.tableClient.withSession(async (session) => {
        await Row.createDBTable(session, logger);
        await fillTableWithData(session);
        await executeScanQueryWithParams(session);
    });
    await driver.destroy();
})();
