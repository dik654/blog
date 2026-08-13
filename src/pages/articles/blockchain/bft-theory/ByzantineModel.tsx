import ByzantineModelViz from "./viz/ByzantineModelViz";

export default function ByzantineModel() {
  return (
    <section id="byzantine-model" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Signature는 발신자를 증명하지만 발신자의 정직함을 증명하지 않는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Failure model과 timing model을 먼저 고정해야 threshold를 해석할 수 있습니다.
          Crash process는 보통 더는 protocol message를 보내지 않지만 Byzantine process는
          invalid value, selective omission, equivocation, 순서 위반을 포함한 임의 행동을 할 수
          있습니다. Network partition은 channel 상태이며 어떤 process가 악의적인지의 증거가 아닙니다.
        </p>
      </div>
      <ByzantineModelViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Authentication과 authorization을 분리합니다</h3>
        <p>
          Digital signature는 message bytes와 signer identity를 묶어 위조·변조를 탐지하고,
          conflicting signed messages를 accountability evidence로 남깁니다. 그러나 valid signature는
          proposal이 application rule에 맞거나 signer가 honest하다는 뜻이 아닙니다. Node는 membership,
          phase·height, domain separation, replay protection과 value validity를 별도로 검사해야 합니다.
        </p>
        <h3>Partial synchrony에서는 safety와 progress의 시간 범위가 다릅니다</h3>
        <p>
          Unknown Global Stabilization Time(GST) 이전에는 message delay가 길어 protocol이 멈출 수
          있습니다. Lock·certificate rule은 이 구간에도 conflicting commit을 막아야 합니다. GST 뒤
          delay bound 안에 message가 오고 정직 leader가 선택되면 timeout·view change가 progress를
          회복합니다. 따라서 timeout은 liveness 장치이지 safety certificate가 아닙니다.
        </p>
      </div>
      <div id="paper-dls-bft" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Partial synchrony</p>
        <p className="mt-2 text-sm font-semibold">Consensus in the Presence of Partial Synchrony</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 완전 동기와 완전 비동기 사이의 timing model에서 consensus 가능 조건을 찾는 것입니다.
          Unknown bound 또는 unknown GST 모델과 resilience bounds를 제시합니다. 실제 Internet delay
          숫자나 특정 protocol의 timeout 값을 제공하는 논문은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf" target="_blank" rel="noreferrer">DLS 원문 보기</a>
      </div>
    </section>
  );
}
