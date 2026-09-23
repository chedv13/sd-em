/*
 * Glue между ENTD JS-библиотекой (entd.js) и витриной Shopify.
 *
 * - Один экземпляр ENTD на страницу (один вызов validate).
 * - Кнопки монтируются по data-атрибутам контейнеров [data-entd-block],
 *   которые рендерит блок entd-button.liquid.
 * - Повторное монтирование при перерисовке секций в редакторе темы.
 * - external_id: customer.id для залогиненных, анонимный UUID для гостей
 *   (или редирект на логин, если в embed-блоке выбран режим "login").
 */
(function () {
  'use strict';

  var ns = (window.ENTDShopify = window.ENTDShopify || {});
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
      return 'shopify:' + config.customerId;
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

    return options;
  }

  function redirectToLogin() {
    var returnUrl = location.pathname + location.search;
    location.href = config.loginUrl + '?return_url=' + encodeURIComponent(returnUrl);
  }

  function mount(el) {
    var drawingId = el.dataset.drawingId;

    el.setAttribute('data-entd-mounted', 'true');

    if (!drawingId) {
      return;
    }

    if (!config.connectionId) {
      warn('Connection ID is not set. Enable the "ENTD Draws" app embed and fill in the Connection ID.');
      return;
    }

    var entd = getInstance();

    if (!entd) {
      return;
    }

    var selector = '[data-entd-block="' + el.dataset.entdBlock + '"]';
    var data = {
      external_id: externalId(),
      source: config.shopDomain,
      shopify: {
        shop: config.shopDomain,
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

  // Редактор темы перерисовывает секцию при изменении настроек.
  document.addEventListener('shopify:section:load', function (event) {
    mountAll(event.target);
  });

  ns.mount = mount;
  ns.mountAll = mountAll;
  ns.getInstance = getInstance;

  mountAll();
})();
