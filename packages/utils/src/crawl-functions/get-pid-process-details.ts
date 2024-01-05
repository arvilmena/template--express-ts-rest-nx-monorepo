import ps from "ps-node";
import { promisify } from "util";

export async function getProcessDetails(pid: number) {
  const psLookup = promisify(ps.lookup);
  const resultList = await psLookup({ pid });

  if (!resultList.length) {
    throw new Error(`pid of browser: ${pid} lookup failed`);
  }

  const process = resultList[0];
  if (!process) {
    throw new Error(`pid of browser: process cannot be obtained`);
  }
  if (!process.arguments[0]) {
    throw new Error(`pid of browser: process.arguments[0] cannot be obtained`);
  }
  return {
    pid: process.pid,
    command: process.command,
    arguments: process.arguments,
    arg0: process.arguments[0],
  };
}
