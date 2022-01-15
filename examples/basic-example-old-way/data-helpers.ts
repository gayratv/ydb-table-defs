import { Ydb, TypedData } from 'ydb-sdk';
import Pt = Ydb.Type.PrimitiveTypeId;
import { ITableFromClass, declareTypePrim, declareTypeNull } from 'ydb-table-defs2';

/*
    declareTypePrim - описывает обязательные поля
                      В данном примере в обязательные поля я записал только те, из которых состоит primary key
    declareTypeNull - описывает опциональные поля

    обратите внимание на запись
    public declare ...

    Дело в том что в конструкторе базового класса уже идет заполнение данными:
    lodash  _.assign(this, data);
    Но если вместо public declare написать просто public - то получается что Вы в наследующем классе создадите переменную, которая перекроет переменную базового класса,
    в результате чего в наследующем классе у Вас все переменные будут undefined
 */

type ISeries = ITableFromClass<Series>;

export class Series extends TypedData {
    @declareTypePrim(Pt.UINT64)
    public declare seriesId: number;

    @declareTypeNull(Pt.UTF8)
    public declare title?: string;

    @declareTypeNull(Pt.DATE)
    public declare releaseDate?: Date;

    @declareTypeNull(Pt.UTF8)
    public declare seriesInfo?: string;

    static create(inp: ISeries): Series {
        return new this(inp);
    }

    constructor(data: ISeries) {
        super(data);
    }
}

type IEpisode = ITableFromClass<Episode>;

export class Episode extends TypedData {
    @declareTypePrim(Pt.UINT64)
    public declare seriesId: number;

    @declareTypePrim(Pt.UINT64)
    public declare seasonId: number;

    @declareTypePrim(Pt.UINT64)
    public declare episodeId: number;

    @declareTypeNull(Pt.UTF8)
    public declare title?: string;

    @declareTypeNull(Pt.DATE)
    public declare airDate?: Date;

    constructor(data: IEpisode) {
        super(data);
    }
}

type ISeason = ITableFromClass<Season>;

export class Season extends TypedData {
    @declareTypePrim(Pt.UINT64)
    public declare seriesId: number;

    @declareTypePrim(Pt.UINT64)
    public declare seasonId: number;

    @declareTypeNull(Pt.UTF8)
    public declare title?: string;

    @declareTypeNull(Pt.DATE)
    public declare firstAired?: Date;

    @declareTypeNull(Pt.DATE)
    public declare lastAired?: Date;

    constructor(data: ISeason) {
        super(data);
    }
}
