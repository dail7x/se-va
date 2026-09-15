import { createClient } from '@libsql/client';
import sharp from 'sharp';
import fs from 'node:fs';

let token = process.env.DATABASE_AUTH_TOKEN;
if (!token && fs.existsSync('jwt_token.txt')) {
  token = fs.readFileSync('jwt_token.txt', 'utf8').trim();
}

const dbUrl = process.env.DATABASE_URL || 'https://db-seva.116.203.118.1.sslip.io';
const db = createClient({
  url: dbUrl,
  authToken: token,
});

async function main() {
  console.log('Connecting to SQLite on VPS...');
  const imagesRes = await db.execute(`
    SELECT id, product_id, storage_path 
    FROM product_images 
    WHERE image_data IS NULL AND storage_path LIKE 'http%'
  `);

  console.log(`Found ${imagesRes.rows.length} images to download and optimize into SQLite.`);

  if (imagesRes.rows.length === 0) {
    console.log('All images are already stored in SQLite!');
    return;
  }

  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < imagesRes.rows.length; i++) {
    const row = imagesRes.rows[i];
    const url = String(row.storage_path);
    const id = String(row.id);

    process.stdout.write(`[${i + 1}/${imagesRes.rows.length}] Fetching ${id.slice(0, 8)}... `);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`FAILED (${res.status} ${res.statusText})`);
        failedCount++;
        continue;
      }

      const inputBuffer = Buffer.from(await res.arrayBuffer());

      // Compress and resize with sharp to WebP
      const webpBuffer = await sharp(inputBuffer)
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const base64 = webpBuffer.toString('base64');
      const localPath = `/api/images/${id}`;

      await db.execute({
        sql: `
          UPDATE product_images 
          SET storage_path = ?, image_data = ?, mime_type = 'image/webp'
          WHERE id = ?
        `,
        args: [localPath, base64, id],
      });

      const originalKb = (inputBuffer.length / 1024).toFixed(0);
      const webpKb = (webpBuffer.length / 1024).toFixed(0);
      console.log(`OK: ${originalKb} KB -> ${webpKb} KB WebP`);
      successCount++;
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      failedCount++;
    }
  }

  console.log(`\n=============================================`);
  console.log(`Resumen de descarga y optimización:`);
  console.log(`- Exitosas: ${successCount}`);
  console.log(`- Fallidas: ${failedCount}`);
  console.log(`=============================================`);
}

main().catch(console.error);
