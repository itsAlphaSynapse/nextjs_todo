import connectToDataBase from "@/lib/db"
import { NextResponse } from "next/server"
import genrateToken from "@/util/genrateToken/genrateToken";
import { cookies } from "next/headers";

export const POST = async (req) => {
    try {
        const { userName, email, password } = await req.json();
        if (!userName || !email || !password) {
            return NextResponse.json({ message: "Please fill in all fields.", success: false })
        }

        const pg = await connectToDataBase();

        await pg.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);

        const data = await pg.query(`
        SELECT * FROM users WHERE username = $1
        `, [userName]);

        if (data.rowCount !== 0) {
            return NextResponse.json({ message: "UserName Alreay Exsists", success: false })
        }

        const user = await pg.query(`
        INSERT INTO users (username, email, password) VALUES ($1, $2, $3)
        RETURNING *
        `, [userName, email, password]);

        console.log(user.rows[0]);

        const token = genrateToken({ username: user.rows[0].username, email: user.rows[0].email }, 'never')

        // update cookieStore
        const cookieStore = cookies();
        cookieStore.delete('authTokenforNextJsTodo');
        cookieStore.set('authTokenforNextJsTodo', token);

        return NextResponse.json({ message: { username: user.rows[0].username, id: user.rows[0].id }, success: true })

    } catch (error) {
        console.log(error);
        return NextResponse.status(500).json({ message: error.message, success: false })
    }
}
