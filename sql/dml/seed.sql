CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Dados de demonstração utilizados exclusivamente no ambiente local.
INSERT INTO perfil (nome)
VALUES
    ('Administrador'),
    ('Bibliotecário')
ON CONFLICT (nome) DO NOTHING;


-- Credenciais de demonstração:
-- admin / admin123
-- bibliotecario / biblioteca123
--
-- As senhas são armazenadas no banco somente como hash.INSERT INTO usuario (login, senha, perfil_id)
VALUES
    (
        'admin',
        crypt('admin123', gen_salt('bf')),
        (SELECT id FROM perfil WHERE nome = 'Administrador')
    ),
    (
        'bibliotecario',
        crypt('biblioteca123', gen_salt('bf')),
        (SELECT id FROM perfil WHERE nome = 'Bibliotecário')
    )
ON CONFLICT (login) DO NOTHING;