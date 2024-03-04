import connectToDataBase from "@/lib/db";
import authToken from "@/util/authToken/authToken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const addTodo = async (req) => {
    try {
        const { text, description } = await req.json();

        if (!text) {
            return NextResponse.json({ message: "Please provide a task", success: false })
        }

        const cookie = cookies().get('authTokenforNextJsTodo')?.value;
        const authResponse = await authToken(cookie);
        if (!authResponse) {
            return NextResponse.json({ success: false })
        }

        const pg = await connectToDataBase();
        const newTodo = await pg.query(
            `INSERT INTO todos (text, description,userid) VALUES ($1, $2, $3) RETURNING *`,
            [text, description, authResponse.id]
        );
        return NextResponse.json({ data: newTodo.rows[0], success: true })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false })
    }
}

export default addTodo;
