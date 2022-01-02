import {Driver, getSACredentialsFromJson, IamAuthService, Logger} from 'ydb-sdk';

export async function run(logger: Logger, entryPoint: string, dbName: string, args?: any) {
    logger.debug('Driver initializing...');
    const saKeyFile = args.serviceAccountKeyFile;
    const saCredentials = getSACredentialsFromJson(saKeyFile);
    const authService = new IamAuthService(saCredentials, dbName);
    const driver = new Driver(entryPoint, dbName, authService);
    const timeout = 10000;
    if (!await driver.ready(timeout)) {
        logger.fatal(`Driver has not become ready in ${timeout}ms!`);
        process.exit(1);
    }
}

export const options = [{
    key: 'serviceAccountKeyFile',
    name: 'service-account-key-file',
    description: 'service account key file for YDB authenticate',
}];
