import { config } from 'dotenv';
config({ path: 'env.local' });

import { Driver, getLogger, TokenAuthService } from '@ggvlasov/ydb-sdk';
import fs from 'fs';
import path from 'path';

export const databaseName = process.env.DATABASENAME!;
export const logger = getLogger({ level: process.env.LOGLEVEL! });
export const entryPoint = process.env.ENTRYPOINT!;
export const driver: Driver = null as unknown as Driver; // singleton

const fileToken = fs.readFileSync(path.resolve(__dirname, 'iam-token.txt'), 'utf8').trim();

export async function run() {
    logger.debug('Driver initializing...');

    const accessToken = fileToken;

    const authService = new TokenAuthService(accessToken, databaseName);
    const driver = new Driver(entryPoint, databaseName, authService);
    const timeout = 10000;
    if (!(await driver.ready(timeout))) {
        logger.fatal(`Driver has not become ready in ${timeout}ms!`);
        process.exit(1);
    }
}

export const options = [
    {
        key: 'ydbAccessToken',
        name: 'ydb-access-token',
        description: 'access token for YDB authentication',
    },
];

(async () => {
    await run();
})();
