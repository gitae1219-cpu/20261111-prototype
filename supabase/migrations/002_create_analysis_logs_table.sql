-- ==============================================================================
-- 002_create_analysis_logs_table.sql
-- CaloView (칼로리뷰) AI 식단 분석 결과 저장용 테이블 생성 및 RLS 보안 설정
-- 
-- [포함 항목]
-- 1. 사진 (image_data / TEXT: Base64 또는 이미지 URL)
-- 2. 메모 (user_memo / TEXT: 사용자 입력 추가 힌트)
-- 3. 칼로리 (total_calories / INT) 및 탄단지 영양소
-- 4. AI 도출 근거 (analysis_reason / TEXT)
-- 5. 신뢰도 (confidence_percentage / INT)
-- 6. 트레이너 조언 (trainer_review / TEXT)
-- 7. 분석 요청 시간 (created_at / TIMESTAMP WITH TIME ZONE)
-- ==============================================================================

-- 1. 식단 분석 기록 테이블(analysis_logs) 생성
CREATE TABLE IF NOT EXISTS public.analysis_logs (
    -- 고유 식별자 (UUID 자동 생성)
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 음식 이름 (예: '돼지고기 보쌈 수육 및 무생채')
    food_name VARCHAR(100) NOT NULL,
    
    -- 추정 음식 총량 (예: '약 450g (대용량 1.5~2인분 분량)')
    portion_estimate VARCHAR(100),
    
    -- 등록된 음식 사진 데이터 (Base64 데이터 또는 이미지 URL을 저장하기 위해 TEXT 사용)
    image_data TEXT NOT NULL,
    
    -- 사용자가 작성한 추가 메모 (선택사항, 없을 시 빈 문자열)
    user_memo TEXT DEFAULT '',
    
    -- 총 칼로리 (kcal 단위, 양의 정수)
    total_calories INT NOT NULL CHECK (total_calories >= 0),
    
    -- 탄수화물 (g 단위)
    carbs_g INT DEFAULT 0 CHECK (carbs_g >= 0),
    
    -- 단백질 (g 단위)
    protein_g INT DEFAULT 0 CHECK (protein_g >= 0),
    
    -- 지방 (g 단위)
    fat_g INT DEFAULT 0 CHECK (fat_g >= 0),
    
    -- AI가 해당 수치를 도출한 구체적인 근거 설명 문장
    analysis_reason TEXT NOT NULL,
    
    -- AI 분석 신뢰도 백분율 (0% ~ 100% 사이 정수)
    confidence_percentage INT NOT NULL CHECK (confidence_percentage >= 0 AND confidence_percentage <= 100),
    
    -- 트레이너의 한마디 조언 문장
    trainer_review TEXT,
    
    -- 분석 요청 일시 (기본값: UTC 기준 현재 시각)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 검색 성능 향상을 위한 최신순 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_analysis_logs_created_at 
ON public.analysis_logs (created_at DESC);

-- 3. 테이블 행 단위 보안(RLS, Row Level Security) 활성화
ALTER TABLE public.analysis_logs ENABLE ROW LEVEL SECURITY;

-- 4. 익명 사용자(anon)가 자신의 분석 결과를 DB에 기록(INSERT)할 수 있도록 허용하는 보안 정책
DROP POLICY IF EXISTS "Allow anonymous insert on analysis_logs" ON public.analysis_logs;
CREATE POLICY "Allow anonymous insert on analysis_logs"
ON public.analysis_logs FOR INSERT
TO anon
WITH CHECK (true);

-- 5. 익명 사용자(anon)가 저장된 분석 결과를 조회(SELECT)할 수 있도록 허용하는 보안 정책
DROP POLICY IF EXISTS "Allow anonymous select on analysis_logs" ON public.analysis_logs;
CREATE POLICY "Allow anonymous select on analysis_logs"
ON public.analysis_logs FOR SELECT
TO anon
USING (true);

