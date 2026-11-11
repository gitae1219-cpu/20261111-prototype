# 03. 기능 및 API 명세서 (Features & API Specifications)

## 1. 백엔드 AI 분석 API (`POST /api/analyze`)

### Request Payload (JSON)
```json
{
  "image": "data:image/jpeg;base64,...",
  "text_hint": "밥은 반 공기만 먹었어",
  "lang": "ko"
}
```

### OpenAI Vision Prompt & Structured Response Format
OpenAI API `gpt-4o-mini` 활용:
```system
You are a precise nutritional AI analyst. Analyze the provided meal image and optional user note.
Return JSON strictly with the following schema:
{
  "food_name": "돼지고기 보쌈 수육 및 무생채",
  "portion_estimate": "약 200g (1.5인분)",
  "total_calories": 850,
  "carbs_g": 30,
  "protein_g": 60,
  "fat_g": 65,
  "confidence_percentage": 92,
  "analysis_reason": "수육 삼겹살 부위의 높은 지방 함량과 무생채 양념의 당류 함량을 종합적으로 고려해 계산함.",
  "reviews": {
    "fact_check": "단백질은 훌륭하지만 비계와 달콤한 무생채 양념 때문에 야간 러닝 3시간 확정입니다.",
    "trainer": "훌륭한 단백질 보충입니다! 저녁엔 지방 비율을 조금만 낮춰볼까요?",
    "humor": "오늘 당겨 쓰신 칼로리 대출은 내일 점심 샐러드로 이자를 상납하세요."
  }
}
```

---

## 2. 클라이언트 단 수량/양념 미세 조절 로직 (Quick Adjust)
사용자가 0.5x, 1x, 1.5x, 2x 버튼이나 체크박스를 클릭할 때 재분석 없이 즉시 수치를 계산하는 JavaScript 함수:

```javascript
function recalculateNutrition(baseData, multiplier, options) {
  let adjustedCal = baseData.total_calories * multiplier;
  let adjustedCarbs = baseData.carbs_g * multiplier;
  let adjustedProtein = baseData.protein_g * multiplier;
  let adjustedFat = baseData.fat_g * multiplier;

  if (options.noSauce) {
    adjustedCal -= 80;
    adjustedCarbs -= 15;
  }
  if (options.halfDressing) {
    adjustedCal -= 50;
    adjustedFat -= 5;
  }

  return {
    calories: Math.max(0, Math.round(adjustedCal)),
    carbs: Math.max(0, Math.round(adjustedCarbs)),
    protein: Math.max(0, Math.round(adjustedProtein)),
    fat: Math.max(0, Math.round(adjustedFat))
  };
}
```