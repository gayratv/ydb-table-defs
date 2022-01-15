import { driver, initYDBdriver } from '../utils/ydb-functions';
import { Session } from 'ydb-sdk';
import { fillTransactionSettings, fillTimeOuts } from 'ydb-table-defs';

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
        //  начинаем транзакцию,и сразу закрываем ее
        const data = await session.executeQuery(
            "upsert into series (series_id, title) values (11,'11')", // query
            {}, // params
            { beginTx: fillTransactionSettings('serializableReadWrite'), commitTx: true },
            fillTimeOuts(3, 3) // параметры operationMode, labels, reportCostInfo в настоящий момент не используются в SDK, поэтому заполнять их не требуется
        );

        // по завершении запроса мы получим ID транзакции в  data.txMeta.id;
        if (!data.txMeta?.id) {
            throw new Error('не удалось открыть транзакцию');
        }

        console.log(data);
    });

    await driver.destroy();
})();
