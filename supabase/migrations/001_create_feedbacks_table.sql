-- ==============================================================================
-- 001_create_feedbacks_table.sql
-- CaloView (칼로리뷰) 익명 피드백 테이블 생성 및 RLS(Row Level Security) 설정
-- ==============================================================================

-- 1. feedbacks 테이블 생성
CREATE TABLE IF NOT EXISTS public.feedbacks (
    -- 고유 식별자 (UUID 자동 생성)
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 사용자 닉네임 (기본값: '익명', 최대 50자)
    nickname VARCHAR(50) NOT NULL DEFAULT '익명',
    
    -- 별점 평가 (1점 ~ 5점 사이 정수)
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    
    -- 피드백 내용 (텍스트)
    comment TEXT NOT NULL,
    
    -- 생성 일시 (UTC 기준 현재 시간)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 테이블 행 단위 보안(RLS, Row Level Security) 활성화
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- 3. 모든 사용자(익명 사용자 포함)가 피드백을 조회할 수 있도록 SELECT 정책 허용
DROP POLICY IF EXISTS "Allow anonymous select on feedbacks" ON public.feedbacks;
CREATE POLICY "Allow anonymous select on feedbacks"
ON public.feedbacks FOR SELECT
TO anon
USING (true);

-- 4. 모든 사용자(익명 사용자 포함)가 새로운 피드백을 등록할 수 있도록 INSERT 정책 허용
DROP POLICY IF EXISTS "Allow anonymous insert on feedbacks" ON public.feedbacks;
CREATE POLICY "Allow anonymous insert on feedbacks"
ON public.feedbacks FOR INSERT
TO anon
WITH CHECK (true);

