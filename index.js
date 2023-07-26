const restify = require('restify');

// Cria o servidor Restify
const server = restify.createServer();

// Middleware para permitir que o servidor parseie o corpo das requisições em JSON
server.use(restify.plugins.bodyParser());

// Definindo uma rota GET
server.get('/api/hello', (req, res, next) => {
  res.send('Hello, world!');
  next();
});

// Definindo uma rota POST
server.post('/api/greet', (req, res, next) => {
  const { name } = req.body;
  res.send(`Hello, ${name}!`);
  next();
});

// Iniciar o servidor na porta 8080
server.listen(8050, () => {
  console.log('Servidor Rodando na porta 8050');
});
