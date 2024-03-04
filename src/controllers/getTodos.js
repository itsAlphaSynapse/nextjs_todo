import connectToDataBase from "@/lib/db";
import authToken from "@/util/authToken/authToken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"

const getTodos = async (req) => {

    try {
        const cookie = cookies().get('authTokenforNextJsTodo')?.value;
        const authResponse = await authToken(cookie);
        if (!authResponse) {
            return NextResponse.json({ success: false })
        }
        const pg = await connectToDataBase();
        await pg.query(`
        CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        completed BOOLEAN DEFAULT false,
        userId INT REFERENCES users(id)
        )`)

        const todos = await pg.query(`
        SELECT * FROM todos WHERE userId = $1
        `, [authResponse.id])

        console.log(todos.rows);

        return NextResponse.json({ data: todos.rows, success: true })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ data: [], success: false }).status(500);
    }
}

export default getTodos;
