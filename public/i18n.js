// ==============================================================================
// public/i18n.js - CaloView 다국어 지원 모듈 (한국어 / 영어)
// 
// [역할 설명]
// 헤더의 언어 버튼(KR/EN) 클릭 시 모든 UI 텍스트를 실시간으로 전환합니다.
// '트레이너의 한마디' 및 화이트 테마, 전체 음식 기준 분석 UI 텍스트를 제공합니다.
// ==============================================================================

export const translations = {
  ko: {
    brand_title: "칼로리뷰",
    brand_sub: "AI 식단 분석 & 트레이너 한마디",
    theme_toggle_dark: "🌙 다크 모드",
    theme_toggle_light: "☀️ 라이트 모드",
    hero_badge: "✨ AI 멀티모달 식단 전체 분석",
    hero_title: "오늘 먹은 식단, 사진 한 장으로 끝!",
    hero_desc: "OpenAI Vision AI가 사진 속 음식 전체의 양과 칼로리, 탄단지를 정밀 분석하고 트레이너의 따뜻한 조언을 전달합니다.",
    
    // 업로드 영역
    upload_drop_title: "음식 사진을 드래그하거나 클릭하여 업로드",
    upload_drop_sub: "또는 화면 아무 곳에서 Ctrl+V 로 이미지를 붙여넣으세요 (최대 10MB)",
    upload_change_btn: "다른 사진 선택",
    sample_label: "또는 빠른 샘플로 테스트:",
    sample_bossam: "🍖 보쌈 정식",
    sample_salad: "🥗 닭가슴살 샐러드",
    sample_pizza: "🍕 페퍼로니 피자",
    hint_label: "✍️ 추가 메모 (선택사항 - 양이 많거나 특별한 점을 적어주세요)",
    hint_placeholder: "예: 밥은 두 공기 분량이고 고기 양이 평소보다 훨씬 많았어",
    analyze_btn: "🚀 AI 영양 분석 시작하기",
    analyzing_btn: "⏳ AI가 식단 전체를 분석하는 중...",

    // 분석 결과 카드
    result_title: "📊 AI 영양 분석 결과",
    badge_confidence: "신뢰도",
    label_portion: "추정 섭취 총량:",
    label_calories: "총 칼로리",
    label_calories_unit: "kcal",
    label_carbs: "탄수화물",
    label_protein: "단백질",
    label_fat: "지방",
    label_reason: "💡 AI 영양 도출 근거 (음식 전체 기준)",
    
    // 트레이너의 한마디
    review_title: "🏋️ 트레이너의 한마디",
    review_badge: "칼로리 & 음식량 반영 코칭",

    // 액션 버튼
    btn_add_dashboard: "➕ 오늘의 식단에 추가",
    btn_save_image: "🖼️ 결과 카드 이미지 저장",
    btn_copy_share: "🔗 공유 문구 복사",

    // 대시보드
    dash_title: "📅 오늘의 식단 요약 대시보드",
    dash_target_label: "하루 권장 목표 칼로리:",
    dash_target_val: "2000 kcal",
    dash_consumed: "오늘 섭취량",
    dash_remaining: "남은 칼로리",
    dash_empty: "아직 등록된 식단이 없습니다. 위에서 분석 후 추가해 보세요!",
    dash_reset_btn: "대시보드 초기화",
    meal_breakfast: "아침",
    meal_lunch: "점심",
    meal_dinner: "저녁",
    meal_snack: "간식",

    // 피드백 영역
    feedback_title: "⭐ 서비스 익명 피드백 (Supabase 실시간 연동)",
    feedback_sub: "로그인 없이 자유롭게 별점과 한줄 소감을 남겨주세요!",
    fb_nick_label: "닉네임",
    fb_nick_ph: "익명 (선택사항)",
    fb_rating_label: "별점",
    fb_comment_label: "한줄 피드백",
    fb_comment_ph: "서비스 사용 후기나 개선할 점을 적어주세요",
    fb_submit_btn: "피드백 남기기",
    fb_submitting: "등록 중...",
    fb_list_title: "최신 사용자 피드백",
    fb_empty_list: "아직 등록된 피드백이 없습니다. 첫 피드백의 주인공이 되어보세요!",

    // 오류 및 알림 메시지
    err_title: "알림",
    err_no_image: "먼저 분석할 음식 사진을 업로드해 주세요.",
    err_file_size: "이미지 용량이 너무 큽니다. 10MB 이하 파일만 지원합니다.",
    err_file_type: "JPG, PNG, WEBP, SVG 이미지 파일만 지원합니다.",
    err_not_food: "음식 사진이 감지되지 않았습니다. 올바른 식단 사진을 업로드해 주세요.",
    share_copied: "식단 분석 결과가 클립보드에 복사되었습니다!",
    dash_added: "오늘의 식단 대시보드에 성공적으로 추가되었습니다."
  },
  en: {
    brand_title: "CaloView",
    brand_sub: "AI Meal Analysis & Trainer's Advice",
    theme_toggle_dark: "🌙 Dark Mode",
    theme_toggle_light: "☀️ Light Mode",
    hero_badge: "✨ Full-Plate Multimodal AI Analysis",
    hero_title: "Analyze Your Meal in One Click!",
    hero_desc: "OpenAI Vision AI accurately estimates the entire portion's calories and macros, accompanied by supportive trainer advice.",
    
    // Upload
    upload_drop_title: "Drag & drop your food photo or click to browse",
    upload_drop_sub: "Or paste an image from clipboard with Ctrl+V (Max 10MB)",
    upload_change_btn: "Choose another photo",
    sample_label: "Or test with quick sample presets:",
    sample_bossam: "🍖 Bossam Set",
    sample_salad: "🥗 Chicken Salad",
    sample_pizza: "🍕 Pepperoni Pizza",
    hint_label: "✍️ Optional Hint Note (Mention if portion is large or special)",
    hint_placeholder: "e.g., Two bowls of rice, extra meat portion than usual.",
    analyze_btn: "🚀 Start AI Nutrition Analysis",
    analyzing_btn: "⏳ AI is analyzing the entire meal...",

    // Result
    result_title: "📊 AI Nutritional Analysis Result",
    badge_confidence: "Confidence",
    label_portion: "Estimated Total Portion:",
    label_calories: "Total Calories",
    label_calories_unit: "kcal",
    label_carbs: "Carbs",
    label_protein: "Protein",
    label_fat: "Fat",
    label_reason: "💡 Nutritional Estimation Logic (Entire Meal)",

    // Trainer's Advice
    review_title: "🏋️ Trainer's Advice",
    review_badge: "Calorie & Portion Coaching",

    // Actions
    btn_add_dashboard: "➕ Add to Daily Log",
    btn_save_image: "🖼️ Save Result Card Image",
    btn_copy_share: "🔗 Copy Share Text",

    // Dashboard
    dash_title: "📅 Daily Meal Summary Dashboard",
    dash_target_label: "Daily Target Calories:",
    dash_target_val: "2000 kcal",
    dash_consumed: "Consumed",
    dash_remaining: "Remaining",
    dash_empty: "No meals logged yet. Analyze and add your first meal above!",
    dash_reset_btn: "Reset Dashboard",
    meal_breakfast: "Breakfast",
    meal_lunch: "Lunch",
    meal_dinner: "Dinner",
    meal_snack: "Snack",

    // Feedback
    feedback_title: "⭐ Community Anonymous Feedback (Supabase)",
    feedback_sub: "Feel free to leave a rating and review without signing in!",
    fb_nick_label: "Nickname",
    fb_nick_ph: "Anonymous (Optional)",
    fb_rating_label: "Rating",
    fb_comment_label: "Review Comment",
    fb_comment_ph: "Share your thoughts or suggest improvements",
    fb_submit_btn: "Submit Feedback",
    fb_submitting: "Submitting...",
    fb_list_title: "Latest Community Feedbacks",
    fb_empty_list: "No reviews yet. Be the first to leave one!",

    // Errors & Notices
    err_title: "Notice",
    err_no_image: "Please upload a meal photo first.",
    err_file_size: "File size exceeds 10MB limit.",
    err_file_type: "Only JPG, PNG, WEBP, and SVG formats are supported.",
    err_not_food: "No food detected in the photo. Please upload a meal photo.",
    share_copied: "Meal summary copied to clipboard!",
    dash_added: "Meal added to daily dashboard successfully."
  }
};

let currentLanguage = localStorage.getItem('caloview_lang') || 'ko';

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  currentLanguage = lang === 'en' ? 'en' : 'ko';
  localStorage.setItem('caloview_lang', currentLanguage);
  applyTranslations();
}

export function t(key) {
  const dict = translations[currentLanguage] || translations.ko;
  return dict[key] || key;
}

export function applyTranslations() {
  const dict = translations[currentLanguage];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  const langBtnKo = document.getElementById('lang-ko');
  const langBtnEn = document.getElementById('lang-en');
  if (langBtnKo && langBtnEn) {
    if (currentLanguage === 'ko') {
      langBtnKo.classList.add('active');
      langBtnEn.classList.remove('active');
    } else {
      langBtnKo.classList.remove('active');
      langBtnEn.classList.add('active');
    }
  }

  document.documentElement.lang = currentLanguage;
}
