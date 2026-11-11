# 04. 오류 처리 및 검증 지침 (Error Handling & Validation Rules)

## 1. 프론트엔드 입력 검증 규칙
- **이미지 파일 검증**: JPG, PNG, WEBP 포맷만 허용. 미지원 파일 업로드 시 즉시 토스트 경고 표출.
- **용량 제한 검증**: 최대 10MB 제한. 초과 시 `"이미지 용량은 최대 10MB까지 가능합니다."` 토스트 표시.
- **텍스트 힌트 검증**: 최대 2,000자 초과 입력 방지.

## 2. 예외 메시지 처리 명세 (Error Cases & Messages)

| 예외 상황 | 원인 | 한국어 노출 메시지 | 영어 노출 메시지 |
| :--- | :--- | :--- | :--- |
| `ERR_NO_IMAGE` | 이미지가 첨부되지 않음 | 이미지를 업로드해 주세요. | Please upload an image. |
| `ERR_FILE_SIZE` | 10MB 초과 파일 | 파일 크기는 10MB 이하여야 합니다. | File size must be under 10MB. |
| `ERR_NOT_FOOD` | 음식 아닌 사진 업로드 | 식단 또는 음식 사진이 감지되지 않았습니다. | No food items detected in image. |
| `ERR_AI_TIMEOUT` | OpenAI API 응답 지연/오류 | AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요. | AI analysis error. Please try again. |
| `ERR_DB_INSERT` | Supabase 피드백 저장 실패 | 피드백 저장 중 오류가 발생했습니다. | Failed to save feedback. |

## 3. 토스트 통지 UI (Toast Notification Component)
오류 발생 시 화면 우측 상단에 3초간 노출 후 사라지는 비침투적 토스트 메세지 UI 컴포넌트 필수 구현.