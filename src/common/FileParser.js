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

  /**
   * @param {File} file
   * @return Promise<string>
   */
  static fileToBase64(file) {
    return new Promise((resolve, error) => {
      const reader = new FileReader();

      reader.onload = function () {
        resolve(reader.result);
      };

      reader.onerror = error;

      reader.readAsDataURL(file);
    });
  }

  /**
   * @param {String} base64
   * @return {Promise<File>}
   */
  static async base64ToFile(base64) {
    const response = await fetch(base64);

    const arrayBuffer = await response.arrayBuffer();

    if (!response.headers.has("content-type")) {
      return new File([arrayBuffer], `file${Date.now()}`);
    }

    return new File([arrayBuffer], `file${Date.now()}`, {
      type: response.headers.get("content-type"),
    });
  }
}
