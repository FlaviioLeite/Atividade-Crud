const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configurações de conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'server',
    database: 'biblioteca'
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar: ' + err.stack);
        return;
    }
    console.log('Conexão bem sucedida com o ID ' + connection.threadId);
});

// Middleware para tratar o corpo das requisições como JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create - Adicionar um novo livro
app.post('/livros', (req, res) => {
    const { titulo, autor, isbn } = req.body;

    // Verificar se o livro já existe
    connection.query('SELECT * FROM livros WHERE titulo = ? AND autor = ? AND isbn = ?', [titulo, autor, isbn], (err, result) => {
        if (err) {
            console.error('Erro ao verificar livro existente:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }

        if (result.length > 0) {
            // Se o livro já existe, retornar uma mensagem de erro
            res.status(400).send('Este livro já está cadastrado');
            return;
        }

        // Se o livro não existe, inserir o novo registro
        connection.query('INSERT INTO livros (titulo, autor, isbn) VALUES (?, ?, ?)', [titulo, autor, isbn], (err, result) => {
            if (err) {
                console.error('Erro ao adicionar livro:', err);
                res.status(500).send('Erro interno no servidor');
                return;
            }
            res.status(201).send('Livro adicionado com sucesso');
        });
    });
});

// Read - Obter todos os livros
app.get('/livros', (req, res) => {
    connection.query('SELECT * FROM livros', (err, result) => {
        if (err) {
            console.error('Erro ao obter livros:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.json(result);
    });
});

// Read - Obter todos os autores
app.get('/autores', (req, res) => {
    connection.query('SELECT * FROM autores', (err, result) => {
        if (err) {
            console.error('Erro ao obter autores:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.json(result);
    });
});

// Create - Adicionar um novo autor
app.post('/autores', (req, res) => {
    const { nome, nacionalidade } = req.body;

    console.log(req.body); // Verificar se os dados estão sendo recebidos corretamente

    connection.query('INSERT INTO autores (nome, nacionalidade) VALUES (?, ?)', [nome, nacionalidade], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar autor:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.status(201).send('Autor adicionado com sucesso');
    });
});

// Update - Atualizar um livro existente
app.put('/livros/:id', (req, res) => {
    const { titulo, autor, isbn } = req.body;
    const id = req.params.id;
    connection.query('UPDATE livros SET titulo = ?, autor = ?, isbn = ? WHERE id = ?', [titulo, autor, isbn, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar livro:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Livro atualizado com sucesso');
    });
});

// Delete - Remover um livro
app.delete('/livros/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM livros WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover livro:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Livro removido com sucesso');
    });
});

// Update - Atualizar um autor existente
app.put('/autores/:id', (req, res) => {
    const { nome, nacionalidade } = req.body;
    const id = req.params.id;
    connection.query('UPDATE autores SET nome = ?, nacionalidade = ? WHERE id = ?', [nome, nacionalidade, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar autor:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Autor atualizado com sucesso');
    });
});

// Delete - Remover um autor
app.delete('/autores/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM autores WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover autor:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Autor removido com sucesso');
    });
});
// Create - Adicionar uma nova editora
app.post('/editoras', (req, res) => {
    const { nome, localizacao } = req.body;

    connection.query('INSERT INTO editoras (nome, localizacao) VALUES (?, ?)', [nome, localizacao], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar editora:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.status(201).send('Editora adicionada com sucesso');
    });
});

// Read - Obter todas as editoras
app.get('/editoras', (req, res) => {
    connection.query('SELECT * FROM editoras', (err, result) => {
        if (err) {
            console.error('Erro ao obter editoras:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.json(result);
    });
});

// Update - Atualizar uma editora existente
app.put('/editoras/:id', (req, res) => {
    const { nome, localizacao } = req.body;
    const id = req.params.id;
    connection.query('UPDATE editoras SET nome = ?, localizacao = ? WHERE id = ?', [nome, localizacao, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar editora:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Editora atualizada com sucesso');
    });
});

// Delete - Remover uma editora
app.delete('/editoras/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM editoras WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover editora:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Editora removida com sucesso');
    });
});
// Create - Adicionar uma nova categoria
app.post('/categorias', (req, res) => {
    const { descricao } = req.body;

    connection.query('INSERT INTO categorias (descricao) VALUES (?)', [descricao], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar categoria:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.status(201).send('Categoria adicionada com sucesso');
    });
});

