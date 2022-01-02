import { driver, initYDBdriver } from '../utils/ydb-functions';
import { Session, Ydb } from 'ydb-sdk';
import '@/helpers/augmentation';

(async function run() {
    await initYDBdriver(); // если не удалось инициализация - то внутри идет process.exit

    await driver.tableClient.withSession(async (session: Session) => {
        const data = await session.executeQueryQuick(
            `upsert into series (series_id, title) values (41,'41');
            upsert into season (season_id, title) values (41,'41');`,
            {},
            { txType: 'serializableReadWrite', commitTx: true },
            { operationTimeout: 5 },
            true,
            Ydb.Table.QueryStatsCollection.Mode.STATS_COLLECTION_FULL
        );

        console.log('===============');
        console.log(data);
        const stats = data.queryStats!.queryPhases!['0'];
        const stats_rows_updated = (stats.tableAccess!['0'].updates?.rows as Long).low;
        const affectedShards = (stats.affectedShards as Long).low;

        console.log('\nstats_rows_updated : ', stats_rows_updated, ', affectedShards : ', affectedShards, '\n\n');
    });

    await driver.destroy();
})();
