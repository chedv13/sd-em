/*
 * Виджет «ENTD Draw Button» для сайтов Wix: кастомный элемент без React и без Shadow DOM
 * (библиотека ENTD вставляет стили кнопки в <head> и модалку в <body>).
 *
 * - Настройки приходят атрибутами, их пишет panel.tsx через widget.setProp().
 * - Один экземпляр ENTD на Connection ID (один вызов validate на страницу).
 * - external_id: wix:<member id> для залогиненных участников сайта, anon:<uuid> для гостей
 *   (или окно логина Wix, если в настройках выбран режим "login").
 */
import { authentication as siteAuth } from '@wix/site';
import { authentication as membersAuth, currentMember } from '@wix/site-members';
import { ENTD, type DrawingButtonOptions, type DrawingData } from '../../../../lib/entd.js';

const ANON_KEY = 'entd_anon_id';
const ATTRIBUTES = [
  'connection-id',
  'drawing-id',
  'text',
  'custom-text',
  'theme',
  'size',
  'shape',
  'align',
  'logo',
  'full-width',
  'guest-mode',
];

const instances: Record<string, ENTD> = {};
const elements = new Set<EntdDrawButton>();
let memberIdPromise: Promise<string | null> | null = null;
let authSubscribed = false;
let elementSeq = 0;

function getInstance(connectionId: string): ENTD {
  if (!instances[connectionId]) {
    instances[connectionId] = new ENTD(connectionId);
    instances[connectionId].init();
  }

  return instances[connectionId];
}

function uuid(): string {
  if (window.crypto && 'randomUUID' in window.crypto) {
    return window.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function anonymousId(): string {
  try {
    let id = localStorage.getItem(ANON_KEY);

    if (!id) {
      id = uuid();
      localStorage.setItem(ANON_KEY, id);
    }

    return `anon:${id}`;
  } catch {
    return `anon:${uuid()}`;
  }
}

function isLoggedIn(): boolean {
  try {
    return siteAuth.loggedIn();
  } catch {
    return false;
  }
}

function currentMemberId(): Promise<string | null> {
  if (!memberIdPromise) {
    memberIdPromise = (async () => {
      if (!isLoggedIn()) {
        return null;
      }

      try {
        // Фронтенд-API участника: не требует прав у приложения, undefined для гостя.
        const member = await currentMember.getMember();
        return member?._id ?? null;
      } catch {
        return null;
      }
    })();
  }

  return memberIdPromise;
}

// Вход/выход участника без перезагрузки страницы: сбрасываем кеш и перерисовываем кнопки.
function subscribeToAuth(): void {
  if (authSubscribed) {
    return;
  }

  authSubscribed = true;

  const refresh = () => {
    memberIdPromise = null;
    elements.forEach((element) => element.render());
  };

  try {
    siteAuth.onLogin(refresh);
    siteAuth.onLogout(refresh);
  } catch {
    // Вне живого сайта (например, в превью редактора) подписка может быть недоступна.
  }
}

class EntdDrawButton extends HTMLElement {
  private renderScheduled = false;

  static get observedAttributes(): string[] {
    return ATTRIBUTES;
  }

  connectedCallback(): void {
    elements.add(this);
    subscribeToAuth();
    this.render();
  }

  disconnectedCallback(): void {
    elements.delete(this);
  }

  attributeChangedCallback(): void {
    if (!this.isConnected || this.renderScheduled) {
      return;
    }

    // Панель меняет свойства по одному — схлопываем серию изменений в одну перерисовку.
    this.renderScheduled = true;
    queueMicrotask(() => {
      this.renderScheduled = false;
      this.render();
    });
  }

  private attr(name: string, fallback = ''): string {
    const value = this.getAttribute(name);

    return value === null || value.trim() === '' ? fallback : value.trim();
  }

  private buttonOptions(): DrawingButtonOptions {
    const text = this.attr('text', 'enter_draw');

    return {
      text: text === 'custom' ? this.attr('custom-text', 'enter_draw') : text,
      theme: this.attr('theme', 'light') as DrawingButtonOptions['theme'],
      size: this.attr('size', 'medium') as DrawingButtonOptions['size'],
      shape: this.attr('shape', 'rectangular') as DrawingButtonOptions['shape'],
      logo: this.attr('logo', 'true') !== 'false',
      fullWidth: this.attr('full-width', 'false') === 'true',
    };
  }

  private renderHint(): void {
    const hint = document.createElement('div');

    hint.textContent = 'ENTD: set the Connection ID and Drawing ID in the widget settings.';
    hint.setAttribute(
      'style',
      'padding:8px 12px;border:1px dashed #c9c9d4;border-radius:6px;font:13px/1.4 system-ui,sans-serif;color:#55556a;',
    );
    this.appendChild(hint);
  }

  render(): void {
    this.innerHTML = '';
    this.style.display = 'block';

    const connectionId = this.attr('connection-id');
    const drawingId = this.attr('drawing-id');

    if (!connectionId || !drawingId) {
      this.renderHint();
      return;
    }

    const align = this.attr('align', 'center');
    const container = document.createElement('div');

    elementSeq++;
    container.setAttribute('data-entd-wix', String(elementSeq));
    container.setAttribute(
      'style',
      `display:flex;justify-content:${align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'};`,
    );
    this.appendChild(container);

    // Библиотека читает data в момент клика, поэтому ID участника можно дописать позже.
    const memberInfo: { member_id: string | null; page: string } = { member_id: null, page: location.href };
    const data: DrawingData = {
      external_id: anonymousId(),
      source: location.hostname,
      wix: memberInfo,
    };

    currentMemberId().then((memberId) => {
      if (memberId) {
        data.external_id = `wix:${memberId}`;
        memberInfo.member_id = memberId;
      }
    });

    getInstance(connectionId).renderDrawingButton(
      `[data-entd-wix="${elementSeq}"]`,
      drawingId,
      data,
      this.buttonOptions(),
    );

    if (this.attr('guest-mode', 'anonymous') === 'login') {
      // Capture-фаза на контейнере срабатывает раньше обработчика библиотеки на кнопке.
      container.addEventListener(
        'click',
        (event) => {
          if (isLoggedIn()) {
            return;
          }

          event.stopPropagation();
          event.preventDefault();
          membersAuth.promptLogin().catch(() => undefined);
        },
        true,
      );
    }
  }
}

export default EntdDrawButton;
