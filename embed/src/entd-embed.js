/*
 * ENTD Embed — подключение розыгрышей без JavaScript: для конструкторов сайтов
 * (Tilda, Webflow, Squarespace, Wix, Framer…) и любых HTML-страниц.
 * Склеивается с собранной библиотекой в один файл entd-embed.js (см. embed/package.json).
 *
 *   <div data-entd-drawing="DRAWING_ID"></div>
 *   <script src="https://entd.tech/em/entd-embed.js" data-connection-id="CONNECTION_ID" async></script>
 *
 * Три способа поставить розыгрыш на страницу:
 * - контейнер [data-entd-drawing] — внутрь рендерится кнопка ENTD;
 * - свой <a>/<button> с [data-entd-drawing] — модалка открывается по клику на него;
 * - любая ссылка с href="#entd-draw-DRAWING_ID" — для кнопок конструкторов, где можно задать
 *   только URL. Клики ловятся делегированием, так что работают и ссылки, отрисованные позже.
 *
 * Настройки скрипта (data-атрибуты тега <script> или window.ENTDEmbedConfig):
 * connection-id, guest-mode (anonymous | login), login-url, user-id, source.
 * У элемента: data-entd-connection, data-entd-user-id, data-entd-mode (button | attach)
 * и внешний вид кнопки: data-entd-theme, -size, -shape, -text, -logo, -full-width, -class.
 */
