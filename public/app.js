// ==============================================================================
// public/app.js - CaloView (칼로리뷰) 메인 프론트엔드 스크립트
// 
// [수정 사항 반영]
// 1. 기본 테마: 화이트 배경(Light Mode) 기본 적용
// 2. 트레이너의 한마디: 칭찬 트레이너 리뷰만 단독 표시 (칼로리 & 음식량 반영 코칭)
// 3. 미세 조절(Quick Adjust) 제거: 사진 속 음식 전체 분량 및 추가 메모 기준으로 직접 계산
// 4. 총 칼로리 상단 대형 강조 + 하단 탄단지 3열 배치 렌더링
// ==============================================================================

import { translations, getLanguage, setLanguage, applyTranslations, t } from './i18n.js';

// ------------------------------------------------------------------------------
// 1. 애플리케이션 상태 (State) 관리 객체
// ------------------------------------------------------------------------------
const state = {
  selectedImageDataUrl: null, // 현재 업로드/선택된 이미지의 PNG/JPEG Base64 데이터
  rawAnalysisData: null,      // AI 분석 원본 데이터 (음식 전체 분량 기준)
  feedbackRating: 5,          // 피드백 등록 별점 (1~5)
  dailyMeals: []              // 오늘의 식단 목록
};

// ------------------------------------------------------------------------------
// 2. DOM 요소 참조
// ------------------------------------------------------------------------------
const DOM = {
  // 테마 & 언어
  themeToggle: document.getElementById('theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
  themeText: document.getElementById('theme-text'),
  langKo: document.getElementById('lang-ko'),
  langEn: document.getElementById('lang-en'),

  // 업로드 & 드롭존
  dropzone: document.getElementById('dropzone'),
  fileInput: document.getElementById('file-input'),
  dropzoneDefault: document.getElementById('dropzone-default'),
  previewContainer: document.getElementById('preview-container'),
  previewImg: document.getElementById('preview-img'),
  btnChangeImg: document.getElementById('btn-change-img'),
  sampleBtns: document.querySelectorAll('.btn-sample'),
  textHint: document.getElementById('text-hint'),
  hintCharCount: document.getElementById('hint-char-count'),
  btnAnalyze: document.getElementById('btn-analyze'),

  // 결과 카드
  resultSection: document.getElementById('result-section'),
  exportableCard: document.getElementById('exportable-card'),
  resultFoodName: document.getElementById('result-food-name'),
  resultPortion: document.getElementById('result-portion'),
  resultConfidence: document.getElementById('result-confidence'),
  valCalories: document.getElementById('val-calories'),
  valCarbs: document.getElementById('val-carbs'),
  valProtein: document.getElementById('val-protein'),
  valFat: document.getElementById('val-fat'),
  barCarb: document.getElementById('bar-carb'),
  barProtein: document.getElementById('bar-protein'),
  barFat: document.getElementById('bar-fat'),
  pctCarbs: document.getElementById('pct-carbs'),
  pctProtein: document.getElementById('pct-protein'),
  pctFat: document.getElementById('pct-fat'),
  resultReason: document.getElementById('result-reason'),

  // 트레이너의 한마디
  reviewDisplay: document.getElementById('review-display'),

  // 액션 버튼
  btnOpenMealModal: document.getElementById('btn-open-meal-modal'),
  btnSaveCard: document.getElementById('btn-save-card'),
  btnShareText: document.getElementById('btn-share-text'),

  // 대시보드
  dashTotalCal: document.getElementById('dash-total-cal'),
  dashRemainCal: document.getElementById('dash-remain-cal'),
  meterFill: document.getElementById('meter-fill'),
  mealTimeline: document.getElementById('meal-timeline'),
  btnResetDashboard: document.getElementById('btn-reset-dashboard'),

  // 피드백
  feedbackForm: document.getElementById('feedback-form'),
  fbNickname: document.getElementById('fb-nickname'),
  fbComment: document.getElementById('fb-comment'),
  starBtns: document.querySelectorAll('.star-btn'),
  btnSubmitFb: document.getElementById('btn-submit-fb'),
  feedbackList: document.getElementById('feedback-list'),

  // 모달
  mealModal: document.getElementById('meal-modal'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  slotBtns: document.querySelectorAll('.btn-slot-choice'),

  // 알림 토스트
  toastContainer: document.getElementById('toast-container')
};

// ------------------------------------------------------------------------------
// 3. 토스트 팝업 알림 함수 (F-09)
// ------------------------------------------------------------------------------
function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<span>${isError ? '⚠️' : '✅'}</span><span>${message}</span>`;
  
  DOM.toastContainer.appendChild(toast);

  // 4초 후 자동 제거
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 4000);
}

// ------------------------------------------------------------------------------
// 4. 테마 (화이트 기본 / 다크 전환) 제어
// ------------------------------------------------------------------------------
function initTheme() {
  // [수정 요구사항 1] 기본 테마를 화이트(light)로 설정
  const savedTheme = localStorage.getItem('caloview_theme') || 'light';
  setTheme(savedTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('caloview_theme', theme);
  if (theme === 'light') {
    DOM.themeIcon.textContent = '☀️';
    DOM.themeText.textContent = t('theme_toggle_light');
  } else {
    DOM.themeIcon.textContent = '🌙';
    DOM.themeText.textContent = t('theme_toggle_dark');
  }
}

DOM.themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(nextTheme);
});

// ------------------------------------------------------------------------------
// 5. 다국어 (KR / EN) 제어
// ------------------------------------------------------------------------------
DOM.langKo.addEventListener('click', () => {
  setLanguage('ko');
  setTheme(document.documentElement.getAttribute('data-theme'));
});

DOM.langEn.addEventListener('click', () => {
  setLanguage('en');
  setTheme(document.documentElement.getAttribute('data-theme'));
});

// ------------------------------------------------------------------------------
// 6. 이미지 변환 유틸: SVG 이미지를 고화질 PNG DataURL로 변환
// ------------------------------------------------------------------------------
function convertSvgToPngDataUrl(svgDataOrUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 400;
        canvas.height = img.naturalHeight || 300;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        resolve(pngUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('SVG 이미지 로드 실패'));
    img.src = svgDataOrUrl;
  });
}

// ------------------------------------------------------------------------------
// 7. 이미지 업로드, 드래그앤드롭 및 Ctrl+V 붙여넣기 (F-01, TC-01, TC-02)
// ------------------------------------------------------------------------------
function handleSelectedFile(file) {
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    showToast(t('err_file_type'), true);
    return;
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    showToast(t('err_file_size'), true);
    return;
  }

  // SVG인 경우 PNG로 변환
  if (file.type === 'image/svg+xml') {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const pngUrl = await convertSvgToPngDataUrl(e.target.result);
        state.selectedImageDataUrl = pngUrl;
        renderImagePreview(state.selectedImageDataUrl);
      } catch (err) {
        showToast('SVG 이미지를 변환하지 못했습니다.', true);
      }
    };
    reader.readAsDataURL(file);
    return;
  }

  // 일반 라스터 이미지(JPEG, PNG, WebP)
  const reader = new FileReader();
  reader.onload = (e) => {
    state.selectedImageDataUrl = e.target.result;
    renderImagePreview(state.selectedImageDataUrl);
  };
  reader.readAsDataURL(file);
}

function renderImagePreview(dataUrl) {
  DOM.previewImg.src = dataUrl;
  DOM.dropzoneDefault.style.display = 'none';
  DOM.previewContainer.style.display = 'flex';
}

function resetImagePreview() {
  state.selectedImageDataUrl = null;
  DOM.fileInput.value = '';
  DOM.previewImg.src = '';
  DOM.dropzoneDefault.style.display = 'flex';
  DOM.previewContainer.style.display = 'none';
}

// 클릭으로 파일 업로드 창 열기
DOM.dropzone.addEventListener('click', (e) => {
  if (e.target.id === 'btn-change-img') {
    DOM.fileInput.click();
    return;
  }
  if (!state.selectedImageDataUrl) {
    DOM.fileInput.click();
  }
});

DOM.fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleSelectedFile(file);
});

DOM.btnChangeImg.addEventListener('click', (e) => {
  e.stopPropagation();
  DOM.fileInput.click();
});

// 드래그 앤 드롭 이벤트 처리 (TC-01)
['dragenter', 'dragover'].forEach(eventName => {
  DOM.dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    DOM.dropzone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  DOM.dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    DOM.dropzone.classList.remove('dragover');
  });
});

DOM.dropzone.addEventListener('drop', (e) => {
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    handleSelectedFile(files[0]);
  }
});

// Ctrl+V 클립보드 이미지 붙여넣기 (TC-02)
window.addEventListener('paste', (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      if (blob) {
        handleSelectedFile(blob);
        showToast('클립보드 이미지가 첨부되었습니다.');
        break;
      }
    }
  }
});

// ------------------------------------------------------------------------------
// 8. 빠른 샘플 프리셋 버튼 (TC-03)
// ------------------------------------------------------------------------------
const SAMPLE_PRESETS = {
  bossam: {
    imgPath: './assets/demo_bossam.svg',
    hint: '보쌈 수육 1.5인분과 무생채를 함께 먹었습니다.'
  },
  salad: {
    imgPath: './assets/demo_salad.svg',
    hint: '오리엔탈 드레싱을 곁들인 닭가슴살 샐러드입니다.'
  },
  pizza: {
    imgPath: './assets/demo_pizza.svg',
    hint: '치즈가 듬뿍 올라간 페퍼로니 피자 2조각입니다.'
  }
};

DOM.sampleBtns.forEach(btn => {
  btn.addEventListener('click', async () => {
    const sampleKey = btn.getAttribute('data-sample');
    const sample = SAMPLE_PRESETS[sampleKey];
    if (!sample) return;

    try {
      showToast(`'${btn.textContent.trim()}' 샘플을 로드하는 중...`);
      const res = await fetch(sample.imgPath);
      const svgText = await res.text();
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(svgBlob);
      
      const pngDataUrl = await convertSvgToPngDataUrl(blobUrl);
      URL.revokeObjectURL(blobUrl);

      state.selectedImageDataUrl = pngDataUrl;
      renderImagePreview(state.selectedImageDataUrl);
      DOM.textHint.value = sample.hint;
      updateCharCount();
      showToast(`'${btn.textContent.trim()}' 샘플이 준비되었습니다.`);
    } catch (err) {
      console.error('샘플 로드 에러:', err);
      showToast('샘플 이미지를 불러오지 못했습니다: ' + err.message, true);
    }
  });
});

// 텍스트 힌트 글자 수 카운터 (F-04)
function updateCharCount() {
  const len = DOM.textHint.value.length;
  DOM.hintCharCount.textContent = len;
}
DOM.textHint.addEventListener('input', updateCharCount);

// ------------------------------------------------------------------------------
// 9. AI 영양 분석 요청 (F-02, TC-04, TC-09)
// ------------------------------------------------------------------------------
DOM.btnAnalyze.addEventListener('click', async () => {
  if (!state.selectedImageDataUrl) {
    showToast(t('err_no_image'), true);
    return;
  }

  // 버튼 로딩 상태 표시
  DOM.btnAnalyze.disabled = true;
  DOM.btnAnalyze.textContent = t('analyzing_btn');

  try {
    const payload = {
      image: state.selectedImageDataUrl,
      text_hint: DOM.textHint.value.trim(),
      lang: getLanguage()
    };

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.message || 'AI 분석에 실패했습니다.';
      showToast(errorMsg, true);
      return;
    }

    // 분석 성공: 음식 전체 기준 데이터 저장
    state.rawAnalysisData = result.data;

    // 화면 렌더링
    renderAnalysisResult();
    DOM.resultSection.style.display = 'block';
    DOM.resultSection.scrollIntoView({ behavior: 'smooth' });
    showToast('AI 영양 분석이 완료되었습니다!');

  } catch (err) {
    console.error('분석 요청 에러:', err);
    showToast('네트워크 오류가 발생했습니다: ' + err.message, true);
  } finally {
    DOM.btnAnalyze.disabled = false;
    DOM.btnAnalyze.textContent = t('analyze_btn');
  }
});

// ------------------------------------------------------------------------------
// 10. 결과 카드 렌더링 (총칼로리 대형 + 탄단지 3열 + 트레이너 한마디)
// ------------------------------------------------------------------------------
function renderAnalysisResult() {
  if (!state.rawAnalysisData) return;

  const data = state.rawAnalysisData;

  // 1. 기본 정보 바인딩
  DOM.resultFoodName.textContent = data.food_name || '식단 정보';
  DOM.resultPortion.textContent = data.portion_estimate || '전체 분량';
  DOM.resultConfidence.textContent = `🎯 ${t('badge_confidence')}: ${data.confidence_percentage || 90}%`;
  DOM.resultReason.textContent = data.analysis_reason || '-';

  // 2. 총 칼로리 및 탄수화물/단백질/지방 수치 바인딩 (수동 미세조절 없이 음식 전체 기준 반영)
  const calories = Math.round(data.total_calories || 0);
  const carbs = Math.round(data.carbs_g || 0);
  const protein = Math.round(data.protein_g || 0);
  const fat = Math.round(data.fat_g || 0);

  DOM.valCalories.textContent = calories;
  DOM.valCarbs.textContent = carbs;
  DOM.valProtein.textContent = protein;
  DOM.valFat.textContent = fat;

  // 3. 매크로 비율 계산 (프로그레스 바)
  const totalMacroGrams = carbs + protein + fat;
  if (totalMacroGrams > 0) {
    const carbPct = Math.round((carbs / totalMacroGrams) * 100);
    const proteinPct = Math.round((protein / totalMacroGrams) * 100);
    const fatPct = Math.max(0, 100 - carbPct - proteinPct);

    DOM.barCarb.style.width = `${carbPct}%`;
    DOM.barProtein.style.width = `${proteinPct}%`;
    DOM.barFat.style.width = `${fatPct}%`;

    DOM.pctCarbs.textContent = `${carbPct}%`;
    DOM.pctProtein.textContent = `${proteinPct}%`;
    DOM.pctFat.textContent = `${fatPct}%`;
  }

  // 4. 트레이너의 한마디 렌더링 (칼로리 & 음식량 반영)
  const trainerFeedback = data.trainer_review || data.reviews?.trainer || '오늘도 맛있게 드시고 힘찬 하루 보내세요!';
  DOM.reviewDisplay.textContent = `"${trainerFeedback}"`;
}

// ------------------------------------------------------------------------------
// 11. 결과 카드 이미지 저장 및 공유 (F-07)
// ------------------------------------------------------------------------------
DOM.btnSaveCard.addEventListener('click', async () => {
  try {
    showToast('결과 카드 이미지를 생성 중입니다...');
    if (typeof html2canvas === 'undefined') {
      showToast('이미지 저장 라이브러리를 불러오지 못했습니다.', true);
      return;
    }

    const canvas = await html2canvas(DOM.exportableCard, {
      scale: 2,
      useCORS: true,
      backgroundColor: null
    });

    const link = document.createElement('a');
    link.download = `CaloView_${state.rawAnalysisData?.food_name || '식단분석'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('결과 카드가 이미지로 저장되었습니다!');
  } catch (err) {
    console.error('이미지 저장 에러:', err);
    showToast('이미지 저장 중 오류가 발생했습니다: ' + err.message, true);
  }
});

