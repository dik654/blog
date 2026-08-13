import ExplainedFormula from "@/components/ui/explained-formula";
import CAPViz from "./viz/CAPViz";

export default function CAP() {
  return (
    <section id="cap" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        CAP는 제품을 CP·AP로 분류하는 표보다 partition execution의 불가능성이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CAP의 formal model에서 consistency는 모든 operation이 한 복사본에서
          원자적으로 실행된 것처럼 보이는 <strong>linearizability</strong>,
          availability는 non-failing node가 받은 모든 요청에 결국 non-error
          response를 돌려주는 성질입니다. Partition tolerance는 세 번째 기능을
          켜는 선택지가 아니라, node 집합 사이 메시지가 임의로 손실되는 execution을
          system model에 포함한다는 뜻입니다.
        </p>
      </div>

      <CAPViz />

      <ExplainedFormula
        question="Partition 중 linearizability와 모든 요청의 응답을 왜 동시에 보장할 수 없을까?"
        idea="서로 통신할 수 없는 두 replica에서 한쪽은 write를 완료하고 다른 쪽은 그 이후 read를 받습니다. 두 번째 replica는 write를 알 수 없으므로 최신 값을 답하거나 응답을 보장하는 선택을 동시에 할 수 없습니다."
        formula={String.raw`P \Longrightarrow \neg(C_{lin} \land A_{resp})`}
        terms={[
          { symbol: "P", name: "partition execution", description: "replica 집합 사이 message loss가 지속되는 partition execution" },
          { symbol: "C_{lin}", name: "linearizability", description: "real-time order를 보존하는 linearizable history" },
          { symbol: "A_{resp}", name: "response availability", description: "모든 non-failing node의 요청에 eventual non-error response" },
        ]}
        assumptions={[
          "적어도 두 node가 있고 partition 양쪽에서 요청을 받을 수 있습니다.",
          "Consistency와 availability는 Gilbert–Lynch model의 강한 정의를 사용합니다.",
        ]}
        interpretation="이 식은 정상 구간에서 latency와 consistency 중 하나만 선택하라는 뜻이 아닙니다. Partition이 실제로 발생한 execution에서 둘의 동시 보장이 불가능하다는 뜻입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>두 replica의 수치 없는 반례</h3>
        <ol>
          <li>A와 B 사이 network가 끊깁니다.</li>
          <li>Client 1이 A에 <code>x=1</code>을 쓰고 성공 응답을 받습니다.</li>
          <li>그 뒤 Client 2가 B에서 <code>x</code>를 읽습니다.</li>
        </ol>
        <p>
          B가 즉시 이전 값 0을 답하면 availability는 유지하지만 real-time order를
          어겨 linearizability를 잃습니다. A의 write를 확인할 때까지 기다리거나
          error를 돌려주면 consistency는 지킬 수 있지만 CAP availability 정의를
          만족하지 못합니다. “항상 둘 중 하나를 영구 선택”하는 것이 아니라 key,
          operation, consistency level에 따라 요청별 policy를 다르게 둘 수도
          있습니다.
        </p>

        <h3>CAP에서 읽으면 안 되는 결론</h3>
        <ul>
          <li>Consistency가 모든 replica의 byte가 같은 순간 같다는 뜻은 아닙니다.</li>
          <li>Availability가 SLA 99.99%나 low latency를 뜻하지 않습니다.</li>
          <li>Replication factor를 늘리면 정리 자체가 사라지는 것이 아닙니다.</li>
          <li>정상 구간의 latency trade-off는 CAP proof가 직접 말하지 않습니다.</li>
        </ul>
        <p>
          실무에서는 consistency model(linearizable·causal·eventual), operation별
          quorum, timeout과 retry, stale-read budget, recovery reconciliation을
          따로 기록합니다. Partition injection은 양쪽 write/read trace와 응답
          status를 수집해 safety와 availability를 각각 판정해야 합니다.
        </p>
      </div>

      <div
        id="paper-gilbert-lynch-cap"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · CAP의 formal model</p>
        <p className="mt-2 text-sm font-semibold">
          Brewer&apos;s Conjecture and the Feasibility of Consistent, Available,
          Partition-Tolerant Web Services
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 asynchronous network model에서 atomic consistency와 availability를
          partition execution까지 함께 보장할 수 있는지입니다. 두 node 반례로
          불가능성을 보이고, 약한 consistency에서는 availability가 가능함을
          구분합니다. 모든 database를 영구적인 CP/AP label 하나로 분류하거나
          정상 상태 latency를 예측하는 논문은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Gilbert–Lynch proof와 정의 보기
        </a>
      </div>
    </section>
  );
}
