const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 8080;

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const initializeDatabase = () => {
    const connection = mysql.createConnection(config);

    connection.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            return;
        }
        console.log('Conectado ao banco de dados');

        connection.query(`CREATE TABLE IF NOT EXISTS people (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(255),
            PRIMARY KEY (id)
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela:', err);
                connection.end();
            }
            console.log('Tabela criada com sucesso');

            // Inserir dados
            const sqlInsert = `INSERT INTO people (name) VALUES ('Bruce Wayne');INSERT INTO people (name) VALUES ('Clark Kent');INSERT INTO people (name) VALUES ('Peter Parker');INSERT INTO people (name) VALUES ('Tony Stark');INSERT INTO people (name) VALUES ('Ash Ketchum');`;
            connection.query(sqlInsert, (err) => {
                if (err) {
                    console.error('Erro ao inserir dados:', err);
                } else {
                    console.log('Dados inseridos com sucesso');
                }
                connection.end();
            });
        });
    });
};

initializeDatabase();

app.get('/', (req, res) => {
    const connection = mysql.createConnection(config);

    connection.connect((err) => {
        if (err) {
            res.status(500).send('Erro ao conectar ao banco de dados');
            return;
        }

        connection.query('SELECT * FROM people;', (err, result) => {
            if (err) {
                res.status(500).send('Erro ao consultar o banco de dados');
                connection.end();
                return;
            }

            let html = '<h1>Full Cycle Rocks!!!</h1><ul>';
            if (result.length > 0) {
                result.forEach(row => {
                    html += `<li>${row.name}</li>`;
                });
                html += '</ul>';
            } else {
                html += 'Nenhuma pessoa encontrada</ul>';
            }

            res.send(html);
            connection.end();
        });
    });
});

app.listen(port, () => {
    console.log('Rodando na porta', port);
});
