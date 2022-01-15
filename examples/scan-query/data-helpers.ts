import { Ydb } from 'ydb-sdk';
import { ConvertStructToTypes, TypedDataDefs } from 'ydb-table-defs';
import { databaseName } from '../utils/ydb-functions';

const Pt = Ydb.Type.PrimitiveTypeId;

const row_def = {
    key: { val: 'key', pt: Pt.UTF8, opt: 'r', pk: true },
    hash: { val: 0, pt: Pt.UINT64, opt: 0 },
    value: { val: 'value', pt: Pt.UTF8, opt: 0 },
};

export type IRow = ConvertStructToTypes<typeof row_def>;

export class Row extends TypedDataDefs {
    constructor(data: IRow) {
        super(data);
    }
}

Row.initTableDef(databaseName, 'scan_query', row_def);
