'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export type UploadState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  uploadUrl?: string;
  fileKey?: string;
};

export async function getPresignedUrl(
  fileName: string,
  fileType: string
): Promise<{ success: boolean; url?: string; key?: string; error?: string }> {
  try {
    if (!process.env.AWS_BUCKET_NAME) {
      throw new Error('AWS_BUCKET_NAME is not configured');
    }

    const fileExtension = fileName.split('.').pop();
    const uniqueKey = `uploads/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return { success: true, url, key: uniqueKey };
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    return { success: false, error: error.message };
  }
}
