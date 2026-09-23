# ENTD Draw Button — шаблон Google Tag Manager

Кастомный шаблон тега GTM поверх `sd-em`. Позволяет поставить кнопку розыгрыша на любой сайт,
где есть GTM, без правки кода сайта (нужен только пустой контейнер или своя кнопка).

## Как устроено

Код шаблона GTM выполняется в песочнице: нет доступа к DOM, нельзя вызвать `new ENTD()`. Поэтому:

1. **Шаблон** (`template/template.tpl`) кладёт настройки тега в очередь `window.entdGtmQueue`
   (API `createQueue`) и подключает бандл через `injectScript`.
2. **Бандл** `entd-gtm.js` = собранная библиотека + `src/entd-gtm.js` (glue). Glue читает очередь и дальнейшие пуши,
   создаёт один `ENTD` на Connection ID, монтирует кнопки по CSS-селектору. Через `MutationObserver`
   подхватывает контейнеры, появившиеся позже (SPA). Повторный запуск тега не создаёт дублей.

Режимы: `render` (кнопка ENTD вставляется в контейнер) и `attach` (модалку открывает своя кнопка/ссылка сайта).
`external_id` — из поля User ID (переменная GTM), иначе `anon:<uuid>` или редирект на Login URL.

```
gtm/
  src/entd-gtm.js        glue
  build/                 (gitignore) entd-gtm.js — прод, entd-gtm.staging.js — staging
  test/index.html        эмуляция тега без GTM: npm run build && npm run test:page → http://localhost:8090/test/
  template/              ← содержимое ПУБЛИЧНОГО репозитория для Community Template Gallery
    template.tpl           сам шаблон (параметры, sandboxed JS, permissions, тесты)
    metadata.yaml          версии для галереи
    LICENSE                Apache 2.0 (требование галереи)
    README.md              документация для пользователей шаблона
```

## Сборка бандла

```bash
cd gtm
npm run build    # build/entd-gtm.js (api.entd.tech) и build/entd-gtm.staging.js (api.aientd.space)
```

Сборка идёт в `gtm/build/`, корневой `dist/` не трогается.

## Куда публиковать

### 1. Бандл — на наш домен (обязательно, иначе тег ничего не загрузит)

URL зашиты в шаблон и в его разрешения `inject_script`:

| Файл | Куда положить |
|---|---|
| `build/entd-gtm.js` | `https://entd.tech/em/entd-gtm.js` |
| `build/entd-gtm.staging.js` | `https://aientd.space/em/entd-gtm.js` |

Требования: HTTPS, `Content-Type: application/javascript`, короткий кеш (например, `max-age=300`): в URL нет версии,
обновления должны доезжать. Если удобнее другой путь/CDN — поменять URL в двух местах `template.tpl`
(`SCRIPT_URLS` и permission `inject_script`) и в тестах.

### 2. Шаблон — Google Tag Manager Community Template Gallery

Галерея берёт шаблоны только из **публичного GitHub-репозитория**, где `template.tpl` лежит **в корне**.

1. Создать публичный репозиторий, например `github.com/chedv13/entd-gtm-template`
   (или в организации ENTD — тогда поправить ссылку `documentation` в `metadata.yaml`).
2. Скопировать туда содержимое `gtm/template/` (в корень), закоммитить, запушить.
3. Проверить шаблон в GTM: **Templates → Tag Templates → New → ⋮ → Import** → `template.tpl` →
   вкладка **Tests → Run tests** (3 сценария должны пройти) → сохранить. Затем тег на тестовом контейнере → Preview.
   При желании там же добавить иконку (Info → Icon) и заново **Export** `template.tpl` в репозиторий.
4. В `metadata.yaml` заменить `sha: 000…` на SHA коммита из п.2 (`git rev-parse HEAD`), закоммитить.
5. Подать заявку через ссылку «Submit template» на
   https://developers.google.com/tag-platform/tag-manager/templates/gallery — указать URL репозитория.
6. Google проверяет шаблон, после этого он ищется в GTM по «ENTD».

Обновления: изменить `template.tpl` → закоммитить → **добавить новую запись сверху** в `versions` в `metadata.yaml`
с SHA этого коммита и `changeNotes`. Галерея подтягивает версии автоматически, повторная заявка не нужна.

### Без галереи (сразу, для своих клиентов)

Отдать клиенту `template.tpl`: **Templates → Tag Templates → New → ⋮ → Import**. Работает сразу, без ревью Google,
но обновлять шаблон клиенту придётся вручную.

## Что сделать руками

- Выложить бандлы на `entd.tech/em/` и `aientd.space/em/` (см. таблицу выше).
- Для каждого сайта клиента: подключение в ENTD, привязанное к его домену (`validate` сверяет `X-SD-Host`).
- Решить, принимаем ли анонимных участников (`anon:*`).
- Публичный репозиторий + заявка в галерею (шаги выше).
- Если у клиента CSP: `script-src entd.tech`, `connect-src api.entd.tech`, `frame-src *.entd.tech`.
