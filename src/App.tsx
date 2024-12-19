// import { useTranslation } from 'react-i18next';
// import './sys/i18n';

// 인터페이스 언어 변경 코드
// const App = () => {
//   const { t, i18n } = useTranslation();

//   const switchLanguage = (language:langs) => {
//     i18n.changeLanguage(language);
//   };

//   return (
//     <div>
//       <h1>{t('welcome')}</h1>
//       <button onClick={() => switchLanguage('en')}>English</button>
//       <button onClick={() => switchLanguage('ko')}>한국어</button>
//     </div>
//   );
// };

// ====================================================================================================
// 에디터를 조립해서 완성시키고 export하는 코드
// ====================================================================================================
// 모듈 관련
import React from "react";
// sys 관련
import $g from './sys/$g';
import Area from './sys/area/Area';



const App: React.FC = () => {
  console.log("Areas 추가됨");

  return (
    <>
      {/* $g.Areas의 배열 안의 모든 값에 대해서 Area 생성 */}
      {$g.Areas.map((area) => (
        <Area
          key={area.id}
          id={area.id}
          x={area.x}
          y={area.y}
          width={area.width}
          height={area.height}
          isSelected={area.isSelected}
          isMinimize={area.isMinimize}
        >
          {/* Area 안에 들어갈 모듈 */}
          <div>Area {area.moduleType}</div>
        </Area>
      ))}
    </>
  );
};

export default App;
