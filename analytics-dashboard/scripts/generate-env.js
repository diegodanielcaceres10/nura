#!/usr/bin/env node
// Generates public/env.js from analytics-dashboard/.env (gitignored) so the
// browser can read runtime config (window.__env) without baking secrets
// into the committed source. Runs automatically before `npm start`/`build`.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const envPath = path.join(projectRoot, '.env');

if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile(envPath);
}

const clientId = process.env['GOOGLE_CLIENT_ID'] ?? '';
const gaPropertyId = process.env['GA_PROPERTY_ID'] ?? '';

if (!clientId || !gaPropertyId) {
  console.warn(
    '[generate-env] Faltan variables por definir (GOOGLE_CLIENT_ID / GA_PROPERTY_ID). ' +
      'Copiá analytics-dashboard/.env.example a analytics-dashboard/.env y completá los valores.',
  );
}

const outDir = path.join(projectRoot, 'public');
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, 'env.js');
const contents = `window.__env = ${JSON.stringify({
  GOOGLE_CLIENT_ID: clientId,
  GA_PROPERTY_ID: gaPropertyId,
})};\n`;

fs.writeFileSync(outPath, contents);
console.log(`[generate-env] public/env.js generado.`);
