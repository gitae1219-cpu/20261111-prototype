// ==============================================================================
// api/analyze.js - AI 음식 이미지 분석 및 Supabase 데이터베이스 자동 저장 엔드포인트
// 
// [역할 설명]
// 1. OpenAI Vision API(gpt-4o-mini)를 통해 음식 사진 전체 분량과 사용자 메모를 분석합니다.
// 2. 분석이 성공적으로 완료되면 Supabase의 analysis_logs 테이블에
//    (사진, 메모, 칼로리, 탄단지, AI 도출근거, 신뢰도, 트레이너 한마디, 시간)을 자동 저장합니다.
// 3. 분석 결과 JSON을 프론트엔드로 응답합니다.
// ==============================================================================

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// .env 파일의 환경 변수 로드
dotenv.config();

// 1. OpenAI 클라이언트 인스턴스 초기화
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes('your_openai_api_key')) {
    return null;
  }
  return new OpenAI({ apiKey });
};

// 2. Supabase 클라이언트 인스턴스 초기화
const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl.includes('your-project-id') || 
      supabaseAnonKey.includes('your_supabase_anon_key')) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

/**
 * Serverless / Express 공용 요청 처리 함수
 * @param {object} req - HTTP 요청 객체
 * @param {object} res - HTTP 응답 객체
 */
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST 메서드만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'ERR_METHOD_NOT_ALLOWED',
      message: 'POST 요청만 지원합니다.'
    });
  }

  try {
    const { image, text_hint = '', lang = 'ko' } = req.body || {};

    // 1. 이미지 데이터 유효성 검사
    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        error: 'ERR_NO_IMAGE',
        message: '분석할 음식 이미지가 제공되지 않았습니다.'
      });
    }

    // 2. OpenAI API 키 존재 여부 검사
    const openai = getOpenAIClient();
    if (!openai) {
      return res.status(500).json({
        error: 'ERR_NO_API_KEY',
        message: '.env 파일에 유효한 OPENAI_API_KEY를 입력해 주세요.'
      });
    }

    // 3. 다국어(ko / en) 안내 프롬프트 구성
    const isKorean = lang !== 'en';
    const targetLanguage = isKorean ? 'Korean (한국어)' : 'English';

    // 4. OpenAI Vision 시스템 프롬프트 정의
    const systemPrompt = `
You are an expert nutritional AI analyst and certified fitness trainer.
Analyze the provided meal image and any optional user note.
The requested response language is: ${targetLanguage}.

Crucial Calculation Rules:
1. Portion Standard: Calculate the total calories and macros for the ENTIRE FOOD SHOWN in the photo (the whole bowl, plate, or full spread), NOT a generic single serving, unless the photo actually contains only 1 serving. If the portion is large or multiple servings are visible, calculate for the full visible amount.
2. User Note Priority: If the user provides a text note (e.g., "양이 많아", "밥 두 공기야", "혼자 다 먹었어"), strictly adjust your estimate to match the whole consumed portion described.
3. Food Verification:
   - If the image clearly does NOT contain food or drinks (e.g. selfies, scenery, animals, non-food items), return "is_food": false with an explanatory message.
   - If it DOES contain food, return "is_food": true.
4. Trainer's Advice ("trainer_review"):
   - Must be an encouraging, constructive 1-2 sentence trainer's feedback.
   - Must specifically reflect NOT ONLY the macronutrients, BUT ALSO the total calories and the portion size (e.g., acknowledging large volume or high calories while praising protein/fiber and offering clear tips like hydration, walking, or next meal pacing).

Strictly output valid JSON matching this schema:
{
  "is_food": true,
  "food_name": "string (name of the meal in ${targetLanguage})",
  "portion_estimate": "string (estimated entire portion, e.g. '약 450g (대용량 1.5~2인분 분량)' or 'Approx. 450g (Large portion)')",
  "total_calories": 850,
  "carbs_g": 60,
  "protein_g": 45,
  "fat_g": 35,
  "confidence_percentage": 92,
  "analysis_reason": "string (detailed explanation of how calories and macros were derived from the visual entire portion and user note)",
  "trainer_review": "string (warm, energetic trainer advice reflecting food portion, calories, and nutrients)"
}
If "is_food" is false:
{
  "is_food": false,
  "message": "음식 이미지가 인식되지 않았습니다. 식단 사진을 업로드해 주세요."
}
`;

    // 5. 사용자 프롬프트 구성 (텍스트 힌트 포함)
    let userPromptText = 'Please analyze this meal image based on the entire food portion shown.';
    if (text_hint && text_hint.trim()) {
      userPromptText += ` User note: "${text_hint.trim().slice(0, 2000)}"`;
    }

    // 6. OpenAI API (gpt-4o-mini) 멀티모달 호출
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userPromptText
            },
            {
              type: 'image_url',
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const rawContent = response.choices[0]?.message?.content;
    if (!rawContent) {
      throw new Error('AI 모델로부터 응답 내용을 전달받지 못했습니다.');
    }

    const parsedData = JSON.parse(rawContent);

    // 7. 비음식 사진 판별 처리 (TC-09)
    if (parsedData.is_food === false) {
      return res.status(422).json({
        error: 'ERR_NOT_FOOD',
        message: parsedData.message || (isKorean ? '음식 사진이 감지되지 않았습니다. 올바른 식단 사진을 업로드해 주세요.' : 'No food detected. Please upload an image containing food.')
      });
    }

    // 8. [Supabase 연동] 분석 결과를 analysis_logs 테이블에 비동기 자동 저장
    let savedToDb = false;
    let savedLogId = null;
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data: dbData, error: dbError } = await supabase
          .from('analysis_logs')
          .insert([
            {
              food_name: parsedData.food_name || '식단 정보',
              portion_estimate: parsedData.portion_estimate || '전체 분량',
              image_data: image, // 업로드된 Base64 사진 데이터
              user_memo: text_hint ? text_hint.trim() : '', // 사용자 입력 추가 메모
              total_calories: Math.max(0, parseInt(parsedData.total_calories, 10) || 0),
              carbs_g: Math.max(0, parseInt(parsedData.carbs_g, 10) || 0),
              protein_g: Math.max(0, parseInt(parsedData.protein_g, 10) || 0),
              fat_g: Math.max(0, parseInt(parsedData.fat_g, 10) || 0),
              analysis_reason: parsedData.analysis_reason || '',
              confidence_percentage: Math.min(100, Math.max(0, parseInt(parsedData.confidence_percentage, 10) || 90)),
              trainer_review: parsedData.trainer_review || ''
            }
          ])
          .select('id');

        if (dbError) {
          console.warn('[Supabase analysis_logs 저장 경고]:', dbError.message);
        } else if (dbData && dbData.length > 0) {
          savedToDb = true;
          savedLogId = dbData[0].id;
          console.log(`[Supabase] 식단 분석 결과가 analysis_logs(ID: ${savedLogId})에 성공적으로 저장되었습니다.`);
        }
      } catch (insertErr) {
        // DB 저장이 실패하더라도 사용자 UI 분석 결과 표출에는 지장을 주지 않도록 보호
        console.error('[Supabase analysis_logs 저장 중 예외]:', insertErr);
      }
    }

    // 9. 최종 성공 응답 반환 (DB 저장 여부 및 log_id 포함)
    return res.status(200).json({
      success: true,
      saved_to_db: savedToDb,
      log_id: savedLogId,
      data: parsedData
    });

  } catch (error) {
    console.error('[API Analyze Error]:', error);

    if (error?.status === 401) {
      return res.status(401).json({
        error: 'ERR_INVALID_API_KEY',
        message: 'OpenAI API 키가 유효하지 않습니다. .env 설정을 확인해 주세요.'
      });
    }

    if (error?.status === 429) {
      return res.status(429).json({
        error: 'ERR_QUOTA_EXCEEDED',
        message: 'OpenAI API 사용량 한도(Quota)를 초과했거나 요청이 너무 많습니다.'
      });
    }

    return res.status(500).json({
      error: 'ERR_SERVER_ERROR',
      message: 'AI 이미지 분석 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 에러')
    });
  }
}