DOM.btnShareText.addEventListener('click', async () => {
  if (!state.rawAnalysisData) return;
  const data = state.rawAnalysisData;
  const trainerMsg = data.trainer_review || data.reviews?.trainer || '';
  const shareText = `[칼로리뷰 식단 분석]\n🍽️ 음식: ${data.food_name} (${data.portion_estimate})\n🔥 총 칼로리: ${data.total_calories}kcal\n🥗 탄단지: 탄 ${data.carbs_g}g / 단 ${data.protein_g}g / 지 ${data.fat_g}g\n🏋️ 트레이너의 한마디: "${trainerMsg}"\n\n#CaloView #식단관리`;

  try {
    await navigator.clipboard.writeText(shareText);
    showToast(t('share_copied'));
  } catch {
    showToast('클립보드 복사에 실패했습니다.', true);
  }
});

// ------------------------------------------------------------------------------
// 12. 오늘의 섭취 대시보드 (LocalStorage 연동 F-06)
// ------------------------------------------------------------------------------
const STORAGE_KEY_MEALS = 'caloview_daily_meals';

function loadDailyMeals() {
  const saved = localStorage.getItem(STORAGE_KEY_MEALS);
  state.dailyMeals = saved ? JSON.parse(saved) : [];
  renderDashboard();
}

