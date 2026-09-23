import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: 'bacce907-c4bb-4eed-a902-ae35035484ac',
  name: 'ENTD Draw Button',
  width: {
    defaultWidth: 260,
    allowStretch: true,
  },
  height: {
    defaultHeight: 64,
  },
  // Не добавляем сам — мерчант ставит виджет из Add Elements → App Widgets на нужную страницу.
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: '4b2d3543-3272-40be-9ab9-62d0cfc14e46',
      name: 'default',
      thumbnailUrl: '{{BASE_URL}}/entd-draw-button-thumbnail.png',
    },
  ],
  behaviors: {
    dashboard: {
      dashboardPageComponentId: '3426f21c-617c-48ac-82c7-be402591667a',
    },
  },
  tagName: 'entd-draw-button',
  element: './extensions/site/widgets/entd-draw-button/entd-draw-button.tsx',
  settings: './extensions/site/widgets/entd-draw-button/entd-draw-button.panel.tsx',
});
