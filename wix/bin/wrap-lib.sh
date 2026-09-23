#!/usr/bin/env bash
# Превращает UMD-сборку ENTD (../.entd-build/index.js) в ES-модуль src/lib/entd.js,
# чтобы Vite внутри Wix CLI мог сделать `import { ENTD } from '../lib/entd.js'`.
# UMD видит объекты module/exports и кладёт в них экспорт, мы его переэкспортируем.
set -euo pipefail
cd "$(dirname "$0")/.."

{
  echo '/* eslint-disable */'
  echo '// Сгенерировано bin/wrap-lib.sh из сборки sd-em. Не редактировать — запустить npm run sync.'
  echo 'var module = { exports: {} };'
  echo 'var exports = module.exports;'
  cat .entd-build/index.js
  echo
  echo 'export var ENTD = module.exports.ENTD;'
} > src/lib/entd.js

grep -o 'api\.[a-z]*\.[a-z]*' src/lib/entd.js | sort -u | sed 's/^/API host: /'
