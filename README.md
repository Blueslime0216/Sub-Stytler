# 개발 일지

[ 할일 ]
- import 기능 이전 완료
- 디버그 모달의 툴팁 채우기

문제점
- 디버그 모달에서 슬라이더와 숫자 인풋이 작동하지 않음
- 1px이라도 움직이면 클릭 처리가 안 되기에, 여유 오차를 추가해야 함
- area 조절 중에 마우스 커서 고정
- Area 분할 기능 구현해야 함
- 병합 기능도 구현해야 함
- 왜인지는 모르겠지만, 화면 경계에 있는 Border가 움직이지 않기 시작함. 버그이긴 한데 결과는 나중에 구현할 기능과 동일해서, 원인 파악 후 그대로 사용 가능한지 파악하자



## 2025-0?-? (?)
- 

| 시간 | 작업 내용 | 기타 | 코드 |
|------|----------|------|-----|
| ??:?? ~ ??:?? | 내용 |  | <span title="수업 끝나서 저장">*004-1\**</span> |


## 2025-06-2 (월)
- 마이그레이션 성공?

| 시간 | 작업 내용 | 기타 | 코드 |
|------|----------|------|-----|
| 쉬는 시간 틈틈히<br>2:25 ~ 2:38 | AI를 사용해서 리액트로 마이그레이션함.<br>각종 컨트롤러가 잘 작동하나 테스트 |  | <span title="내 PC에 있는 걸, 노트북에서 작업하기 위해 저장">*007-1\**</span> |
| 3:08 ~ 3:20 | 내용 |  | <span title="노트북에서 작업 끝나고, 하교해야 해서 저장">*007-2\**</span> |


## 2025-06-01 (일)
- 리액트로 마이그레이션 시도도

| 시간 | 작업 내용 | 기타 | 코드 |
|------|----------|------|-----|
| (6/2)1:20 ~ 2:00 언저리 | 마이그레이션 시도도, 잠들어 버림림 |  | <span title="마이그레이션 전에 백업">*006-1\**</span> |

## 2025-04-25 (금)
- 커서 사용해서 디버그 모달 창 추가

| 시간 | 작업 내용 | 기타 | 코드 |
|------|----------|------|-----|
| 11:56 ~ 2:07 | 커서로 디버그 모달 창 초스피드 날먹 완성... 인 줄 알았으나 인풋이 작동하지 않음. 졸리고 원인도 모르겠어서 그냥 포기. 툴팁 설명 채우다가 그냥자러 감 |  | 005 |

## 2025-03-21 (금)
- 영역의 조절 가능한 최소 크기 구현
    - <span title="2025-03-21 - 003">*최소 크기에 도달한 영역 표시하기\**</span>
    - <span title="2025-03-21 - 004">*선택된 Border의 상/하 또는 좌/우 영역을 개별적으로 감지해 표시하기\**</span>
    - <span title="2025-03-21 - 005">*조절 가능한 범위 계산하기 성공\**</span>
    - <span title="2025-03-21 - 006">*Area 최소 크기 구현 완료\**</span>
- 다양한 디버그 옵션 추가, 시각화 처리 완료
- Area 분열 구현 시도

| 시간 | 작업 내용 | 기타 | 코드 |
|------|----------|------|-----|
| 12:07 ~ 12:40 | 크기 조절 최소 제한 시도 중 |  | <span title="수업 끝나서 저장">*004-1\**</span> |
| 19:43 ~ 20:42<br>21:06 ~ 23:19<br>23:56 ~ 2:09 | 단일 Area 최소 크기 제한 성공,<br>이제 최소 크기에 도달한 영역 감지하는 코드 짜고,<br>인접한 영역 중에서 특정 방향에 있는 것만 감지하는 코드 짜고,<br>조절 가능한 영역 계산하기 성공,<br>마침내 최소 크기 구현 완료<br>Area 분열까지 구현하려다가 막혀서 오늘은 여기까지 |  | <span title="???">*004-2\**</span> |

## 2025-03-20 (목)
- 코드 다듬기
- Area UI 조정 기능 구현
- 인접한 경계 감지하는 함수 추가

| 시간 | 작업 내용 | 기타 | 코드 |
|------|----------|------|-----|
| 10:50 ~ 11:51 | 코드 주석 다듬음<br>줄 바꿈 정리 중<br>Area 하이라이트 함수 추가<br>보더가 인접한 Area를 찾는 것 구현 중 |  | <span title="수업 끝나서 일단 저장">*003-1\**</span> |
| 13:06 ~ 14:00 | 새로운 Area UI 조절 테스트를 위한 배치를 짬<br>선택한 경계에 인접한 Area 찾는 코드 짜는 중 |  | 003-2 |
| 21:41 ~ 23:43 | 하이라이트 작동시 뒷 배경이 보여서, 하얀색으로 변경하게만 설정<br>받은 방향의 반대 방향을 반환하는 함수 unit.ts에 추가<br>삽질 한 뒤에, 마침내!!!<br>드디어 인접한 경계가 같이 움직이는 UI 구현 완료 | 완료 | 003-3 |
| 23:43 ~ 23:56 | 타입스크립트 예외 처리, Vercel 호스팅 중 |  | <span title="Vercel 호스팅 시도 중">*003-4\**</span><br><span title="Vercel 호스팅 시도 중">*003-5\**</span> |

