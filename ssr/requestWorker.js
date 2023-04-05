import { JSDOM } from 'jsdom';
import { parentPort } from 'worker_threads';
import { createServer as createViteServer } from 'vite';
import fs from "fs";
import path from "path";
import { fileURLToPath, URL } from 'node:url'
import  jsxDomBuilderVitePlugin from "../vite-plugin.js"

// Listen for messages from the main thread
parentPort.on('message', async ({url,html,server}) => {
  // Access the global variable passed from the main thread
  const vite = await createViteServer({
        server: {
            middlewareMode: true,
            appType: 'custom',
        },
        plugins:[
            jsxDomBuilderVitePlugin(),
        ],
        resolve: {
            alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            }
        }
    });
  const dom = new JSDOM(fs.readFileSync(html, "utf8"));


  global.window = dom.window;
  global.document = global.window.document;
  global.MutationObserver = global.window.MutationObserver;
  global.HTMLElement = global.window.HTMLElement;
  // Send the modified global variable back to the main thread

  const main = await vite.ssrLoadModule(server);
  main.default(url)
  parentPort.postMessage(document.documentElement.outerHTML);
  await vite.close();
});