import {
    Ydb,
    Session,
    Logger,
    withRetries,
    TableDescription,
    Column,
    typeMetadataKey,
    declareType,
    TypedData,
    getNameConverter,
} from 'ydb-sdk';
import Type = Ydb.Type;

export type NonFunctionKeys<T extends object> = {
    [K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T];

export type ITableFromClass<T extends object> = { [K in NonFunctionKeys<T>]: T[K] };

export type NonNeverKeys<T extends object> = {
    [K in keyof T]-?: T[K] extends never ? never : K;
}[keyof T];

// тест
// type T1 = {
//   a: number;
//   b: never;
//   c: string;
// };
// type O2 = NonNeverKeys<T1>;
// выход
// type O2_r = 'a' | 'c';

export type NonUndefinedKeys<T extends object> = {
    [K in keyof T]-?: T[K] extends undefined ? never : K;
}[keyof T];

export type RemoveNever<T extends object> = { [K in NonNeverKeys<T>]: T[K] };

// тест
// type O3 = RemoveNever<T1>;
// выход
// type O3_r = {
//   a: number;
//   c: string;
// };

export type OptionalUndefined<T extends object> = {
    [K in NonUndefinedKeys<T>]+?: T[K];
};

export type RemoveIntersection<T> = { [K in keyof T]: T[K] };

type RequiredFields<B extends Record<string, FieldsDefinition>> = RemoveNever<{
    [K in keyof B]: B[K]['opt'] extends string ? B[K]['val'] : never;
}>;

type OptionalFields<B extends Record<string, FieldsDefinition>> = OptionalUndefined<{
    [K in keyof B]: B[K]['opt'] extends number ? B[K]['val'] : never;
}>;

/*
  На вход получает тип , образуемый из объекта JS

  const tdef = {
    id: { val: 0, pt: Pt.UINT64, opt: 'r' },
    title: { val: 'title', pt: Pt.UTF8, opt: 0 },
    genre_ids: { val: 'json', pt: Pt.JSON, opt: 0 },
    release_date: { val: new Date(), pt: Pt.DATE, opt: 0 },
  };

  type ITdef = ConvertStructToTypes<typeof tdef>;

  На выходе получаем :
  {
    id : number;
    title? : string; // опциональный параметр
    genre_ids? : string;
    release_date? : Date;
  }

  Новые записи можно создавать передавая только обязательные параметры
  const rec = new Tdef({ id: 25 });

 */
export type ConvertStructToTypes<T extends Record<string, FieldsDefinition>> = RemoveIntersection<
    RequiredFields<T> & OptionalFields<T>
>;

export interface TypedDataFieldDescription {
    name: string;
    typeId: number;
    optional: boolean;
    typeName: string;
    primaryKey?: boolean;
}

export interface FieldsDefinition {
    val: any;
    pt: Ydb.Type.PrimitiveTypeId;
    opt: string | number;
    pk?: boolean; // primary key
}

export type TableDefinition = Record<string, FieldsDefinition>;

export class YdbTableMetaData {
    public tableName = '';
    public fieldsDescriptions: Array<TypedDataFieldDescription> = [];
    public YQLUpsert = '';
    public YQLReplaceSeries = '';
    public YQLCreateTable = '';
    public tableDef: TableDefinition = {};
}

export function declareTypePrim(typePrim: Type.PrimitiveTypeId) {
    const type: Ydb.IType = { typeId: typePrim };
    return declareType(type);
}
export function declareTypeNull(typePrim: Type.PrimitiveTypeId) {
    const type: Ydb.IType = { optionalType: { item: { typeId: typePrim } } };
    return declareType(type);
}

export const errorText: Record<number, string> = {
    1: 'Please provide tabledefinition in refMetaData',
};

export class TypedDataDefs extends TypedData {
    public static refMetaData: YdbTableMetaData;

    private expandFields() {
        const refMeta: YdbTableMetaData = (this.constructor as typeof TypedDataDefs).refMetaData;
        if (!refMeta) throw new Error(errorText[1]); // если описание таблицы идет старым способом

        Reflect.ownKeys(refMeta.tableDef).forEach((key) => {
            if (!this[key as string]) {
                this[key as string] = null;
            }
        });
    }

    private createQueryParams() {
        const resObj: Record<string, any> = {};
        // @ts-ignore   доступ к static свойству derived класса
        const refMeta: YdbTableMetaData = this.constructor.refMetaData;

        Reflect.ownKeys(this).forEach((key) => {
            key = key.toString();
            resObj['$' + key] = this.getTypedValue(key);
        });

        return resObj;
    }

    private static generateFieldsDescription() {
        const refMeta: YdbTableMetaData = this.refMetaData;
        const tdef = refMeta.tableDef;
        const converter = getNameConverter(this.__options, 'jsToYdb');

        Reflect.ownKeys(tdef).forEach((key) => {
            const keys: string = key as string;
            const fld: TypedDataFieldDescription = {
                name: converter(keys),
                typeId: tdef[keys].pt,
                optional: tdef[keys].opt === 0,
                typeName: primitiveTypeIdToName[tdef[keys].pt],
                primaryKey: tdef[keys].pk,
            };
            refMeta.fieldsDescriptions.push(fld);
        });
    } // generateFieldsDescription

    private static generateYQLUpsert(databaseName: string) {
        let rst = `PRAGMA TablePathPrefix("${databaseName}");`;
        let rst_series = `PRAGMA TablePathPrefix("${databaseName}");\nDECLARE $seriesData AS List<Struct<`;

        const refMeta: YdbTableMetaData = this.refMetaData;

        refMeta.fieldsDescriptions.forEach((fld) => {
            rst += `\nDECLARE $${fld.name} as ${fld.typeName}${fld.optional ? '?' : ''};`;
            rst_series += `\n   ${fld.name} : ${fld.typeName}${fld.optional ? '?' : ''},`;
        });
        rst_series = rst_series.substring(0, rst_series.length - 1);
        rst_series += `>>;\n\nREPLACE INTO ${refMeta.tableName}\nSELECT *`;

        rst += `\n\nUPSERT INTO ${refMeta.tableName} (`;

        refMeta.fieldsDescriptions.forEach((itm) => {
            rst += `\n   ${itm.name},`;
        });

        rst = rst.substring(0, rst.length - 1);
        rst_series += '\nFROM AS_TABLE($seriesData);';

        rst += '\n)VALUES (';
        refMeta.fieldsDescriptions.forEach((itm) => {
            rst += `\n   $${itm.name},`;
        });
        rst = rst.substring(0, rst.length - 1);
        rst += '\n);';

        refMeta.YQLUpsert = rst;
        refMeta.YQLReplaceSeries = rst_series;
    } // generateYQLUpsert

    static generateInitialData(tableDef: TableDefinition) {
        const resultObj: any = {};
        Reflect.ownKeys(tableDef).forEach((key) => {
            key = key as string;
            resultObj[key] = tableDef[key].val;
        });
        return resultObj;
    } // generateInitialData

    private generateMetadata() {
        if (!(this.constructor as typeof TypedDataDefs).refMetaData) return;
        const tableDef: TableDefinition = (this.constructor as typeof TypedDataDefs).refMetaData.tableDef;

        Reflect.ownKeys(tableDef).forEach((key) => {
            let metadataValue: any = {};
            key = key as string;

            if (tableDef[key].opt === 'r') {
                metadataValue = { typeId: tableDef[key].pt };
            } else
                metadataValue = {
                    optionalType: { item: { typeId: tableDef[key].pt } },
                };

            Reflect.defineMetadata(typeMetadataKey, metadataValue, this, key);
        });
    } // generateMetadata

    private static generateYQLcreateTable(databaseName: string) {
        let rst = `PRAGMA TablePathPrefix("${databaseName}");\n`;
        let rst_primary = `\n    PRIMARY KEY (`;
        let first_primary = true;

        rst += `CREATE TABLE ${this.refMetaData.tableName} (`;
        this.refMetaData.fieldsDescriptions.forEach((fld) => {
            rst += `\n    ${fld.name} ${primitiveTypeIdToName[fld.typeId]},`;
            if (fld.primaryKey) {
                if (!first_primary) {
                    rst_primary += ',';
                }
                first_primary = false;
                rst_primary += fld.name;
            }
        });
        rst_primary += ')';
        rst += rst_primary + '\n)';
        this.refMetaData.YQLCreateTable = rst;
    } // generateYQLcreateTable

    static initTableDef(databaseName: string, tableName: string, tdef: TableDefinition) {
        this.refMetaData = new YdbTableMetaData();
        this.refMetaData.tableName = tableName;
        this.refMetaData.tableDef = tdef;

        this.generateFieldsDescription();
        this.prototype.generateMetadata();

        this.generateYQLUpsert(databaseName);
        this.generateYQLcreateTable(databaseName);
    }

    async upsertToDB(session: Session, logger: Logger): Promise<{ result: boolean; message: string }> {
        const refMeta = (this.constructor as typeof TypedDataDefs).refMetaData;
        if (!refMeta) throw new Error(errorText[1]);

        const YQLUpsert = refMeta.YQLUpsert;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const thisRecord = this;

        async function fillTable() {
            logger.info('Inserting data to tables, preparing query...');

            let preparedQuery: Ydb.Table.PrepareQueryResult;
            try {
                preparedQuery = await session.prepareQuery(YQLUpsert);
                logger.info('Query has been prepared, executing...');
                await session.executeQuery(preparedQuery, thisRecord.createQueryParams());
                return { result: true, message: 'OK' };
            } catch (err) {
                let msg = '';
                if (err instanceof Error) {
                    console.error(err.message);
                    msg = err.message;
                } else msg = 'unknown Error';
                return { result: false, message: msg };
            }
        }

        return await withRetries(fillTable);
    }

    /*
      upsert нескольких значений реализовать не удалось - потому что если передавать неполные данные (только часть полей)
      то YDB для серии все равно требует ввода всех полей
     */
    static async replaceSeriesToDB(
        session: Session,
        logger: Logger,
        dataArray: Array<TypedDataDefs>
    ): Promise<{ result: boolean; message: string }> {
        if (!this.refMetaData) throw new Error(errorText[1]); // если описание таблицы идет старым способом

        const YQLReplace = this.refMetaData.YQLReplaceSeries;

        // должен быть передан полный набор полей
        dataArray.forEach((data) => {
            data.expandFields();
        });

        async function fillTable() {
            logger.info('Inserting data to tables, preparing query...');
            try {
                const preparedQuery = await session.prepareQuery(YQLReplace);
                logger.info('Query has been prepared, executing...');

                const typedDataCollection = TypedData.asTypedCollection(dataArray);
                await session.executeQuery(preparedQuery, { $seriesData: typedDataCollection });
                // await session.executeQuery(preparedQuery, { $seriesData: TypedData.asTypedCollection(dataArray) });
                return { result: true, message: 'OK' };
            } catch (err) {
                let msg = '';
                if (err instanceof Error) {
                    console.error(err.message);
                    msg = err.message;
                } else msg = 'unknown Error';
                return { result: false, message: msg };
            }
        }

        return await withRetries(fillTable);
    }

    /*
    Так не работает
    static async createDBTable(session: Session, logger: Logger ) {

        const YQLCreateTable =  this.refMetaData.YQLCreateTable;

        async function createTable() {
            logger.info('Creating table...');
                await session.executeQuery(YQLCreateTable);
        }

        await withRetries(createTable);
    }*/

    static async createDBTable(session: Session, logger: Logger) {
        logger.info('Creating table... ' + this.refMetaData.tableName);

        const columns: Array<Column> = [];
        const primaryKeys: Array<string> = [];
        this.refMetaData.fieldsDescriptions.forEach((fld) => {
            const type = { optionalType: { item: { typeId: fld.typeId } } };
            // Only optional type for columns supported

            const column = new Column(fld.name, Ydb.Type.create(type));
            columns.push(column);
            if (fld.primaryKey) {
                primaryKeys.push(fld.name);
            }
        });

        await session.createTable(
            this.refMetaData.tableName,
            new TableDescription().withColumns(...columns).withPrimaryKeys(...primaryKeys)
        );
    }

    static async dropDBTable(session: Session, logger: Logger) {
        logger.info('Drop table... ' + this.refMetaData.tableName);
        await session.dropTable(this.refMetaData.tableName);
    }
}

export const primitiveTypeIdToName: Record<string, string> = {};

function initPrimitiveTypeIdToName() {
    for (const itm of Object.entries(Type.PrimitiveTypeId)) {
        // @ts-ignore
        primitiveTypeIdToName[itm[1]] = itm[0];
    }
}

// Side Effect
initPrimitiveTypeIdToName();
