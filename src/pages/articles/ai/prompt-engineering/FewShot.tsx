import FewShotViz from './viz/FewShotViz';

export default function FewShot() {
  return (
    <section id="few-shot" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Few-shot 예시 설계</h2>
      <div className="not-prose mb-8"><FewShotViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Few-shot</strong>(소수 예시 학습) — 입출력 쌍을 프롬프트에 포함해 LLM이 패턴을 학습하도록 유도<br />
          0-shot → 1-shot에서 가장 큰 점프, 3-shot 이후 수확 체감
        </p>
        <p>
          예시 품질이 핵심 — 다양한 카테고리 + 엣지케이스 포함이 필수<br />
          LLM은 마지막 예시에 더 큰 영향을 받는 Recency Bias(최신성 편향) 존재<br />
          대표적 예시를 마지막에 배치하거나 순서를 셔플해 편향 완화
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Few-shot 예시 설계 원칙</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Few-shot Prompting 설계 가이드
//
// 1. 개수 (N-shot):
//    0-shot: 예시 없음, 지시만
//    1-shot: 1개 예시 (가장 큰 개선)
//    3-5 shot: 실무 표준
//    10+ shot: 수확 체감, context window 부담
//
// 2. 다양성 (Diversity):
//    - 다양한 카테고리 커버
//    - 엣지 케이스 포함
//    - 긍정/부정 예시 균형
//
//    나쁜 예 (감정 분석):
//      1. "좋은 영화" → 긍정
//      2. "재밌었다" → 긍정
//      3. "추천합니다" → 긍정
//    → 모두 긍정, 부정 예시 없음
//
//    좋은 예:
//      1. "최고의 영화" → 긍정
//      2. "지루한 2시간" → 부정
//      3. "그럭저럭" → 중립
//      4. "놀라운 반전" → 긍정
//
// 3. 형식 일관성:
//    모든 예시가 같은 포맷 사용
//    라벨 이름 통일 (POSITIVE vs positive)
//    구분자 일관 (":" vs "->")
//
// 4. 순서 (Recency Bias):
//    LLM은 최근 예시에 더 영향받음
//    - 대표 예시를 마지막에
//    - 또는 랜덤 셔플
//    - A/B 테스트로 최적 순서 찾기
//
// 5. 예시 선택 (Retrieval):
//    - 질문과 가장 유사한 예시 동적 선택
//    - k-NN 임베딩 검색
//    - Dynamic prompting`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">In-Context Learning 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ICL이 어떻게 작동하는가?
//
// Brown et al. 2020 (GPT-3 원논문):
//   "모델이 런타임에 예시로부터 '패턴'을 학습"
//   파라미터 업데이트 없음
//   purely attention/forward-pass 기반
//
// 이론적 해석:
//
// 1. Bayesian Meta-Learning
//    - 사전학습 = 태스크 분포 학습
//    - ICL = 특정 태스크 추론
//    - 예시 = task descriptor
//
// 2. Gradient Descent Simulation
//    - Transformer attention이 implicit gradient
//    - 각 예시 처리 = 1-step 업데이트
//    - Akyurek 2022, Von Oswald 2023
//
// 3. Induction Heads
//    - 특정 attention head가 패턴 복사
//    - "A → B, C → D" 같은 매핑 학습
//    - Olsson 2022 (Anthropic)
//
// Few-shot 성능 요인:
//   - 예시 수
//   - 예시 다양성
//   - 라벨 분포
//   - 입력 형식

// 주목할 발견 (Min 2022):
//   - 라벨 랜덤 셔플링해도 성능 유지
//   - 형식/분포가 라벨 정확도보다 중요
//   - 예시의 '구조'가 진짜 역할

// Zero-shot vs Few-shot 비교:
//   GPT-3 175B on SuperGLUE:
//     0-shot:  67.5
//     1-shot:  71.9 (+4.4)
//     few-shot (32): 73.2 (+1.3)
//
//   가장 큰 개선은 0 → 1 shot!
//
// Claude 3 few-shot:
//   - XML 태그로 예시 구분 권장
//   - <example> ... </example>
//   - System prompt에 예시 배치`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>3~5 shot</strong>이 실무 표준 — 그 이상은 수확 체감.<br />
          요약 2: <strong>다양성·형식 일관성·순서</strong>가 성능에 결정적.<br />
          요약 3: ICL의 본질은 <strong>패턴 학습</strong> — 라벨 정확도보다 형식 중요.
        </p>
      </div>
    </section>
  );
}
