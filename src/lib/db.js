import { Client } from 'pg';

const {
    POSTGREAQL_USER,
    POSTGREAQL_PASSWORD,
    POSTGREAQL_HOST,
    POSTGREAQL_DATABASE
} = process.env;

let catchedConnection = null;

const connectToDataBase = async () => {

    if (catchedConnection) {
        return catchedConnection;
    }
    try {
        const postgreSQL = new Client({
            user: POSTGREAQL_USER,
            password: POSTGREAQL_PASSWORD,
            host: POSTGREAQL_HOST,
            port: 5432,
        });

        await postgreSQL.connect()

        const checkResult = await postgreSQL.query(`
        SELECT datname FROM pg_database WHERE datname = $1;
        `, [POSTGREAQL_DATABASE]);

        if (checkResult.rows.length === 0) {
            await postgreSQL.query(`CREATE DATABASE ${POSTGREAQL_DATABASE};`);
        }

        await postgreSQL.end();

        const client = new Client({
            user: POSTGREAQL_USER,
            password: POSTGREAQL_PASSWORD,
            host: POSTGREAQL_HOST,
            database: POSTGREAQL_DATABASE,
            port: 5432,
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
