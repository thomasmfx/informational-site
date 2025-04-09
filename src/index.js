import { createServer } from 'node:http';
import { parse } from 'node:url';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const PORT = 8080;
const pagesPath = './src/pages';
const cssPath = './src/css';

createServer(async (req, res) => {
  const url = parse(req.url, true);
  const pathname = url.pathname;
  
  // Verificar se é uma solicitação de CSS
  if (pathname.startsWith('/css/') && pathname.endsWith('.css')) {
    try {
      const cssFilePath = join(cssPath, pathname.replace('/css/', ''));
      const data = await readFile(cssFilePath);
      res.writeHead(200, {"Content-Type": "text/css"});
      res.end(data);
      return;
    } catch(err) {
      console.error(`CSS não encontrado: ${pathname}`);
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.end('CSS não encontrado');
      return;
    }
  }
  
  // Páginas HTML
  const filename = pathname === '/' ? '/index.html' : pathname + '.html';
  const filePath = join(pagesPath, filename);
  const errorPage = join(pagesPath, '/404.html');

  try {
    const data = await readFile(filePath);
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(data);
  } catch(err) {
    try {
      const errData = await readFile(errorPage);
      res.writeHead(404, {"Content-Type": "text/html"});
      res.end(errData);
    } catch(err404) {
      res.writeHead(500, {"Content-Type": "text/plain"});
      res.end('Erro interno');
    }
  }
}).listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});