// Read - Obter todas as categorias
app.get('/categorias', (req, res) => {
    connection.query('SELECT * FROM categorias', (err, result) => {
        if (err) {
            console.error('Erro ao obter categorias:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.json(result);
    });
});


// Update - Atualizar uma categoria existente
app.put('/categorias/:id', (req, res) => {
    const { descricao } = req.body;
    const id = req.params.id;
    connection.query('UPDATE categorias SET descricao = ? WHERE id = ?', [descricao, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar categoria:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Categoria atualizada com sucesso');
    });
});

// Delete - Remover uma categoria
app.delete('/categorias/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM categorias WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover categoria:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Categoria removida com sucesso');
    });
});
// Create - Adicionar um novo detalhe do livro
app.post('/detalhes_livro', (req, res) => {
    const { livro_id, resumo, criticas, edicoes_especiais, premios, notas_adicionais } = req.body;

    connection.query(
        'INSERT INTO detalhes_livro (livro_id, resumo, criticas, edicoes_especiais, premios, notas_adicionais) VALUES (?, ?, ?, ?, ?, ?)',
        [livro_id, resumo, criticas, edicoes_especiais, premios, notas_adicionais],
        (err, result) => {
            if (err) {
                console.error('Erro ao adicionar detalhes do livro:', err);
                res.status(500).json({ message: 'Erro interno no servidor' });
                return;
            }
            res.status(201).json({ message: 'Detalhes do livro adicionados com sucesso' });
        }
    );
});

// Read - Obter todos os detalhes do livro
app.get('/detalhes_livro', (req, res) => {
    connection.query('SELECT * FROM detalhes_livro', (err, result) => {
        if (err) {
            console.error('Erro ao obter detalhes do livro:', err);
            res.status(500).json({ message: 'Erro interno no servidor' });
            return;
        }
        res.json(result);
    });
});

// Update - Atualizar detalhes do livro
app.put('/detalhes_livro/:livro_id', (req, res) => {
    const { resumo, criticas, edicoes_especiais, premios, notas_adicionais } = req.body;
    const livro_id = req.params.livro_id; // Capturar o livro_id da URL

    connection.query(
        'UPDATE detalhes_livro SET resumo = ?, criticas = ?, edicoes_especiais = ?, premios = ?, notas_adicionais = ? WHERE livro_id = ?',
        [resumo, criticas, edicoes_especiais, premios, notas_adicionais, livro_id],
        (err, result) => {
            if (err) {
                console.error('Erro ao atualizar detalhes do livro:', err);
                res.status(500).json({ message: 'Erro interno no servidor' });
                return;
            }
            res.json({ message: 'Detalhes do livro atualizados com sucesso' });
        }
    );
});


// Delete - Remover detalhes do livro
app.delete('/detalhes_livro/:livro_id', (req, res) => {
    const livro_id = req.params.livro_id;

    connection.query('DELETE FROM detalhes_livro WHERE livro_id = ?', [livro_id], (err, result) => {
        if (err) {
            console.error('Erro ao remover detalhes do livro:', err);
            res.status(500).json({ message: 'Erro interno no servidor' });
            return;
        }
        res.json({ message: 'Detalhes do livro removidos com sucesso' });
    });
});

// Create - Adicionar uma nova reserva
app.post('/reservas', (req, res) => {
    const { livro_id, usuario_id, data_reserva } = req.body;

    connection.query('INSERT INTO reservas (livro_id, usuario_id, data_reserva) VALUES (?, ?, ?)', [livro_id, usuario_id, data_reserva], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar reserva:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.status(201).send('Reserva adicionada com sucesso');
    });
});

