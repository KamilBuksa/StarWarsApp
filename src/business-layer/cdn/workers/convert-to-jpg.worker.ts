import { readFile, writeFile } from 'fs/promises';
import convert from 'heic-convert';
import { join } from 'path';
import { ConvertToJpgWorkerRunOptions } from '../types/cdn.types.dto';

async function convertToJpgWorker(message) {
  const { filePath, destination, filename } = message;
  const pathToConvert = process.cwd() + `/${filePath}`;
  const pathToSaveConvertedFile = join(
    `${destination}`,
    `${filename.split('.')[0]}.jpg`,
  );

  try {
    const inputBuffer = await readFile(pathToConvert);
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1,
    });
    await writeFile(pathToSaveConvertedFile, Buffer.from(outputBuffer));

    console.log(`[Workers] Plik został przekonwertowany na format JPEG`);

    return { status: true, pathToSaveConvertedFile };
  } catch (error: any) {
    console.error('[Workers] Błąd konwersji:', error);
    return { status: false, error: error.message };
  }
}

module.exports = ({ message }: ConvertToJpgWorkerRunOptions) => {
  return convertToJpgWorker(message);
};
