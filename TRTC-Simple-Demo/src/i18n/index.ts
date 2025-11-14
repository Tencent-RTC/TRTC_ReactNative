import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {NativeModules, Platform} from 'react-native';

import en from './locales/en';
import zh from './locales/zh';
import zhHant from './locales/zh-Hant';

const getDeviceLanguage = () => {
  let deviceLanguage: string;

  try {
    if (Platform.OS === 'ios') {
      // Try to use native module to get language on iOS
      const {SettingsManager} = NativeModules;
      deviceLanguage = SettingsManager?.settings?.AppleLocale ||
          SettingsManager?.settings?.AppleLanguages?.[0] ||
          Intl.DateTimeFormat().resolvedOptions().locale || 'en';
    } else {
      // Use I18nManager or Intl API on Android
      const {I18nManager} = NativeModules;
      deviceLanguage = I18nManager?.localeIdentifier ||
          Intl.DateTimeFormat().resolvedOptions().locale || 'en';
    }
  } catch (error) {
    console.warn('Failed to get device language:', error);
    // Use Intl API as fallback
    try {
      deviceLanguage = Intl.DateTimeFormat().resolvedOptions().locale || 'en';
    } catch {
      deviceLanguage = 'en';
    }
  }

  // Handle Traditional Chinese
  if (deviceLanguage &&
      (deviceLanguage.includes('zh-Hant') ||
       deviceLanguage.includes('zh_TW'))) {
    return 'zh-Hant';
  }
  return deviceLanguage ? deviceLanguage.substring(0, 2) : 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    zh: {
      translation: zh,
    },
    en: {
      translation: en,
    },
    'zh-Hant': {
      translation: zhHant,
    },
  },
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;