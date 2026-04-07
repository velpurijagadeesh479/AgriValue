import fs from "fs/promises";
import path from "path";
import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "./config.js";

const sanitizeFileName = (fileName) =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");

const ensureTrailingSlashRemoved = (value) => value.replace(/\/+$/, "");

const buildS3Client = () => {
  if (config.storage.provider !== "s3") {
    return null;
  }

  return new S3Client({
    region: config.storage.s3Region,
    endpoint: config.storage.s3Endpoint || undefined,
    forcePathStyle: config.storage.s3ForcePathStyle,
    credentials:
      config.storage.s3AccessKeyId && config.storage.s3SecretAccessKey
        ? {
            accessKeyId: config.storage.s3AccessKeyId,
            secretAccessKey: config.storage.s3SecretAccessKey,
          }
        : undefined,
  });
};

const s3 = buildS3Client();

const getS3PublicBaseUrl = () => {
  if (config.storage.s3PublicBaseUrl) {
    return ensureTrailingSlashRemoved(config.storage.s3PublicBaseUrl);
  }

  if (config.storage.s3Endpoint) {
    const endpoint = ensureTrailingSlashRemoved(config.storage.s3Endpoint);
    return config.storage.s3ForcePathStyle
      ? `${endpoint}/${config.storage.s3Bucket}`
      : endpoint.replace("://", `://${config.storage.s3Bucket}.`);
  }

  return `https://${config.storage.s3Bucket}.s3.${config.storage.s3Region}.amazonaws.com`;
};

const getLocalUploadUrl = (req, fileName) =>
  `${req.protocol}://${req.get("host")}/uploads/${path.basename(fileName)}`;

const getS3ObjectKey = (fileName) => `products/${Date.now()}-${sanitizeFileName(fileName)}`;

const validateS3Config = () => {
  const required = ["s3Bucket", "s3Region"];
  const missing = required.filter((key) => !config.storage[key]);
  if (missing.length > 0) {
    throw new Error(`Missing S3 storage configuration: ${missing.join(", ")}`);
  }
};

export async function saveUploadedFiles(req, files) {
  if (!files?.length) {
    return [];
  }

  if (config.storage.provider === "s3") {
    validateS3Config();
    const publicBaseUrl = getS3PublicBaseUrl();

    return Promise.all(
      files.map(async (file) => {
        const key = getS3ObjectKey(file.originalname);
        await s3.send(
          new PutObjectCommand({
            Bucket: config.storage.s3Bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );

        return `${publicBaseUrl}/${key}`;
      }),
    );
  }

  await fs.mkdir(config.uploadsDir, { recursive: true });

  return Promise.all(
    files.map(async (file) => {
      const fileName = `${Date.now()}-${sanitizeFileName(file.originalname)}`;
      const target = path.join(config.uploadsDir, fileName);
      await fs.writeFile(target, file.buffer);
      return getLocalUploadUrl(req, fileName);
    }),
  );
}

const extractS3KeyFromUrl = (url) => {
  try {
    const parsed = new URL(url);
    const prefix = new URL(`${getS3PublicBaseUrl()}/`);
    if (parsed.origin !== prefix.origin) {
      return null;
    }

    let key = parsed.pathname.replace(/^\/+/, "");
    if (config.storage.s3ForcePathStyle && key.startsWith(`${config.storage.s3Bucket}/`)) {
      key = key.slice(config.storage.s3Bucket.length + 1);
    }
    return key;
  } catch {
    return null;
  }
};

export async function deleteUploadedFiles(urls) {
  if (!urls?.length) {
    return;
  }

  if (config.storage.provider === "s3") {
    await Promise.all(
      urls.map(async (url) => {
        const key = extractS3KeyFromUrl(url);
        if (!key) {
          return;
        }

        await s3.send(
          new DeleteObjectCommand({
            Bucket: config.storage.s3Bucket,
            Key: key,
          }),
        );
      }),
    );
    return;
  }

  await Promise.all(
    urls.map(async (url) => {
      const fileName = path.basename(url);
      const filePath = path.join(config.uploadsDir, fileName);
      await fs.rm(filePath, { force: true });
    }),
  );
}
