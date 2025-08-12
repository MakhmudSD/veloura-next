// next-i18next.config.js
const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko', 'uz'],          // ← use 'ko' (NOT 'kr')
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',

  // Make non-standard codes resolve correctly (e.g., 'kr' → 'ko', 'uz-UZ' → 'uz')
  fallbackLng: { kr: ['ko'], 'ko-KR': ['ko'], 'uz-UZ': ['uz'], default: ['en'] },
  load: 'languageOnly',
  nonExplicitSupportedLngs: true,

  ns: ['common'],
  defaultNS: 'common',
};
