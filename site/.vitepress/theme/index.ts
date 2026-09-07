import type { Theme } from 'vitepress';
import { inBrowser } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './custom.css';
import {
  bindSiteProductEvents,
  captureSitePageview,
  initSiteAnalytics,
  registerSiteLocale,
} from './analytics';

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    if (!inBrowser) return;

    initSiteAnalytics();

    const previous = router.onAfterRouteChange;
    router.onAfterRouteChange = async (to) => {
      await previous?.(to);
      registerSiteLocale(to);
      captureSitePageview(to);
    };

    bindSiteProductEvents();
  },
};

export default theme;
