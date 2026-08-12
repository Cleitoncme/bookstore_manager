import { AutorController } from './controllers/autor.controller';
import { LoginController } from './controllers/login.controller';
import { database, testDatabaseConnection } from './infra/database/connection';
import { AutorPostgresRepository } from './infra/repositories/adapters/autor-postgres.repository';
import { UsuarioPostgresRepository } from './infra/repositories/adapters/usuario-postgres.repository';
import { MainMenu } from './menus/main.menu';
import { AutorService } from './services/autor.service';
import { LoginService } from './services/login.service';
import { createTerminal } from './utils/terminal';

async function main(): Promise<void> {
  const terminal = createTerminal();

  try {
    await testDatabaseConnection();

    const usuarioRepository = new UsuarioPostgresRepository(database);

    const autorRepository = new AutorPostgresRepository(database);

    const loginService = new LoginService(usuarioRepository);

    const autorService = new AutorService(autorRepository);

    const loginController = new LoginController(terminal, loginService);

    const autorController = new AutorController(terminal, autorService);

    const mainMenu = new MainMenu(terminal, autorController);

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