function saveDailyMeals() {
  localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(state.dailyMeals));
  renderDashboard();
}

function renderDashboard() {
  const targetCalories = 2000;
  const totalCalories = state.dailyMeals.reduce((acc, cur) => acc + cur.calories, 0);
  const remainCalories = Math.max(0, targetCalories - totalCalories);

  DOM.dashTotalCal.textContent = totalCalories;
  DOM.dashRemainCal.textContent = remainCalories;

  const pct = Math.min(100, Math.round((totalCalories / targetCalories) * 100));
  DOM.meterFill.style.width = `${pct}%`;
  DOM.meterFill.classList.toggle('overflow', totalCalories > targetCalories);

  // 타임라인 목록 렌더링
  if (state.dailyMeals.length === 0) {
    DOM.mealTimeline.innerHTML = `<p class="empty-timeline">${t('dash_empty')}</p>`;
    return;
  }

  DOM.mealTimeline.innerHTML = '';
  state.dailyMeals.forEach((meal, idx) => {
    const slotNames = {
      breakfast: t('meal_breakfast'),
      lunch: t('meal_lunch'),
      dinner: t('meal_dinner'),
      snack: t('meal_snack')
    };

    const item = document.createElement('div');
    item.className = 'meal-timeline-item';
    item.innerHTML = `
      <div class="timeline-info">
        <span class="timeline-tag">${slotNames[meal.slot] || meal.slot}</span>
        <span class="timeline-food">${meal.food_name}</span>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="timeline-cal">+${meal.calories} kcal</span>
        <button type="button" class="btn-remove-meal" data-index="${idx}" aria-label="삭제">✕</button>
      </div>
    `;
    DOM.mealTimeline.appendChild(item);
  });

  // 개별 식단 삭제 버튼 바인딩
  DOM.mealTimeline.querySelectorAll('.btn-remove-meal').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      state.dailyMeals.splice(idx, 1);
      saveDailyMeals();
    });
  });
}

