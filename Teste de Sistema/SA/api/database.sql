CREATE DATABASE IF NOT EXISTS teste;
USE teste;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    telefone VARCHAR(20)
);

CREATE TABLE motos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100),
    marca VARCHAR(100),
    ano INT,
    preco DECIMAL(10, 2),
    imagem_url TEXT,
    vendedor_id INT,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id)
);