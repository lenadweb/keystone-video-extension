import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

export const serveFixture = async () => {
    const html = await readFile('tests/fixtures/player.html');
    const server = createServer((request, response) => {
        if (request.url !== '/') {
            response.writeHead(404).end();
            return;
        }
        response
            .writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            .end(html);
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    return {
        url: `http://127.0.0.1:${server.address().port}/`,
        close: () =>
            new Promise((resolve, reject) =>
                server.close((error) => (error ? reject(error) : resolve()))
            ),
    };
};
