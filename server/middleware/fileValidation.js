const fs = require("fs/promises");

const validateUploadedFile = async (req, res, next) => {
  if (!req.file) return next();
  try {
    const handle = await fs.open(req.file.path, "r");
    const buffer = Buffer.alloc(8);
    await handle.read(buffer, 0, 8, 0);
    await handle.close();
    const ext = req.file.originalname.toLowerCase().endsWith(".pdf") ? "pdf" : "docx";
    const validPdf = ext === "pdf" && buffer.subarray(0, 5).toString() === "%PDF-";
    const validDocx = ext === "docx" && buffer[0] === 0x50 && buffer[1] === 0x4b &&
      [0x03, 0x05, 0x07].includes(buffer[2]) && [0x04, 0x06, 0x08].includes(buffer[3]);
    if (!validPdf && !validDocx) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ success: false, message: "Uploaded file content does not match a valid PDF or DOCX" });
    }
    next();
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    next(error);
  }
};

module.exports = validateUploadedFile;
