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
                return;
            }
            console.log('Tabela criada com sucesso');

            connection.query('SELECT COUNT(*) AS count FROM people', (err, results) => {
                if (err) {
                    console.error('Erro ao verificar dados:', err);
                    connection.end();
                    return;
                }

                if (results[0].count === 0) {
                    const names = ['Bruce Wayne', 'Clark Kent', 'Peter Parker', 'Tony Stark', 'Ash Ketchum'];
                    const insertPromises = names.map(name => {
                        return new Promise((resolve, reject) => {
                            connection.query('INSERT INTO people (name) VALUES (?)', [name], (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        });
                    });

                    Promise.all(insertPromises)
                        .then(() => {
                            console.log('Dados iniciais inseridos com sucesso');
                            connection.end();
                        })
                        .catch((err) => {
                            console.error('Erro ao inserir dados iniciais:', err);
                            connection.end();
                        });
                } else {
                    console.log('Dados já existem na tabela');
                    connection.end();
                }
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
