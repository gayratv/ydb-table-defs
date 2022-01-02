import { driver, initYDBdriver } from './utils/ydb-functions';
// import { ColorConsole, CT } from '../utils/color-console';
import { Session } from 'ydb-sdk';

(async function run() {
    await initYDBdriver(); // если не удалось инициализация - то внутри идет process.exit

    await driver.tableClient.withSession(async (session: Session) => {
        // const data = await session.describeTable('episodes');
        // @ts-ignore
        // const data = await session.describeTable('episodes', { includeTableStats: true, includePartitionStats: true });
        const data = await session.describeTable('episodes', { includeTableStats: true });
        console.log(data);
        console.log('rowsEstimate ', (data.tableStats!.rowsEstimate as Long).low);
        console.log('storeSize ', (data.tableStats!.storeSize as Long).low);
        // console.log(data.tableStats!.modificationTime);
        const seconds = (data.tableStats!.modificationTime!.seconds as Long).low;
        const d = new Date(seconds * 1000);
        d.setTime(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
        console.log('modificationTime ', d);
    });

    await driver.destroy();
})();
