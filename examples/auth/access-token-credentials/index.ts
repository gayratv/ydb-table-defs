import { config } from 'dotenv';
import { Driver, getLogger, TokenAuthService } from 'ydb-sdk';
import fs from 'fs';
import path from 'path';

config({ path: 'env.local' });

const databaseName = process.env.DATABASENAME!;
const logger = getLogger({ level: process.env.LOGLEVEL! });
const entryPoint = process.env.ENTRYPOINT!;
const driver: Driver = null as unknown as Driver; // singleton

const fileToken = fs.readFileSync(path.resolve(__dirname, 'iam-token.txt'), 'utf8').trim();

export async function run() {
    logger.debug('Driver initializing...');

    const accessToken = fileToken;

    const authService = new TokenAuthService(accessToken, databaseName);
    const driver = new Driver(entryPoint, databaseName, authService);
    const timeout = 10000;
    const drvInitResult = await driver.ready(timeout);
    if (!drvInitResult) {
        // if (!(await driver.ready(timeout))) {
        logger.fatal(`Driver has not become ready in ${timeout}ms!`);
        process.exit(1);
    }
}

(async () => {
    console.log('Инициализация драйвера');
    await run();
    console.log('Драйвер инициализирован - токен сработал');
})();
