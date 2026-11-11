// ==============================================================================
// api/feedback.js - Supabase 익명 피드백 조회 및 등록 엔드포인트
// 
// [역할 설명]
// 사용자가 작성한 별점, 닉네임, 한줄 피드백을 Supabase PostgreSQL 데이터베이스에
// 저장하고, 최신 피드백 20건을 실시간으로 가져와 화면에 노출합니다.
// ==============================================================================

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// .env 파일의 환경 변수 로드
dotenv.config();

// Supabase 클라이언트 인스턴스 초기화
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = getSupabaseClient();

  // 1. 피드백 목록 조회 (GET)
  if (req.method === 'GET') {
    try {
      if (!supabase) {
        // Supabase 설정 전일 경우 빈 배열을 기본 응답하여 프론트엔드가 중단되지 않도록 보호
        return res.status(200).json({
          success: true,
          configured: false,
          data: [],
          message: 'Supabase가 아직 설정되지 않았습니다. .env 파일을 확인해 주세요.'
        });
      }

      // feedbacks 테이블에서 최신순으로 상위 20개 가져오기
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }

      return res.status(200).json({
        success: true,
        configured: true,
        data: data || []
      });
    } catch (error) {
      console.error('[API Feedback GET Error]:', error);
      return res.status(500).json({
        error: 'ERR_FEEDBACK_FETCH',
        message: '피드백 목록을 불러오지 못했습니다: ' + (error.message || '')
      });
    }
  }

  // 2. 신규 피드백 등록 (POST)
  if (req.method === 'POST') {
    try {
      if (!supabase) {
        return res.status(400).json({
          error: 'ERR_SUPABASE_NOT_CONFIGURED',
          message: 'Supabase 데이터베이스 연동 정보가 올바르게 설정되지 않았습니다. .env를 확인해 주세요.'
        });
      }

      const { nickname = '익명', rating = 5, comment = '' } = req.body || {};

      // 유효성 검증
      const parsedRating = parseInt(rating, 10);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({
          error: 'ERR_INVALID_RATING',
          message: '별점은 1점부터 5점 사이의 정수여야 합니다.'
        });
      }

      if (!comment || !comment.trim()) {
        return res.status(400).json({
          error: 'ERR_EMPTY_COMMENT',
          message: '피드백 내용을 1자 이상 입력해 주세요.'
        });
      }

      // XSS 방지 및 기본 문자열 정리
      const cleanNickname = (nickname.trim() || '익명').slice(0, 50);
      const cleanComment = comment.trim().slice(0, 1000);

      // Supabase 테이블에 행 삽입
      const { data, error } = await supabase
        .from('feedbacks')
        .insert([
          {
            nickname: cleanNickname,
            rating: parsedRating,
            comment: cleanComment
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      return res.status(201).json({
        success: true,
        message: '피드백이 성공적으로 등록되었습니다.',
        data: data ? data[0] : null
      });

    } catch (error) {
      console.error('[API Feedback POST Error]:', error);
      return res.status(500).json({
        error: 'ERR_FEEDBACK_INSERT',
        message: '피드백 저장에 실패했습니다: ' + (error.message || '')
      });
    }
  }

  // 지원하지 않는 메서드
  return res.status(405).json({
    error: 'ERR_METHOD_NOT_ALLOWED',
    message: '지원하지 않는 HTTP 메서드입니다.'
  });
}

