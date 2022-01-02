import { Session, Ydb } from 'ydb-sdk';

export type TransactionType = 'serializableReadWrite' | 'onlineReadOnly' | 'staleReadOnly';

export function fillTransactionSettings(
    txType: TransactionType,
    allowInconsistentReads?: boolean | null
): Ydb.Table.ITransactionSettings {
    switch (txType) {
        case 'serializableReadWrite':
            return { serializableReadWrite: {} };
        case 'onlineReadOnly':
            return { onlineReadOnly: { allowInconsistentReads: allowInconsistentReads } };
        case 'staleReadOnly':
            return { staleReadOnly: {} };
    }
}

export function fillTimeOuts(operationTimeout?: number, cancelAfter?: number): Ydb.Operations.IOperationParams {
    return { operationTimeout: { seconds: operationTimeout }, cancelAfter: { seconds: cancelAfter } };
}

export function beginTransactionQuick(
    session: Session,
    txType: TransactionType,
    allowInconsistentReads?: boolean | null,
    operationTimeout?: number,
    cancelAfter?: number
): Promise<Ydb.Table.ITransactionMeta> {
    return session.beginTransaction(
        fillTransactionSettings(txType, allowInconsistentReads),
        fillTimeOuts(operationTimeout, cancelAfter)
    );
}
