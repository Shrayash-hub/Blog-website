import multer from "multer";
import fs from "fs";
import path from "path";

export const uploadDir = process.env.LOCAL_UPLOAD_PATH || "./public/uploads";

// Ensure the upload directory exists before multer tries to write to it.
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// NOTE: This is local-disk storage. When the AWS migration happens, this
// file is the only place that needs to change - swap `diskStorage` for
// `multer-s3` (or keep diskStorage as a temp buffer and stream the file
// to S3 inside the controller). No controller/route code depends on
// *how* the file is stored, only on the resulting `featuredImage` path
// returned by the controller.
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only image files (jpeg, png, webp, gif) are allowed"));
    }

    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
