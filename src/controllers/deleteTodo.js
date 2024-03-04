import connectToDataBase from "@/lib/db";
import authToken from "@/util/authToken/authToken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const deleteTodo = async (req) => {
    try {
        const id = req.nextUrl.searchParams.get('id');

        const cookie = cookies(req).get('authTokenforNextJsTodo')?.value;
        const authResponse = await authToken(cookie);
        if (!authResponse) {
            return NextResponse.json({ success: false })
        }

        const pg = await connectToDataBase();
        await pg.query('DELETE FROM todos WHERE id = $1 AND userid = $2', [id, authResponse.id]);

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false })
    }
}

export default deleteTodo;