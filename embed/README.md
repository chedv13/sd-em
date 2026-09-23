# ENTD Embed — no-code подключение розыгрышей

Лоадер для конструкторов сайтов (Tilda, Webflow, Squarespace, Wix, Framer…) и любых HTML-страниц:
розыгрыш ставится data-атрибутами, без JavaScript на стороне сайта. Инструкции для пользователей —
https://entd.tech/integrations (исходники в entd-frontend: `src/components/integrations/guides.tsx`).

```html
<div data-entd-drawing="DRAWING_ID"></div>
<script src="https://entd.tech/em/entd-embed.js" data-connection-id="CONNECTION_ID" async></script>
```

Бандл `entd-embed.js` = собранная библиотека + `src/entd-embed.js` (glue), как у `../gtm`.

## Что умеет glue

- `[data-entd-drawing]` на контейнере — внутрь рендерится кнопка ENTD (`renderDrawingButton`).
- `[data-entd-drawing]` на своём `<a>`/`<button>` — модалка открывается по клику на него
  (переопределяется `data-entd-mode="button" | "attach"`).
- Ссылка с `href="#entd-draw-DRAWING_ID"` — для кнопок конструкторов, где можно задать только URL.
  Клик ловится в фазе захвата на `window`, раньше обработчиков якорей конструктора.
- `MutationObserver` подхватывает контейнеры, появившиеся позже (SPA, попапы).
- Один экземпляр `ENTD` на Connection ID, повторного монтирования нет (`data-entd-mounted`).

Настройки скрипта — data-атрибуты тега `<script>` или `window.ENTDEmbedConfig` (перекрывает атрибуты):
`connection-id` / `connectionId`, `guest-mode` (`anonymous` | `login`), `login-url`, `user-id`, `source`.
У элемента: `data-entd-connection`, `data-entd-user-id`, `data-entd-source`, внешний вид кнопки —
`data-entd-theme`, `-size`, `-shape`, `-text`, `-logo="false"`, `-full-width="true"`, `-class`.

`external_id`: user-id из элемента/конфига, иначе `anon:<uuid>` из localStorage (`entd_anon_id`),
либо редирект на `login-url?redirect_to=…` в режиме `login`. В `data` дополнительно уходит `embed: {page}`.

## Сборка и публикация

```bash
cd embed
npm run build              # build/entd-embed.js (api.entd.tech) и build/entd-embed.staging.js (api.aientd.space)
npm run test:page          # http://localhost:8091/test/ — стенд со staging-бандлом (shop vega)
npm run publish:frontend   # собрать embed + gtm и положить все бандлы в ../../entd-frontend/public/sdk/{prod,staging}
```

entd-frontend раздаёт их по стабильным URL (rewrite в `next.config.ts` по `APP_ENV`, кеш 5 минут):

| URL | prod (entd.tech) | staging (aientd.space) |
|---|---|---|
| `/em/entd.js` | библиотека | библиотека |
| `/em/entd-embed.js` | этот лоадер | этот лоадер |
| `/em/entd-gtm.js` | рантайм GTM-шаблона | рантайм GTM-шаблона |

После `publish:frontend` бандлы нужно закоммитить в entd-frontend и задеплоить.
