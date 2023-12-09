import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { filter, firstValueFrom, fromEvent, map, Observable } from 'rxjs';
import { join } from 'path';
import { Worker } from 'worker_threads';
import { randomUUID } from 'crypto';
import { SharpCompressionWorkerRunOptions } from '../types/cdn.types.dto';

@Injectable()
export class SharpCompressionWorkerHost
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private worker: Worker;
  private message$: Observable<{ id: string; result: number }>;

  onApplicationBootstrap() {
    this.worker = new Worker(join(__dirname, 'sharp-compression.worker.js'));
    this.message$ = fromEvent(this.worker, 'message') as Observable<{
      id: string;
      result: number;
    }>;
  }

  async onApplicationShutdown() {
    this.worker.terminate();
  }

  run(runOptions: SharpCompressionWorkerRunOptions) {
    const { fullPathToFile, pathToCompressionFile } = runOptions;
    const uniqueId = randomUUID();
    this.worker.postMessage({
      fullPathToFile,
      pathToCompressionFile,
      id: uniqueId,
    });

    return firstValueFrom(
      // convert our Observable to a Promise
      this.message$.pipe(
        filter(({ id }) => id === uniqueId), // filter out messages by IDs
        map(({ result }) => result), // pluck result value
      ),
    );
  }
}
