import { driver, initYDBdriver } from '../utils/ydb-functions';
import { Session } from 'ydb-sdk';
import { fillTransactionSettings } from 'ydb-table-defs';

/*
Подготовка:
Запустите пример из basic-example-new-way
На выходе Вы получите несколько таблиц с данными

Запускайте пример
результат проверяйте в консоли:
https://console.cloud.yandex.ru/
*/

/*
 Данный пример показывает как передавать transactionID в цепочке запросов и комитить транзакцию на последнем запросе
 */

(async function run() {
    await initYDBdriver(); // если не удалось инициализация - то внутри идет process.exit

    await driver.tableClient.withSession(async (session: Session) => {
        // первый запрос - начинаем транзакцию, но не комитим ее, используем хелпер
        const data = await session.executeQuery(
            "upsert into series (series_id, title) values (11,'11')", // query
            {}, // params
            { beginTx: fillTransactionSettings('serializableReadWrite'), commitTx: false }
        );

        // по завершении запроса мы получим ID транзакции в  data.txMeta.id;
        if (!data.txMeta?.id) {
            throw new Error('не удалось открыть транзакцию');
        }
        // второй запрос - посылаем второй запрос и закрываем транзакцию
        const data2 = await session.executeQuery(
            "upsert into series (series_id, title) values (12,'12')", // query
            {}, // params
            { txId: data.txMeta.id, commitTx: true } // txControl
        );

        console.log(data2);
    });

    await driver.destroy();
})();
