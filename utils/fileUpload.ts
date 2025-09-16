import fs = require("fs");
import path = require("path");

const fileName = "fileUpload.ts";

const saveUploadedFile = (file: Express.Multer.File, folder = "./uploads") => {
  if (!file) return null;

  try {
    // Check if folder exist
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    const filename = `${Date.now()}${path.extname(file.originalname)}`;
    const filePath = path.join(folder, filename);

    // Store file
    fs.writeFileSync(filePath, file.buffer);

    return filePath;
  } catch (error) {
    console.error("ERROR", fileName, "saveUploadedFile", error);
  }
};

const deleteUploadedFile = (filePath: string) => {
  if (!filePath) return null;

  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (error) {
    console.error("ERROR", fileName, "deleteUploadedFile", error);
  }
};

module.exports = { saveUploadedFile, deleteUploadedFile };
