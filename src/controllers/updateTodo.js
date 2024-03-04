import connectToDataBase from "@/lib/db";
import authToken from "@/util/authToken/authToken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const updateTodo = async (req) => {
    try {
        const id = req.nextUrl.searchParams.get('id');
        const { text, description } = await req.json();

        const cookie = cookies(req).get('authTokenforNextJsTodo')?.value;
        const authResponse = await authToken(cookie);
        if (!authResponse) {
            return NextResponse.json({ success: false });
        }

        const pg = await connectToDataBase();
        await pg.query(
            'UPDATE todos SET text = $1, description = $2 WHERE id = $3 AND userid = $4',
            [text, description, id, authResponse.id]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: '', success: false });
    }
}

export default updateTodo;