import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import config from "../config";

const s3 = new aws.S3({
  apiVersion: "api-v1",
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.accessKeyId,
  region: config.region,
});

const fileFilter = (req, file, cb) => {
  cb(
    file.mimetype === "image/jpeg" || file.mimetype === "image/png"
      ? (null, true)
      : new Error("Only Image Uploads are accepted")
  );
};

export default multer({
  storage: multerS3({
    fileFilter,
    s3,
    bucket: config.AWSBucket,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldName }),
    key: (req, file, cb) =>
      cb(null, `projects/${req?.body?.title}${Date.now().toString()}`),
  }),
});
