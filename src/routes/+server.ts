import { json, type RequestHandler } from "@sveltejs/kit";
import { PROXY_SECRET } from "$env/static/private";

export const POST: RequestHandler = async (event) => {
    const { request } = event;
    const secret = request.headers.get('x-proxy-secret')

    if (!secret || secret !== PROXY_SECRET) return json({ error: 'Unauthorized' }, { status: 403 });

    let bodyJSON;
    try {
        bodyJSON = await request.json();
    } catch {
        return json({ error: `Invalid JSON` }, { status: 400 })
    }

    const { url, method = "POST", headers = {}, body } = bodyJSON;

    if (!url || typeof url !== 'string' || !url.startsWith('https://')) return json({ error: 'Invalid or missing url' }, { status: 400 });

    // return json({ url, headers, body })
    try {
        const response = await fetch(url, { method, headers, body: JSON.stringify(body) });
        return response;
    } catch (error) {
        return json({ error, url, headers, body })
    }

}