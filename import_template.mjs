// Импорт шаблона в Zabbix 8.0 через API (configuration.import).
// Использование:
//   ZABBIX_API=http://zabbix/api_jsonrpc.php ZABBIX_TOKEN=... node import_template.mjs template_ts_piot_ecm_lm_cz_8.0.yaml
import { readFileSync } from 'node:fs';

const [api, token, file] = [
  process.env.ZABBIX_API,
  process.env.ZABBIX_TOKEN,
  process.argv[2] ?? 'template_ts_piot_ecm_lm_cz_8.0.yaml',
];
if (!api || !token) {
  console.error('Задайте переменные окружения ZABBIX_API и ZABBIX_TOKEN');
  process.exit(1);
}

const yaml = readFileSync(file, 'utf8');
const payload = {
  jsonrpc: '2.0',
  method: 'configuration.import',
  params: {
    format: 'yaml',
    rules: {
      templates: { createMissing: true, updateExisting: true },
      items: { createMissing: true, updateExisting: true, deleteMissing: false },
      triggers: { createMissing: true, updateExisting: true, deleteMissing: false },
    },
    source: yaml,
  },
  id: 1,
};

const res = await fetch(api, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify(payload),
});
console.log(JSON.stringify(await res.json(), null, 2));
