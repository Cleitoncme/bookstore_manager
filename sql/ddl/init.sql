CREATE TABLE perfil(
    id   INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE usuario(
    id            INTEGER       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    login         VARCHAR(100)  NOT NULL UNIQUE,
    senha         VARCHAR(255)  NOT NULL,
    perfil_id     INTEGER       NOT NULL,
    data_cadastro TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (perfil_id) REFERENCES perfil(id)
);

CREATE TABLE autor(
    id   INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE livro(
    id             INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo         VARCHAR(200) NOT NULL,
    editora        VARCHAR(100) NOT NULL,
    ano_publicacao INTEGER      NOT NULL
);

CREATE TABLE livro_autor(
    livro_id INTEGER NOT NULL,
    autor_id INTEGER NOT NULL,

    PRIMARY KEY (livro_id, autor_id),

    FOREIGN KEY (livro_id) REFERENCES livro(id),
    FOREIGN KEY (autor_id) REFERENCES autor(id)
);

CREATE TABLE cliente(
    id       INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome     VARCHAR(100) NOT NULL,
    cpf      VARCHAR(11)  NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email    VARCHAR(100)
);

CREATE TABLE emprestimo(
    id              INTEGER    GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id      INTEGER    NOT NULL,
    usuario_id      INTEGER    NOT NULL,
    data_emprestimo TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_devolucao  TIMESTAMPTZ,

    FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE emprestimo_livro(
    emprestimo_id INTEGER NOT NULL,
    livro_id      INTEGER NOT NULL,

    PRIMARY KEY (emprestimo_id, livro_id),

    FOREIGN KEY (emprestimo_id) REFERENCES emprestimo(id),
    FOREIGN KEY (livro_id) REFERENCES livro(id)
);