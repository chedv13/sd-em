# ENTD Draws — приложение для Wix (App Market)

Wix-приложение на **новом едином Wix CLI** (`@wix/cli` + Astro, `src/extensions/...`).
Старый «Wix CLI for Apps» (`@wix/create-app`, `src/site/widgets/custom-elements/…`) объявлен устаревшим — не используем.

Что внутри:

- **Site widget «ENTD Draw Button»** (custom element) — мерчант добавляет его в редакторе
  (Add Elements → App Widgets) и настраивает в панели Settings: Connection ID, Drawing ID, режим для гостей,
  текст, тема, размер, форма, выравнивание, логотип, full width.
- **Dashboard page «ENTD Draws»** — онбординг: 4 шага настройки (App Market без него часто отклоняет).
  Кнопка «Manage» у виджета ведёт сюда.

`external_id`: `wix:<member id>` для залогиненных участников сайта (`currentMember.getMember()` из `@wix/site-members`,
прав у приложения не требует), иначе `anon:<uuid>` из localStorage или окно логина Wix (режим «Must log in first»).
`source` — hostname сайта. В `data` дополнительно уходит `wix: {member_id, page}`.

## Структура

```
wix/
  wix.config.json            appId — ЗАПОЛНИТЬ (см. ниже)
  astro.config.mjs, tsconfig.json, .nvmrc (Node 22), .npmrc
  public/entd-draw-button-thumbnail.png     превью виджета в Add Elements
  bin/wrap-lib.sh            UMD-сборка sd-em → ES-модуль src/lib/entd.js
  src/
    extensions.ts            регистрация расширений
    lib/entd.js, entd.d.ts   библиотека ENTD (генерируется, не править руками)
    extensions/site/widgets/entd-draw-button/
      entd-draw-button.extension.ts   конфиг виджета (id, размеры, превью, tagName)
      entd-draw-button.tsx            кастомный элемент (обычный HTMLElement, без Shadow DOM)
      entd-draw-button.panel.tsx      панель настроек в редакторе (@wix/editor widget.setProp)
    extensions/dashboard/pages/entd/
      entd.extension.ts, entd.tsx     страница в админке сайта
```

## Сборка библиотеки

```bash
cd wix
npm run sync            # ENTD под прод (api.entd.tech) → src/lib/entd.js
npm run sync:staging    # под aientd.space
```

**Сейчас в `src/lib/entd.js` — staging.** Перед `release` для App Market обязательно `npm run sync`.

---

## Пошагово: от нуля до App Market

### 0. Что нужно

- Аккаунт Wix (лучше отдельный «ENTD» с доступом команды) — через него создаётся приложение.
- Node 22 (`nvm use`), Git.
- Публичные страницы на entd.tech: **Privacy Policy**, **Terms of Use**, support email — без них листинг не отправить.

### 1. Создать приложение в Wix и привязать проект

1. https://manage.wix.com → **Custom Apps** (или https://dev.wix.com → **Create New App**) → создать приложение «ENTD Draws».
2. Скопировать **App ID** (App dashboard → Settings / OAuth) и вписать в `wix/wix.config.json` → `appId`.
3. В терминале:
   ```bash
   cd wix
   npm install
   npx wix login          # откроет браузер, войти в аккаунт из п.1
   npx wix env pull       # подтянет WIX_CLIENT_ID и прочие переменные в .env.local
   ```
   > Альтернатива, если что-то не заводится: `npm create @wix/new@latest -- app` (создаст приложение и чистый проект),
   > затем перенести в него `src/extensions/site/widgets/entd-draw-button`, `src/extensions/dashboard/pages/entd`,
   > `src/lib`, `public/entd-draw-button-thumbnail.png`, `bin/`, строки `.use(...)` в `src/extensions.ts`
   > и зависимости `@wix/editor`, `@wix/site`, `@wix/site-members` из `package.json`.

### 2. Разработка и проверка

```bash
npm run dev
```

- При первом запуске CLI предложит выбрать или создать **dev-сайт** (бесплатный Premium, до 5 шт.) и откроет редактор.
- В редакторе: **Add Elements → App Widgets → ENTD Draw Button** → Settings → вписать Connection ID и Drawing ID.
- Проверить на **опубликованном** dev-сайте (в редакторе/превью виджет в песочнице-iframe: нет localStorage,
  API участников работает не полностью):
  - кнопка рисуется, по клику открывается модалка ENTD;
  - в ENTD должен быть connection, привязанный к домену dev-сайта (host вида `<user>.wixsite.com`),
    иначе модалка покажет «Unable to enter the drawing»;
  - залогиненный участник уходит как `wix:<id>`, гость — `anon:<uuid>`, режим «Must log in first» открывает логин Wix.

### 3. Релиз версии

