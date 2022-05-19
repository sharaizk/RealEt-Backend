import S3 from "aws-sdk/clients/s3.js";
import fs from "fs";
import multer from "multer";
import multerS3 from "multer-s3";
import config from "../config";

const s3 = new S3({
  apiVersion: "api-v1",
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
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

export const uploadPhoto = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: config.AWSBucket,
    Body: fileStream,
    Key: file.filename + "-" + file.originalname,
  };
  return s3.upload(uploadParams).promise();
};

function dataURItoBlob(dataURI) {
  var binary = atob(dataURI.split(",")[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
}

export const uploadBase64 = (sceneName, base64file) => {
  const base64Data = new Buffer.from(
    base64file.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = base64file.split(";")[0].split("/")[1];
  const uploadParams = {
    Bucket: config.AWSBucket,
    Body: base64Data,
    Key: sceneName + "-imageSource",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };
  return s3.upload(uploadParams).promise();
};
