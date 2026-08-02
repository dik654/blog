import AgentSelectionViz from './viz/AgentSelectionViz';

export default function AgentSelection() {
  return (
    <section id="agent-selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold">선택은 점수 경쟁이 아니라 type 해석이다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          현재 source에는 tag overlap, embedding score, cutoff 0.30, top-k, success-rate bandit이 없다.
          호출자가 이미 <code>subagent_type</code>을 정하고, runtime은 별칭을 정규화한 뒤
          <code>allowed_tools_for_subagent</code>의 고정 분기로 보낸다.
        </p>
      </div>
      <AgentSelectionViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>주의할 fallback</h3>
        <p>
          빈 type은 <code>general-purpose</code>가 된다. 알 수 없는 문자열은 그대로 보존되지만
          allowlist match의 기본 branch로 가므로 오히려 write와 shell을 포함한 넓은 도구 집합을 받는다.
          strict registry가 목표라면 unknown type을 spawn 전에 거부하는 검증이 추가로 필요하다.
        </p>
        <h3>빈 type과 unknown type은 같은 branch지만 같은 의미는 아니다</h3>
        <p>
          빈 값은 <code>normalize_subagent_type</code>에서 명시적으로 <code>general-purpose</code>가 된다.
          unknown 문자열은 그대로 보존된 채 allowlist의 <code>_</code> branch로 간다. 결과 tool 집합은
          같아도 manifest에 남는 type과 검증 의도는 다르다. 따라서 audit에서는 normalized type과 선택된
          branch를 둘 다 기록해야 한다.
        </p>
      </div>
    </section>
  );
}
