import type { StepDef } from '@/components/ui/step-viz';

export const ANTI_C = '#ef4444';
export const FIX_C = '#10b981';
export const DEBUG_C = '#6366f1';
export const CHECK_C = '#f59e0b';

export const ANTIPATTERN_STEPS: StepDef[] = [
  {
    label: '안티패턴 1-3: 과도한 지시 · 네거티브 · 모호한 역할',
    body: '① 과도한 지시: 500 토큰 + 10개 제약 → 핵심이 노이즈에 묻힘\n해결: 지시 우선순위 → 상위 3개만\n\n② 네거티브 프롬프트: "절대 욕설 하지 마" → "욕설" 개념 활성화\n해결: "전문적이고 정중한 어조 유지" (긍정형 전환)\n\n③ 모호한 역할: "도움이 되는 어시스턴트"\n해결: "15년 경력의 Python 백엔드 엔지니어로서..."',
  },
  {
    label: '안티패턴 4-7: 형식 미지정 · 예시 부재 · 오염',
    body: '④ 출력 형식 미지정: "요약해줘"\n→ "3줄, 각 50자 이내, 숫자 매기기"\n\n⑤ 예시 부재: "이 카테고리로 분류해줘"\n→ 2-3개 입출력 쌍 제공\n\n⑥ 컨텍스트 과잉: 관련 없는 배경 정보 → Lost in the middle\n→ 필요한 정보만 (relevant context)\n\n⑦ 대화 히스토리 오염: 긴 대화 후 원래 지시 잊음\n→ 중요 지시 재주입, 세션 재시작',
  },
  {
    label: '안티패턴 8-10: Temperature · 편향 예시 · 스키마 미제공',
    body: '⑧ Temperature 오용: 사실 검색에 temp=1.0\n→ 사실=0, 창의=0.7-1.0\n\n⑨ 잘못된 Few-shot 예시: 편향된 카테고리만\n→ 다양성 확보, 엣지 케이스 포함\n\n⑩ JSON 스키마 미제공: "JSON으로 줘"\n→ 명확한 스키마 + 예시 동시 제공',
  },
];

export const TROUBLESHOOT_STEPS: StepDef[] = [
  {
    label: '문제 1-2: 출력 불일치 + Hallucination',
    body: '문제 1: 출력이 일관성 없음\n원인: temperature 높음, 모호한 지시\n해결: temp=0 또는 0.3, 더 구체적 지시, Few-shot 추가, 형식 명시\n\n문제 2: Hallucination (거짓 정보)\n원인: 모델이 모르는 영역\n해결: "모르면 모른다고 답", RAG, 소스 인용 강제, 더 큰 모델',
  },
  {
    label: '문제 3-5: 지시 무시 + 토큰 낭비 + 금지 회피',
    body: '문제 3: 지시 무시 → System prompt 강화, 지시 반복, 대화 초기화\n\n문제 4: 너무 긴 응답 → max_tokens, "간결하게 N단어 이내"\n\n문제 5: 금지된 응답 → 정당한 사용 컨텍스트 제공, 역할 재설정',
  },
  {
    label: '디버깅 전략 + 프로덕션 체크리스트',
    body: '디버깅 5단계:\n① 최소 프롬프트로 시작 → ② 단계적 지시 추가\n③ 각 단계 결과 관찰 → ④ A/B 테스트 → ⑤ 실패 케이스 분석\n\n프로덕션 체크리스트:\nTemperature 적절 | Output format 명시 | Error handling\nmax_tokens 설정 | Rate limiting | 비용 모니터링\n응답 품질 평가 파이프라인 | Fallback 전략',
  },
];
