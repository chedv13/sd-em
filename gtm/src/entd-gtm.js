/*
 * Glue между GTM-шаблоном «ENTD Draw Button» и ENTD JS-библиотекой.
 * Склеивается с собранной библиотекой в один файл entd-gtm.js (см. gtm/package.json).
 *
 * Шаблон GTM работает в песочнице и не может трогать DOM, поэтому он только кладёт
 * настройки в очередь window.entdGtmQueue (createQueue) и подключает этот файл.
 * Здесь:
 * - один экземпляр ENTD на Connection ID (один вызов validate);
 * - кнопки монтируются во все элементы по CSS-селектору, в том числе появившиеся позже (SPA);
 * - повторный запуск тега с теми же настройками не создаёт дублей;
 * - external_id: значение из тега (обычно переменная GTM с ID пользователя),
 *   иначе анонимный UUID или редирект на логин.
 */
(function () {
  'use strict';

  var QUEUE_KEY = 'entdGtmQueue';
  var ANON_KEY = 'entd_anon_id';
  var MARK_ATTR = 'data-entd-gtm';

  if (window.__entdGtmLoaded) {
    return;
  }
  window.__entdGtmLoaded = true;

  var instances = {};
  var items = [];
  var itemKeys = {};
  var elementSeq = 0;
  var scheduled = false;

  function warn(message) {
    if (window.console && console.warn) {
      console.warn('[ENTD GTM] ' + message);
    }
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

  function requiresLogin(item) {
    return !item.externalId && item.guestMode === 'login';
  }

  function buildData(item) {
    var data = {};
    var extra = item.extra || {};

    for (var key in extra) {
      if (Object.prototype.hasOwnProperty.call(extra, key)) {
        data[key] = extra[key];
      }
    }

    data.external_id = item.externalId || anonymousId();
    data.source = item.source || location.hostname;
    data.gtm = {page: location.href};

    return data;
  }

  function buttonOptions(item) {
    var b = item.button || {};
    var options = {
      theme: b.theme || 'light',
      size: b.size || 'medium',
      shape: b.shape || 'rectangular',
      logo: b.logo !== false,
      fullWidth: b.fullWidth === true,
    };

    if (b.text) {
      options.text = b.text;
    }

    if (b.className) {
      options.className = b.className;
    }

    return options;
  }

  function redirectToLogin(item) {
    var url = item.loginUrl;
    var separator = url.indexOf('?') === -1 ? '?' : '&';

    location.href = url + separator + 'redirect_to=' + encodeURIComponent(location.href);
  }

  function onClick(item, entd) {
    return function (event) {
      if (event && item.mode === 'attach') {
        event.preventDefault();
      }

      if (requiresLogin(item)) {
        redirectToLogin(item);
        return;
      }

      entd.openDrawingModal(item.drawingId, buildData(item));
    };
  }

  // Каждый элемент помечается ключами тегов, которые его уже обработали.
  function isMounted(el, item) {
    var marks = (el.getAttribute(MARK_ATTR) || '').split(' ');

    return marks.indexOf(item.uid) !== -1;
  }

  function markMounted(el, item) {
    var current = el.getAttribute(MARK_ATTR);

    el.setAttribute(MARK_ATTR, current ? current + ' ' + item.uid : item.uid);
  }

  function mountElement(el, item, entd) {
    markMounted(el, item);

    if (item.mode === 'attach') {
      el.addEventListener('click', onClick(item, entd));
      return;
    }

    // renderDrawingButton принимает селектор, поэтому адресуем контейнер уникальным атрибутом.
    elementSeq++;
    el.setAttribute('data-entd-gtm-el', String(elementSeq));

    var buttons = entd.renderDrawingButton(
      '[data-entd-gtm-el="' + elementSeq + '"]',
      item.drawingId,
      buildData(item),
      buttonOptions(item)
    );

    if (requiresLogin(item)) {
      // cloneNode сбрасывает обработчик библиотеки — ведём на логин вместо модалки.
      buttons.forEach(function (button) {
        var clone = button.cloneNode(true);

        clone.addEventListener('click', onClick(item, entd));
        button.parentNode.replaceChild(clone, button);
      });
    }
  }

  function mountItem(item) {
    var nodes;

    try {
      nodes = document.querySelectorAll(item.selector);
    } catch (e) {
      warn('Invalid CSS selector: ' + item.selector);
      item.broken = true;
      return;
    }

    if (!nodes.length) {
      return;
    }

    var entd = getInstance(item.connectionId);

    if (!entd) {
      return;
    }

    for (var i = 0; i < nodes.length; i++) {
      if (!isMounted(nodes[i], item)) {
        mountElement(nodes[i], item, entd);
      }
    }
  }

  function mountAll() {
    scheduled = false;

    for (var i = 0; i < items.length; i++) {
      if (!items[i].broken) {
        mountItem(items[i]);
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

  function addItem(raw) {
    if (!raw || typeof raw !== 'object') {
      return;
    }

    if (!raw.connectionId || !raw.drawingId || !raw.selector) {
      warn('Connection ID, Drawing ID and CSS selector are required.');
      return;
    }

    if (raw.guestMode === 'login' && !raw.loginUrl) {
      warn('Login URL is empty — guests will enter with an anonymous ID.');
      raw.guestMode = 'anonymous';
    }

    var key = [raw.connectionId, raw.drawingId, raw.selector, raw.mode, raw.externalId].join('|');

    if (itemKeys[key]) {
      // Тег сработал ещё раз (например, на History Change) — просто пересканируем DOM.
      scheduleMount();
      return;
    }

    raw.uid = 'i' + items.length;
    itemKeys[key] = true;
    items.push(raw);
    scheduleMount();
  }

  var queue = (window[QUEUE_KEY] = window[QUEUE_KEY] || []);

  for (var i = 0; i < queue.length; i++) {
    addItem(queue[i]);
  }

  // Всё, что тег положит в очередь после загрузки скрипта, обрабатываем сразу.
  queue.push = function () {
    for (var j = 0; j < arguments.length; j++) {
      Array.prototype.push.call(queue, arguments[j]);
      addItem(arguments[j]);
    }

    return queue.length;
  };

  // Кнопки для контейнеров, которые появятся позже (SPA, ленивые блоки).
  if (typeof MutationObserver === 'function') {
    new MutationObserver(scheduleMount).observe(document.documentElement, {childList: true, subtree: true});
  }

  window.ENTDGTM = {mountAll: mountAll};
})();
