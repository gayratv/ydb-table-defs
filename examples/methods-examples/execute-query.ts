import { driver, initYDBdriver } from '../utils/ydb-functions';
// import { ColorConsole, CT } from '../utils/color-console';
// @ts-ignore
import { Session, Ydb, AUTO_TX } from 'ydb-sdk';

(async function run() {
    await initYDBdriver(); // если не удалось инициализация - то внутри идет process.exit

    await driver.tableClient.withSession(async (session: Session) => {
        /* const data = await session.executeQuery(
            'select * from series',
            {},
            AUTO_TX,
            undefined,
            undefined,
            Ydb.Table.QueryStatsCollection.Mode.STATS_COLLECTION_BASIC
        ); */
        const data = await session.executeQuery(
            'select * from series',
            {},
            {
                beginTx: {
                    serializableReadWrite: {},
                },
                commitTx: true,
            },
            {
                reportCostInfo: Ydb.FeatureFlag.Status.ENABLED,
                labels: { lbl: 'labels text descr' },
            },
            undefined,
            Ydb.Table.QueryStatsCollection.Mode.STATS_COLLECTION_BASIC
        );
        console.log('===============');
        console.log(data);
        const stats_rows_read = (data.queryStats!.queryPhases!['0'].tableAccess!['0'].reads!.rows as Long).low;
        const affectedShards = (data.queryStats!.queryPhases!['0'].affectedShards as Long).low;

        console.log(stats_rows_read, affectedShards);

        // <html>TS2345: Argument of type '{ labels: { lbl: string; }; }'
        // is not assignable to parameter of type
        // 'ExecDataQuerySettings'.<br/>Object literal may only specify known properties, and 'labels' does not exist in type 'ExecDataQuerySettings'.
    });

    await driver.destroy();
})();
