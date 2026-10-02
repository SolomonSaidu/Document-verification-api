import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 6 * 1024 * 1024, // 6MB
  },
});

export default upload;
