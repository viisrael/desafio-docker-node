Desafio:

A idéia principal é que quando um usuário acesse o nginx, o mesmo fará uma chamada em nossa aplicação node.js. Essa aplicação por sua vez adicionará um registro em nosso banco de dados mysql, cadastrando um nome na tabela people.

O retorno da aplicação node.js para o nginx deverá ser:

<h1>Full Cycle Rocks!</h1>

- Lista de nomes cadastrada no banco de dados.

Gere o docker-compose de uma forma que basta apenas rodarmos: docker-compose up -d que tudo deverá estar funcionando e disponível na porta: 8080.


Criar a rede docker:
docker network --create desafio-docker-node


Build node
cd node
docker build -t desafio-docker-node:prod . -f Dockerfile.prod
docker run -d --name app_node --network desafio-docker-node -p 8081:8080 laoviah/desafio-docker-node:prod

Build: nginx
cd nginx
docker build -t nginx:prod . -f Dockerfile.prod
docker run -d --name nginx --network desafio-docker-node -p 8080:80 nginx:prod