## 2025-03-?? (?)
- 경계 움직이는 알고리즘 구상 완료

## 2025-03-04 (화)
| 시간 | 작업 내용 | 기타 | 코드 |
|------|----------|------|-----|
| 13:23 ~ 13:34 | 인접한 경계 같이 움직이는 알고리즘 짜는 중, 생각 안 나서 던짐 |  |  |

## 2025-03-03 (월)
- 이벤트 매니저 마이그레이션 완료
    - **이벤트 매니저** : 키보드&마우스의 입력을 바탕으로 적절한 함수를 실행시켜주는 코드
    - 기존의 이벤트 리스너에서는 원하는 기능을 구현하기 어려워 직접 구현하기로 함
- Area 및 Border 구현 완료
- Area UI 크기 조절 시스템 구현 완료

| 시간 | 작업 내용 | 기타 | 코드 |
|------|----------|------|-----|
| 10:42 ~ 12:52 | 이전 v2 코드에서 이벤트 관리자 뜯어오기<br>체크된 이벤트가 실행되면 콘솔에 띄울 수 있게 해주는 UI 단순하게 제작<br>이전 코드에는 없던 `tab`, `holdend` 키보드 이벤트 추가<br>컨트롤러(이벤트 관리자) 정상 작동 테스트 중<br>클릭된 요소가 가진 함수 찾아서 실행되게 하는 중<br>Area와 Border 클래스 구조 변경(각 요소는 고유한 클래스를 가짐)<br>밥 먹고 돌아온다 |  |  |
| 14:51 ~ 16:12 | Area와 Border 정상 작동 테스트<br>이전 코드와 달라진 부분을 반영해서, 클릭된 요소가 해당하는 이벤트를 가지고 있으면 실행되게 함<br><span title="dev/'2025-03-03 - 003 - Area 크기 조정'">*Area 크기 변경 작동 확인\**</span>, 인접한 Border 크기 변하는 건 구현해야 함 |  |  |
| 18:51 ~ 21:05 | 한쪽 보더 드래그 시, 인접한 보더 위치와 크기 변경하는 것 구현 완료<br>각종 예외 상황 처리 중<br>인접한 보더의 좌표가 변하지를 않아서 삽질 하다가, 그냥 만능해결사 GPT 시켜서 해결함<br>GPT 사용해서 코드 한번 다듬어주고<br>될 것 같아서, 같은 라인에 있는 경계도 같이 움직이는 것 까지 구현<br>ctrl을 누른 경우, 해당 경계만 움직이게 하려고 했으나, 예상치 못한 변수에 머리가 터짐 |  | <span title="일단 한번 올려두자">*002\**</span> |

## 2025-02-27 (목)
- 개발일지 형식 정함
- 개발일지 작성
- Area 구현 실패

| 시간 | 작업 내용 | 기타 | 코드 |
|------|----------|------|-----|
| 14:19 ~ 16:14 | `Area` 크기 조절 구현 시도<br>입력 관리자를 만들어야 한다는 걸 깨닫고 뇌 정지<br>아니 똑같은 거 3번 만들게 하지 말라고<br>괜찮아 이전에 만든 거 가져오면 됨 |  |  |
| 22:28 ~ 00:05 | GPT로 적당한 개발 일지 형식 추천 받기<br>다 별로라서 그냥 표에 적기로 함<br>개발 일지 작성하기 |  | <span title="표 형식 잘 들어갔나 테스트">*001-1\**</span><br><span title="제목 ##로 적는 게 더 좋은가 테스트">*001-2\**</span><br><span title="한 번 더 테스트">*001-3\**</span><br><span title="지금 뜨는 이 툴팁 잘 뜨나 테스트">*001-4\**</span><br><span title="툴팁인지 알기 쉽게 CSS 좀 변경함">*001-5\**</span><br><span title="깃허브 readme에 CSS 적용이 안돼서 이탤릭체 대신 사용함">*001-6\**</span><br><span title="<u> 작동하나 테스트">*001-7\**</span><br><span title="그냥 던지고 편집기에서 가독성 살리는 시도 중">*001-8\**</span><br><span title="가독성 살리기 계속 시도 중">*001-9\**</span><br><span title="에디터 내에서의 가독성 포기, 일단 잠시 숨 돌리자">*001-10\**</span> |

## 2025-02-26 (수)
- 프로젝트 시작
- Area 구현 로드맵 작성

| 시간 | 작업 내용 | 기타 | 코드 |
|------|----------|------|-----|
| 21:00 ~ 21:13 | 프로젝트 초기 셋업 | 완료 |  |
| 21:13 ~ 21:45 | GPT로 `Area` 어떻게 구현할지 고민  |  |  |
| 22:19 ~ 01:02 | `Area` 구현 시도<br>GPT가 코드를 엉망으로 작성함<br>.md 형식으로 구현 로드맵(기획서) 작성하기<br>이후 GPT 시켜서 뼈대 생성하게 함<br>코드가 엉망이라서 수정함<br>일찍 자는 성실한 어린이가 되기 위해 내일 이어서 하기로 함 | 미완 |  |



