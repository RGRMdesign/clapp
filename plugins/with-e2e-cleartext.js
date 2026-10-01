/**
 * Allows plain-HTTP traffic on Android **only** for E2E builds against a local Supabase
 * (`E2E_LOCAL_BACKEND=1`, see .github/workflows/native.yml). Release builds otherwise block
 * cleartext, and store builds must never enable it.
 */
const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withE2eCleartext(config) {
  if (process.env.E2E_LOCAL_BACKEND !== '1') return config;

  return withAndroidManifest(config, (mod) => {
    const application = mod.modResults.manifest.application?.[0];
    if (application) application.$['android:usesCleartextTraffic'] = 'true';
    return mod;
  });
};
