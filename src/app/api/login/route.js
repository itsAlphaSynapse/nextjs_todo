import { NextResponse } from "next/server"
import genrateToken from "@/util/genrateToken/genrateToken";
import connectToDataBase from "@/lib/db";
import { cookies } from "next/headers";

export const POST = async (req) => {
    try {
        const { userName, password } = await req.json();
        if (!userName || !password) {
            return NextResponse.json({ message: "Please fill in all fields.", success: false })
        }

        const pg = await connectToDataBase();

        const checkTableQuery = `
        SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'users'
        ) AS table_exists;
        `;

        const checkTableResult = await pg.query(checkTableQuery);

        if (checkTableResult.rows[0].table_exists) {
            const data = await pg.query(`
            SELECT * FROM users WHERE username = $1 AND password = $2
        `, [userName, password]);

            if (data.rowCount === 0) {
                return NextResponse.json({ message: "Wrong Credentials!", success: false })
            }

            const token = genrateToken({ username: data.rows[0].username, email: data.rows[0].email }, 'never')

            // update cookieStore
            const cookieStore = cookies();
            cookieStore.delete('authTokenforNextJsTodo');
            cookieStore.set('authTokenforNextJsTodo', token);

            return NextResponse.json({ message: { userName: data.rows[0].username, id: data.rows[0].id }, success: true })
        } else {
            return NextResponse.json({ message: "Wrong Credentials!", success: false })
        }

    } catch (error) {
        console.log(error);
        return NextResponse.status(500).json({ message: error.message, success: false })
    }
}