// 대시보드 초기화
DOM.btnResetDashboard.addEventListener('click', () => {
  if (confirm('오늘의 대시보드 기록을 모두 초기화할까요?')) {
    state.dailyMeals = [];
    saveDailyMeals();
    showToast('대시보드가 초기화되었습니다.');
  }
});

// 식단 추가 모달 제어
DOM.btnOpenMealModal.addEventListener('click', () => {
  DOM.mealModal.classList.add('open');
});

DOM.btnCloseModal.addEventListener('click', () => {
  DOM.mealModal.classList.remove('open');
});

DOM.slotBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const slot = btn.getAttribute('data-slot');
    const calories = Math.round(state.rawAnalysisData?.total_calories || 0);

    state.dailyMeals.push({
      slot,
      food_name: state.rawAnalysisData.food_name,
      calories: calories,
      timestamp: new Date().toISOString()
    });

    saveDailyMeals();
    DOM.mealModal.classList.remove('open');
    showToast(t('dash_added'));
  });
});

// ------------------------------------------------------------------------------
// 13. Supabase 익명 피드백 (F-08, TC-08)
// ------------------------------------------------------------------------------
// 별점 선택 바인딩
DOM.starBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const score = parseInt(btn.getAttribute('data-score'), 10);
    state.feedbackRating = score;
    DOM.starBtns.forEach(b => {
      const bScore = parseInt(b.getAttribute('data-score'), 10);
      b.classList.toggle('active', bScore <= score);
    });
  });
});

