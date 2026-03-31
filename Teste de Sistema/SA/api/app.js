import express from "express";

const app = express();
app.use(express.json());


app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?',
      [email, senha]
    );

    if (rows.length > 0) {
      return res.status(200).json({
        message: 'Login realizado!',
        token: 'token',
        usuario: rows[0]
      });
    }

    res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});


app.get('/api/motos', async (req, res) => {
  const { busca } = req.query;

  try {
    let query = 'SELECT * FROM motos';
    let params = [];

    if (busca) {
      query += ' WHERE modelo LIKE ? OR marca LIKE ?';
      params = [`%${busca}%`, `%${busca}%`];
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar motos' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));