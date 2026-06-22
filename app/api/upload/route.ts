import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();
    if (!filename || !contentType) return NextResponse.json({ error: "filename and contentType required" }, { status: 400 });

    const ep = process.env.R2_ENDPOINT, key = process.env.R2_ACCESS_KEY_ID;
    const secret = process.env.R2_SECRET_ACCESS_KEY, bucket = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (!ep || !key || !secret || !bucket) return NextResponse.json({ error: "R2 not configured" }, { status: 500 });

    const s3 = new S3Client({ region: "auto", endpoint: ep, credentials: { accessKeyId: key, secretAccessKey: secret } });
    const fileKey = `${Date.now()}-${filename.replace(/\s+/g, "_")}`;
    const cmd = new PutObjectCommand({ Bucket: bucket, Key: fileKey, ContentType: contentType });
    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
    const pub = `${(publicUrl || ep).replace(/\/$/, "")}/${fileKey}`;

    return NextResponse.json({ uploadUrl, publicUrl: pub, key: fileKey });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}
