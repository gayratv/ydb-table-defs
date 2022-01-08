// необходимо включить этот файл один раз в один из модулей так:
// import './helpers/augmentation';

import { Ydb, Session, ExecDataQuerySettings, AUTO_TX } from 'ydb-sdk';
import { fillTimeOuts, fillTransactionSettings, TransactionType } from '@/helpers/index';

interface IQueryParams {
    [k: string]: Ydb.ITypedValue;
}

interface IExistingTransaction {
    txId: string;
}

interface INewTransaction {
    txType: TransactionType;
    commitTx?: boolean;
    allowInconsistentReads?: boolean | null;
}

interface INewTransactionOld {
    beginTx: Ydb.Table.ITransactionSettings;
    commitTx: boolean;
}

declare module 'ydb-sdk' {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Ydb {
        // eslint-disable-next-line @typescript-eslint/no-namespace
        namespace Table {
            interface TransactionSettings {
                age: number;

                walk(location: string): void;
            }
        }
    }
    interface Session {
        beginTransactionQuick(
            txType: TransactionType,
            allowInconsistentReads?: boolean | null,
            operationTimeout?: number,
            cancelAfter?: number
        ): Promise<Ydb.Table.ITransactionMeta>;
        executeQueryQuick(
            query: Ydb.Table.PrepareQueryResult | string,
            params?: IQueryParams,
            txControl?: IExistingTransaction | INewTransaction,
            timeOuts?: { operationTimeout?: number; cancelAfter?: number },
            casheSettings?: boolean,
            collectStats?: Ydb.Table.QueryStatsCollection.Mode | null
        ): Promise<Ydb.Table.ExecuteQueryResult>;
    }
}

Session.prototype.beginTransactionQuick = function (
    txType: TransactionType,
    allowInconsistentReads?: boolean | null,
    operationTimeout?: number,
    cancelAfter?: number
) {
    return this.beginTransaction(
        fillTransactionSettings(txType, allowInconsistentReads),
        fillTimeOuts(operationTimeout, cancelAfter)
    );
};

Session.prototype.executeQueryQuick = async function (
    query: Ydb.Table.PrepareQueryResult | string,
    params?: IQueryParams,
    txControl?: IExistingTransaction | INewTransaction,
    timeOuts?: { operationTimeout?: number; cancelAfter?: number },
    casheSettings = false,
    collectStats?: Ydb.Table.QueryStatsCollection.Mode | null
): Promise<Ydb.Table.ExecuteQueryResult> {
    let txControlC: IExistingTransaction | INewTransactionOld | undefined = undefined;
    if (txControl) {
        if ('txId' in txControl) {
            txControlC = txControl;
        } else {
            txControlC = {
                beginTx: fillTransactionSettings(txControl?.txType, txControl?.allowInconsistentReads),
                commitTx: true,
            };
            if (txControl.commitTx) txControlC.commitTx = txControl.commitTx;
        }
    } else txControlC = AUTO_TX;

    let operationParams: Ydb.Operations.IOperationParams | undefined = undefined;
    if (timeOuts) {
        operationParams = fillTimeOuts(timeOuts.operationTimeout, timeOuts.cancelAfter);
    }

    let settings: ExecDataQuerySettings | undefined = undefined;
    if (casheSettings) settings = { keepInCache: true } as ExecDataQuerySettings;

    return this.executeQuery(query, params, txControlC, operationParams, settings, collectStats);
};
