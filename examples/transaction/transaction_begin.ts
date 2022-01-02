import { driver, initYDBdriver } from '../utils/ydb-functions';
import { Session } from 'ydb-sdk';
import { beginTransactionQuick } from '../../src/helpers';

(async function run() {
    await initYDBdriver(); // если не удалось инициализация - то внутри идет process.exit

    await driver.tableClient.withSession(async (session: Session) => {
        const transaction = await beginTransactionQuick(session, 'serializableReadWrite');
        if (!transaction.id) {
            throw new Error('невозможно начать транзакцию');
        }

        const data = await session.executeQuery(
            "upsert into series (series_id, title) values (21,'21')", // query
            {}, // params
            { txId: transaction.id } // txControl
        );
        console.log(data);
        await session.commitTransaction({ txId: transaction.id });
    });

    await driver.destroy();
})();
