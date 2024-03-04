const { default: connectToDataBase } = require("@/lib/db");
const { default: authToken } = require("@/util/authToken/authToken");
const { cookies } = require("next/headers");
const { NextResponse } = require("next/server");

const handleDone = async (req) => {
    try {
        const id = req.nextUrl.searchParams.get('id');
        const { done } = await req.json();

        console.log(done);

        const cookie = cookies().get('authTokenforNextJsTodo')?.value;
        const authResponse = await authToken(cookie);
        if (!authResponse) {
            return NextResponse.json({ success: false });
        }

        const pg = await connectToDataBase();
        await pg.query(
            'UPDATE todos SET completed = $1 WHERE id = $2 AND userid = $3',
            [done, id, authResponse.id]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false });
    }
}

export default handleDone;