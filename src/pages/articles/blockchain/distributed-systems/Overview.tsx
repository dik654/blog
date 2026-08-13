import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import ContextViz from "./viz/ContextViz";
import SystemModelViz from "./viz/SystemModelViz";

const modelAxes = [
  ["Timing", "메시지·process step의 시간에 어떤 상한이 있는가"],
  ["Failure", "멈춤, 누락, 임의 행동 중 무엇까지 허용하는가"],
  ["Channel", "손실·중복·순서 변경·발신자 인증을 어떻게 다루는가"],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        분산 시스템은 같은 상태보다 먼저 같은 가정을 합의해야 한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          한 process가 메모리 안의 값을 바꾸는 일은 순서가 하나지만, 여러 node가
          네트워크로 협력하면 각 node가 보는 메시지 순서와 시각이 달라집니다.
          그래서 분산 protocol을 읽을 때는 알고리즘 이름보다 먼저
          <strong> system model</strong>을 고정해야 합니다. 어떤 지연과 고장을
          허용했는지 모르면 “안전하다”와 “결국 진행한다”는 문장도 의미가
          정해지지 않습니다.
        </p>
        <p>
          이 글은 node·message·execution에서 출발해 timing과 failure model,
          safety와 liveness, FLP와 CAP의 정확한 적용 범위를 설명합니다. 명령을
          같은 순서로 실행하는 방법은 <Link to="/blockchain/smr-theory">SMR</Link>,
          Byzantine quorum의 정확한 bound는{" "}
          <Link to="/blockchain/bft-theory">BFT 이론</Link>, 공개 네트워크의
          참여 가중치는 <Link to="/blockchain/consensus-mechanisms">PoW·PoS</Link>
          글에서 확장합니다.
        </p>
      </div>

      <ContentBoundary article="distributed-systems" />
      <ContextViz />
      <SystemModelViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>가장 작은 실행 단위</h3>
        <p>
          <strong>Process</strong>는 local state를 가진 계산 주체이고,
          <strong> message</strong>는 process 사이를 이동하는 값입니다. Process가
          한 번 계산하거나 메시지를 보내고 받는 사건을 event라고 하며, 한
          실행(execution)은 initial state에서 시작한 event의 순서입니다. 실제
          서버·container·thread와 이론의 process는 일대일일 필요가 없습니다.
        </p>
        <p>
          예를 들어 A가 <code>balance=10</code>에서 출금 요청을 처리하고 B에게
          갱신 메시지를 보냈더라도, 그 메시지가 늦으면 B는 여전히 10을 읽을 수
          있습니다. 이것은 곧바로 protocol 오류가 아니라 system model이 허용한
          관측 차이입니다. 오류 여부는 어떤 consistency와 decision rule을
          약속했는지로 판단합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Quorum 두 개가 적어도 한 process를 공유하게 하려면 크기가 얼마나 커야 할까?"
        idea="전체 n개 중 각각 q개를 고르면 두 집합의 합이 n을 넘는 부분만큼은 반드시 겹칩니다. 이 단순한 집합 계산이 이후 crash quorum과 Byzantine quorum의 출발점입니다."
        formula={String.raw`|Q_1 \cap Q_2| \ge 2q-n`}
        terms={[
          { symbol: "n", name: "membership size", description: "전체 replica 또는 voter 수" },
          { symbol: "q", name: "quorum size", description: "각 decision certificate에 필요한 voter 수" },
          { symbol: "Q_1,Q_2", name: "quorum sets", description: "서로 다른 두 quorum 집합" },
        ]}
        assumptions={[
          "두 quorum은 같은 고정 membership에서 선택합니다.",
          "교집합이 존재한다는 사실만으로 그 process가 정직하다는 보장은 없습니다.",
        ]}
        interpretation="n=5, q=3이면 교집합은 최소 1개입니다. Byzantine safety에는 교집합 안에 정직한 voter가 남도록 더 강한 threshold와 vote rule이 필요합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Timing model: timeout은 사실 판정기가 아니다</h3>
        <div className="not-prose my-5 grid gap-5 md:grid-cols-3">
          {[
            ["Synchronous", "알려진 delay·step 상한이 모든 실행에서 성립합니다."],
            ["Asynchronous", "고정 시간 상한이 없어 느림과 crash를 시간만으로 구분하지 못합니다."],
            ["Partial synchrony", "상한이 있지만 값이나 성립 시작 시점 GST를 미리 모릅니다."],
          ].map(([title, body]) => (
            <div key={title} className="border-l border-border pl-4">
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p>
          Production timeout은 “상대가 죽었다”는 증명이 아니라 현재 진행 경로를
          바꿀 근거입니다. 200ms timeout 뒤 leader를 교체하더라도 이전 leader의
          늦은 메시지가 도착할 수 있으므로 term·view·certificate 같은 logical
          evidence로 stale action을 거절해야 합니다.
        </p>

        <h3>Failure model: 고장이라는 한 단어를 쪼갭니다</h3>
        <ul>
          <li><strong>Crash:</strong> process가 더 이상 step을 수행하지 않습니다.</li>
          <li><strong>Omission:</strong> 일부 send·receive event가 누락됩니다.</li>
          <li><strong>Byzantine:</strong> 임의 값, equivocation, 선택적 침묵까지 허용합니다.</li>
        </ul>
        <p>
          인증된 channel은 “누가 보냈는가”와 변조 여부를 검증하지만 발신자가
          거짓 값을 보냈는지는 해결하지 않습니다. 또한 retry로 lossy channel을
          보완할 때는 duplicate delivery를 견디는 message ID와 idempotency rule이
          필요합니다.
        </p>

        <h3>Safety와 liveness는 서로 다른 질문입니다</h3>
        <p>
          <strong>Safety</strong>는 나쁜 일이 한 번도 일어나지 않는다는 성질입니다.
          Consensus의 agreement라면 정직한 두 process가 서로 다른 값을 결정하지
          않는 것입니다. <strong>Liveness</strong>는 좋은 일이 결국 일어난다는
          성질이며, termination은 non-faulty process가 결국 값을 결정하는
          조건입니다. Partition 중 protocol이 멈추면 liveness는 잃을 수 있지만
          conflicting decision을 내지 않았다면 safety는 지킬 수 있습니다.
        </p>
        <p>
          장애 주입에서는 둘을 다른 oracle로 측정합니다. Safety는 conflicting
          commit certificate가 한 건이라도 생기면 실패이고, liveness는 network가
          회복된 뒤 정해진 시간 안에 새 commit이 나오는지 측정합니다. 평균 latency
          하나로 두 성질을 대신할 수 없습니다.
        </p>

        <h3>세 축을 기록하는 최소 run contract</h3>
        <div className="not-prose my-5 grid gap-4 md:grid-cols-3">
          {modelAxes.map(([title, body]) => (
            <div key={title} className="border-t border-border pt-4">
              <p className="text-xs font-bold text-primary">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p>
          같은 binary와 같은 workload라도 이 세 축, membership, protocol version,
          seed·schedule, fault injection trace를 고정하지 않으면 결과를 비교할 수
          없습니다. 다음 절부터는 이 run contract 위에서 불가능성 결과가 실제
          설계에 무엇을 요구하는지 살펴봅니다.
        </p>
      </div>
    </section>
  );
}
