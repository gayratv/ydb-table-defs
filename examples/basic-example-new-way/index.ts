import { driver, initYDBdriver, logger } from '../utils/ydb-functions';
import { Episodes, Season, Series } from './table-definitions';
import { getEpisodesData, getSeasonsData, getSeriesData } from './table-data';
import { ColorConsole, CT } from '../utils/color-console';
import { Session } from 'ydb-sdk';

(async function run() {
    await initYDBdriver(); // если не удалось инициализация - то внутри идет process.exit

    CT.print_fgColor(ColorConsole.FgMagentaBold, '\n\nтаблица Series, данные из refMetaData\n');
    CT.print_fgColor(ColorConsole.FgMagentaBold, '+++++++++++++++++++ YQLCreateTable');
    console.log(Series.refMetaData.YQLCreateTable);
    console.log(CT.set_color(ColorConsole.FgMagentaBold), '+++++++++++++++++++ YQLReplaceSeries', CT.reset());
    console.log(Series.refMetaData.YQLReplaceSeries);
    CT.print_fgColor(ColorConsole.FgMagentaBold, '+++++++++++++++++++\n\n');

    await driver.tableClient.withSession(async (session: Session) => {
        await Series.dropDBTable(session, logger);
        await Series.createDBTable(session, logger);
        await Series.replaceSeriesToDB(session, logger, getSeriesData());

        await Season.dropDBTable(session, logger);
        await Season.createDBTable(session, logger);
        await Season.replaceSeriesToDB(session, logger, getSeasonsData());

        await Episodes.dropDBTable(session, logger);
        await Episodes.createDBTable(session, logger);
        await Episodes.replaceSeriesToDB(session, logger, getEpisodesData());
    });

    await driver.destroy();
})();
