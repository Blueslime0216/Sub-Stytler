import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../lang/en.json';
import ko from '../lang/ko.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
    },
    lng: 'kr', // 초기 언어
    fallbackLng: 'kr', // 언어가 없을 경우 대체
    interpolation: { escapeValue: false },
  });

export default i18n;