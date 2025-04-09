import express from "express";
const app = express();

const pagesPath = '/home/thomas/Home/github/repos/informational-site/src/pages'
const pages = {
  '/': `${pagesPath}/index.html`,
  '/about': `${pagesPath}/about.html`,
  '/contact-me': `${pagesPath}/contact-me.html`,
  error: `${pagesPath}/404.html`,
}

app.use(express.static('public')); // css

app.get('/', async (req, res) => {
  res.sendFile(pages['/'])
});

app.get('/:page', async (req, res) => {
  const pathname = `/${req.params.page}`;
  const fileName = pages[pathname]

  if (!fileName) {
    return res.status(404).sendFile(pages.error)
  }

  res.sendFile(fileName)
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})