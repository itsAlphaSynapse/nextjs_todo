import { Client } from 'pg';

const {
    POSTGREAQL_SERVER_USER,
    POSTGREAQL_SERVER_PASSWORD,
    POSTGREAQL_SERVER_HOST,
    POSTGREAQL_SERVER_PORT,
    DB_NAME
} = process.env;

let catchedConnection = null;

const connectToDataBase = async () => {

    if (catchedConnection) {
        return catchedConnection;
    }
    try {
        const postgreSQL = new Client({
            user: POSTGREAQL_SERVER_USER,
            password: POSTGREAQL_SERVER_PASSWORD,
            host: POSTGREAQL_SERVER_HOST,
            port: POSTGREAQL_SERVER_PORT,
        });

        await postgreSQL.connect()

        const checkResult = await postgreSQL.query(`
        SELECT datname FROM pg_database WHERE datname = $1;
        `, [DB_NAME]);

        if (checkResult.rows.length === 0) {
            await postgreSQL.query(`CREATE DATABASE ${DB_NAME};`);
        }

        await postgreSQL.end();

        const client = new Client({
            user: POSTGREAQL_SERVER_USER,
            password: POSTGREAQL_SERVER_PASSWORD,
            host: POSTGREAQL_SERVER_HOST,
            database: DB_NAME,
            port: POSTGREAQL_SERVER_PORT,
        });

        await client.connect();


        catchedConnection = client;
        return catchedConnection;
    }
    catch (error) {
        console.log(error.message);
        return null;
    }
}

export default connectToDataBase;
