import express from "express";
import { pool as db } from "./db/db.js";

const app = express();
app.use(express.json());


app.post('/api/usuarios/registro', async (req, res) => {
    const { nome, email, senha, telefone } = req.body;
    try {
        const query = 'INSERT INTO vendedores (nome, email, senha, telefone) VALUES ($1, $2, $3, $4) RETURNING id';
        const result = await db.query(query, [nome, email, senha, telefone]);
        res.status(201).json({ message: "Vendedor cadastrado!", id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao cadastrar." });
    }
});


app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const result = await db.query(
            'SELECT id, nome, email, telefone FROM vendedores WHERE email = $1 AND senha = $2',
            [email, senha]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Login bem-sucedido!', usuario: result.rows[0] });
        } else {
            res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

app.post('/api/motos', async (req, res) => {
    const { modelo, marca, ano, preco, cor, descricao, quilometragem, vendedor_id } = req.body;
    try {
        const query = `
            INSERT INTO motos (modelo, marca, ano, preco, cor, descricao, quilometragem, vendedor_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
        const result = await db.query(query, [modelo, marca, ano, preco, cor, descricao, quilometragem, vendedor_id]);
        res.status(201).json({ message: "Anúncio publicado!", id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao publicar anúncio." });
    }
});

app.get('/api/usuarios/perfil/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const userResult = await db.query('SELECT id, nome, email, telefone FROM vendedores WHERE id = $1', [id]);
        const motosResult = await db.query('SELECT * FROM motos WHERE vendedor_id = $1', [id]);

        if (userResult.rows.length > 0) {
            res.json({ 
                usuario: userResult.rows[0], 
                motos: motosResult.rows 
            });
        } else {
            res.status(404).json({ error: "Vendedor não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao carregar perfil." });
    }
});

app.listen(3000, () => {
    console.log("Servidor a rodar em http://localhost:3000");
});


/*Aplicação Postgre

Instalar "PostgreSQL" plataforma EDB

Instalar "pgAdmin" também

abrir aba Servers -> PostgreSQL -> ciar no Database

Public -> Tables (criar nova tabela)

UUID Generator (gera id) - comando default (uuid_generate_v4())
criar extensão - CREATE EXTENSION IF NOT EXISTS "uuid-ossp"

Data type possui um tipo ou um array do tipo

usar TEXT ao inves de VARCHAR



*/