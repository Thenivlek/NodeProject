const restify = require('restify');
const functions = require('./functions');
const corsMiddleware = require('restify-cors-middleware');

const server = restify.createServer({
  name: 'NodeJs API',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const cors = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['*'],
  exposeHeaders: []
});

server.pre(cors.preflight);
server.use(cors.actual);

server.get('/checklists', async (req, res, next) => {
  const all = await functions.getAllChecklists(req.rawBody);
  res.send(201, all);
  return next();
});

server.post('/checklists', async (req, res, next) => {
  await functions.createChecklist(req.rawBody);
  const all = await functions.getAllChecklists(req.rawBody);
  res.send(201, all);
  return next();
});

server.put('/put/checklists/:id', async (req, res, next) => {
  const newData = req.body;
  await functions.updateChecklist(newData)
  const all = await functions.getAllChecklists();
  res.send(201, all);
  return next();
});

server.put('/put/task/:id', async (req, res, next) => {
  const newData = req.body;
  await functions.updateChecklistItem(newData)
  const all = await functions.getAllChecklists();
  res.send(201, all);
  return next();
});

server.post('/task', async (req, res, next) => {
  await functions.createTask(req.rawBody);
  const all = await functions.getAllChecklists(req.rawBody);
  res.send(201, all);
  return next();
});

server.post('/delete/checklist', async (req, res, next) => {
  await functions.deleteChecklist(req.rawBody);
  const all = await functions.getAllChecklists(req.rawBody);
  res.send(201, all);
  return next();
});

server.post('/delete/task', async (req, res, next) => {
  await functions.deleteTask(req.rawBody);
  const all = await functions.getAllChecklists(req.rawBody);
  res.send(201, all);
  return next();
});

server.post('/cleandb', async (req, res, next) => {
  const example = await functions.deleteAll();
  res.send(201, example);
  return next();
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
