# Projeto Node.js Back-end API

Este projeto serve exclusivamente para fazer conexão com o projeto FrontCrudProject (disponivel em: https://github.com/Thenivlek/FrontCrudProject). Sua função é receber as requisições voltadas para CRUD em uma lista de tarefas simples e manter a conexão com o Banco de dados Neo4j.

## Requisitos

- Node.js (versão 10.24.1)
- npm (versão compativel com a versão do NodeJs)

## Instalação

1. Clone o repositório para sua máquina local: https://github.com/Thenivlek/NodeProject

2. Navegue para o diretório do projeto: /NodeProject


3. Instale as dependências: npm install restify@8.5.1 neo4j-driver restify-cors-middleware --save

## Configuração

1. O intuito do projeto é para fins estudantis e como projeto de portifólio, não necessita de arquivos de configuração.

## Rodando o Projeto

Para rodar o projeto, utilize o seguinte comando: node server.js

O servidor estará rodando em: `http://localhost:8081/`.

## Considerações Finais 

- **Dificuldades durante o desenvolvimento do projeto**
1. Apesar de já conhecer gerenciamento de banco de dados orientado a grafos tive pouco contato com a linguagem Cypher, devido a isso tive que dedicar meior tempo de estudo.

- **Facilidades durante o desenvolvimento do projeto**
1. Já tive experiência prévia com o NodeJs, devido a isso o tempo de desenvolvimento foi menor.

- **Possíveis melhorias no projeto**
1. Criação de token de segurança para validação de usuário.
2. Melhor estruturação de código para possíveis implementações futuras.
3. Criação do arquivo .env para maior segurança do banco de dados (devido a facilidade de testes optei por manter o acesso ao banco de dados diretamente no código)









