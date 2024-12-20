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
import React, { useEffect } from "react";
// sys 관련
import $g from './sys/$g';
import Area from './sys/area/Area';
import controller from "./sys/controller";
import $keyboard from "./sys/keyboard";
import $mouse from "./sys/mouse";



const App: React.FC = () => {
  console.log("Areas 추가됨");
  const [count, setCount] = React.useState(0);
  const divRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault(); // 우클릭 메뉴 안 뜨게 하기
    });
    // window load되면 이벤트 리스너 추가
    window.addEventListener('load', () => {
      controller.run('load');
    });

    // 키보드 이벤트 리스너
    window.addEventListener("keydown", $keyboard.keydown);
    window.addEventListener("keyup", $keyboard.keyup);

    window.addEventListener("mousedown", $mouse.mousedown);
    window.addEventListener("mouseup", $mouse.mouseup);
    window.addEventListener("mousemove", $mouse.mousemove);

    // 이벤트 리스너 등록
    window.addEventListener("resize", () => {
      controller.run('resize');
    });

    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener("resize", () => {
        controller.run('resize');
      });

      window.removeEventListener("mousedown", $mouse.mousedown);
      window.removeEventListener("mouseup", $mouse.mouseup);
      window.removeEventListener("mousemove", $mouse.mousemove);

      window.removeEventListener("keydown", $keyboard.keydown);
      window.removeEventListener("keyup", $keyboard.keyup);
    }
  }, [])

  return (
    <>
      {/* $g.Areas의 배열 안의 모든 값에 대해서 Area 생성 */}
      {$g.Areas.map((area) => (
        <Area
          key={area.id.code}
          id={area.id.code}
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
