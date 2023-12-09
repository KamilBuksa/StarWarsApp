import { Injectable } from '@nestjs/common';
import 'sharp';
import { resolve } from 'path';
import Piscina from 'piscina';
@Injectable()
export class CdnWorkerService {
  sharpCompressionWorker = new Piscina({
    filename: resolve(__dirname, 'sharp-compression.worker.js'),
  });

  convertToJpgWorker = new Piscina({
    filename: resolve(__dirname, 'convert-to-jpg.worker.js'),
  });

  constructor() {}

  async sharpCompression(
    fullPathToFile: string,
    pathToCompressionFile: string,
  ) {
    return this.sharpCompressionWorker.run({
      fullPathToFile,
      pathToCompressionFile,
    });
  }

  async convertHeicToJpg(
    destination: string,
    filename: string,
    filePath: string,
  ) {
    return this.convertToJpgWorker.run({
      message: { destination, filename, filePath },
    });
  }
}
