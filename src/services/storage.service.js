import superBase from "../config/supabase.js";
import crypto from "crypto";

// Upload a document to the configured Supabase storage bucket.
const uploadDocument = async (file) => {
  // Keep the original file extension and generate a unique file name.
  const extension = file.originalname.split(".").pop();
  const file_name = `${crypto.randomUUID()}.${extension}`;
  const file_path = `dva-bucket/${file_name}`;

  // Store the file in the bucket with its MIME type.
  const { data, error } = await superBase.storage
    .from("dva-bucket")
    .upload(file_path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw new Error(`Failed to upload the document: ${error.message}`);

  // Return the stored file path for later retrieval.
  return data.path;
};

// Download a document from storage and return its binary content.
const downloadDocument = async (document_path) => {
  const { data, error } = await superBase.storage
    .from("dva-bucket")
    .download(document_path);

  if (error) throw new Error(`Failed to download document: ${error.message}`);

  // Convert the response to a Node.js Buffer for downstream processing.
  const buffer = Buffer.from(await data.arrayBuffer());

  return {
    buffer,
    mimeType: data.type,
  };
};

export default { uploadDocument, downloadDocument };
