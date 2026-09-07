import posthog from 'posthog-js';

/** Public web token for PostHog project 204088 (photoshop-mcp). Same key as MCP/UI. */
const POSTHOG_KEY = 'phc_mejq4ZZ8jTNZPiusjh7vHyPzWYinzsDwVJW43SM5FEcg';
const API_HOST = 'https://a.alisait.com';
const UI_HOST = 'https://eu.posthog.com';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const SITE_LOCALES = new Set(['tr', 'zh', 'es', 'de', 'ja']);

let initialized = false;
let productEventsBound = false;
let lastPageviewKey = '';

function isLocalHost(): boolean {
  return LOCAL_HOSTS.has(window.location.hostname);
}

export function localeFromPath(pathOrUrl: string): string {
  let pathname = pathOrUrl;
  try {
    pathname = new URL(pathOrUrl, window.location.origin).pathname;
  } catch {
    pathname = pathOrUrl.split('?')[0] ?? pathOrUrl;
  }
  const match = pathname.match(/^\/(tr|zh|es|de|ja)(?:\/|$)/);
  const locale = match?.[1];
  return locale && SITE_LOCALES.has(locale) ? locale : 'en';
}

function resolveHref(to: string): URL {
  return new URL(to, window.location.origin);
}

export function initSiteAnalytics(): void {
  if (initialized || isLocalHost() || !POSTHOG_KEY) return;

  posthog.init(POSTHOG_KEY, {
    api_host: API_HOST,
    ui_host: UI_HOST,
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage+cookie',
  });
  posthog.register({
    event_source: 'site',
    usage_surface: 'site',
    site_locale: localeFromPath(window.location.pathname),
  });
  initialized = true;
}

export function registerSiteLocale(to: string): void {
  if (!initialized) return;
  posthog.register({ site_locale: localeFromPath(to) });
}

export function captureSitePageview(to: string): void {
  if (!initialized) return;
  const url = resolveHref(to);
  const key = `${url.pathname}${url.search}`;
  if (key === lastPageviewKey) return;
  lastPageviewKey = key;
  posthog.capture('$pageview', { $current_url: url.href });
}

function capture(name: string, properties: Record<string, string>): void {
  if (!initialized) return;
  posthog.capture(name, properties);
}

function ctaLocation(el: Element): 'hero' | 'nav' | 'footer' | 'body' {
  if (el.closest('.VPHero, .VPHomeHero')) return 'hero';
  if (el.closest('.VPNav, .VPNavBar, .VPNavScreen')) return 'nav';
  if (el.closest('.VPFooter')) return 'footer';
  return 'body';
}

function ctaIdFromLink(host: string, pathname: string): string | null {
  if (/\/readme\/?$/.test(pathname)) return 'quick_start';
  if (pathname.includes('/docs/')) return 'documentation';
  if (host === 'github.com' && pathname.includes('/alisaitteke/photoshop-mcp')) return 'github';
  if ((host === 'www.npmjs.com' || host === 'npmjs.com') && pathname.includes('photoshop-mcp')) {
    return 'npm';
  }
  if (host === 'registry.modelcontextprotocol.io' || host.endsWith('.modelcontextprotocol.io')) {
    return 'mcp_registry';
  }
  return null;
}

function outboundDestination(host: string): string | null {
  if (host === 'github.com' || host.endsWith('.github.com')) return 'github';
  if (host === 'www.npmjs.com' || host === 'npmjs.com') return 'npm';
  if (host === 'registry.modelcontextprotocol.io' || host.endsWith('.modelcontextprotocol.io')) {
    return 'mcp_registry';
  }
  if (host === 'www.linkedin.com' || host === 'linkedin.com') return 'linkedin';
  if (host === 'alisait.com' || host === 'www.alisait.com') return 'alisait';
  return null;
}

function classifyCopiedCommand(text: string): 'mcp' | 'ui' | 'other' {
  if (text.includes('photoshop-mcp-ui')) return 'ui';
  if (text.includes('@alisaitteke/photoshop-mcp')) return 'mcp';
  return 'other';
}

function copiedCodeText(button: Element): string {
  const wrap = button.closest('div[class*="language-"]');
  const code = wrap?.querySelector('pre code, pre')?.textContent ?? '';
  return code.replace(/^ *(\$|>) /gm, '').trim();
}

function handleCopyClick(target: EventTarget | null): boolean {
  const el = target instanceof Element ? target : null;
  const button = el?.closest('button.copy');
  if (!button) return false;
  if (!button.closest('div[class*="language-"]')) return false;
  capture('site_code_copied', { command: classifyCopiedCommand(copiedCodeText(button)) });
  return true;
}

function handleLocaleClick(anchor: HTMLAnchorElement): boolean {
  if (!anchor.closest('.VPNavBarTranslations, .VPNavScreenTranslations')) return false;
  const to = localeFromPath(anchor.href);
  const from = localeFromPath(window.location.pathname);
  if (to === from) return false;
  capture('site_locale_changed', { from, to });
  return true;
}

function handleLinkClick(anchor: HTMLAnchorElement): void {
  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return;
  }

  const ctaId = ctaIdFromLink(url.hostname, url.pathname);
  if (ctaId) {
    capture('site_cta_clicked', {
      cta_id: ctaId,
      cta_location: ctaLocation(anchor),
    });
    return;
  }

  if (url.origin === window.location.origin) return;
  const destination = outboundDestination(url.hostname);
  if (!destination) return;
  capture('site_outbound_clicked', {
    destination,
    href_host: url.hostname,
  });
}

export function bindSiteProductEvents(): void {
  if (productEventsBound || !initialized) return;
  productEventsBound = true;

  document.addEventListener(
    'click',
    (event) => {
      if (handleCopyClick(event.target)) return;
      const el = event.target instanceof Element ? event.target : null;
      const anchor = el?.closest('a');
      if (!(anchor instanceof HTMLAnchorElement) || !anchor.href) return;
      if (handleLocaleClick(anchor)) return;
      handleLinkClick(anchor);
    },
    true,
  );
}
