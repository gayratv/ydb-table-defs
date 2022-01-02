import { Ydb, declareType, TypedData, Session, Logger, TableDescription, Column } from 'ydb-sdk';
import Type = Ydb.Type;

interface ISeries {
    seriesId: number;
    title: string;
    releaseDate: Date;
    seriesInfo: string;
}
export class Series extends TypedData {
    @declareType({ typeId: Type.PrimitiveTypeId.UINT64 })
    public seriesId: number;

    @declareType({ typeId: Type.PrimitiveTypeId.UTF8 })
    public title: string;

    @declareType({ typeId: Type.PrimitiveTypeId.DATE })
    public releaseDate: Date;

    @declareType({ typeId: Type.PrimitiveTypeId.UTF8 })
    public seriesInfo: string;

    static create(seriesId: number, title: string, releaseDate: Date, seriesInfo: string): Series {
        return new this({ seriesId, title, releaseDate, seriesInfo });
    }

    constructor(data: ISeries) {
        super(data);
        this.seriesId = data.seriesId;
        this.title = data.title;
        this.releaseDate = data.releaseDate;
        this.seriesInfo = data.seriesInfo;
    }
}

export const yql_series = `
PRAGMA TablePathPrefix("tablePathPrefix");

DECLARE $seriesData AS List<Struct<
series_id: Uint64,
    title: Utf8,
    series_info: Utf8,
    release_date: Date>>;

REPLACE INTO SERIES_TABLE
SELECT
series_id,
    title,
    series_info,
    release_date
FROM AS_TABLE($seriesData);`;

const SERIES_TABLE = 'series';

export async function createSeriesTables(session: Session, logger: Logger) {
    logger.info('Dropping old tables...');
    await session.dropTable(SERIES_TABLE);

    logger.info('Creating tables...');
    await session.createTable(
        SERIES_TABLE,
        new TableDescription()
            .withColumn(
                new Column(
                    'series_id',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UINT64 } } })
                )
            )
            .withColumn(
                new Column(
                    'title',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UTF8 } } })
                )
            )
            .withColumn(
                new Column(
                    'series_info',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.UTF8 } } })
                )
            )
            .withColumn(
                new Column(
                    'release_date',
                    Ydb.Type.create({ optionalType: { item: { typeId: Ydb.Type.PrimitiveTypeId.DATE } } })
                )
            )
            .withPrimaryKey('series_id')
    );
}
