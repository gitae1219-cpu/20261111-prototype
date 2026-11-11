// ==============================================================================
// server.js - CaloView (칼로리뷰) 로컬 개발 서버 진입점
// 
// [역할 설명]
// Node.js 환경에서 Express 프레임워크를 기반으로 웹 화면(HTML/CSS/JS)을 제공하고,
// /api/analyze 및 /api/feedback API 라우터를 매핑하여 로컬에서 온전하게 구동시킵니다.
// Vercel 배포 시에는 vercel.json에 따라 /api 폴더가 개별 서버리스 함수로 직접 작동합니다.
// ==============================================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// API 핸들러 가져오기
import analyzeHandler from './api/analyze.js';
import feedbackHandler from './api/feedback.js';

// .env 환경 변수 불러오기
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());

// 이미지 Base64 업로드를 위해 최대 요청 바디 크기를 15MB로 넉넉하게 설정
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// 1. API 라우트 매핑
app.all('/api/analyze', (req, res) => analyzeHandler(req, res));
app.all('/api/feedback', (req, res) => feedbackHandler(req, res));

// 2. 정적 웹 프론트엔드 파일(HTML, CSS, JS, Assets) 서빙
app.use(express.static(path.join(__dirname, 'public')));

// 3. SPA 또는 단일 페이지 폴백: 기타 모든 경로는 index.html로 응답
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 4. 서버 시작
app.listen(PORT, () => {
  console.log('\n=============================================================');
  console.log(`🚀 [CaloView] 칼로리뷰 서버가 성공적으로 실행되었습니다!`);
  console.log(`👉 로컬 브라우저 주소: http://localhost:${PORT}`);
  console.log('=============================================================\n');
});

