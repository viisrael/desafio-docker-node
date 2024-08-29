# Desafio

A ideia principal é que quando um usuário acesse o Nginx, ele fará uma chamada à nossa aplicação Node.js. Essa aplicação, por sua vez, adicionará um registro em nosso banco de dados MySQL, cadastrando um nome na tabela `people`.

O retorno da aplicação Node.js para o Nginx deverá ser:

```html
<h1>Full Cycle Rocks!</h1>
<ul>
    <!-- Lista de nomes cadastrados no banco de dados -->
</ul>

```

### Docker Compose
Para executar a aplicação através do Docker Compose
```bash
docker-compose up -d --build
```

### Build e Execução
Para executar cada container separado

### Buile Node.js
Navegue até o diretório do Node.js e construa a imagem:

```bash
cd node
docker build -t desafio-docker-node:prod . -f Dockerfile.prod
```

### Execute o container Node.js:

```bash
docker run -d --name app_node --network desafio-docker-node desafio-docker-node:prod
```

### Build Nginx
Navegue até o diretório do Nginx e construa a imagem:
```bash
cd nginx
docker build -t nginx:prod . -f Dockerfile.prod
```

### Permissões
Pode ser necessário ajustar as permissões da pasta MySQL:
```
chmod 777 -R /mysql
```