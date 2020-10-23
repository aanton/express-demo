const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/get-request', (req, res) => {
  res.send(`
<h1>GET request</h1>
<p>GET parameter: search => ${req.query.search} at ${Date.now()}</p>
  `);
});

app.get('/post-request', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/post-request.html'));
});

app.post('/post-request', (req, res) => {
  res.send(`
<h1>POST request</h1>
<p>POST arameter: search => ${req.body.search} at ${Date.now()}</p>
  `);
});

app.get('/write-file', async (req, res) => {
  const filepath = path.join(__dirname + '/../.tmp/storage');

  let oldContent;
  try {
    oldContent = await fs.readFile(filepath);
  } catch (error) {
    console.log(error);
    oldContent = error;
  }

  const newContent = `Timestamp ${Date.now()}`;
  await fs.writeFile(filepath, newContent);

  res.send(`
<h1>Write to a file</h1>
<p>Writing content: ${newContent}</p>

<h2>Read from the file</h2>
<p>Previous content: ${oldContent}</p>
  `);
});

const runCommand = async (command) => {
  let stdout, stderr;
  try {
    ({ stdout, stderr } = await exec(command));
  } catch (err) {
    console.error(err);
    stderr = JSON.stringify(err, null, 2);
  }

  return `
<h1>Run system command: ${command}</h1>

<h2>stdout</h2>
<pre>${stdout}</pre>

<h2>stderr</h2>
<pre>${stderr}</pre>
  `;
};

app.get('/run-command/ls', async (req, res) => {
  const content = await runCommand('ls -1');
  res.send(content);
});

app.get('/run-command/gulp-version', async (req, res) => {
  const content = await runCommand('npm run gulp:version');
  res.send(content);
});

app.get('/run-command/gulp-task', async (req, res) => {
  const content = await runCommand('npm run gulp:hello');
  res.send(content);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
