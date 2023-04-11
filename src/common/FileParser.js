import imageSize from 'buffer-image-size';

export default class FileParser {

  /**
   * @param {Blob} file
   * @param {Number} maxSize
   * @param {Number} maxWidth
   * @param {Number} maxHeight
   * @return {Promise<Buffer|null>}
   */
  async imageFileToArrayBuffer(
    file,
    maxSize = 1024 * 32,
    maxWidth = 240,
    maxHeight = 240
  ) {
    return new Promise(resolve => {
      if (file.size > maxSize) {
        resolve(null);
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target.result;

        const buffer = new Buffer(arrayBuffer);

        const imageInfo = this.parseImageInfo(buffer);

        if (imageInfo === null) {
          resolve(null);
          return;
        }

        if (
          (
            imageInfo.width > maxWidth
            || imageInfo.height > maxHeight
          )
          && imageInfo.type !== 'svg'
        ) {
          resolve(null);
          return;
        }

        resolve(buffer);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * @param {Buffer} imageBuffer
   * @return {{width: Number, height: Number, type: String}|null}
   */
  parseImageInfo(imageBuffer) {
    const imageInfo = imageSize(imageBuffer);

    if (!imageInfo || !imageInfo.type) {
      return null;
    }

    if (
      !imageInfo.width
      || imageInfo.width <= 0
      || !imageInfo.height
      || imageInfo.height <= 0
    ) {
      return null;
    }

    if (imageInfo.type === 'jpg') {
      imageInfo.type = 'jpeg';
    }

    return imageInfo;
  }
}
