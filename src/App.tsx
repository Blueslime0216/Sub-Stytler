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
import React, { useEffect, useState, useRef } from "react";
// sys 관련
import $g from './sys/$g';
import controller from "./sys/controller";
import $keyboard from "./sys/keyboard";
import $mouse from "./sys/mouse";
// Area
import Area from './sys/area/Area';



const App: React.FC = () => {
    const areaRefs = useRef<(HTMLDivElement | null)[]>([]); // Area 컴포넌트 배열 참조

    useEffect(() => {
        // 이벤트 리스너 추가
        // window 관련
        window.addEventListener("contextmenu", (e) => e.preventDefault());  // 우클릭 메뉴 안 뜨게 하기
        window.addEventListener("load", () => controller.run("load"));
        window.addEventListener("resize", () => controller.run("resize"));
        // 키보드 관련
        window.addEventListener("keydown", $keyboard.keydown);
        window.addEventListener("keyup", $keyboard.keyup);
        // 마우스 관련
        window.addEventListener("mousedown", $mouse.mousedown);
        window.addEventListener("dragstart", $mouse.mousedown);
        window.addEventListener("mouseup", $mouse.mouseup);
        window.addEventListener("mousemove", $mouse.mousemove);
        window.addEventListener("drag", $mouse.mousemove);

        return () => {
            // 이벤트 리스너 제거
            window.removeEventListener("resize", () => controller.run("resize"));

            window.removeEventListener("keydown", $keyboard.keydown);
            window.removeEventListener("keyup", $keyboard.keyup);

            window.removeEventListener("mousedown", $mouse.mousedown);
            window.removeEventListener("mouseup", $mouse.mouseup);
            window.removeEventListener("mousemove", $mouse.mousemove);
        };
    }, []);

    
    console.log("Areas 업데이트 됨");
    return (
        <>
            {/* $g.Areas의 배열 안의 모든 값에 대해서 Area 생성 */}
            {$g.Workspace.map((area, index) => (
                <Area
                    // key={index}
                    x={area.x}
                    y={area.y}
                    width={area.width}
                    height={area.height}
                    isMinimize={area.isMinimize}
                    moduleType={area.moduleType}
                >
                    {/* Area 안에 들어갈 모듈 */}
                    <div>Area {area.moduleType}</div>
                </Area>
            ))}
        </>
    );
};

export default App;
