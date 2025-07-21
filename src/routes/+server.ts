import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
    console.log(JSON.stringify(event, null, 2))
    // const secret = request.headers.get('x-proxy-secret');
    // console.log({ secret });

    return new Response(secret);
    // if (!secret || secret !== 'Ennis01+') return json({ error: 'Unauthorized' }, { status: 403 });

    // let bodyJSON;
    // try {
    //     bodyJSON = await request.json();
    // } catch {
    //     return json({ error: `Invalid JSON` }, { status: 400 })
    // }

    // const { url, method = "POST", headers = {}, body } = bodyJSON;

    // if (!url || typeof url !== 'string' || !url.startsWith('https://')) return json({ error: 'Invalid or missing url' }, { status: 400 });

    // const response = await fetch(url, { method, headers, body });
    // const result = await response.json();

    // return result;
}