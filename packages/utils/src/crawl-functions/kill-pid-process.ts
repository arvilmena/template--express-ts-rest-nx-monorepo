import ps from "ps-node";
import { promisify } from "util";
import { getProcessDetails } from "./get-pid-process-details";

export async function killPidProcess(pid: number) {
  const process = getProcessDetails(pid);
  const asyncKill = promisify(ps.kill);

  try {
    asyncKill((await process).pid);
  } catch (error) {
    throw new Error(`pid of browser: ${pid} kill failed`);
  }
}
