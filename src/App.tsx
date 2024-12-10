import React from 'react';
import { useTranslation } from 'react-i18next';
import './components/i18n';

const App = () => {
  const { t, i18n } = useTranslation();

  const switchLanguage = (language:langs) => {
    i18n.changeLanguage(language);
  };

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => switchLanguage('en')}>English</button>
      <button onClick={() => switchLanguage('ko')}>한국어</button>
    </div>
  );
};

export default App;