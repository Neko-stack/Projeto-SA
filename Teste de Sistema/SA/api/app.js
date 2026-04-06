import express from "express";

const app = express();
app.use(express.json());


app.post('/api/usuarios/registro', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)',
      [nome, email, senha, telefone]
    );
    res.status(201).json({ message: "Usuário cadastrado com sucesso!", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar. O e-mail pode já estar em uso." });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.execute(
      'SELECT id, nome, email, telefone FROM usuarios WHERE email = ? AND senha = ?',
      [email, senha]
    );

    if (rows.length > 0) {
      return res.status(200).json({
        message: 'Login realizado!',
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


app.post('/api/motos', async (req, res) => {
  const { marca, modelo, ano, cor, preco, descricao, quilometragem, vendedor_id } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO motos (marca, modelo, ano, cor, preco, descricao, quilometragem, vendedor_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [marca, modelo, ano, cor, preco, descricao, quilometragem, vendedor_id]
    );
    res.status(201).json({ message: "Anúncio criado!", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Erro ao publicar anúncio." });
  }
});


app.get('/api/perfil/:id', async (req, res) => {
  const { id } = req.params;
  try {
  
    const [userRows] = await db.execute(
      'SELECT id, nome, email, telefone FROM usuarios WHERE id = ?', 
      [id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

   
    const [motosRows] = await db.execute(
      'SELECT * FROM motos WHERE vendedor_id = ?', 
      [id]
    );

    res.json({
      perfil: userRows[0],
      meus_anuncios: motosRows
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao carregar perfil." });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});