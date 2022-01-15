import { Session, Ydb } from 'ydb-sdk';
import { LogMessage } from './table-definitions';
import { initYDBdriver, logger, driver, databaseName } from '../utils/ydb-functions';

const TABLE_NAME = 'log_messages';
const BATCH_SIZE = 1000;

const now = Date.now();

export function getLogBatch(offset: number): LogMessage[] {
    const logs = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
        const message = new LogMessage({
            app: `App_${Math.trunc(i / 256)}`,
            host: `192.168.0.${offset % 256}`,
            timestamp: new Date(now + offset * 1000 + (i % 1000)),
            httpCode: 200,
            message: i % 2 === 0 ? 'GET / HTTP/1.1' : 'GET /images/logo.png HTTP/1.1',
        });
        logs.push(message);
    }
    return logs;
}

export async function writeLogBatch(session: Session, logs: LogMessage[]) {
    const rows = LogMessage.asTypedCollection(logs) as Ydb.TypedValue;
    return await session.bulkUpsert(`${databaseName}/${TABLE_NAME}`, rows, {
        reportCostInfo: Ydb.FeatureFlag.Status.ENABLED,
    });
}

async function run() {
    await initYDBdriver();

    await driver.tableClient.withSession(async (session) => {
        // создать таблицу
        await LogMessage.dropDBTable(session, logger);
        await LogMessage.createDBTable(session, logger);
        for (let offset = 0; offset < 2; offset++) {
            const logs = getLogBatch(offset);
            logger.info(`Write log batch with offset ${offset}`);
            const ret = await writeLogBatch(session, logs);
            console.log('RETURN info : ', ret);
        }
        logger.info('Done');
    });
    await driver.destroy();
}

(async function () {
    await initYDBdriver();
    await run();
})();
