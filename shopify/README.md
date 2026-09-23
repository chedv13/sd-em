# ENTD Draws — Shopify app

Extension-only приложение Shopify (без бэкенда) с theme app extension.
Даёт мерчанту два блока в редакторе темы:

- **App embed «ENTD Draws»** — включается один раз, хранит Connection ID и режим для гостей,
  подключает `entd.js` и `entd-shopify.js` на всех страницах.
- **App block «ENTD Draw button»** — кнопка розыгрыша, которую мерчант перетаскивает
  в любую секцию (обычно на страницу товара) и указывает Drawing ID.

## Структура

```
shopify/
  shopify.app.toml                  конфиг приложения (client_id заполняет CLI)
  package.json                      shopify cli + скрипты
  extensions/entd-draws/
    shopify.extension.toml
    assets/
      entd.js                       копия ../dist/index.js (см. npm run sync)
      entd-shopify.js               glue: singleton, external_id, монтирование по data-атрибутам
      entd-shopify.css              выравнивание кнопки, подсказка в редакторе
    blocks/
      entd-embed.liquid             app embed block (target: head)
      entd-button.liquid            app block (target: section)
```

## Как это работает

1. `entd-embed.liquid` кладёт в `window.ENTDShopify.config` connection ID, домен магазина,
   `customer.id` (или `null`), режим гостей и URL логина, затем подключает оба скрипта с `defer`.
2. `entd-button.liquid` рендерит пустой контейнер `[data-entd-block]` с настройками в data-атрибутах.
   Drawing ID берётся из настроек блока, а если пусто — из метаполя товара `entd.drawing_id`.
3. `entd-shopify.js` после загрузки DOM находит все контейнеры, создаёт один экземпляр `ENTD`,
   вызывает `init()` и `renderDrawingButton()` для каждого. При перерисовке секции в редакторе
   (`shopify:section:load`) монтирует заново.

`external_id`:

| Посетитель      | Режим `anonymous` (по умолчанию)             | Режим `login`                          |
|-----------------|----------------------------------------------|----------------------------------------|
| Залогинен       | `shopify:<customer.id>`                      | `shopify:<customer.id>`                |
| Гость           | `anon:<uuid>` из localStorage                | кнопка ведёт на `/account/login`       |

`source` = `shop.permanent_domain` (например `my-store.myshopify.com`).
Дополнительно в `data` уходит объект `shopify: {shop, customer_id, product_id, locale}`.

## Первый запуск

Нужны: Shopify Partner-аккаунт, dev store, Node 18+.

```bash
cd shopify
npm install

# Вариант A: приложение уже создано в Partner Dashboard
npx shopify app config link

# Вариант B: создать приложение из CLI
npx shopify app dev            # предложит создать новое приложение

# Запуск на dev store (откроет редактор темы с превью расширения)
npx shopify app dev --store my-dev-store.myshopify.com

# Выкладка версии расширения
npx shopify app deploy
```

Перед `deploy` обновите библиотеку под прод:

```bash
npm run sync            # собирает ../dist с API_HOST=api.entd.tech и копирует в assets/entd.js
npm run sync:staging    # то же под aientd.space
```

Сейчас в `assets/entd.js` лежит сборка под **staging** (`api.aientd.space`).

## Установка у мерчанта

1. Установить приложение по ссылке из Partner Dashboard (custom app distribution — без ревью App Store).
2. Online Store → Themes → Customize → Theme settings → **App embeds** → включить **ENTD Draws**, вписать Connection ID.
3. На странице товара: Add block → Apps → **ENTD Draw button**, вписать Drawing ID
   или задать метаполе товара `entd.drawing_id` (Settings → Custom data → Products).

## Что нужно на стороне ENTD

- `connections/validate` проверяет `X-SD-Host`: магазин отвечает и на `*.myshopify.com`,
  и на собственном домене — валидация должна принимать оба.
- Решить, принимаются ли анонимные `external_id` (`anon:*`) или магазину рекомендовать режим `login`.
- Для проверки покупок/заказов потребуется полноценное приложение с OAuth и вебхуком
  `orders/create` — это следующий этап, кнопка и модалка работают без него.

## Ограничения theme app extension

- До 25 блоков, до 100 файлов, до 10 МБ на расширение.
- В app block нельзя использовать `{% javascript %}` / `{% stylesheet %}`; поэтому CSS подключён
  через ключ `"stylesheet"` в схеме, а JS — через embed.
- Блок доступен только в темах Online Store 2.0 (все актуальные темы).
