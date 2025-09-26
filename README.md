# What's Up Today - Cloudflare Worker

감정 분석 결과를 기반으로 한국어 캡션을 생성하는 Cloudflare Worker API입니다.

## 📋 프로젝트 개요

이 프로젝트는 얼굴 표정 분석 결과를 받아서 재미있고 위트 있는 한국어 캡션을 생성하는 API를 제공합니다.

## 🚀 기능

- **감정 분석 기반 캡션 생성**: 표정 분석 결과를 받아서 적절한 한국어 캡션 생성
- **CORS 지원**: 웹 애플리케이션에서 직접 호출 가능
- **JSON 응답**: `{ "phrase": "생성된 캡션" }` 형태로 응답
- **Cloudflare Worker**: 빠른 전역 배포 및 실행

## 🛠 기술 스택

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **AI Service**: OpenAI gpt-5-nano
- **Deployment**: Wrangler CLI

## 📁 프로젝트 구조

```
whatsuptoday-worker/
├── src/
│   └── index.ts          # 메인 Worker 코드
├── test/
│   └── index.spec.ts     # 테스트 파일
├── wrangler.jsonc        # Wrangler 설정
├── package.json          # 의존성 관리
└── worker-configuration.d.ts  # 타입 정의
```

## 🚨 중요 알림

### OpenAI API 지역 제한 문제

이 프로젝트는 **OpenAI API의 지역 제한으로 인해 현재 사용할 수 없습니다**.

**발생한 오류:**
```
Error: 403 Country, region, or territory not supported
```

**원인:**
- OpenAI API가 한국에서 직접 접근이 제한됨
- Cloudflare Workers에서 OpenAI API 호출 시 지역 제한 적용

**해결 방안:**
1. **VPN 사용**: 다른 지역에서 API 호출
2. **프록시 서버**: 중간 프록시를 통한 API 호출
3. **대체 AI 서비스**: 한국에서 접근 가능한 AI API 사용
4. **로컬 개발**: 개발 환경에서만 사용

## 🔧 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
# .dev.vars 파일 생성
echo "OPENAI_API_KEY=your_openai_api_key_here" > .dev.vars
```

### 3. 로컬 개발 서버 실행
```bash
npm run dev
```

### 4. 배포
```bash
npm run deploy
```

## 📡 API 사용법

### 엔드포인트
```
POST /api/generate
```

### 요청 예시
```javascript
const response = await fetch('https://your-worker.workers.dev/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    expressions: {
      happy: 0.8,
      sad: 0.1,
      angry: 0.1
    }
  })
});

const data = await response.json();
console.log(data.phrase); // "기분이 좋아 보이네요!"
```

### 응답 예시
```json
{
  "phrase": "기분이 좋아 보이네요!"
}
```

## 🧪 테스트

```bash
npm test
```

## 📝 스크립트

- `npm run dev` - 로컬 개발 서버 실행
- `npm run deploy` - 프로덕션 배포
- `npm test` - 테스트 실행
- `npm run cf-typegen` - 타입 생성

## 🔒 CORS 설정

API는 모든 도메인에서 호출 가능하도록 CORS가 설정되어 있습니다:

```typescript
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}
```

## 📚 참고 자료

- [Cloudflare Workers 문서](https://developers.cloudflare.com/workers/)
- [OpenAI API 문서](https://platform.openai.com/docs)
- [Wrangler CLI 문서](https://developers.cloudflare.com/workers/wrangler/)

## ⚠️ 제한사항

- **OpenAI API 지역 제한**: 한국에서 직접 접근 불가

---

**참고**: 이 프로젝트는 OpenAI API의 지역 제한으로 인해 현재 프로덕션 환경에서 사용할 수 없습니다. 대안적인 AI 서비스 사용을 고려해보세요.
