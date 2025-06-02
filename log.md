# Sub-Stytler Area 시스템 구현 분석

## 1. Area 구현 방식 및 UI 레이아웃 메커니즘

### Area 클래스 (`src/components/Area/Area.ts`)
- 각 Area는 고유 id, 화면상의 위치(_x, _y - vw, vh 단위) 및 크기(_width, _height - vw, vh 단위)를 가짐
- 크기 조절 중 임시 변경사항을 저장하기 위한 _temp_x, _temp_y, _temp_width, _temp_height 속성 포함
- 네 방향(top, bottom, left, right)의 Border 객체들을 borders 속성에 저장
- HTML 요소 생성 및 관리, 크기 조절, 분할, 업데이트 등의 메소드 제공

### Border 클래스 (`src/components/Area/Border.ts`)
- 각 Border는 고유 _id, 방향(side), 위치(_x, _y), 크기(_size)를 가짐
- 드래그 중 임시 변경량을 저장하는 _temp_x, _temp_y 속성 포함
- 연결된 다른 Border들과 함께 움직이는 기능 구현
- 최소 크기 제한 및 임시 상태 관리 기능 제공

### UI 조작 메커니즘
1. **상대적 단위 사용**
   - 모든 위치와 크기는 vw, vh 단위 사용
   - 브라우저 창 크기 변화에 반응하는 반응형 레이아웃 구현

2. **연결된 Border 동시 이동**
   - detectLinkedBorders를 통해 같은 선상의 Border들 찾아 함께 움직임
   - Ctrl 키로 개별 Border만 조작 가능

3. **최소 크기 제한**
   - Area에 최소 너비와 높이 설정
   - 크기 조절 시 최소 크기 제한 적용

4. **임시 상태와 최종 확정 분리**
   - 드래그 중 _temp_ 변수들에 변경사항 임시 저장
   - 드래그 완료(endResize)나 취소(cancelResize) 시 실제 값에 반영

5. **분할 및 병합**
   - Area.split() 메소드로 영역 분할 가능
   - Border를 끝까지 밀어 하나의 Area 크기를 0으로 만들면 병합

## 2. 입력 처리 흐름

### main.ts (애플리케이션 진입점)
- DOMContentLoaded 이벤트 발생 시 init() 함수 호출
- setupEventListeners()를 통해 기본 이벤트 리스너 등록
- 초기 Area 객체들 생성 및 DOM에 추가

### keyboard.ts ($keyboard 객체)
- 키보드 상태 관리:
  - keymap: 현재 눌려있는 키 저장
  - keymap_hold: 홀드 중인 키 저장
  - time: 키 누름 시점 저장

- 이벤트 처리:
  - keydown: 새로운 키 또는 홀드 시작 처리
  - keyup: 홀드 종료 또는 단순 클릭 처리

### mouse.ts ($mouse 객체)
- 마우스 상태 관리:
  - position: 마우스 커서의 절대 좌표
  - isDown: 각 마우스 버튼의 눌림 상태
  - isDragging: 드래그 상태
  - draggedSize: 드래그 거리
  - downTarget: 클릭 대상 요소
  - moveTarget: 커서 아래 요소

- 이벤트 처리:
  - down: 클릭/드래그/홀드 감지
  - click: 클릭 감지 및 연속 클릭 처리
  - move: 마우스 이동 처리
  - up: 클릭/드래그 종료 처리
  - wheel: 휠 이벤트 처리

### controller.ts (controller 객체)
- 중앙 집중형 이벤트 디스패처 역할
- 전역 이벤트 핸들러($g.eventFunctions) 및 요소별 이벤트 핸들러 관리
- 이벤트 발생 및 핸들러 실행 로그 제공($g.debug)

## 3. 종합적인 입력 처리 흐름

1. **사용자 입력**
   - 키보드 누름/림, 마우스 클릭/이동/휠 등

2. **브라우저**
   - 네이티브 DOM 이벤트 생성

3. **events.ts (통해 main.ts에서 설정)**
   - 네이티브 이벤트를 캡처하여 $keyboard 또는 $mouse의 적절한 메소드로 전달

4. **$keyboard / $mouse**
   - 내부 상태 업데이트 (눌린 키, 마우스 위치 등)
   - 입력 패턴 분석 (단순 클릭, 홀드, 드래그, 조합 키 등)하여 고수준 이벤트로 해석
   - 해석된 이벤트에 따라 controller의 해당 함수 호출

5. **controller**
   - 전달받은 이벤트 타입에 대해, $g.eventFunctions (전역 핸들러) 및 이벤트 대상 요소의 자체 핸들러 배열을 확인
   - 등록된 핸들러들의 조건(특정 키, 마우스 버튼 등)을 검사하여 일치하는 핸들러 함수 실행

6. **애플리케이션 로직 (예: Area, Border)**
   - 핸들러 함수 내에서 UI 변경, 상태 업데이트 등 실제 작업 수행
