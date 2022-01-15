import { driver, initYDBdriver } from '../utils/ydb-functions';
import { Session } from 'ydb-sdk';
import { beginTransactionQuick, TransactionType } from 'ydb-table-defs';

/*
Подготовка:
Запустите пример из basic-example-new-way
На выходе Вы получите несколько таблиц с данными

Запускайте пример
результат проверяйте в консоли:
https://console.cloud.yandex.ru/
*/

(async function run() {
    await initYDBdriver(); // если не удалось инициализация - то внутри идет process.exit

    await driver.tableClient.withSession(async (session: Session) => {

        const transaction = await session.beginTransactionQuick('serializableReadWrite');

        if (!transaction.id) {
            throw new Error('невозможно начать транзакцию');
        }

        const data = await session.executeQuery(
            "upsert into series (series_id, title) values (24,'24')", // query
            {}, // params
            { txId: transaction.id, commitTx: true } // txControl
        );

        /*

        // Если Вы желаете самостоятельно закрыть транзакцию - то напишите так
        const data = await session.executeQuery(
            "upsert into series (series_id, title) values (21,'21')", // query
            {}, // params
            { txId: transaction.id, commitTx: true } // txControl
        );
        */

        console.log(`Результат записи данных`);
        console.log(data);
        console.log('Проверьте результат в консоли: https://console.cloud.yandex.ru/');

        // Данный метод надо вызывать если Вы не указали commitTx: true
        // await session.commitTransaction({ txId: transaction.id });

        // Если Вы не закроете транзакцию - то не увидите результат update
    });

    await driver.destroy();
})();
