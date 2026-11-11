# 02. UI/UX 구현 지침 (UI/UX Implementation Guide)

## 1. 디자인 시스템 & 컬러 가이드 (첨부 브랜드 아이덴티티 준수)

```css
:root {
  /* Brand Signatures (첨부 오렌지 그래픽 스타일 반영) */
  --brand-orange: #ff5500;
  --brand-orange-hover: #e04b00;
  --brand-orange-glow: rgba(255, 85, 0, 0.25);
  
  /* Dark Theme (Default) */
  --bg-primary: #09090b;
  --bg-card: #121214;
  --bg-input: #18181b;
  --border-subtle: #27272a;
  --border-focus: #ff5500;
  
  --text-main: #ffffff;
  --text-sub: #a1a1aa;
  --text-muted: #71717a;
  
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
}

[data-theme="light"] {
  --bg-primary: #f4f4f5;
  --bg-card: #ffffff;
  --bg-input: #ffffff;
  --border-subtle: #e4e4e7;
  --text-main: #09090b;
  --text-sub: #52525b;
  --text-muted: #a1a1aa;
}
```

## 2. 화면 구성 요소 지침

### 1) 상단 내비게이션 (Header)
- 좌측: `CaloView.` 굵은 타이포 로고 + 브랜드 오렌지 포인트 닷 (`#ff5500`).
- 우측: 다국어 스위처 (`KR | EN`), 테마 토글 버튼 (`🌙 / ☀️`).

### 2) 히어로 섹션 (Hero Section)
- **캡슐 뱃지**: `[ 🤖 AI NUTRITION ANALYZER ]` 오렌지 테두리와 은은한 글로우 효과.
- **메인 타이틀**: Moodline 스타일의 거대한 볼드 헤드라인: `ANALYZE THE NUTRITION BEHIND YOUR PLATE`.
- **서브 타이틀**: "사진 한 장으로 식단, 칼로리, 탄단지 및 AI 팩폭 한줄평까지 즉시 분석합니다."

### 3) 템플릿 예시 버튼 (Demo Preset Bar)
- `[ 🍖 보쌈 수육 예시 ]`, `[ 🥗 닭가슴살 샐러드 예시 ]`, `[ 🍕 피자 예시 ]` 버튼 배치. 클릭 시 업로드창에 샘플 이미지 및 텍스트 힌트가 자동 채워짐.

### 4) Dropzone UI & 입력 영역
- 점선 테두리가 있는 드래그 앤 드롭 영역. 카메라 아이콘 및 `Ctrl+V` 클립보드 붙여넣기 안내 텍스트.
- 하단 서브 입력창: 텍스트 힌트 입력 (0 / 2000자 글자수 카운터 표시).
- 메인 실행 버튼: 오렌지 색상의 `[ 🔥 칼로리 및 영양 분석하기 ]` 대형 버튼.

### 5) 분석 결과 카드 (Result Card UI)
- **신뢰도 뱃지**: `🎯 신뢰도: 92%` (우상단 뱃지 표출).
- **AI 한줄리뷰 상자**: 인용구 스타일의 오렌지 하이라이트 박스. (3가지 페르소나 탭 선택 버튼 포함).
- **영양 정보 시각화**: 총 칼로리 대형 수치 표시 + 탄수화물/단백질/지방 프로그래스 바 및 g(그램) 수치.
- **분석 이유 (Accordion)**: `💡 AI 분석 이유 보기` 클릭 시 확장되는 근거 문장 상자.
- **미세 조절 UI (Quick Adjust)**: 0.5인분 / 1인분 / 1.5인분 / 2인분 버튼 및 "국물/양념 안 먹음", "드레싱 반만" 체크박스.

### 6) 실시간 익명 피드백 월 (Feedback Wall UI - 최하단)
- 로그인 필요 없는 피드백 작성 폼 (닉네임, 별점 선택, 피드백 내용, 전송 버튼).
- 작성된 피드백이 실시간 카드 형태로 하단에 최신순 정렬되어 노출.