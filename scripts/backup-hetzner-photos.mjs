import { createClient } from '@libsql/client';
import fs from 'node:fs';
import path from 'node:path';

const HETZNER_URL = 'https://db-seva.116.203.118.1.sslip.io';
const HETZNER_AUTH = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MjEwNDY2NTc5Mn0.6dR-i7HkEvs75KyN6BAbY2pvJERbGlBhZclgqqbO6KytoUX4_cj9bcvq3IRf6J0-hREIlOKFZ-TPdknIQ7N6DQ';

const db = createClient({
  url: HETZNER_URL,
  authToken: HETZNER_AUTH,
});

async function runBackup() {
  console.log('--- INICIANDO BACKUP DE HETZNER ---');

  const backupDir = path.resolve('backups');
  const photosDir = path.resolve('backups/fotos');
  const byProductDir = path.resolve('backups/fotos_por_producto');

  fs.mkdirSync(photosDir, { recursive: true });
  fs.mkdirSync(byProductDir, { recursive: true });

  // 1. Export tables to JSON
  console.log('1. Exportando tablas de base de datos...');
  const tables = ['categories', 'products', 'site_settings', 'admin_users'];
  const dbDump = {};

  for (const table of tables) {
    const res = await db.execute(`SELECT * FROM ${table}`);
    dbDump[table] = res.rows;
    console.log(`- ${table}: ${res.rows.length} filas`);
  }

  // 2. Fetch all product images in batches to avoid RESPONSE_TOO_LARGE
  console.log('\n2. Obteniendo lista de fotos desde Hetzner...');
  const idsRes = await db.execute(`
    SELECT pi.id, pi.product_id, pi.storage_path, pi.mime_type, pi.sort_order,
           p.slug as product_slug, p.title as product_title
    FROM product_images pi
    LEFT JOIN products p ON pi.product_id = p.id
    WHERE pi.storage_path IS NOT NULL
    ORDER BY pi.product_id, pi.sort_order
  `);

  console.log(`Encontradas ${idsRes.rows.length} fotos registradas. Descargando en bloques...`);
  
  let savedCount = 0;
  const allImagesDump = [];

  for (let i = 0; i < idsRes.rows.length; i++) {
    const meta = idsRes.rows[i];
    try {
      const dataRes = await db.execute({
        sql: `SELECT image_data FROM product_images WHERE id = ?`,
        args: [meta.id],
      });

      const row = dataRes.rows[0];
      if (!row || !row.image_data) {
        continue;
      }

      allImagesDump.push({
        ...meta,
        image_data: row.image_data,
      });

      const rawBase64 = String(row.image_data).replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(rawBase64, 'base64');
      
      const ext = meta.mime_type === 'image/jpeg' ? 'jpg' : (meta.mime_type === 'image/png' ? 'png' : 'webp');
      
      // Save by image ID (as requested by API /api/images/[id])
      const filenameById = `${meta.id}.${ext}`;
      fs.writeFileSync(path.join(photosDir, filenameById), buffer);

      // Save also organized by product slug for human convenience
      const slug = meta.product_slug || meta.product_id || 'sin-producto';
      const prodFolder = path.join(byProductDir, slug);
      fs.mkdirSync(prodFolder, { recursive: true });
      const filenameByProd = `${meta.sort_order || 0}_${meta.id}.${ext}`;
      fs.writeFileSync(path.join(prodFolder, filenameByProd), buffer);

      savedCount++;
      if (savedCount % 10 === 0 || savedCount === idsRes.rows.length) {
        console.log(`- Fotos descargadas y respaldadas: ${savedCount}/${idsRes.rows.length}`);
      }
    } catch (err) {
      console.error(`Error descargando imagen ${meta.id}:`, err.message);
    }
  }

  dbDump['product_images'] = allImagesDump;

  // Save complete JSON backup
  const jsonPath = path.join(backupDir, 'hetzner_backup_completo.json');
  fs.writeFileSync(jsonPath, JSON.stringify(dbDump, null, 2), 'utf8');
  console.log(`\nBackup JSON completo guardado en: ${jsonPath} (${(fs.statSync(jsonPath).size / 1024 / 1024).toFixed(2)} MB)`);

  console.log(`\n==============================================`);
  console.log(`BACKUP COMPLETADO EXITOSAMENTE`);
  console.log(`- Total de fotos respaldadas en disco: ${savedCount}`);
  console.log(`- Directorio por ID: ${photosDir}`);
  console.log(`- Directorio por Producto: ${byProductDir}`);
  console.log(`==============================================\n`);
}

runBackup().catch(console.error);
