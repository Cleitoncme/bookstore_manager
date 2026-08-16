# 📚 Bookstore Manager

Aplicação de gerenciamento de biblioteca executada via terminal, desenvolvida com **Node.js, TypeScript e PostgreSQL**.

O sistema permite administrar autores, livros e clientes, controlar empréstimos e devoluções e consultar relatórios sobre o acervo e sua utilização.

O projeto foi desenvolvido como atividade avaliativa do curso **SCTEC — Desenvolvedor(a) Back-End**, reunindo conceitos de TypeScript, programação orientada a objetos, banco de dados relacional, SQL, programação assíncrona e organização de aplicações Back-End.

---

## 📑 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Objetivo](#-objetivo)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração do PostgreSQL](#-configuração-do-postgresql)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Execução](#️-execução)
- [Arquitetura](#️-arquitetura)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Modelagem do banco de dados](#️-modelagem-do-banco-de-dados)
- [Funcionalidades](#️-funcionalidades)
- [Regras de negócio](#-regras-de-negócio)
- [Relatórios](#-relatórios)
- [SQL e persistência](#️-sql-e-persistência)
- [Transações](#-transações)
- [Fluxo da aplicação](#-fluxo-da-aplicação)
- [Exemplos de utilização](#-exemplos-de-utilização)
- [Qualidade de código](#-qualidade-de-código)
- [Versionamento](#-versionamento)
- [Contexto acadêmico](#-contexto-acadêmico)

---

## 📖 Sobre o projeto

O **Bookstore Manager** é uma aplicação Back-End com interface de linha de comando (CLI) destinada ao gerenciamento das operações básicas de uma biblioteca.

Por meio dos menus exibidos no terminal, o usuário autenticado pode administrar o catálogo de autores e livros, manter o cadastro de clientes, registrar empréstimos e devoluções e acessar relatórios gerados a partir das informações armazenadas no banco de dados.

Os dados são persistidos em PostgreSQL e acessados por consultas SQL executadas através da biblioteca `pg`.

O código foi organizado em camadas, separando interação com o usuário, regras de negócio e acesso aos dados.

---

## 🎯 Objetivo

O objetivo do projeto é consolidar os conhecimentos de desenvolvimento Back-End por meio da construção de uma aplicação completa utilizando Node.js, TypeScript e PostgreSQL.

A implementação busca aplicar principalmente:

- programação orientada a objetos;
- tipagem com TypeScript;
- arquitetura em camadas;
- separação de responsabilidades;
- abstração do acesso a dados através de repositories;
- modelagem de banco de dados relacional;
- consultas SQL;
- relacionamentos entre entidades;
- programação assíncrona;
- tratamento de exceções;
- transações;
- autenticação;
- controle de versão com Git.

---

## 🚀 Tecnologias utilizadas

### Aplicação

- **Node.js** — ambiente de execução;
- **TypeScript** — linguagem utilizada no desenvolvimento;
- **tsx** — execução do TypeScript durante o desenvolvimento.

### Banco de dados

- **PostgreSQL** — persistência dos dados;
- **pg** — comunicação entre Node.js e PostgreSQL;
- **pgcrypto** — geração e verificação de hashes das senhas dos usuários.

### Configuração

- **dotenv** — carregamento das variáveis de ambiente.

### Qualidade de código

- **ESLint** — análise estática;
- **Prettier** — padronização da formatação;
- **TypeScript Compiler (`tsc`)** — compilação e verificação de tipos.

### Versionamento

- **Git**;
- **GitHub**.

---

## 📦 Pré-requisitos

Para executar o projeto localmente, é necessário possuir:

| Software   | Finalidade                     |
| ---------- | ------------------------------ |
| Node.js    | Execução da aplicação          |
| npm        | Gerenciamento das dependências |
| PostgreSQL | Banco de dados                 |
| Git        | Clonagem e versionamento       |

Também é necessário possuir uma instalação do PostgreSQL e credenciais com permissão para criar e acessar o banco utilizado pela aplicação.

---

## ⚙️ Instalação

Clone o repositório:

```bash
git clone https://github.com/Cleitoncme/bookstore_manager.git
```

Acesse a pasta do projeto:

```bash
cd bookstore_manager
```

Instale as dependências:

```bash
npm install
```

---

## 🐘 Configuração do PostgreSQL

A aplicação utiliza PostgreSQL para armazenar os dados.

Crie inicialmente o banco:

```sql
CREATE DATABASE bookstore_manager;
```

Os scripts SQL estão organizados em:

```text
sql/
├── ddl/
│   └── init.sql
└── dml/
    └── seed.sql
```

### 1. Criar a estrutura do banco

Execute primeiro:

```text
sql/ddl/init.sql
```

```
Ou direto no terminal bash
psql -U seu_usuario -d bookstore_manager -f sql/ddl/init.sql
```

Esse arquivo cria as tabelas, relacionamentos, chaves e restrições utilizados pela aplicação.

Entre as principais tabelas estão:

- `perfil`;
- `usuario`;
- `autor`;
- `livro`;
- `livro_autor`;
- `cliente`;
- `emprestimo`;
- `emprestimo_livro`.

### 2. Inserir os dados iniciais

Depois execute:

```text
sql/dml/seed.sql
```

```
Ou direto no terminal bash
psql -U seu_usuario -d bookstore_manager -f sql/dml/seed.sql
```

O `seed.sql`:

- habilita a extensão `pgcrypto`;
- cadastra os perfis iniciais;
- cadastra usuários fictícios de demonstração;
- armazena as senhas no banco utilizando hash.

A sequência recomendada é:

```text
1. Criar o banco bookstore_manager
2. Executar sql/ddl/init.sql
3. Executar sql/dml/seed.sql
4. Configurar o arquivo .env
5. Iniciar a aplicação
```

---

## 🔐 Variáveis de ambiente

A conexão com o PostgreSQL é configurada através de variáveis de ambiente.

O repositório contém o arquivo:

```text
.env.example
```

Crie uma cópia chamada `.env`:

```env
DEBUG=true
DB_PASSWORD=your_database_password
DB_USER=your_database_user
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=bookstore_manager
```

Altere principalmente:

```text
DB_USER
DB_PASSWORD
```

de acordo com sua instalação local do PostgreSQL.

O arquivo `.env` contém configurações locais e não deve ser versionado.

---

## 🔑 Usuários de demonstração

O `seed.sql` cadastra usuários destinados exclusivamente à execução local e avaliação do projeto.

### Administrador

```text
Login: admin
Senha: admin123
```

### Bibliotecário

```text
Login: bibliotecario
Senha: biblioteca123
```

As senhas são processadas pelo PostgreSQL através da extensão `pgcrypto` e armazenadas no banco como hash.

---

## ▶️ Execução

### Ambiente de desenvolvimento

```bash
npm run dev
```

### Compilar o projeto

```bash
npm run build
```

Os arquivos JavaScript gerados são armazenados em `dist`.

### Executar a versão compilada

```bash
npm start
```

### Executar o ESLint

```bash
npm run lint
```

Antes de integrar alterações, recomenda-se executar:

```bash
npm run lint
npm run build
```

---

## 🏛️ Arquitetura

A aplicação utiliza uma arquitetura em camadas para separar interface, regras de negócio e persistência.

O fluxo principal segue:

```text
┌───────────────────────┐
│        Usuário        │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│      Controller       │
│  Entrada / saída CLI  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│        Service        │
│ Regras e validações   │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│      Repository       │
│ Interface / contrato  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ PostgreSQL Repository │
│   SQL através de pg   │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│      PostgreSQL       │
└───────────────────────┘
```

### Controllers

Responsáveis pela interação com o usuário através do terminal.

Recebem os dados informados, acionam os Services e apresentam os resultados.

### Services

Concentram regras de negócio e validações.

Essa camada evita que decisões de negócio sejam implementadas diretamente na interface ou nas consultas SQL.

### Repositories

Definem interfaces e contratos para as operações de persistência.

### PostgreSQL Adapters

Implementam os Repositories através de consultas SQL utilizando a biblioteca `pg`.

### Models

Definem as estruturas e tipos utilizados entre as camadas.

### Menus

Controlam a navegação entre os módulos disponíveis na interface CLI.

### Infraestrutura

Agrupa recursos relacionados ao banco de dados, conexão e implementações concretas dos repositories.

---

## 📂 Estrutura de pastas

O projeto está organizado em camadas, separando a interface de linha de comando, regras de negócio, modelos e infraestrutura de acesso ao banco de dados.

A estrutura principal é:

```text
bookstore_manager/
│
├── sql/
│   ├── ddl/
│   │   └── init.sql
│   │
│   └── dml/
│       └── seed.sql
│
├── src/
│   ├── controllers/
│   │   ├── autor.controller.ts
│   │   ├── cliente.controller.ts
│   │   ├── emprestimo.controller.ts
│   │   ├── livro.controller.ts
│   │   ├── login.controller.ts
│   │   └── relatorio.controller.ts
│   │
│   ├── infra/
│   │   ├── database/
│   │   │   ├── entities/
│   │   │   │   ├── autor.entity.ts
│   │   │   │   ├── cliente.entity.ts
│   │   │   │   ├── emprestimo.entity.ts
│   │   │   │   ├── livro.entity.ts
│   │   │   │   ├── perfil.entity.ts
│   │   │   │   └── usuario.entity.ts
│   │   │   │
│   │   │   ├── connection.ts
│   │   │   └── data-source.ts
│   │   │
│   │   └── repositories/
│   │       ├── adapters/
│   │       │   ├── autor-postgres.repository.ts
│   │       │   ├── cliente-postgres.repository.ts
│   │       │   ├── emprestimo-postgres.repository.ts
│   │       │   ├── livro-postgres.repository.ts
│   │       │   ├── relatorio-postgres.repository.ts
│   │       │   └── usuario-postgres.repository.ts
│   │       │
│   │       ├── autor.repository.ts
│   │       ├── cliente.repository.ts
│   │       ├── emprestimo.repository.ts
│   │       ├── livro.repository.ts
│   │       ├── relatorio.repository.ts
│   │       └── usuario.repository.ts
│   │
│   ├── menus/
│   │   └── main.menu.ts
│   │
│   ├── models/
│   │   ├── autor.ts
│   │   ├── cliente.ts
│   │   ├── emprestimo.ts
│   │   ├── livro.ts
|   |   ├── perfil.ts
|   |   ├── relatorio.ts
│   │   └── usuario.ts
│   │
│   ├── services/
│   │   ├── autor.service.ts
│   │   ├── cliente.service.ts
│   │   ├── emprestimo.service.ts
│   │   ├── livro.service.ts
│   │   ├── login.service.ts
│   │   └── relatorio.service.ts
│   │
│   ├── utils/
│   │   └── terminal.ts
│   │
│   └── main.ts
│
├── .env.example
├── .gitattributes
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Modelagem do banco de dados

O banco foi modelado de forma relacional.

As principais relações podem ser representadas assim:

```text
PERFIL
  │
  └──< USUARIO


AUTOR
  │
  └──< LIVRO_AUTOR >── LIVRO


CLIENTE
  │
  └──< EMPRESTIMO >── USUARIO
           │
           └──< EMPRESTIMO_LIVRO >── LIVRO
```

### Perfil e usuário

Os perfis identificam o tipo de acesso do usuário cadastrado no sistema.

O usuário é utilizado na autenticação e também fica associado aos empréstimos registrados.

### Autor e livro

Um livro pode possuir um ou mais autores.

A relação entre as entidades é representada pela tabela intermediária `livro_autor`.

### Cliente e empréstimo

Cada empréstimo pertence a um cliente e registra o usuário responsável pela operação.

### Empréstimo e livro

Um empréstimo pode conter um ou mais livros.

A associação é representada através da tabela `emprestimo_livro`.

---

## ⚙️ Funcionalidades

### 🔐 Autenticação

- login antes do acesso ao menu principal;
- validação das credenciais;
- identificação do perfil;
- manutenção do usuário autenticado durante a execução.

### ✍️ Autores

- cadastrar autor;
- listar autores;
- consultar autor por ID;
- atualizar autor;
- remover autor.

### 📚 Livros

- cadastrar livro;
- associar autores;
- listar livros;
- consultar livro por ID;
- atualizar livro;
- remover livro;
- controlar quantidade total;
- controlar quantidade disponível.

### 👥 Clientes

- cadastrar cliente;
- listar clientes;
- consultar cliente por ID;
- atualizar cliente;
- remover cliente;
- validar unicidade do CPF.

### 🔄 Empréstimos

- registrar empréstimo;
- vincular cliente;
- registrar o usuário autenticado responsável;
- adicionar um ou mais livros;
- validar disponibilidade;
- atualizar automaticamente a quantidade disponível;
- listar empréstimos;
- consultar empréstimo por ID;
- listar empréstimos ativos.

### ↩️ Devoluções

- registrar devolução;
- atualizar a data de devolução;
- restaurar a disponibilidade dos livros;
- impedir devolução duplicada.

---

## 📋 Regras de negócio

Entre as principais regras implementadas estão:

- IDs devem possuir valores válidos;
- o cliente informado no empréstimo deve existir;
- o empréstimo deve possuir pelo menos um livro;
- os livros informados devem existir;
- somente livros com exemplares disponíveis podem ser emprestados;
- IDs repetidos de livros são normalizados antes do registro;
- a quantidade disponível não pode ficar negativa;
- a quantidade disponível não pode ultrapassar a quantidade total;
- a quantidade total de um livro não pode ser reduzida abaixo da quantidade atualmente emprestada;
- CPF de cliente deve ser único;
- login de usuário deve ser único;
- um empréstimo já devolvido não pode ser devolvido novamente;
- operações críticas que alteram múltiplos registros utilizam transações para preservar a consistência do banco.

---

## 📊 Relatórios

A aplicação possui uma área específica para relatórios.

### 1. Livros disponíveis

Apresenta os livros que possuem exemplares disponíveis para empréstimo.

### 2. Livros emprestados

Apresenta os livros associados a empréstimos que ainda estão ativos.

### 3. Livros por autor

Relaciona cada autor aos respectivos livros cadastrados.

### 4. Quantidade de empréstimos por livro

Apresenta a quantidade de vezes que cada livro aparece nos registros de empréstimos.

### 5. Clientes com empréstimos ativos

Apresenta os clientes que possuem empréstimos ainda não devolvidos.

Além da quantidade de empréstimos ativos, o relatório informa os livros atualmente associados a esses empréstimos.

---

## 🗃️ SQL e persistência

O acesso ao PostgreSQL é realizado diretamente através da biblioteca `pg`.

Entre os recursos SQL utilizados estão:

```text
SELECT
INSERT
UPDATE
DELETE
INNER JOIN
LEFT JOIN
GROUP BY
ORDER BY
LIMIT
COUNT
DISTINCT
```

Também são utilizadas agregações JSON do PostgreSQL para estruturar determinados resultados relacionados.

A modelagem utiliza:

- `PRIMARY KEY`;
- `FOREIGN KEY`;
- `UNIQUE`;
- `CHECK`;
- tabelas associativas;
- relacionamentos um-para-muitos;
- relacionamentos muitos-para-muitos.

---

## 🔄 Transações

Operações críticas que exigem alterações coordenadas utilizam transações PostgreSQL.

O fluxo segue o padrão:

```text
BEGIN
   │
   ├── executar operações
   │
   ├── sucesso
   │      └── COMMIT
   │
   └── erro
          └── ROLLBACK
```

Caso alguma etapa falhe, as alterações realizadas dentro da transação são revertidas.

Esse mecanismo é utilizado para preservar a consistência principalmente em operações envolvendo empréstimos, devoluções e relacionamentos entre registros.

---

## 🔀 Fluxo da aplicação

Ao iniciar o sistema:

```text
npm run dev
     │
     ▼
Inicialização
     │
     ▼
Teste da conexão com PostgreSQL
     │
     ▼
Autenticação
     │
     ▼
Menu Principal
     │
     ├── 1 - Autores
     ├── 2 - Livros
     ├── 3 - Clientes
     ├── 4 - Empréstimos
     ├── 5 - Relatórios
     └── 0 - Encerrar
```

Cada módulo possui seu próprio menu e retorna ao fluxo principal após a conclusão das operações.

---

## 🖥️ Exemplos de utilização

### Iniciando a aplicação

```bash
npm run dev
```

Após validar a conexão com o PostgreSQL, a aplicação solicita a autenticação do usuário.

### Menu principal

Após o login:

```text
==========================================
              MENU PRINCIPAL
==========================================

Usuário: admin
Perfil: Administrador

1 - Autores
2 - Livros
3 - Clientes
4 - Empréstimos
5 - Relatórios
0 - Encerrar
```

### Exemplo de registro de empréstimo

O fluxo de empréstimo segue aproximadamente:

```text
Selecionar cliente
       │
       ▼
Validar cliente
       │
       ▼
Informar livros
       │
       ▼
Validar existência
       │
       ▼
Verificar disponibilidade
       │
       ▼
Registrar empréstimo
       │
       ▼
Associar livros
       │
       ▼
Atualizar disponibilidade
```

### Exemplo de devolução

```text
Selecionar empréstimo ativo
          │
          ▼
Validar empréstimo
          │
          ▼
Registrar data de devolução
          │
          ▼
Restaurar disponibilidade
```

### Exemplo ilustrativo de relatório

```text
--- Clientes com Empréstimos Ativos ---
------------------------------------------
Cliente: José Rufino (ID: 2)
Empréstimos ativos: 1
Livros emprestados:
  - Dom Casmurro (ID: 3)
```

A saída acima é apenas um exemplo ilustrativo. Os dados apresentados dependem dos registros existentes no banco.

---

## 🧹 Qualidade de código

O projeto utiliza TypeScript em modo estrito e ferramentas de análise e formatação.

Para verificar o código:

```bash
npm run lint
```

Para validar a compilação:

```bash
npm run build
```

A aplicação utiliza conceitos como:

- interfaces;
- classes;
- construtores;
- modificadores de acesso;
- tipagem explícita;
- `async/await`;
- tratamento de erros;
- abstrações de Repository;
- injeção de dependências por construtor;
- separação entre interface, regra de negócio e persistência.

---

## 🌿 Versionamento

O desenvolvimento utiliza Git e GitHub com uma branch de integração e branches destinadas às diferentes funcionalidades.

Fluxo geral adotado:

```text
feature
   │
   ▼
develop
   │
   ▼
validação
   │
   ▼
main
```

As funcionalidades foram desenvolvidas incrementalmente, permitindo testar cada módulo antes da integração com o restante da aplicação.

---

## 🎓 Contexto acadêmico

Este projeto foi desenvolvido para fins acadêmicos como parte da formação **SCTEC — Desenvolvedor(a) Back-End**.

A aplicação busca demonstrar, de forma prática, a integração entre TypeScript, Node.js e PostgreSQL, juntamente com conceitos de arquitetura, orientação a objetos, persistência, SQL, tratamento de erros, transações e versionamento de código.
