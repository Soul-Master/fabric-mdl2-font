import Koa from 'koa';
import type { Context } from 'koa';
import send from 'koa-send';
import path from 'node:path';
import type { SendOptions } from 'koa-send';

interface SendError {
    status: number;
}

const hostPort = 8080;
const srcFolder = '/src/';
const allowFolders = [
    '/font/',
    '/svg/'
];
const app = new Koa();
app.use(serve());
app.listen(hostPort);

console.info('http://127.0.0.1:' + hostPort);

// Port from `koa-static` package
// https://github.com/koajs/static/blob/master/index.js
function serve() {
    const options: SendOptions = {
        root: path.resolve('.'),
        index: 'index.html'
    };
  
    return async function serve (ctx: Context, next: Function) {
        let done: boolean | string = false

        if (ctx.method === 'HEAD' || ctx.method === 'GET') {
            try {
                if (allowFolders.every(x => !ctx.path.startsWith(x))) {
                    ctx.path = srcFolder + ctx.path;
                }

                done = await send(ctx, ctx.path, options)
            }
            catch (err) {
                if ((<SendError>err).status !== 404) {
                    throw err
                }
            }
        }

        if (!done) {
            await next()
        }
    }
}