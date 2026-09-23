/*
 * Glue между ENTD JS-библиотекой (entd.js) и витриной WooCommerce.
 * Порт shopify/extensions/entd-draws/assets/entd-shopify.js.
 *
 * - Один экземпляр ENTD на страницу (один вызов validate).
 * - Кнопки монтируются по data-атрибутам контейнеров [data-entd-block],
 *   которые рендерит ENTD_Frontend::render_button().
 * - external_id: ID пользователя WordPress для залогиненных, анонимный UUID для гостей
 *   (или редирект на логин, если в настройках выбран режим "login").
 */
(function () {
  'use strict';

  var ns = (window.ENTDWoo = window.ENTDWoo || {});
  var config = ns.config || {};
  var ANON_KEY = 'entd_anon_id';
  var instance = null;

  function warn(message) {
    if (window.console && console.warn) {
      console.warn('[ENTD] ' + message);
    }
  }

  function getInstance() {
    if (instance) {
      return instance;
    }

    if (typeof window.ENTD !== 'function') {
      warn('entd.js is not loaded.');
      return null;
    }

    instance = new window.ENTD(config.connectionId);
    instance.init();

    return instance;
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function anonymousId() {
    try {
      var id = localStorage.getItem(ANON_KEY);

      if (!id) {
        id = uuid();
        localStorage.setItem(ANON_KEY, id);
      }

      return 'anon:' + id;
    } catch (e) {
      return 'anon:' + uuid();
    }
  }

  function externalId() {
    if (config.customerId) {
      return 'woo:' + config.customerId;
    }

    return anonymousId();
  }

  function requiresLogin() {
    return config.guestMode === 'login' && !config.customerId;
  }

  function readOptions(el) {
    var d = el.dataset;
    var options = {
      theme: d.theme || 'light',
      size: d.size || 'medium',
      shape: d.shape || 'rectangular',
      logo: d.logo !== 'false',
      fullWidth: d.fullWidth === 'true',
    };

    if (d.text) {
      options.text = d.text;
    }

    if (d.className) {
      options.className = d.className;
    }

    return options;
  }

  function redirectToLogin() {
    var url = config.loginUrl || '/wp-login.php';
    var separator = url.indexOf('?') === -1 ? '?' : '&';

    location.href = url + separator + 'redirect_to=' + encodeURIComponent(location.href);
  }

  function mount(el) {
    var drawingId = el.dataset.drawingId;

    el.setAttribute('data-entd-mounted', 'true');

    if (!drawingId) {
      return;
    }

    if (!config.connectionId) {
      warn('Connection ID is not set. Fill it in WooCommerce → Settings → ENTD Draws.');
      return;
    }

    var entd = getInstance();

    if (!entd) {
      return;
    }

    var selector = '[data-entd-block="' + el.dataset.entdBlock + '"]';
    var data = {
      external_id: externalId(),
      source: config.siteHost,
      woocommerce: {
        site: config.siteHost,
        customer_id: config.customerId || null,
        product_id: el.dataset.productId || null,
        locale: config.locale || null,
      },
    };

    var buttons = entd.renderDrawingButton(selector, drawingId, data, readOptions(el));

    if (requiresLogin()) {
      // Библиотека вешает свой click-обработчик внутри renderDrawingButton.
      // cloneNode сбрасывает обработчики — подменяем кнопку и ведём на логин.
      buttons.forEach(function (button) {
        var clone = button.cloneNode(true);

        clone.addEventListener('click', redirectToLogin);
        button.parentNode.replaceChild(clone, button);
      });
    }
  }

  function mountAll(root) {
    var scope = root && root.querySelectorAll ? root : document;

    scope.querySelectorAll('[data-entd-block]:not([data-entd-mounted])').forEach(mount);
  }

  ns.mount = mount;
  ns.mountAll = mountAll;
  ns.getInstance = getInstance;

  // Скрипт с defer: обычно DOM уже разобран, но на всякий случай ждём.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      mountAll();
    });
  } else {
    mountAll();
  }
})();
