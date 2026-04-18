import RuntimeGuardViz from './viz/RuntimeGuardViz';

export default function RuntimeGuard() {
  return (
    <section id="runtime-guard" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">런타임 LLM judge + retry</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Smoothie-Qwen은 모델 가중치를 건드린다. RL은 학습 자체를 다시 돌린다.<br />
          그 사이에 하나가 더 있다 — <strong>모델을 전혀 건드리지 않는</strong> 접근.<br />
          생성된 출력을 검사하고, 실패하면 재시도하고, 그게 전부다.
        </p>
        <p className="leading-7">
          런타임 가드는 Smoothie/RL의 대체가 아니라 그 위에 얹는 안전망이다.<br />
          Smoothie로 95% 거르고, RL로 4%를 더 막고, 나머지 1%의 long-tail을 런타임 가드가 잡는다.<br />
          또는 모델을 마음대로 바꿀 수 없는 환경(API 기반, 외부 공급자)에서 유일한 해법이다.
        </p>
        <p className="leading-7">
          이 섹션은 두 가지 검사 방식(regex vs LLM judge), hybrid fast/slow path, retry 전략, 그리고 이 모든 걸 묶는 <code>runWithQualityGuard</code> 패턴을 본다.
        </p>

        <div className="not-prose my-8"><RuntimeGuardViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">블랙박스로 모델을 다루기</h3>
        <p className="leading-7">
          런타임 가드의 장점은 <strong>모델 교체 자유도</strong>다.<br />
          모델이 Qwen이든 Llama든 GPT든 똑같이 동작한다. 학습된 가중치, 디코더 internals, tokenizer 어느 것도 요구하지 않는다.<br />
          input → model → output → check 라는 4단 파이프라인 중 마지막 단계만 추가한다.
        </p>
        <p className="leading-7">
          단점은 비용과 latency다.<br />
          매 응답에 검사 오버헤드가 붙고, 실패 시 재생성이 추가 generation을 요구한다.<br />
          잘 설계하면 평균 오버헤드를 50~100ms 수준으로 억제할 수 있지만, 최악의 경우(연속 retry) latency가 2~3배로 튄다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">1단계 — regex 검사</h3>
        <p className="leading-7">
          가장 단순하고 가장 빠른 검사다.<br />
          CJK Unified Ideographs 범위(U+4E00~9FFF)에 속하는 문자가 응답에 포함돼 있는지 정규식 한 줄로 확인한다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`const CJK_PATTERN = /[\\u4E00-\\u9FFF]/;
function regexCheck(text) {
  const matches = text.match(new RegExp(CJK_PATTERN, 'g')) ?? [];
  const ratio = matches.length / text.length;
  return { ok: ratio < 0.05 };  // 5% 임계
}`}
        </pre>
        <p className="leading-7">
          비용은 마이크로초 단위. 모든 응답에 부담 없이 적용할 수 있다.<br />
          실패 기준은 유연하게 설정한다 — "한자 비율 &gt; 5%" 또는 "연속 한자 3자 이상" 같은 heuristic.<br />
          단순 존재 여부로는 고유명사에서 false positive가 과도해진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">regex의 한계</h3>
        <p className="leading-7">
          regex는 유니코드 판정만 한다. 그래서 두 방향으로 틀린다.
        </p>
        <p className="leading-7">
          <strong>False positive</strong> — 정상인데 잘못 걸림:
        </p>
        <ul className="leading-7">
          <li>고유명사: "李舜臣", "新羅", "漢江" — 한글로 풀어쓰면 오히려 어색하다.</li>
          <li>사용자가 한자를 명시적으로 요청한 경우 — 한자 학습 앱, 한문 번역, 역사 자료 인용.</li>
          <li>기술 용어: 한의학, 법률 등 일부 도메인은 한자 표기가 표준.</li>
        </ul>
        <p className="leading-7">
          <strong>False negative</strong> — 비정상인데 못 걸림:
        </p>
        <ul className="leading-7">
          <li>음차(transliteration): "분시", "펀시" 같은 어색한 한자 발음 표기. 유니코드 상으로는 정상 한글이지만 의미가 망가져 있다.</li>
          <li>영어 혼용: "API 호출 結果를 확인" 같은 패턴에서 한자만 regex로 잡히지만, 영어가 과도한 경우는 못 잡는다.</li>
          <li>문법은 한국어인데 어휘가 부자연스러운 경우 — 직역체.</li>
        </ul>
        <p className="leading-7">
          regex로 해결되는 사례가 70~80%인 건 분명하다. 하지만 나머지 20~30%는 의미를 알아야 판정할 수 있다.<br />
          그래서 LLM judge가 필요하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2단계 — LLM judge</h3>
        <p className="leading-7">
          작은 판정용 LLM(Haiku급, 혹은 Qwen3-4B 같은 작은 오픈 모델)에게 "이 응답이 자연스러운 한국어인가"를 묻는다.<br />
          판정 결과는 yes / partial / no 삼단 분류 + 짧은 이유.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`const JUDGE_PROMPT = \`
다음 응답이 자연스러운 한국어인지 판정하세요.
- 고유명사(인명·지명)에 한자가 들어간 경우는 정상입니다.
- 한자어를 한자로 표기한 경우(分析 등)는 비정상입니다.
- 음차나 직역체는 비정상입니다.

응답: """{response}"""

판정: yes / partial / no
이유: (한 문장)
\`;`}
        </pre>
        <p className="leading-7">
          비용은 추가 추론 한 번이다. Haiku 기준 latency +500ms~1s, 토큰 비용도 증가.<br />
          판정용 LLM의 크기가 중요하다 — 너무 작으면 판정이 부정확하고, 너무 크면 비용이 polynominal하게 올라간다.<br />
          실전에선 Qwen3-4B 또는 Haiku 정도가 sweet spot.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">hybrid fast/slow path</h3>
        <p className="leading-7">
          regex와 LLM judge의 장단점이 정확히 상보적이다.<br />
          regex는 싸고 명백한 케이스를 잘 걸러낸다. LLM judge는 비싸지만 미묘한 경우를 정확히 판정한다.<br />
          둘을 순차 조합하면 비용과 정확도를 동시에 잡을 수 있다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`async function check(response) {
  const fast = regexCheck(response);
  if (fast.ok && !fast.suspicious) return { ok: true };
  if (!fast.ok && fast.clear) return { ok: false };
  // 애매한 경우만 judge로
  const verdict = await llmJudge(response);
  return { ok: verdict === 'yes' };
}`}
        </pre>
        <p className="leading-7">
          실측해 보면 전체 응답의 85~90%가 regex fast path에서 확실하게 통과하거나 실패한다.<br />
          LLM judge 호출이 필요한 건 10~15%의 애매한 경우뿐이다.<br />
          평균 latency 오버헤드는 (regex 0ms × 0.85) + (judge 700ms × 0.15) ≈ 100ms.<br />
          LLM judge 단독 사용(700ms)에 비해 7배 저렴하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">retry 전략 — 동일 프롬프트로는 부족</h3>
        <p className="leading-7">
          검사가 실패했을 때 가장 순진한 해법은 "같은 프롬프트로 다시 생성"이다.<br />
          이건 효과가 약하다. 같은 분포에서 다시 샘플링하는 것뿐이라, 한 번 실패한 패턴이 두 번째에도 나올 가능성이 높다.
        </p>
        <p className="leading-7">
          효과적인 변형 세 가지:
        </p>
        <p className="leading-7">
          <strong>① Temperature 낮추기</strong><br />
          첫 시도 temp=1.0, 재시도 temp=0.7, 두 번째 재시도 temp=0.4 식으로 내려간다.<br />
          낮은 temperature는 덜 창의적이고 덜 실험적인 sampling이다. 한자 토큰이 "차선"인 경우 낮은 temp에서는 한국어 토큰이 일관되게 선택된다.
        </p>
        <p className="leading-7">
          <strong>② System prompt 강화</strong><br />
          실패한 응답을 system 컨텍스트에 삽입하고 "이전 응답에 한자가 섞였습니다. 한국어로만 재작성하세요"를 추가한다.<br />
          모델이 자신의 실패를 볼 수 있으면 다음 생성에서 그 패턴을 피한다.
        </p>
        <p className="leading-7">
          <strong>③ Negative few-shot</strong><br />
          실패한 응답을 "이렇게 쓰지 마" 예시로 프롬프트에 넣는다.<br />
          in-context learning이 강한 모델일수록 이 신호가 잘 먹힌다. 단 몇 샷으로 명확히 금지를 가르칠 수 있다.
        </p>
        <p className="leading-7">
          세 가지를 조합하면 retry 성공률이 단순 retry 대비 2~3배 올라간다.<br />
          대신 프롬프트가 길어지는 비용이 따른다. retry 횟수와 프롬프트 확장 사이의 trade-off를 관리해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">retry 상한과 모니터링</h3>
        <p className="leading-7">
          retry는 무한 루프를 절대 피해야 한다. 기본 상한 2~3회.<br />
          그 이후에도 실패하면 두 가지 폴백 전략 중 선택한다.
        </p>
        <ul className="leading-7">
          <li><strong>postProcess</strong>: 마지막 응답을 받아 regex로 한자를 제거하거나 한글로 치환. 의미가 깨질 위험이 있지만 사용자에게 응답은 간다.</li>
          <li><strong>throw</strong>: 에러로 처리하고 호출자에게 알린다. 중요 워크로드에서는 이쪽이 안전.</li>
        </ul>
        <p className="leading-7">
          retry 횟수는 latency budget과 직결된다. 1회 retry = latency 2배.<br />
          그래서 지속 모니터링이 필수다:
        </p>
        <ul className="leading-7">
          <li><strong>retry rate</strong>: 응답 중 재시도가 일어난 비율. 정상은 5~15%.</li>
          <li><strong>judge pass rate</strong>: LLM judge에서 yes가 나온 비율. 정상은 80~90%.</li>
          <li><strong>평균 latency</strong>: 가드 오버헤드 포함 end-to-end. 정상은 base latency의 1.1~1.3배.</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>운영 신호</strong> — retry rate &gt; 20%는 명확한 경보다.<br />
          모델이 해당 워크로드에 적합하지 않거나, 프롬프트 자체에 문제가 있거나, 언어 일관성 문제가 악화된 상황.<br />
          이 시점이 되면 런타임 가드를 더 강화하는 게 아니라 Smoothie-Qwen으로 갈아타거나 프롬프트를 다시 짜는 게 맞는 방향이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">runWithQualityGuard — 실전 패턴</h3>
        <p className="leading-7">
          가드 로직을 호출자에게 노출시키면 모든 호출 사이트가 실패 처리 분기를 가져야 한다.<br />
          대신 가드를 생성 경로의 일부로 encapsulate 해서 호출자가 존재 자체를 모르게 만든다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`async function runWithQualityGuard(prompt, { maxRetries = 2 } = {}) {
  let currentPrompt = prompt;
  let lastResp = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const temp = 1.0 - attempt * 0.3;
    lastResp = await model.generate(currentPrompt, { temperature: temp });
    const fast = regexCheck(lastResp);
    if (fast.ok && !fast.suspicious) return lastResp;
    if (attempt === maxRetries) break;
    const verdict = await llmJudge(lastResp);
    if (verdict === 'yes') return lastResp;
    currentPrompt = reinforce(currentPrompt, lastResp);
  }
  return postProcess(lastResp);  // 또는 throw
}`}
        </pre>
        <p className="leading-7">
          호출자는 단순히 <code>runWithQualityGuard(prompt)</code>를 부른다. 가드의 존재, retry의 동작, 폴백 처리는 전부 내부에 갇힌다.<br />
          이 패턴은 테스트도 쉽다 — <code>regexCheck</code>, <code>llmJudge</code>, <code>reinforce</code>를 각각 stub으로 바꿔 retry 분기를 검증할 수 있다.
        </p>
        <p className="leading-7">
          에이전트가 여러 도구·여러 단계를 거친다면 이 가드를 tool 실행 직전에 두는 게 아니라, <strong>모델 출력을 받는 모든 지점에 균일하게</strong> 두는 게 중요하다.<br />
          한 지점만 가드하고 다른 지점은 그냥 두면 leakage가 그 구멍으로 새어나간다.
        </p>
        <p className="leading-7">
          다음 섹션에서는 지금까지 본 4가지 해법(프롬프트, 런타임 가드, Smoothie, RL)을 비용·강도·배포 제약 기준으로 묶고, 상황별로 어떤 조합을 선택할지 결정 매트릭스를 정리한다.
        </p>
      </div>
    </section>
  );
}
