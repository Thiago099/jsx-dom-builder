import { Worker } from 'worker_threads';

function getMessageAsync(worker)
{
    return new Promise((resolve, reject) => {
        worker.on('message', (message) => {
            resolve(message);
        });
    });
}

function ExpressPlugin(html, server)
{
    return async (req, res) => {
      const url = req.originalUrl;
      var requestThread = new Worker(new URL('./ssr/requestWorker.js', import.meta.url));
      requestThread.postMessage({html,server,url})
      res.status(200).set({ 'Content-Type': 'text/html' }).end(await getMessageAsync(requestThread));
  }
}

export default ExpressPlugin
