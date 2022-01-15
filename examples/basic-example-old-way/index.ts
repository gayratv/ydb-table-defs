import { Series } from './data-helpers';

process.env.YDB_SDK_PRETTY_LOGS = '1';

import { Column, Logger, Session, TableDescription, withRetries, Ydb } from 'ydb-sdk';
// @ts-ignore
import { getEpisodesData, getSeasonsData, getSeriesData } from './get-data';
// @ts-ignore
import { driver, initYDBdriver, logger, databaseName as dbName } from '../utils/ydb-functions';

const SERIES_TABLE = 'series';
const SEASONS_TABLE = 'seasons';
const EPISODES_TABLE = 'episodes';

export async function createTables(session: Session, logger: Logger) {
    logger.info('Dropping old tables...');
    await session.dropTable(SERIES_TABLE);
    await session.dropTable(EPISODES_TABLE);
    await session.dropTable(SEASONS_TABLE);

    logger.info('Creating tables...');
    await session.createTable(
        SERIES_TABLE,
        new TableDescription()
            .withColumn(
                new Column(
                    'series_id',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UINT64 } } })
                )
            )
            .withColumn(
                new Column(
                    'title',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UTF8 } } })
                )
            )
            .withColumn(
                new Column(
                    'series_info',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UTF8 } } })
                )
            )
            .withColumn(
                new Column(
                    'release_date',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.DATE } } })
                )
            )
            .withPrimaryKey('series_id')
    );

    await session.createTable(
        SEASONS_TABLE,
        new TableDescription()
            .withColumn(
                new Column(
                    'series_id',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UINT64 } } })
                )
            )
            .withColumn(
                new Column(
                    'season_id',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UINT64 } } })
                )
            )
            .withColumn(
                new Column(
                    'title',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UTF8 } } })
                )
            )
            .withColumn(
                new Column(
                    'first_aired',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.DATE } } })
                )
            )
            .withColumn(
                new Column(
                    'last_aired',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.DATE } } })
                )
            )
            .withPrimaryKeys('series_id', 'season_id')
    );

    await session.createTable(
        EPISODES_TABLE,
        new TableDescription()
            .withColumn(
                new Column(
                    'series_id',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UINT64 } } })
                )
            )
            .withColumn(
                new Column(
                    'season_id',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UINT64 } } })
                )
            )
            .withColumn(
                new Column(
                    'episode_id',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UINT64 } } })
                )
            )
            .withColumn(
                new Column(
                    'title',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UTF8 } } })
                )
            )
            .withColumn(
                new Column(
                    'air_date',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.DATE } } })
                )
            )
            .withPrimaryKeys('series_id', 'season_id', 'episode_id')
    );
}

export async function describeTable(session: Session, tableName: string, logger: Logger) {
    logger.info(`Describing table: ${tableName}`);
    const result = await session.describeTable(tableName);
    for (const column of result.columns) {
        logger.info(`Column name '${column.name}' has type ${JSON.stringify(column.type)}`);
    }
}

export async function fillTablesWithData(session: Session) {
    const query = `
PRAGMA TablePathPrefix("${dbName}");

DECLARE $seriesData AS List<
    Struct<
        series_id: Uint64,
        title: Utf8? ,
        series_info: Utf8? ,
        release_date: Date?
    >>;
DECLARE $seasonsData AS List<Struct<
    series_id: Uint64,
    season_id: Uint64,
    title: Utf8? ,
    first_aired: Date? ,
    last_aired: Date? >>;
DECLARE $episodesData AS List<Struct<
    series_id: Uint64,
    season_id: Uint64,
    episode_id: Uint64,
    title: Utf8? ,
    air_date: Date? >>;

REPLACE INTO series
SELECT
    series_id,
    title,
    series_info,
    release_date
FROM AS_TABLE($seriesData);

REPLACE INTO ${SEASONS_TABLE}
SELECT
    series_id,
    season_id,
    title,
    first_aired,
    last_aired
FROM AS_TABLE($seasonsData);

REPLACE INTO ${EPISODES_TABLE}
SELECT
    series_id,
    season_id,
    episode_id,
    title,
    air_date
FROM AS_TABLE($episodesData);
`;

    async function fillTable() {
        logger.info('Inserting data to tables, preparing query...');
        const preparedQuery = await session.prepareQuery(query);
        logger.info('Query has been prepared, executing...');

        await session.executeQuery(preparedQuery, {
            $seriesData: getSeriesData(),
            $seasonsData: getSeasonsData(),
            $episodesData: getEpisodesData(),
        });
    }
    await withRetries(fillTable);
}

(async function run() {
    await initYDBdriver(); // если не удалось инициализация - то внутри идет process.exit
    await driver.tableClient.withSession(async (session) => {
        await createTables(session, logger);
        await describeTable(session, 'series', logger);
        await fillTablesWithData(session);
    });

    await driver.destroy();
})();
