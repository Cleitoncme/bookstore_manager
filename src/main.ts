import { LoginController } from './controllers/login.controllers';
import { database, testDatabaseConnection } from './infra/database/connection';
import { UsuarioPostgresRepository } from './infra/repositories/adapters/usuario-postgres.repository';
import { LoginService } from './services/login.services';

async function main(): Promise<void> {
  let loginController: LoginController | undefined;

  try {
    await testDatabaseConnection();

    const usuarioRepository = new UsuarioPostgresRepository(database);
    const loginService = new LoginService(usuarioRepository);

    loginController = new LoginController(loginService);

    const usuario = await loginController.execute();

    console.log('==========================================');
    console.log('              MENU PRINCIPAL');
    console.log('==========================================');
    console.log(`Usuário autenticado: ${usuario.login}`);
    console.log('');
    console.log('1 - Autores');
    console.log('2 - Livros');
    console.log('3 - Clientes');
    console.log('4 - Empréstimos');
    console.log('5 - Relatórios');
    console.log('0 - Encerrar');
    console.log('');
    console.log('Os módulos serão implementados nas próximas features.');
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Erro inesperado ao iniciar a aplicação.';

    console.error(`Não foi possível iniciar a aplicação: ${message}`);
    process.exitCode = 1;
  } finally {
    loginController?.close();
    await database.end();
  }
}

void main();
