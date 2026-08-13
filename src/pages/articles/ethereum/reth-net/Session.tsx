import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import SessionDetailViz from "./viz/SessionDetailViz";
import { codeRefs } from "./codeRefs";

export default function Session({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="session" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Session은 socket이 아니라 단계별 권한을 가진 state machine이다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Pending session은 handshake deadline과 buffer를 쓰지만 아직
          application message를 처리할 권한이 없습니다. RLPx identity와
          encryption이 확정되고, Hello capability 교집합에서 ETH version을 고른
          뒤, Status가 local chain과 호환돼야 active slot을 받습니다. 이 순서를
          생략하면 공격자가 TCP만 열어 slot을 붙잡거나 다른 genesis의 message가
          handler까지 들어올 수 있습니다.
        </p>
      </div>

      <SessionDetailViz />

      <ExplainedFormula
        question="두 peer가 어떤 subprotocol로 통신할 수 있으며 언제 active session이 되는가?"
        idea="이름·version이 같은 capability만 교집합에 남기고, 그중 필요한 ETH capability와 chain Status가 모두 통과할 때만 data-path 권한을 엽니다."
        formula={String.raw`\begin{aligned}
          C_{shared}&=C_{local}\cap C_{peer}\\
          ready&=secure\land(C_{shared}^{eth}\ne\varnothing)\\
          &\quad\land compatible(status)
        \end{aligned}`}
        terms={[
          {
            symbol: String.raw`C_{local}`,
            name: "local capabilities",
            description:
              "Local binary가 지원한다고 Hello에 광고한 protocol 이름·version 집합입니다.",
          },
          {
            symbol: String.raw`C_{peer}`,
            name: "peer capabilities",
            description:
              "Remote Hello에서 받은 protocol 이름·version 집합입니다.",
          },
          {
            symbol: String.raw`C_{shared}^{eth}`,
            name: "shared ETH set",
            description:
              "양쪽이 함께 구현한 ETH subprotocol version 후보입니다.",
          },
          {
            symbol: "secure",
            name: "RLPx ready",
            description:
              "Peer identity·session secret·encrypted frame state가 확정됐음을 뜻합니다.",
          },
          {
            symbol: "status",
            name: "ETH Status",
            description:
              "선택한 version에서 교환한 chain·genesis·fork·head compatibility 정보입니다.",
          },
        ]}
        assumptions={[
          "Capability 값은 단순 문자열이 아니라 protocol 이름과 version의 정확한 pair입니다.",
          "Version 선택·message ID layout·Status validation은 pinned devp2p와 Reth implementation을 따릅니다.",
        ]}
        interpretation="Local이 eth/68·snap/1, peer가 eth/67·eth/68이면 공통 ETH 후보는 eth/68입니다. 그래도 genesis나 fork compatibility가 틀리면 ready는 false입니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Close reason이 slot·retry·reputation을 결정합니다</h3>
        <p>
          Local capacity 초과, transient timeout, remote disconnect, malformed
          frame와 incompatible Status는 같은 failure가 아닙니다. 모든 종료
          경로는 pending/active map, inflight request와 bounded channel
          capacity를 회수하고 reason-coded metric을 남깁니다. 재시작 뒤에는
          stale active counter를 복원하지 않고 durable peer policy와 fresh
          handshake에서 session을 다시 구성합니다.
          <CodeViewButton
            onClick={() => onCodeRef("net-session", codeRefs["net-session"])}
          />
        </p>
      </div>

      <div
        id="paper-devp2p-rlpx"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 규격 읽기 · secure session
        </p>
        <p className="mt-2 text-sm font-semibold">
          Ethereum devp2p RLPx specification
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 peer authentication, encrypted framing과 capability
          negotiation을 어떻게 연결하는지 정의하는 것입니다. 규격은 wire
          contract를 제공하지만 peer가 honest하거나 ETH chain data가 valid하다는
          보장은 하지 않으며 Status와 full block validation이 뒤따라야 합니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/ethereum/devp2p/blob/master/rlpx.md"
          target="_blank"
          rel="noreferrer"
        >
          RLPx 규격 보기
        </a>
      </div>
    </section>
  );
}
