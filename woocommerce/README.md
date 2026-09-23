# ENTD Draws — плагин для WooCommerce

Обычный WordPress-плагин (PHP, без сборки и без бэкенда на нашей стороне) поверх `sd-em`.
Аналог `../shopify`, логика на витрине та же: glue-скрипт монтирует кнопку ENTD по data-атрибутам.

Что даёт мерчанту:

- **WooCommerce → Settings → ENTD Draws** — Connection ID, режим для гостей, автовставка и её позиция,
  внешний вид кнопки по умолчанию.
- **Поле «ENTD Drawing ID»** в карточке товара (Product data → General) + галочка «Hide “Add to cart”»,
  если товар продаётся только через розыгрыш.
- **Автовставка** кнопки на страницу товара, у которого задан Drawing ID. Работает и в классических темах
  (хук `woocommerce_single_product_summary`), и в блочных (рядом с блоком `woocommerce/add-to-cart-form`).
- **Шорткод** для любых страниц, Elementor, блока Shortcode и т.д.:

  ```
  [entd_draw_button drawing_id="80fee286-..." text="Участвовать" theme="dark" size="large" shape="pill" align="center" logo="yes" full_width="no" class=""]
  [entd_draw_button product_id="123"]   ← Drawing ID из товара 123
  [entd_draw_button]                    ← на странице товара: Drawing ID текущего товара
  ```

## Структура

```
woocommerce/
  package.json               скрипты: sync, sync:staging, zip, env:up/down/reset
  docker-compose.yml         локальный стенд WP + WooCommerce (плагин примонтирован)
  bin/setup-local.sh         установка WP/Woo, тестовый товар с Drawing ID
  entd-draws/                ← это и есть плагин (то, что уходит в zip)
    entd-draws.php           заголовок плагина, bootstrap, HPOS-совместимость
    uninstall.php            чистит опции при удалении
    includes/
      class-entd-options.php   чтение опций, дефолты, допустимые значения
      class-entd-settings.php  вкладка в настройках WooCommerce
      class-entd-product.php   метаполя товара _entd_drawing_id / _entd_hide_add_to_cart
      class-entd-frontend.php  автовставка, шорткод, подключение скриптов, window.ENTDWoo.config
    assets/
      entd.js                копия ../dist/index.js (см. npm run sync)
      entd-woo.js            glue: singleton, external_id, монтирование
      entd-woo.css           выравнивание, подсказка для менеджеров
```

`external_id`:

| Посетитель | Режим `anonymous` (по умолчанию) | Режим `login`                                |
|------------|----------------------------------|----------------------------------------------|
| Залогинен  | `woo:<WP user ID>`               | `woo:<WP user ID>`                           |
| Гость      | `anon:<uuid>` из localStorage    | кнопка ведёт на `wp-login.php?redirect_to=…` |

`source` — хост сайта из `home_url()`. В `data` дополнительно уходит `woocommerce: {site, customer_id, product_id, locale}`.
URL логина можно заменить фильтром `entd_draws_login_url` (например, на страницу «My account»).

## Сборка

```bash
cd woocommerce
npm run sync            # собрать ../dist под прод (api.entd.tech) и положить в entd-draws/assets/entd.js
npm run sync:staging    # то же под aientd.space
npm run zip             # → entd-draws.zip, его и ставят через Plugins → Add New → Upload
```

Сейчас в `assets/entd.js` лежит сборка под **staging** (та же, что в `shopify/`).
**Перед выдачей zip мерчанту обязательно `npm run sync` (прод), потом поднять `Version` в `entd-draws.php`
и `ENTD_DRAWS_VERSION`** — от версии зависит сброс кеша (`?ver=` в URL скриптов).

## Локальный стенд

Нужен запущенный Docker.

```bash
npm run env:up          # http://localhost:8080  (admin / admin), тема Storefront, товар «ENTD Test Sneakers»
ENTD_CONNECTION_ID=... ENTD_DRAWING_ID=... npm run env:up   # сразу с реальными ID
docker compose run --rm cli theme activate twentytwentyfive # проверить блочную тему
npm run env:down        # остановить; env:reset — снести вместе с БД
```

На localhost модалка покажет «Unable to enter the drawing»: `connections/validate` не знает хост `localhost:8080`.
Для полного прогона нужен connection, привязанный к этому хосту (или туннель/домен).

## Что сделать руками

### Со стороны ENTD (бэкенд/админка)

1. **Завести connection для WooCommerce-магазина** и привязать к его домену. `validate` сверяет `X-SD-Host`
   (= `window.location.host`, с портом, если он есть). Если магазин открывается и с `www.`, и без — нужны оба варианта.
2. **Решить про анонимных участников** (`anon:*`). Если не принимаем — мерчанту ставить режим «Must log in first».
3. Убедиться, что бэкенд спокойно принимает лишнее поле `woocommerce` в `data` (для Shopify уже уходит `shopify`).
4. Если нужна проверка покупок — это отдельный этап: вебхуки WooCommerce (`order.created`) или REST API
   с ключами мерчанта. Кнопка и модалка работают без этого.

### Установка у мерчанта

1. Получить `entd-draws.zip` (после `npm run sync` + `npm run zip`).
2. WordPress admin → **Plugins → Add New → Upload Plugin** → выбрать zip → Install → **Activate**.
   (WooCommerce должен быть установлен; WP ≥ 6.5, PHP ≥ 7.4.)
3. **WooCommerce → Settings → ENTD Draws** → вписать **Connection ID** → Save.
4. **Products → нужный товар → Product data → General** → вписать **ENTD Drawing ID**
   (опционально «Hide “Add to cart”») → Update.
5. Открыть страницу товара — кнопка под «Add to cart». Либо вставить шорткод на любую страницу.

### Если что-то не так

| Симптом | Что проверить |
|---|---|
| Кнопки нет вообще | Задан ли Drawing ID у товара; включено ли «Show automatically». Конструкторы (Elementor Pro, Divi) и кастомные шаблоны товара могут не вызывать хуки WooCommerce → вставить шорткод `[entd_draw_button]` в шаблон товара руками. |
| Контейнер `.entd-draw` есть, кнопки нет | Консоль: `[ENTD] Connection ID is not set` или `entd.js is not loaded`. Оптимизаторы (WP Rocket, Autoptimize, LiteSpeed) могут склеивать/откладывать JS — исключить `entd.js` и `entd-woo.js` из combine/delay. |
| Модалка «Unable to enter the drawing» | Не тот Connection ID или хост магазина не привязан к connection в ENTD. |
| Залогиненный пользователь видится как гость | Страница закеширована для всех. Кеш-плагины обычно не кешируют для залогиненных; если кешируют — отключить для них. |
| CSP блокирует iframe/запросы | Разрешить `api.entd.tech` в `connect-src` и `entd.tech` в `frame-src`. |

## Чего пока нет (можно добавить позже)

- Отдельного Gutenberg-блока с настройками (сейчас — блок Shortcode).
- Переводов (`languages/` пустая, text domain `entd-draws`; строки обёрнуты в `__()`).
- Публикации в каталог WordPress.org: нужны `readme.txt` в их формате, GPL-совместимая лицензия
  и ревью. Для раздачи своим мерчантам хватает zip.
