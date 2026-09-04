import { CitationBlock } from "@/components/ui/citation";

export default function ErrorCases({ title }: { title: string }) {
  return (
    <section id="error-cases" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}: 부분 성공을 store로 승격하지 않는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Timeout·oversized response·unknown fork는 transport/schema failure이고 checkpoint root mismatch·invalid
          committee branch는 trust failure입니다. Stale checkpoint는 provenance는 맞지만 freshness policy를 통과하지 못한
          경우입니다. 이들을 모두 “sync 실패” 한 종류로 합치면 retry해도 되는 문제와 operator 승인이 필요한 문제의 구분이 사라집니다.
        </p>
        <p>
          Release 전에 재생하는 fixture는 wrong network/genesis, C와 다른 header, branch sibling 한 bit 변경, old
          checkpoint입니다. 여기에 response truncation, unknown fork, store write 전후 crash, endpoint failover도 같은
          fixture로 돌립니다. Base와 candidate가 accept/reject reason, resulting store root, restart outcome에서 같음을
          확인한 뒤 latency를 비교하며 rollback에는 binary·config·last verified checkpoint를 묶습니다.
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
