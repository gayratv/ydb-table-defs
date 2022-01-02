import { driver, initYDBdriver } from './utils/ydb-functions';
// @ts-ignore
import { Session, Ydb, AUTO_TX } from 'ydb-sdk';
import { fillTransactionSettings } from '../src/helpers';

(async function run() {
    await initYDBdriver(); // если не удалось инициализация - то внутри идет process.exit

    await driver.tableClient.withSession(async (session: Session) => {
        // первый запрос - начинаем транзакцию, но не комитим ее
        const data = await session.executeQuery(
            "upsert into series (series_id, title) values (11,'11')", // query
            {}, // params
            { beginTx: fillTransactionSettings('serializableReadWrite'), commitTx: false } // txControl
        );
        // по завершении запроса мы получим ID транзакции в  data.txMeta.id;
        if (!data.txMeta?.id) {
            throw new Error('не удалось открыть транзакцию');
        }
        // второй запрос - посылаем запрос и закрываем транзакцию
        const data2 = await session.executeQuery(
            "upsert into series (series_id, title) values (12,'12')", // query
            {}, // params
            { txId: data.txMeta.id, commitTx: true } // txControl
        );

        console.log(data2);
    });

    await driver.destroy();
})();
