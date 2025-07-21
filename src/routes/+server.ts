import { json, type RequestHandler } from "@sveltejs/kit";
import { PROXY_SECRET } from "$env/static/private";

export const OPTIONS = () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-PROXY-SECRET'
        }
    });
};

export const POST: RequestHandler = async ({ request }) => {
    const secret = request.headers.get('x-proxy-secret');
    if (!secret || secret !== PROXY_SECRET) {
        return json({ error: 'Unauthorized' }, {
            status: 403,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }

    let bodyJSON;
    try {
        bodyJSON = await request.json();
    } catch {
        return json({ error: 'Invalid JSON' }, {
            status: 400,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }

    const { url, method = 'POST', headers = {}, body } = bodyJSON;

    if (!url || typeof url !== 'string' || !url.startsWith('https://')) {
        return json({ error: 'Invalid or missing url' }, {
            status: 400,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }

    try {
        const proxiedResponse = await fetch(url, {
            method,
            headers,
            body: typeof body === 'string' ? body : JSON.stringify(body)
        });

        // Read proxied response as raw body (buffer or text)
        const contentType = proxiedResponse.headers.get('content-type') || '';
        const buffer = await proxiedResponse.arrayBuffer();

        console.log(JSON.stringify({ url, method, headers, body: typeof body === 'string' ? body : JSON.stringify(body) }, null, 2))

        return new Response(buffer, {
            status: proxiedResponse.status,
            statusText: proxiedResponse.statusText,
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err: any) {
        console.error('Proxy fetch failed:', err);
        return json({ error: 'Proxy request failed', detail: err.message }, {
            status: 502,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }
};
