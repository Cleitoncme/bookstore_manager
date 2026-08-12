import { stdin, stdout } from 'node:process';
import { createInterface, Interface } from 'node:readline/promises';

/**
 * Cria a única interface de terminal utilizada pela aplicação.
 *
 * O ciclo de vida deve ser controlado pelo main.ts.
 */
export function createTerminal(): Interface {
  return createInterface({
    input: stdin,
    output: stdout,
  });
}
