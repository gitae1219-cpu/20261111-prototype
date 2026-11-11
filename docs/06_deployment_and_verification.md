# 06. 배포 및 검증 시나리오 (Deployment & Verification)

## 1. Vercel 배포 설정 가이드
1. GitHub 저장소와 Vercel 프로젝트 연동.
2. Vercel 대시보드 -> Environment Variables 설정:
   - `OPENAI_API_KEY`: OpenAI API 키
   - `SUPABASE_URL`: Supabase 프로젝트 URL
   - `SUPABASE_ANON_KEY`: Supabase Public Anon 키

---

## 2. 완성 검증 체크리스트 (Verification Test Scenarios)

| Test ID | 검증 시나리오 | 예상 동작 결과 | 합격 여부 |
| :--- | :--- | :--- | :--- |
| **TC-01** | 드래그 앤 드롭으로 이미지 업로드 | 업로드 즉시 Dropzone 내 썸네일 노출 | PASS |
| **TC-02** | `Ctrl+V` 클립보드 붙여넣기 | 이미지 자동 업로드 및 썸네일 노출 | PASS |
| **TC-03** | 샘플 버튼 (보쌈) 클릭 | 샘플 이미지 및 텍스트 힌트 자동 삽입 | PASS |
| **TC-04** | AI 분석 요청 전송 | 6초 이내 결과 카드, 신뢰도%, 영양성분, AI이유, 한줄리뷰 표출 | PASS |
| **TC-05** | 수량 버튼 조절 (0.5x, 2x) | API 재요청 없이 화면의 칼로리/탄단지 수치가 즉시 변경됨 | PASS |
| **TC-06** | 다국어 (KR/EN) 전환 클릭 | UI 텍스트 및 결과 설명 텍스트 실시간 전환 | PASS |
| **TC-07** | 다크/라이트 테마 전환 클릭 | 배경/카드의 변수 색상 전환 및 `localStorage` 저장 | PASS |
| **TC-08** | 피드백 작성 후 전송 | Supabase DB 저장 후 하단 최신순 피드백 목록에 즉시 추가됨 | PASS |
| **TC-09** | 비음식 이미지 업로드 테스트 | `ERR_NOT_FOOD` 오류 메시지가 상단 토스트 팝업으로 표출 | PASS |
| **TC-10** | ESC 키 입력 | 열려 있는 모달 창이 즉시 닫힘 | PASS |