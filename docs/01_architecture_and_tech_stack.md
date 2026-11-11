# 01. 시스템 아키텍처 및 기술 스택 (Architecture & Tech Stack)

## 1. 시스템 구조도
```
[ Client Browser (HTML / CSS / Vanilla JS) ]
       │
       ├──(1. Image & Hint)──> [ Node.js Express API (/api/analyze) ] ──> [ OpenAI Vision API (gpt-4o) ]
       │
       ├──(2. Feedback Data)──> [ Supabase Client SDK / API ] ─────────> [ Supabase PostgreSQL DB ]
       │
       └──(3. Local State)───> [ Browser LocalStorage ] (대시보드/테마/언어 설정)
```

## 2. 기술 스택 세부 명세
- **Frontend**: Standard HTML5, CSS3 (Modern Flexbox, CSS Variables), Native Vanilla JS (ES6+).
- **Backend**: Node.js (v18+) Serverless Express Architecture.
- **AI Engine**: OpenAI API (`gpt-4o` / `gpt-4o-mini`) Vision & Structured Outputs.
- **Database & BaaS**: Supabase (PostgreSQL, Anonymous Authentication, Realtime/REST API).
- **Deployment**: Vercel (Static Hosting + Serverless Functions).

## 3. 전체 프로젝트 파일 구조
```
caloview/
├── AGENTS.md
├── PRD.md
├── docs/
│   ├── 01_architecture_and_tech_stack.md
│   ├── 02_ui_ux_implementation_guide.md
│   ├── 03_features_and_api_spec.md
│   ├── 04_error_handling_and_validation.md
│   ├── 05_supabase_and_database.md
│   └── 06_deployment_and_verification.md
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── i18n.js
│   └── assets/
│       ├── demo_bossam.jpg
│       ├── demo_salad.jpg
│       └── demo_pizza.jpg
├── api/
│   ├── analyze.js
│   └── feedback.js
├── server.js
├── vercel.json
├── package.json
└── .env.example
```