export const authProfileCode = `Auth Profile 시스템:

여러 AI 프로바이더를 동시 지원:
  Profile 1: OpenAI GPT-4o (API 키)
  Profile 2: Anthropic Claude (OAuth)
  Profile 3: Google Gemini (API 키)
  Profile 4: Ollama (로컬, 무료)

자동 페일오버 설정:
  {
    "model": {
      "primary": "anthropic/claude-opus-4-6",
      "fallbacks": ["anthropic/claude-sonnet-4-5",
                     "openai/gpt-5", "google/gemini-2-pro"]
    }
  }
  → Rate limit, 장애, 타임아웃 시 자동으로 다음 모델 시도
  → channels.modelByChannel로 채널별 다른 모델 지정 가능

쿨다운 관리:
  실패한 프로파일은 일정 시간 쿨다운
  → 자동 만료 후 다시 활성화
  → 무한 재시도 방지

프로바이더별 인증:
  Anthropic: API 키 인증 (권장)
  OpenAI:    OPENAI_API_KEY 환경 변수
  Gemini:    키 로테이션 (GEMINI_API_KEYS, KEY_1, KEY_2)
             + Google CLI 로그인 → auth-profiles.json 저장
  Ollama:    자동 감지 (127.0.0.1:11434/v1, 인증 불필요)

Model Catalog:
  각 프로바이더의 사용 가능 모델 자동 발견
  확장 카탈로그: GLM-5, MiniMax M2.5, Kimi K2.5, Grok 등
  → 사용자가 models.json으로 커스텀 설정 가능`;

export const authProfileAnnotations = [
  { lines: [3, 7] as [number, number], color: 'sky' as const, note: '4개 프로바이더 동시 지원' },
  { lines: [9, 18] as [number, number], color: 'emerald' as const, note: '자동 페일오버 설정' },
  { lines: [20, 23] as [number, number], color: 'amber' as const, note: '쿨다운으로 무한 재시도 방지' },
];
