import { CitationBlock } from "@/components/ui/citation";

export default function ErrorCases({ title }: { title: string }) {
  return (
    <section id="error-cases" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}: 어느 gate에서 멈췄는지 구분합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Timeout은 응답을 받지 못한 transport 실패입니다. Unknown fork는 받은 bytes를 해당 schema로 해석할 수 없는 실패입니다.
        </p>
        <p>
          Header root mismatch는 <code>HTR(H)≠C</code>입니다. Invalid committee branch는
          <code>Fold(HTR(K),B)≠H.state_root</code>입니다. 오래된 checkpoint는 cryptographic mismatch가 아니라 고정한 Helios 구현의
          freshness policy에 걸린 경우입니다.
        </p>
        <p>
          이 실패들은 모두 S1을 만들기 전에 끝나므로 이전 Store가 있다면 그대로 남습니다. 반대로 두 proof가 통과한 뒤
          <code>apply_bootstrap</code>이 실행되면 H와 K가 같은 Bootstrap 응답에서 함께 들어갑니다. 운영 환경에서 timeout을 몇 번 재시도할지,
          checkpoint를 누가 교체할지, process crash 뒤 persistence를 어떻게 복구할지는 이 개념 경계 밖이며 설정·운영 글에서 다룹니다.
        </p>
      </div>
      <div id="paper-helios-bootstrap-source" className="scroll-mt-24">
        <CitationBlock source="a16z/helios 43a8c9f — checkpoint configuration and consensus implementation" href="https://github.com/a16z/helios/tree/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/ethereum" citeKey={1} type="code">
          문제: trusted checkpoint에서 portable Ethereum client를 시작하는 실제 설정·실행 경로. 기여: checkpoint input/cache/fallback과
          Ethereum client implementation을 제공합니다. 전제: 이 SHA·network config·build를 고정합니다. 근거 범위: 선택한 source snapshot의
          현재 동작입니다. 주장하지 않는 것: fallback source의 정직성, audit 완료, 모든 failure에 대한 hardening을 자동 보장하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-light-client-bootstrap-spec" className="scroll-mt-24">
        <CitationBlock source="Ethereum consensus-specs v1.6.1 — light-client bootstrap" href="https://github.com/ethereum/consensus-specs/tree/v1.6.1/specs/altair/light-client" citeKey={2}>
          문제: recent trusted block root에서 current committee와 header를 안전하게 초기화하는 문제. 기여: bootstrap container 생성과
          initialize_light_client_store validation을 정의합니다. 전제: v1.6.1·active fork·preset·trusted root를 고정합니다. 근거 범위:
          consensus bootstrap rules입니다. 주장하지 않는 것: checkpoint source 선택이나 Helios의 HTTP·disk policy를 정하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-weak-subjectivity-spec" className="scroll-mt-24">
        <CitationBlock source="Ethereum consensus-specs v1.6.1 — Weak Subjectivity" href="https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/phase0/weak-subjectivity.md" citeKey={3}>
          문제: 오래 offline인 proof-of-stake node가 장거리 대체 history를 구분하는 문제. 기여: weak-subjectivity period와 checkpoint
          distribution의 조건을 설명합니다. 전제: validator churn·network state·spec version을 고정합니다. 근거 범위: recent trust anchor의
          consensus 근거입니다. 주장하지 않는 것: 27시간이나 14일을 모든 network의 보편 상수로 선언하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
