/**
 * Theme - Storage Key.
 *
 * Stores only your visual preference. Authentication and registry
 * credentials remain outside browser storage.
 *
 * @since 0.0.1
 */
const themeStorageKey = 'outpost.theme';

/**
 * Theme - Values.
 *
 * Keeps the appearance control closed to the three options rendered by the
 * static shell so a stored value cannot become an arbitrary DOM attribute.
 *
 * @since 0.0.1
 */
const themeValues = [
  'system',
  'light',
  'dark',
];

/**
 * Theme - System Theme.
 *
 * Tracks the operating system preference for the default theme and responds
 * when that preference changes while the dashboard remains open.
 *
 * @since 0.0.1
 */
const systemTheme = globalThis.matchMedia('(prefers-color-scheme: dark)');

/**
 * Theme - Preference.
 *
 * Retains the selected mode in memory so system appearance changes affect the
 * page only while you have selected the system option.
 *
 * @since 0.0.1
 */
let themePreference = 'system';

/**
 * Theme - Apply Theme Preference.
 *
 * Resolves system mode into a concrete palette before styles load, then keeps
 * every visible segmented control synchronized with the active preference.
 *
 * @param {string}  preference - Preference.
 * @param {boolean} persist    - Persist.
 *
 * @returns {void}
 *
 * @since 0.0.1
 */
function applyThemePreference(preference, persist) {
  const normalizedPreference = (themeValues.includes(preference) === true) ? preference : 'system';
  let resolvedTheme = normalizedPreference;
  const documentElement = globalThis.document.documentElement;
  const themeColor = globalThis.document.querySelector('meta[name="theme-color"]');

  if (normalizedPreference === 'system') {
    resolvedTheme = (systemTheme.matches === true) ? 'dark' : 'light';
  }

  themePreference = normalizedPreference;
  documentElement.dataset.theme = resolvedTheme;
  documentElement.dataset.themePreference = normalizedPreference;
  documentElement.style.colorScheme = resolvedTheme;

  if (themeColor !== null) {
    themeColor.setAttribute('content', (resolvedTheme === 'dark') ? '#0b0d10' : '#f6f8fa');
  }

  if (persist === true) {
    try {
      globalThis.localStorage.setItem(themeStorageKey, normalizedPreference);
    } catch {
      // The theme still works for this page when browser storage is unavailable.
    }
  }

  for (const themeControl of globalThis.document.querySelectorAll('[data-theme-value]')) {
    const isSelected = themeControl.getAttribute('data-theme-value') === normalizedPreference;

    themeControl.setAttribute('aria-pressed', String(isSelected));
  }

  return;
}

/**
 * Theme - Get Theme Preference.
 *
 * Reads the optional non-sensitive preference defensively because hardened
 * browsers may disable storage even when the page itself remains available.
 *
 * @returns {string}
 *
 * @since 0.0.1
 */
function getThemePreference() {
  try {
    const storedPreference = globalThis.localStorage.getItem(themeStorageKey);

    if (storedPreference !== null && themeValues.includes(storedPreference) === true) {
      return storedPreference;
    }

    return 'system';
  } catch {
    return 'system';
  }
}

/**
 * Theme - Handle Theme Click.
 *
 * Routes appearance selection through one delegated listener so the
 * authenticated control persists your preference.
 *
 * @param {MouseEvent} event - Event.
 *
 * @returns {void}
 *
 * @since 0.0.1
 */
function handleThemeClick(event) {
  if ((event.target instanceof globalThis.Element) === false) {
    return;
  }

  const target = event.target.closest('[data-theme-value]');

  if (target === null) {
    return;
  }

  const preference = target.getAttribute('data-theme-value');

  if (preference === null || themeValues.includes(preference) === false) {
    return;
  }

  applyThemePreference(preference, true);

  return;
}

/**
 * Theme - Initialize Theme Controls.
 *
 * Attaches interaction after the shell is parsed and reapplies the early theme
 * choice so every segmented control exposes correct pressed state.
 *
 * @returns {void}
 *
 * @since 0.0.1
 */
function initializeThemeControls() {
  globalThis.document.addEventListener('click', handleThemeClick);

  applyThemePreference(themePreference, false);

  return;
}

applyThemePreference(getThemePreference(), false);

systemTheme.addEventListener('change', () => {
  if (themePreference === 'system') {
    applyThemePreference('system', false);
  }

  return;
});

if (globalThis.document.readyState === 'loading') {
  globalThis.document.addEventListener('DOMContentLoaded', initializeThemeControls, { once: true });
} else {
  initializeThemeControls();
}