// Read - Obter todas as reservas
app.get('/reservas', (req, res) => {
    connection.query('SELECT * FROM reservas', (err, result) => {
        if (err) {
            console.error('Erro ao obter reservas:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.json(result);
    });
});

// Update - Atualizar uma reserva existente
app.put('/reservas/:id', (req, res) => {
    const { livro_id, usuario_id, data_reserva } = req.body;
    const id = req.params.id;

    connection.query('UPDATE reservas SET livro_id = ?, usuario_id = ?, data_reserva = ? WHERE id = ?', [livro_id, usuario_id, data_reserva, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar reserva:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Reserva atualizada com sucesso');
    });
});

// Delete - Remover uma reserva
app.delete('/reservas/:id', (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM reservas WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover reserva:', err);
            res.status(500).send('Erro interno no servidor');
            return;
        }
        res.send('Reserva removida com sucesso');
    });
});

// Rota para obter todos os livros
app.get('/livros', (req, res) => {
    connection.query('SELECT id, titulo FROM livros', (error, results) => {
        if (error) {
            console.error('Erro ao buscar livros:', error);
            res.status(500).send('Erro ao buscar livros');
        } else {
            res.json(results);
        }
    });
});

// Rota para obter todos os usuários
app.get('/usuarios', (req, res) => {
    connection.query('SELECT id, nome FROM usuarios', (error, results) => {
        if (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).send('Erro ao buscar usuários');
        } else {
            res.json(results);
        }
    });
});

// Rota para obter todos os empréstimos
app.get('/emprestimos', (req, res) => {
    connection.query('SELECT * FROM emprestimos', (error, results) => {
        if (error) {
            console.error('Erro ao buscar empréstimos:', error);
            res.status(500).send('Erro ao buscar empréstimos');
        } else {
            res.json(results);
        }
    });
});

// Rota para registrar um novo empréstimo
app.post('/emprestimos', (req, res) => {
    const { bookId, userId, loanDate, returnDate } = req.body;

    if (!bookId || !userId || !loanDate || !returnDate) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const query = 'INSERT INTO emprestimos (livro_id, usuario_id, data_emprestimo, data_devolucao) VALUES (?, ?, ?, ?)';
    connection.query(query, [bookId, userId, loanDate, returnDate], (error, results) => {
        if (error) {
            console.error('Erro ao registrar empréstimo:', error);
            return res.status(500).send('Erro ao registrar empréstimo.');
        }
        res.status(201).send('Empréstimo registrado com sucesso.');
    });
});

// Rota para atualizar um empréstimo
app.put('/emprestimos/:id', (req, res) => {
    const { bookId, userId, loanDate, returnDate } = req.body;
    const { id } = req.params;

    if (!bookId || !userId || !loanDate || !returnDate) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const query = 'UPDATE emprestimos SET livro_id = ?, usuario_id = ?, data_emprestimo = ?, data_devolucao = ? WHERE id = ?';
    connection.query(query, [bookId, userId, loanDate, returnDate, id], (error, results) => {
        if (error) {
            console.error('Erro ao atualizar empréstimo:', error);
            return res.status(500).send('Erro ao atualizar empréstimo.');
        }
        res.status(200).send('Empréstimo atualizado com sucesso.');
    });
});

