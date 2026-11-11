# 05. Supabase 데이터베이스 구축 지침 (Supabase & Database)

## 1. Supabase SQL 테이블 생성 쿼리
Supabase SQL Editor에서 아래 쿼리를 실행하여 `feedbacks` 테이블을 생성합니다:

```sql
-- Create Feedbacks Table
CREATE TABLE public.feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL DEFAULT '익명',
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access to everyone
CREATE POLICY "Allow anonymous select on feedbacks"
ON public.feedbacks FOR SELECT
TO anon
USING (true);

-- Allow anonymous insert access to everyone
CREATE POLICY "Allow anonymous insert on feedbacks"
ON public.feedbacks FOR INSERT
TO anon
WITH CHECK (true);
```

## 2. Supabase 연동 JavaScript 코드 명세
```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 피드백 목록 가져오기 (최신순 20개)
export async function fetchFeedbacks() {
  const { data, error } = await supabase
    .from('feedbacks')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data;
}

// 신규 피드백 제출하기 (로그인 없이 가능)
export async function submitFeedback(nickname, rating, comment) {
  const { data, error } = await supabase
    .from('feedbacks')
    .insert([{ nickname: nickname || '익명', rating, comment }]);
  if (error) throw error;
  return data;
}
```