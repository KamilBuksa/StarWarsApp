import { promises as fsPromises, constants } from 'fs';
import { isProduction } from '../../utils/other.utils';

// operations from 'fs' to change to async :existsSync, mkdirSync, rmSync, readFileSync, writeFileSync, writeFile, readFile, access, rm, mkdir

export class CdnUtils {
  static async checkFileExists(file: string) {
    try {
      await fsPromises.access(file, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  static async deleteFile(file: string): Promise<void> {
    try {
      await fsPromises.rm(file, { force: true });
      if (!isProduction()) console.info(`File is deleted!`);
    } catch (error) {
      console.error(`File deleted error: `, error);
    }
  }

  static async createDirectory(dirPath: string): Promise<void> {
    try {
      await fsPromises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (!isProduction()) console.info(`Can not create directory!`);
      // throw error;
    }
  }

  static async readFile(filePath: string): Promise<Buffer> {
    return fsPromises.readFile(filePath);
  }
  static async readFileAsString(
    filePath: string,
    encoding: BufferEncoding,
  ): Promise<string> {
    return fsPromises.readFile(filePath, { encoding });
  }

  static async writeFile(filePath: string, data: Buffer): Promise<void> {
    return fsPromises.writeFile(filePath, data);
  }
}
