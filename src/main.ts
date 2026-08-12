//console.log ("Hello World")
import { AppDataSource } from './infra/database/data-source';
import { UsuarioEntity } from './infra/database/entities/usuario.entity';

async function main(): Promise<void> {
  try {
    await AppDataSource.initialize();

    console.log('Conexão com o banco estabelecida.');

    const usuarioRepository = AppDataSource.getRepository(UsuarioEntity);

    const usuarios = await usuarioRepository.find({
      relations: {
        perfil: true,
      },
    });

    console.log(`Usuários encontrados: ${usuarios.length}`);

    for (const usuario of usuarios) {
      console.log(
        `ID: ${usuario.id} | Login: ${usuario.login} | Perfil: ${usuario.perfil.nome}`,
      );
    }
  } catch (error) {
    console.error('Erro ao acessar o banco de dados:', error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

void main();
