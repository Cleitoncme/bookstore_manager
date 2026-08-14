import { AutorController } from './controllers/autor.controller';
import { ClienteController } from './controllers/cliente.controller';
import { EmprestimoController } from './controllers/emprestimo.controller';
import { LivroController } from './controllers/livro.controller';
import { LoginController } from './controllers/login.controller';
import { database, testDatabaseConnection } from './infra/database/connection';
import { AutorPostgresRepository } from './infra/repositories/adapters/autor-postgres.repository';
import { ClientePostgresRepository } from './infra/repositories/adapters/cliente-postgres.repository';
import { EmprestimoPostgresRepository } from './infra/repositories/adapters/emprestimo-postgres.repository';
import { LivroPostgresRepository } from './infra/repositories/adapters/livro-postgres.repository';
import { UsuarioPostgresRepository } from './infra/repositories/adapters/usuario-postgres.repository';
import { MainMenu } from './menus/main.menu';
import { AutorService } from './services/autor.service';
import { ClienteService } from './services/cliente.service';
import { EmprestimoService } from './services/emprestimo.service';
import { LivroService } from './services/livro.service';
import { LoginService } from './services/login.service';
import { createTerminal } from './utils/terminal';

async function main(): Promise<void> {
  const terminal = createTerminal();

  try {
    await testDatabaseConnection();

    const usuarioRepository = new UsuarioPostgresRepository(database);

    const autorRepository = new AutorPostgresRepository(database);

    const livroRepository = new LivroPostgresRepository(database);

    const clienteRepository = new ClientePostgresRepository(database);

    const emprestimoRepository = new EmprestimoPostgresRepository(database);

    const loginService = new LoginService(usuarioRepository);

    const autorService = new AutorService(autorRepository);

    const livroService = new LivroService(livroRepository, autorRepository);

    const clienteService = new ClienteService(clienteRepository);

    const emprestimoService = new EmprestimoService(
      emprestimoRepository,
      clienteRepository,
      livroRepository,
    );

    const loginController = new LoginController(terminal, loginService);

    const autorController = new AutorController(terminal, autorService);

    const livroController = new LivroController(terminal, livroService);

    const clienteController = new ClienteController(terminal, clienteService);

    const emprestimoController = new EmprestimoController(
      terminal,
      emprestimoService,
    );

    const mainMenu = new MainMenu(
      terminal,
      autorController,
      livroController,
      clienteController,
      emprestimoController,
    );

    const usuario = await loginController.execute();

    await mainMenu.execute(usuario);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Erro inesperado ao iniciar a aplicação.';

    console.error(`\nNão foi possível iniciar a aplicação: ${message}`);

    process.exitCode = 1;
  } finally {
    terminal.close();
    await database.end();
  }
}

void main();
