import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh';
import en from './locales/en';
import zhHant from './locales/zh-Hant';
import { NativeModules, Platform } from 'react-native';

const getDeviceLanguage = () => {
    const deviceLanguage =
        Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
              NativeModules.SettingsManager.settings.AppleLanguages[0]
            : NativeModules.I18nManager.localeIdentifier;

    // 处理繁体中文
    if (deviceLanguage.includes('zh-Hant') || deviceLanguage.includes('zh_TW')) {
        return 'zh-Hant';
    }
    return deviceLanguage.substring(0, 2);
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