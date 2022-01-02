import { config } from 'dotenv';
config({ path: 'env.local' });

import { getLogger, Driver, getCredentialsFromEnv, Session, Logger } from 'ydb-sdk';
import { primitiveTypeIdToName } from '@/types';
import { ColorConsole, CT } from './color-console';

export const databaseName = process.env.DATABASENAME!;
export const logger = getLogger({ level: process.env.LOGLEVEL! });
export const entryPoint = process.env.ENTRYPOINT!;
export let driver: Driver = null as unknown as Driver; // singleton

export async function initYDBdriver() {
    if (driver) return; // singleton
    logger.info('Start preparing driver ...');
    const authService = getCredentialsFromEnv(entryPoint, databaseName, logger);
    driver = new Driver(entryPoint, databaseName, authService);

    if (!(await driver.ready(10000))) {
        logger.fatal(`Driver has not become ready in 10 seconds!`);
        process.exit(1);
    }
    return driver;
}

export async function describeTable(session: Session, tableName: string, logger: Logger) {
    logger.info(`Describing table: ${tableName}`);
    const result = await session.describeTable(tableName);

    console.log(
        CT.set_color(ColorConsole.FgBlue) + '%s',
        `\nDescribe table ${CT.set_color(ColorConsole.FgRed)} "${tableName}"${CT.set_color(ColorConsole.FgBlue)}`
    );
    for (const column of result.columns) {
        console.log(
            `  Column '${column.name}' type ${primitiveTypeIdToName[column.type!.optionalType!.item!.typeId!]}`
        );
    }

    console.log(CT.reset());
}
