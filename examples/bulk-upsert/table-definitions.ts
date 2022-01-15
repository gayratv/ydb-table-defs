import { Ydb } from 'ydb-sdk';
import { ConvertStructToTypes, TypedDataDefs } from 'ydb-table-defs';
import { databaseName } from '../utils/ydb-functions';

const Pt = Ydb.Type.PrimitiveTypeId;

const log_messages = {
    app: { val: 'app', pt: Pt.UTF8, opt: 'r', pk: true },
    timestamp: { val: new Date(), pt: Pt.TIMESTAMP, opt: 'r', pk: true },
    host: { val: 'host', pt: Pt.UTF8, opt: 'r', pk: true },
    httpCode: { val: 200, pt: Pt.UINT32, opt: 0 },
    message: { val: 'message', pt: Pt.UTF8, opt: 0 },
};

export type ILog_message = ConvertStructToTypes<typeof log_messages>;

export class LogMessage extends TypedDataDefs {
    constructor(data: ILog_message) {
        super(data);
    }
}
// инициализация класса таблицы
LogMessage.initTableDef(databaseName, 'log_messages', log_messages);
