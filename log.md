<!-- < TypeScript + React + Vite + Framer Motion 프로젝트 시작 > -->

1. 프로젝트명 : 서브-스타이틀러(Sub-Stytler)
 - 유튜브 웹 기반 자막(.ytt)을 만들 수 있는 사이트
 - Electron을 사용해 PC 전용 애플리케이션으로 빌드할 계획 있음
 - TypeScript + React + Vite + Framer Motion 프로젝트임

2. 사용할 모듈 및 프레임워크
 - TypeScript: 코드 가독성과 타입 안정성을 위해 사용
 - React: 코드 구조화 및 최적화(자주 사용되는 요소 합치기 등), 컴포넌트 기반 UI 구축
 - Vite: 빠른 빌드와 개발 환경 제공
 - Framer Motion: 자막 애니메이션과 에디터 내에서 보여질 애니메이션 효과 구현
 - Electron: 프로젝트 완성 후 빌드에 활용 예정

3. 설치된 주요 모듈
 - react
 - react-dom
 - framer-motion
 - i18next
 - react-i18next

4. 구현하고자 하는 기능
 - 실시간 동영상 재생과 자막 표시: 동영상과 자막을 동기화하고 스타일링된 형태로 렌더링.
 - 자막 편집 에디터: 사용자 정의 워크스페이스 제공. 화면 분할 기능으로 동영상과 자막 편집 공간 분리.
 - 자막 수정 기능: 자막 텍스트를 간편하게 수정하고 실시간 미리보기 제공.
 - 저장 및 로드 기능: 로컬 스토리지 및 파일 업로드/다운로드 지원.
 - 다국어 지원(i18n): 사용자 인터페이스를 다양한 언어로 제공.
 - 자막 파일(.ytt)은 로컬에 저장하거나 불러올 수 있으며, 쿠키(혹은 로컬 스토리지)에 자동 저장하는 기능도 있음

5. 프로젝트 폴더 구조
[Sub-Stytler]
├──[public]
├──[src]
|   ├──[areas]
│   ├──[assets]
│   ├──[components]
│   │   ├── i18n.ts
│   ├──[lang]
│   │   ├── en.json
│   │   ├── ko.json
│   ├──[utils]
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── main.tsx
│   ├── vite-env.d.ts
├── index.html
├── package.json
├── README.md


[public] : 정적 파일이 위치하는 폴더
[src] : 메인 소스 코드가 담겨있는 폴더
    [areas] : 완성된 Area UI들이 담겨 있는 폴더
    [assets] : 정적 파일 (이미지, 아이콘 등)
    [components] : UI 구성 요소가 정의되어 있는 폴더
        i18n.ts : 다국어 인터페이스 지원을 위한 코드
    [lang] : 다국어 지원을 위한 언어 파일이 위치하는 폴더
        en.json : 영어 언어 파일
        ko.json : 한국어 언어 파일
    [utils] : 사용할 함수들 모음
    vite-env.d.ts : 타입스크립트 타입들이 정의되어 있는 파일
index.html : 메인 HTML 파일
package.json : 프로젝트 설정 파일
README.md : 프로젝트 설명 파일


