const API_URL = "http://localhost:3000/api";

async function rodarTestes() {

  try {
    
    const registro = await fetch(`${API_URL}/usuarios/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: "Admin Teste",
        email: "admin@teste.com",
        senha: "123",
        telefone: 11999999999
      })
    });
    const resRegistro = await registro.json();
    console.log("Cadastro", resRegistro);

    const usuarioId = resRegistro.id || 1;
    
    
    const login = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@teste.com", senha: "123" })
    });
    console.log("Login", await login.json());

    
    const novaMoto = await fetch(`${API_URL}/motos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marca: "BMW",
        modelo: "R 1250 GS",
        ano: 2024,
        cor: "Triple Black",
        preco: 110000.00,
        descricao: "Moto nova, zero KM",
        quilometragem: 0,
        vendedor_id: usuarioId
      })
    });
    console.log("venda", await novaMoto.json());


  
    const perfil = await fetch(`${API_URL}/perfil/${usuarioId}`);
    console.log(" Dados do Perfil:", await perfil.json());

  } catch (error) {
    console.error(error.message);
  }
}

rodarTestes();