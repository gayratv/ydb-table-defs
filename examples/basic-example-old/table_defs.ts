import { Ydb, TypedData } from 'ydb-sdk';
import Type = Ydb.Type;
import { ITableFromClass, declareTypePrim, declareTypeNull } from '@/types';

type ISeries = ITableFromClass<Series>;

export class Series extends TypedData {
    @declareTypePrim(Type.PrimitiveTypeId.UINT64)
    public seriesId = 0; // начальные присваивания нужны для задания типа и чтобы избежать ошибки TS:
    // TS2564: Property 'seriesId' has no initializer and is not definitely assigned in the constructor.

    @declareTypeNull(Type.PrimitiveTypeId.UTF8)
    public title = '';

    @declareTypeNull(Type.PrimitiveTypeId.DATE)
    public releaseDate: Date = new Date();

    @declareTypeNull(Type.PrimitiveTypeId.UTF8)
    public seriesInfo = '';

    static create(inp: ISeries): Series {
        return new this(inp);
    }

    constructor(data: ISeries) {
        // фактическое присваивание данных идет в родительском конструкторе :  _.assign(this, data);
        super(data);
    }
}
