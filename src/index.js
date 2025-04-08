import { createServer } from 'node:http';
import { parse } from 'node:url';
import { readFile } from 'node:fs/promises';

const pagesPath = './pages'

createServer(async (req, res) => {
  const url = parse(req.url, true);
  const filename = url.pathname === '/' ? '/index.html' : url.pathname + '.html'
  const filePath = pagesPath + filename;
  const errorPage = pagesPath + '/404.html';

  try {
    const data = await readFile(filePath);
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(data);
  } catch(err) {
    try {
      const errData = await readFile(errorPage);
      res.writeHead(404, {"Content-Type": "text/html"});
      res.end(errData)
    } catch(err404) {
      res.writeHead(500, {"Content-Type": "text/plain"});
      res.end('Erro interno');
    }
  }
}).listen(8080);