// Rota para excluir um empréstimo
app.delete('/emprestimos/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM emprestimos WHERE id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Erro ao excluir empréstimo:', error);
            return res.status(500).send('Erro ao excluir empréstimo.');
        }
        res.status(200).send('Empréstimo excluído com sucesso.');
    });
});
// Rota principal servindo o arquivo home.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});
app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;

    connection.query(
        'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
        [nome, email],
        (err, result) => {
            if (err) {
                console.error('Erro ao adicionar usuário:', err);
                res.status(500).json({ message: 'Erro interno no servidor' });
                return;
            }
            res.status(201).json({ message: 'Usuário adicionado com sucesso' });
        }
    );
});
app.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM usuarios', (err, result) => {
        if (err) {
            console.error('Erro ao obter usuários:', err);
            res.status(500).json({ message: 'Erro interno no servidor' });
            return;
        }
        res.json(result);
    });
});
app.put('/usuarios/:id', (req, res) => {
    const { nome, email } = req.body;
    const id = req.params.id; // Capturar o ID do usuário da URL

    connection.query(
        'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
        [nome, email, id],
        (err, result) => {
            if (err) {
                console.error('Erro ao atualizar usuário:', err);
                res.status(500).json({ message: 'Erro interno no servidor' });
                return;
            }
            res.json({ message: 'Usuário atualizado com sucesso' });
        }
    );
});
app.delete('/usuarios/:id', (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover usuário:', err);
            res.status(500).json({ message: 'Erro interno no servidor' });
            return;
        }
        res.json({ message: 'Usuário removido com sucesso' });
    });
});

app.post('/multas', (req, res) => {
    const { emprestimo_id, valor, data_multa, pago } = req.body;

    connection.query(
        'INSERT INTO multas (emprestimo_id, valor, data_multa, pago) VALUES (?, ?, ?, ?)',
        [emprestimo_id, valor, data_multa, pago],
        (err, result) => {
            if (err) {
                console.error('Erro ao adicionar multa:', err);
                res.status(500).json({ message: 'Erro interno no servidor' });
                return;
            }
            res.status(201).json({ message: 'Multa adicionada com sucesso' });
        }
    );
});
app.get('/multas', (req, res) => {
    connection.query('SELECT * FROM multas', (err, result) => {
        if (err) {
            console.error('Erro ao obter multas:', err);
            res.status(500).json({ message: 'Erro interno no servidor' });
            return;
        }
        res.json(result);
    });
});
app.put('/multas/:id', (req, res) => {
    const { valor, data_multa, pago } = req.body;
    const id = req.params.id; // Capturar o ID da multa da URL

    connection.query(
        'UPDATE multas SET valor = ?, data_multa = ?, pago = ? WHERE id = ?',
        [valor, data_multa, pago, id],
        (err, result) => {
            if (err) {
                console.error('Erro ao atualizar multa:', err);
                res.status(500).json({ message: 'Erro interno no servidor' });
                return;
            }
            res.json({ message: 'Multa atualizada com sucesso' });
        }
    );
});
app.delete('/multas/:id', (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM multas WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover multa:', err);
            res.status(500).json({ message: 'Erro interno no servidor' });
            return;
        }
        res.json({ message: 'Multa removida com sucesso' });
    });
});


// Rota para obter todos os logs
app.get('/logs', (req, res) => {
    connection.query('SELECT * FROM log', (err, results) => {
      if (err) {
        console.error('Erro ao obter logs:', err);
        res.status(500).json({ message: 'Erro interno no servidor' });
        return;
      }
      res.json(results); // Retorna os resultados como JSON
    });
  });

// Rota para as proximas páginas
app.get('/cadastrar_autor', (req, res) => {
    res.sendFile(__dirname + '/cadastrar_autor.html');
});
app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/editora', (req, res) => {
    res.sendFile(__dirname + '/editoras.html');
}); 
app.get('/categoria', (req, res) => {
    res.sendFile(__dirname + '/categorias.html');
}); 
app.get('/reservaa', (req, res) => {
    res.sendFile(__dirname + '/reserva.html');
}); 
app.get('/detalhes', (req, res) => {
    res.sendFile(__dirname + '/detalheLivros.html');
}); 
app.get('/emprestimo', (req, res) => {
    res.sendFile(__dirname + '/Emprestimo.html');
}); 
app.get('/usuari', (req, res) => {
    res.sendFile(__dirname + '/usuarios.html');
}); 
app.get('/mult', (req, res) => {
    res.sendFile(__dirname + '/multas.html');
}); 
app.get('/lo', (req, res) => {
    res.sendFile(__dirname + '/log.html');
}); 
// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
