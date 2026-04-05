import AntiPatternsViz from './viz/AntiPatternsViz';

export default function AntiPatterns() {
  return (
    <section id="anti-patterns" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안티패턴 & 트러블슈팅</h2>
      <div className="not-prose mb-8"><AntiPatternsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          과도한 지시 — 500+ 토큰 지시문은 핵심이 노이즈에 묻혀 오히려 성능 저하<br />
          모호한 역할 — "도움이 되는 어시스턴트" 대신 구체적 전문성과 행동 기준 명시
        </p>
        <p>
          네거티브 프롬프트 — "~하지 마"는 해당 개념을 활성화시켜 역효과<br />
          "개인정보 출력 금지" → "공개 가능 정보만 포함"으로 긍정형 전환<br />
          컨텍스트 오염 — 긴 대화에서 초기 지시 영향력 감소, 중요 지시 재주입 필요
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">흔한 안티패턴 목록</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 프롬프트 안티패턴 Top 10
//
// 1. 과도한 지시 (Over-Instruction)
//    나쁜 예: 500 토큰 지시 + 10개 제약
//    문제: 핵심 지시가 노이즈에 묻힘
//    해결: 지시 우선순위 → 상위 3개만
//
// 2. 네거티브 프롬프트
//    나쁜 예: "절대 욕설 하지 마"
//    문제: "욕설" 개념 활성화
//    해결: "전문적이고 정중한 어조 유지"
//
// 3. 모호한 역할
//    나쁜 예: "도움이 되는 어시스턴트가 되어줘"
//    해결: "15년 경력의 Python 백엔드 엔지니어로서..."
//
// 4. 출력 형식 미지정
//    나쁜 예: "요약해줘"
//    해결: "3줄, 각 줄 50자 이내, 숫자 매기기"
//
// 5. 예시 부재
//    나쁜 예: "이 카테고리로 분류해줘"
//    해결: 2~3개 입출력 쌍 제공
//
// 6. 컨텍스트 과잉
//    나쁜 예: 관련 없는 배경 정보 첨부
//    문제: Lost in the middle 현상
//    해결: 필요한 정보만 (relevant context)
//
// 7. 대화 히스토리 오염
//    나쁜 예: 긴 대화 후 원래 지시 잊음
//    해결: 중요 지시 재주입, 세션 재시작
//
// 8. Temperature 오용
//    나쁜 예: 사실 검색에 temp=1.0
//    해결: 사실=0, 창의=0.7~1.0
//
// 9. 잘못된 Few-shot 예시
//    나쁜 예: 편향된 카테고리만
//    해결: 다양성, 엣지 케이스 포함
//
// 10. JSON 스키마 미제공
//    나쁜 예: "JSON으로 줘"
//    해결: 명확한 스키마 + 예시`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">트러블슈팅 가이드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 흔한 문제와 해결책
//
// 문제 1: 출력이 일관성 없음
//   원인: temperature 너무 높음, 모호한 지시
//   해결:
//     - temperature = 0 또는 0.3
//     - 더 구체적 지시
//     - Few-shot 예시 추가
//     - Output format 명시
//
// 문제 2: Hallucination (거짓 정보)
//   원인: 모델이 모르는 영역
//   해결:
//     - "정보가 없으면 '모른다'고 답하기"
//     - RAG (검색 증강)
//     - 소스 인용 강제
//     - 더 큰 모델 사용
//
// 문제 3: 지시 무시
//   원인: 컨텍스트 오염, 긴 대화
//   해결:
//     - System prompt 강화
//     - 중요 지시 반복
//     - 대화 초기화
//
// 문제 4: 토큰 낭비 (너무 긴 응답)
//   원인: 지시 불명확
//   해결:
//     - max_tokens 설정
//     - "간결하게, N단어 이내"
//     - 구조화된 짧은 형식
//
// 문제 5: 금지된 응답 회피
//   원인: 안전 필터
//   해결:
//     - 정당한 사용 컨텍스트 제공
//     - 역할 재설정
//     - 불가 시 다른 접근

// 디버깅 전략:
//   1. 최소 프롬프트로 시작
//   2. 단계적으로 지시 추가
//   3. 각 단계 결과 관찰
//   4. A/B 테스트
//   5. 실패 케이스 수집 분석

// 프로덕션 체크리스트:
//   [ ] Temperature 적절 (사실=0, 창의=0.7)
//   [ ] Output format 명시
//   [ ] Error handling 정의
//   [ ] max_tokens 설정
//   [ ] Rate limiting
//   [ ] 비용 모니터링
//   [ ] 응답 품질 평가 파이프라인
//   [ ] Fallback 전략`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>네거티브 프롬프트</strong>는 역효과 — 긍정형 전환 필수.<br />
          요약 2: <strong>과도한 지시</strong>가 오히려 성능 저하 — 상위 3개만.<br />
          요약 3: Hallucination 대응은 <strong>RAG + 명시적 "모른다" 허용</strong>.
        </p>
      </div>
    </section>
  );
}
