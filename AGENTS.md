# AGENTS.md - Antigravity AI Coding Agent 작업 규칙

## 1. 역할 정의 및 원칙
- **역할**: Antigravity AI 코딩 에이전트는 [칼로리뷰 (CaloView)] 웹 서비스의 프론트엔드, 백엔드 API, OpenAI API 연동, Supabase DB 연동 및 Vercel 배포 설정을 완벽하게 구현한다.
- **기본 원칙 (추측 금지)**: 
  - 본 문서 및 `PRD.md`, `docs/` 내의 세부 구현 지침에 기재되지 않은 임의의 기능이나 라이브러리를 추가하지 않는다.
  - 비전공자도 코드를 유지보수할 수 있도록 직관적이고 표준적인 코드 구조를 유지한다.
  - 지정된 기술 스택(HTML/CSS/JS, Node.js, OpenAI API, Supabase)을 철저히 준수한다.

---

## 2. 디자인 및 UI 구현 규정 (첨부 이미지 브랜드 반영)
- **메인 브랜드 컬러 시스템**:
  - Primary Color: **Vibrant Orange (`#FF5500` / `#FF4500`)** - 첨부된 브랜드 이미지의 시그니처 팝 오렌지 테마 반영
  - Theme Base (Dark/Light):
    - Dark Mode (기본): `#09090b` (배경), `#121214` (카드/컨테이너), `#27272a` (테두리), `#ffffff` (주 텍스트)
    - Light Mode: `#f4f4f5` (배경), `#ffffff` (카드), `#e4e4e7` (테두리), `#09090b` (주 텍스트)
  - Graphic Elements: 오렌지 바탕 위에 다이아몬드, 별, 오각형 형태의 팝(Pop) 감성 플레이풀 그래픽 요소 및 모던 뱃지 스타일 적용.
- **반응형 가이드**: Breakpoints - Mobile (360px+), Tablet (768px+), Desktop (1200px+).

---

## 3. 코드 작성 가이드라인
- **HTML**: Semantic Markup (`<header>`, `<main>`, `<section>`, `<footer>`), 접근성(`aria-label`, `alt` 속성) 보장.
- **CSS**: BEM 규칙 혹은 직관적인 클래스명, CSS Custom Properties(변수) 기반의 다크/라이트 테마 제어.
- **JavaScript (Vanilla JS)**: ES6+ 표준, `async/await` strict error handling (`try...catch`), 전역 변수 오염 방지.
- **보안 규칙**: API Key(OpenAI, Supabase Service Key)는 절대 클라이언트 코드에 노출하지 않으며 Serverless API (`process.env`)에서 관리한다.

---

## 4. 완료 및 검증 기준 (Definition of Done)
1. 모든 기능 요구사항(1-1 ~ 1-6, 2-1 ~ 2-5, Supabase 피드백, 추가 기능 3종)이 작동해야 함.
2. `docs/06_deployment_and_verification.md`의 테스트 케이스(TC-01 ~ TC-10)를 100% 통과해야 함.