```bash
npm run sync        # прод-сборка библиотеки
npm run build
npm run release     # создаёт версию приложения и регистрирует виджет и страницу
```

Проверить: App dashboard → **Test App** → Test on dev site. Чтобы виджет был виден в Add Elements,
нужен `presets` с превью — он уже есть (`public/entd-draw-button-thumbnail.png`).

### 4A. Раздать своим клиентам без App Market (сразу, без ревью)

App dashboard → **Distribute App** → **Share Install Link** (или **Install on Site** для сайтов, к которым есть доступ).
Приложение остаётся «unlisted». Подходит для пилотов и своих магазинов.
> App Market — только для публичных приложений. Если приложение нужно лишь конкретным клиентам, подавать в Market не надо.

### 4B. Публикация в Wix App Market

Всё в App dashboard (manage.wix.com → Custom Apps → ENTD Draws):

1. **App Profile → App Info**
   - Название, teaser (1 строка), **иконка 1000×1000 PNG** (24-bit, sRGB).
   - Минимум **3 фичи**, полное описание (сплошным текстом, англ., >500 символов уходит под «Read more»).
   - **Demo site URL** — обязателен, раз у приложения есть видимый виджет. Сделать отдельный опубликованный Wix-сайт
     с установленной кнопкой (и рабочим connection в ENTD).
   - Ссылка на **Terms & Conditions**.
2. **App Profile → Media** — 5–6 скриншотов **от 1200×900, 4:3, JPG/PNG**: кнопка на шаблоне сайта (2 шт.),
   панель настроек (1–2), модалка ENTD, dashboard-страница. Желательно YouTube-видео (сильно рекомендуют).
   Опционально промо-баннер 540×360.
3. **Get Found** — категория (например, Marketing / Sales) и до 5 ключевых слов: raffle, giveaway, draw, sneakers, launch.
4. **App Audience** — языки, страны; требуемые продукты Wix — никакие (работает на любом сайте).
5. **Company Info** — логотип, название (до 23 символов), описание (до 1200), адрес, сайт, **Privacy Policy**.
6. **Pricing** — Free (для начала). Если будут платные планы — только через Wix Billing.
7. **Security & Privacy** — заполнить анкету (какие данные собираем: ID участника, anon ID, URL страницы → ENTD).
8. **Submit App** → в Submission Summary убрать все Blockers → в заметках для ревьюера указать:
   demo-сайт, тестовые Connection ID / Drawing ID, как проверить сценарий (открыть сайт → нажать кнопку → модалка).

Ревью — до ~15 рабочих дней, приложение на это время заблокировано для правок.
После первой публикации новые версии (`npm run release`) ревью уже не требуют.

---

## Что сделать руками (сводка)

- [ ] Создать приложение в Wix, вписать `appId`, `wix login`, `wix env pull`.
- [ ] `npm run sync` (прод) перед каждым релизом.
- [ ] В ENTD: connection для каждого Wix-сайта клиента, привязанный к его домену (`X-SD-Host` = домен сайта;
      у бесплатных сайтов это `<user>.wixsite.com`, у сайтов со своим доменом — сам домен, лучше оба).
- [ ] Решить, принимаем ли анонимных (`anon:*`) — иначе рекомендовать режим «Must log in first».
- [ ] Privacy Policy / Terms / support email на entd.tech (сейчас на dashboard-странице стоит `support@entd.tech` —
      заменить на реальный).
- [ ] Иконка 1000×1000, 5–6 скриншотов, demo-сайт — для листинга.

## Риски для ревью и что улучшить потом

- **Своя модалка поверх сайта.** Гайдлайны Wix: окна открывать «как Wix popup/modal». Наша модалка — не браузерный
  popup, скорее всего пройдёт, но если ревьюер придерётся — перейти на `window.openModal(url)` из `@wix/site-window`
  (нужен URL страницы участия на entd.tech вместо iframe внутри нашей модалки).
- **Доверие к member ID.** ID участника берётся на фронте — подделать можно (как и в Shopify/WooCommerce-версиях).
  Если ENTD должен доверять личности участника — добавить backend-endpoint приложения (`src/pages/api/...`):
  он получает `auth.getTokenInfo()` → `subjectType: 'MEMBER'`, `subjectId`, `siteId`, `instanceId` и подписывает
  запрос к ENTD. Тогда же можно автоматически сопоставлять сайт с connection без ручного Connection ID.
- **Connection ID вводится в каждом виджете.** Можно вынести на dashboard-страницу (одна настройка на сайт) —
  через Data Collections или backend-endpoint приложения.
- **Не проверено на живом Wix**: `wix build` / `wix dev` требуют логина и зарегистрированного приложения. Проверены
  типы (`tsc`) и работа элемента вне Wix (рендер, подсказка без ID, перерисовка при смене настроек, модалка).
