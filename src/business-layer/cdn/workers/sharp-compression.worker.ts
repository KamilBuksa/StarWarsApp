import { sep } from 'path';
import sharp from 'sharp';
import { SharpCompressionWorkerRunOptions } from '../types/cdn.types.dto';

async function sharpCompression(
  fullPathToFile: string,
  pathToCompressionFile: string,
) {
  try {
    await sharp(fullPathToFile)
      .resize(500, 500, {
        background: { r: 255, g: 255, b: 255, alpha: 0.0 },
      })
      .withMetadata()
      .jpeg({ quality: 30 })
      .toFile(pathToCompressionFile.split(sep).join('/'));
    console.info(`[Workers] File has been converted to JPEG`);

    return { status: true };
  } catch (error) {
    console.error('[Workers] Conversion error:', error);
  }
}

module.exports = ({
  fullPathToFile,
  pathToCompressionFile,
}: SharpCompressionWorkerRunOptions) => {
  return sharpCompression(fullPathToFile, pathToCompressionFile);
};