(function () {
  'use strict';

  var ANON_KEY = 'entd_anon_id';
  var MARK_ATTR = 'data-entd-mounted';
  var LINK_PREFIX = '#entd-draw-';

  if (window.__entdEmbedLoaded) {
    return;
  }
  window.__entdEmbedLoaded = true;

  var script =
    document.currentScript ||
    document.querySelector('script[data-connection-id][src*="entd-embed"]') ||
    document.querySelector('script[src*="entd-embed"]');

  var instances = {};
  var elementSeq = 0;
  var scheduled = false;

  function warn(message) {
    if (window.console && console.warn) {
      console.warn('[ENTD] ' + message);
    }
  }

  // window.ENTDEmbedConfig перекрывает атрибуты тега <script>: удобно, когда скрипт
  // подключён глобально (в head), а настройки задаются на конкретной странице.
  function config(name) {
    var global = window.ENTDEmbedConfig || {};
    var camel = name.replace(/-([a-z])/g, function (_, c) {
      return c.toUpperCase();
    });

    if (global[camel] !== undefined && global[camel] !== null && global[camel] !== '') {
      return String(global[camel]);
    }

    return (script && script.getAttribute('data-' + name)) || '';
  }

  function getInstance(connectionId) {
    if (instances[connectionId]) {
      return instances[connectionId];
    }

    if (typeof window.ENTD !== 'function') {
      warn('ENTD library is not loaded.');
      return null;
    }

    var entd = new window.ENTD(connectionId);
    entd.init();
    instances[connectionId] = entd;

    return entd;
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

  function attr(el, name) {
    return (el && el.getAttribute('data-entd-' + name)) || '';
  }

  function connectionIdFor(el) {
    return attr(el, 'connection') || config('connection-id');
  }

  function userIdFor(el) {
    return attr(el, 'user-id') || config('user-id');
  }

  function requiresLogin(el) {
    return !userIdFor(el) && config('guest-mode') === 'login' && !!config('login-url');
  }

  function buildData(el) {
    return {
      external_id: userIdFor(el) || anonymousId(),
      source: attr(el, 'source') || config('source') || location.hostname,
      embed: {page: location.href},
    };
  }

  function buttonOptions(el) {
    var options = {
      theme: attr(el, 'theme') || 'light',
      size: attr(el, 'size') || 'medium',
      shape: attr(el, 'shape') || 'rectangular',
      logo: attr(el, 'logo') !== 'false',
      fullWidth: attr(el, 'full-width') === 'true',
    };

    if (attr(el, 'text')) {
      options.text = attr(el, 'text');
    }

    if (attr(el, 'class')) {
      options.className = attr(el, 'class');
    }

    return options;
  }

  function redirectToLogin() {
    var url = config('login-url');
    var separator = url.indexOf('?') === -1 ? '?' : '&';

    location.href = url + separator + 'redirect_to=' + encodeURIComponent(location.href);
  }

  // Открыть модалку розыгрыша; el — элемент с настройками (или ссылка #entd-draw-…)
  function open(drawingId, el) {
    if (requiresLogin(el)) {
      redirectToLogin();
      return;
    }

    var connectionId = connectionIdFor(el);

    if (!connectionId) {
      warn('Connection ID is not set. Add data-connection-id to the ENTD script tag.');
      return;
    }

    var entd = getInstance(connectionId);

    if (entd) {
      entd.openDrawingModal(drawingId, buildData(el));
    }
  }

  function isTrigger(el) {
    var mode = attr(el, 'mode');

    if (mode) {
      return mode === 'attach';
    }

    return el.tagName === 'A' || el.tagName === 'BUTTON';
  }

  function mountElement(el) {
    var drawingId = attr(el, 'drawing');

    el.setAttribute(MARK_ATTR, '');

    if (isTrigger(el)) {
      el.addEventListener('click', function (event) {
        event.preventDefault();
        open(drawingId, el);
      });
      return;
    }

    var connectionId = connectionIdFor(el);

    if (!connectionId) {
      warn('Connection ID is not set. Add data-connection-id to the ENTD script tag.');
      return;
    }

    var entd = getInstance(connectionId);

    if (!entd) {
      return;
    }

    // renderDrawingButton принимает селектор, поэтому адресуем контейнер уникальным атрибутом.
    elementSeq++;
    el.setAttribute('data-entd-el', String(elementSeq));

    var buttons = entd.renderDrawingButton(
      '[data-entd-el="' + elementSeq + '"]',
      drawingId,
      buildData(el),
      buttonOptions(el)
    );

    if (requiresLogin(el)) {
      // cloneNode сбрасывает обработчик библиотеки — ведём на логин вместо модалки.
      buttons.forEach(function (button) {
        var clone = button.cloneNode(true);

        clone.addEventListener('click', redirectToLogin);
        button.parentNode.replaceChild(clone, button);
      });
    }
  }

  function mountAll() {
    scheduled = false;

    var nodes = document.querySelectorAll('[data-entd-drawing]:not([' + MARK_ATTR + '])');

    for (var i = 0; i < nodes.length; i++) {
      if (attr(nodes[i], 'drawing')) {
        mountElement(nodes[i]);
      }
    }
  }

  function scheduleMount() {
    if (scheduled) {
      return;
    }

    scheduled = true;
    setTimeout(mountAll, 50);
  }

  function drawingIdFromHref(href) {
    var index = href ? href.indexOf(LINK_PREFIX) : -1;

    if (index === -1) {
      return '';
    }

    return decodeURIComponent(href.slice(index + LINK_PREFIX.length)).replace(/[^0-9a-zA-Z-]/g, '');
  }

  // Ссылки #entd-draw-ID: перехватываем клик в фазе захвата на window, раньше обработчиков
  // конструктора (Tilda и др. сами обрабатывают якорные ссылки и прокручивают страницу).
  window.addEventListener(
    'click',
    function (event) {
      var target = event.target;
      var link = target && target.closest ? target.closest('a[href*="' + LINK_PREFIX + '"]') : null;

      if (!link || link.hasAttribute('data-entd-drawing')) {
        return;
      }

      var drawingId = drawingIdFromHref(link.getAttribute('href'));

      if (!drawingId) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      open(drawingId, link);
    },
    true
  );

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAll);
  } else {
    mountAll();
  }

  // Контейнеры, которые появятся позже (SPA, ленивые блоки, попапы конструкторов).
  if (typeof MutationObserver === 'function') {
    new MutationObserver(scheduleMount).observe(document.documentElement, {childList: true, subtree: true});
  }

  window.ENTDEmbed = {mountAll: mountAll, open: open};
})();
