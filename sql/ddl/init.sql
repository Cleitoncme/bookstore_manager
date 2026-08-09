CREATE TABLE autor(
    id   INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE livro(
    id              INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo          VARCHAR(200) NOT NULL,
    editora         VARCHAR(100) NOT NULL,
    ano_publicacao  INTEGER      NOT NULL
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
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id      INTEGER NOT NULL,
    data_emprestimo DATE    NOT NULL,
    data_devolucao  DATE,

    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

CREATE TABLE emprestimo_livro(
    emprestimo_id INTEGER NOT NULL,
    livro_id      INTEGER NOT NULL,

    PRIMARY KEY (emprestimo_id, livro_id),

    FOREIGN KEY (emprestimo_id) REFERENCES emprestimo(id),
    FOREIGN KEY (livro_id) REFERENCES livro(id)
);