// 피드백 목록 로드 (GET /api/feedback)
async function loadFeedbacks() {
  try {
    const res = await fetch('/api/feedback');
    const result = await res.json();
    if (!res.ok || !result.success) return;

    if (!result.data || result.data.length === 0) {
      DOM.feedbackList.innerHTML = `<p class="empty-timeline">${t('fb_empty_list')}</p>`;
      return;
    }

    DOM.feedbackList.innerHTML = '';
    result.data.forEach(item => {
      const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);

      const fbItem = document.createElement('div');
      fbItem.className = 'feedback-item';
      fbItem.innerHTML = `
        <div class="fb-meta">
          <span class="fb-nick">${item.nickname}</span>
          <span class="fb-stars">${stars}</span>
        </div>
        <p class="fb-comment">${item.comment}</p>
      `;
      DOM.feedbackList.appendChild(fbItem);
    });

  } catch (err) {
    console.warn('피드백 목록 로드 알림:', err.message);
  }
}

// 피드백 등록 전송 (POST /api/feedback)
DOM.feedbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const comment = DOM.fbComment.value.trim();
  if (!comment) return;

  DOM.btnSubmitFb.disabled = true;
  DOM.btnSubmitFb.textContent = t('fb_submitting');

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname: DOM.fbNickname.value.trim() || '익명',
        rating: state.feedbackRating,
        comment: comment
      })
    });

    const result = await res.json();
    if (!res.ok) {
      showToast(result.message || '피드백 등록에 실패했습니다.', true);
      return;
    }

    showToast('소중한 피드백이 등록되었습니다!');
    DOM.fbComment.value = '';
    await loadFeedbacks();
  } catch (err) {
    showToast('피드백 등록 중 오류가 발생했습니다: ' + err.message, true);
  } finally {
    DOM.btnSubmitFb.disabled = false;
    DOM.btnSubmitFb.textContent = t('fb_submit_btn');
  }
});

// ------------------------------------------------------------------------------
// 14. 키보드 단축키 (ESC 키로 모달 닫기 TC-10)
// ------------------------------------------------------------------------------
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    if (DOM.mealModal.classList.contains('open')) {
      DOM.mealModal.classList.remove('open');
    }
  }
});

// ------------------------------------------------------------------------------
// 15. 애플리케이션 초기화 (Init)
// ------------------------------------------------------------------------------
function initApp() {
  initTheme();
  applyTranslations();
  loadDailyMeals();
  loadFeedbacks();
}

// 스크립트 로드 시 즉시 초기화 실행
initApp();
