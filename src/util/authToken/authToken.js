import connectToDataBase from "@/lib/db";
import jwt from "jsonwebtoken";

const authToken = (cookie) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!cookie) {
                resolve(false)
            }
            let jwtDecode = jwt.verify(cookie, process.env.JWT_SECRET)

            const pg = await connectToDataBase();

            const checkTableQuery = `
        SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'users'
        ) AS table_exists;
        `;
            const checkTableResult = await pg.query(checkTableQuery);


            if (!checkTableResult.rows[0].table_exists) {
                resolve(false)
                return;
            }

            const data = await pg.query(`
        SELECT * FROM users WHERE username = $1 AND email = $2
        `, [jwtDecode.username, jwtDecode.email]);

            if (data.rowCount === 0) {
                resolve(false)
                return;
            }
            resolve(data.rows[0])
        } catch (error) {
            if (error.message === 'jwt expired') {
                resolve(false)
            } else {
                reject(error)
            }
        }
    })
}

export default authToken;
