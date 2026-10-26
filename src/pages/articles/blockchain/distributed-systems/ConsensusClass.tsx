import ConsensusClassViz from "./viz/ConsensusClassViz";

export default function ConsensusClass() {
  return (
    <section id="consensus-class" className="scroll-mt-20">
      <header className="space-y-4">
        <p className="text-sm font-bold text-primary">05 · 진행 조건</p>
        <h2 className="text-2xl font-bold">부분 동기는 진행할 수 있는 구간을 가정합니다</h2>
        <p className="max-w-3xl text-lg leading-8 text-foreground/90">
          FLP의 완전 비동기 모델에서 벗어나려면 무엇을 더 가정해야 할까요? 부분 동기는 네트워크가 언젠가 안정되지만 그 시점을 미리 모른다고 두고, 기다리는 시간을 늘려 안정 구간을 만납니다.
        </p>
      </header>

      <ConsensusClassViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>GST 전후의 약속이 다릅니다</h3>
        <p>
          Dwork·Lynch·Stockmeyer는 동기와 비동기 사이에 두 형태의 부분 동기를 정의했습니다. 한 형태는 전달과 처리의 상한이 존재하지만 프로토콜이 값을 미리 모릅니다. 다른 형태는 상한을 알고 있지만, 그 상한이 성립하기 시작하는 시각 <strong>GST(Global Stabilization Time)</strong>를 모릅니다.
        </p>
        <p>
          따라서 일반적인 부분 동기 합의는 GST 전에도 충돌 결정을 막는 안전성 규칙을 유지하고, GST 뒤에 정직한 리더와 충분한 통신이 이어지면 진행성을 얻습니다. 타임아웃은 다음 라운드로 넘어갈 계기일 뿐이며, 이전 라운드의 늦은 메시지를 거절하는 라운드 번호와 결정 증거가 따로 필요합니다.
        </p>

        <h3>불가능성을 피할 때 추가한 조건을 숨기지 않습니다</h3>
        <div className="not-prose my-6 grid gap-px bg-border p-px sm:grid-cols-2">
          {[
            ["부분 동기", "GST 뒤에 성립하는 지연 상한을 추가합니다."],
            ["무작위성", "스케줄러가 다음 선택을 완전히 예측하지 못하게 합니다."],
            ["실패 감지기", "누구를 의심할지에 대한 정확성·완전성 조건을 추가합니다."],
            ["더 약한 문제", "정확한 합의 대신 근사 합의처럼 목표를 조정합니다."],
          ].map(([title, body]) => (
            <div key={title} className="bg-background p-4">
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p>
          어떤 방법을 쓰든 “FLP를 해결했다”보다 정확한 문장은 “원래 모델에 이 조건을 더해 이 범위의 진행성을 얻었다”입니다. 이 구분을 해두면 프로토콜 이름이 달라도 보장과 한계를 같은 기준으로 비교할 수 있습니다.
        </p>
      </div>

      <aside id="paper-dls-partial-synchrony" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">원 논문 · 부분 동기</p>
        <p className="mt-2 text-sm font-semibold">Consensus in the Presence of Partial Synchrony</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Dwork·Lynch·Stockmeyer는 알려지지 않은 상한이 존재하는 경우와, 알려진 상한이 알 수 없는 시각 뒤부터 성립하는 경우를 구분합니다. 여러 고장 모델에서 합의 프로토콜과 하한을 제시하지만 실제 인터넷의 GST 시각이나 특정 타임아웃 값을 제공하는 논문은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://research.ibm.com/publications/consensus-in-the-presence-of-partial-synchrony" target="_blank" rel="noreferrer">DLS 초록과 원문 링크 보기</a>
      </aside>

      <aside id="paper-chandra-toueg-failure-detectors" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">원 논문 · 실패 감지기</p>
        <p className="mt-2 text-sm font-semibold">Unreliable Failure Detectors for Reliable Distributed Systems</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Chandra와 Toueg는 비동기 crash 시스템에서 process에 대한 의심을 completeness와 accuracy라는 성질로 추상화합니다. 운영 health check가 완벽한 고장 판정기라는 뜻도, 비잔틴 행동을 찾는다는 뜻도 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.cs.cornell.edu/home/rvr/papers/UnreliableFD.pdf" target="_blank" rel="noreferrer">Chandra–Toueg 원문 보기</a>
      </aside>
    </section>
  );
}
