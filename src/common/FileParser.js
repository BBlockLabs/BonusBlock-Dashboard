import { FileObject } from "@/common/FileObject.js";

export default class FileParser {
  /**
   * @param {File} file
   * @return {Promise<FileObject>}
   */
  static async fileToFileObject(file) {
    const image = new FileObject();

    image.type = file.type;

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        image.data = reader.result.split(",")[1];

        resolve(image);
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * @param {FileObject} fileObject
   * @return {string}
   */
  static fileObjectSrc(fileObject) {
    return `data:image/${fileObject.type};base64,${fileObject.data}`;
  }
}
