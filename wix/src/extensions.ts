import { app } from '@wix/astro/builders';
import entdDrawButton from './extensions/site/widgets/entd-draw-button/entd-draw-button.extension.ts';
import entdDashboard from './extensions/dashboard/pages/entd/entd.extension.ts';

export default app()
  .use(entdDrawButton)
  .use(entdDashboard);
