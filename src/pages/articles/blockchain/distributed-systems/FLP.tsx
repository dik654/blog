import { Link } from "react-router-dom";
import FLPViz from "./viz/FLPViz";

export default function FLP() {
  return (
    <section id="flp" className="scroll-mt-20">
      <header className="space-y-4">
        <p className="text-sm font-bold text-primary">02 · 종료 한계</p>
        <h2 className="text-2xl font-bold">FLP는 끝나지 않는 실행 하나를 보입니다</h2>
        <p className="max-w-3xl text-lg leading-8 text-foreground/90">
          완전 비동기 환경에서 결정적 합의가 모든 허용된 실행마다 반드시 끝난다고 약속할 수 있을까요? 아래 장면은 결정을 고정할 사건을 늦춰 미결정 상태를 연장하는 증명의 핵심을 보여줍니다.
        </p>
      </header>

      <FLPViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>정리의 범위를 먼저 고정합니다</h3>
        <p>
          FLP(Fischer–Lynch–Paterson) 정리는 process의 상대 속도와 메시지 지연에 상한이 없는 완전 비동기 메시지 시스템을 다룹니다. process는 결정적으로 동작하고, 최대 한 process가 예고 없이 멈출 수 있으며, 메시지는 정확하게 전달됩니다. 이 조건에서 agreement와 validity를 만족하는 합의 프로토콜도 모든 허용된 실행의 termination까지 함께 보장할 수는 없습니다.
        </p>
        <p>
          원문은 오히려 채널에 유리한 조건을 둡니다. 메시지가 손상되거나 중복되는 모델도, 비잔틴 고장도 다루지 않습니다. 그런데도 느린 process와 멈춘 process를 구별할 수 없기 때문에 종료하지 않는 실행을 구성할 수 있습니다.
        </p>

        <h3>Bivalence는 아직 두 결정이 모두 가능한 상태입니다</h3>
        <p>
          모든 로컬 상태와 아직 전달되지 않은 메시지를 합친 전체 상태를 configuration이라고 합니다. 앞으로 0만 결정할 수 있으면 0-valent, 1만 가능하면 1-valent입니다. 둘 다 가능하면 <strong>bivalent</strong>입니다. 증명은 bivalent 초기 상태가 있음을 보인 뒤, 결정값을 하나로 좁힐 critical event를 당장 전달하지 않고 다음 bivalent 상태로 이동하는 선택을 반복합니다.
        </p>
        <p>
          결론은 “현실의 모든 합의가 멈춘다”가 아닙니다. 끝나지 않는 허용된 실행이 하나라도 있으므로 <em>모든 실행에서 종료</em>를 보장할 수 없다는 뜻입니다. 실제 프로토콜은 부분 동기, 무작위성, 실패 감지기처럼 원래 모델에 없던 조건을 추가합니다.
        </p>
        <p>
          안전성 규칙과 리더 교체가 실제 로그에 어떻게 연결되는지는 <Link to="/cs/blockchain/smr-theory">상태 머신 복제</Link>에서 확인합니다. 비잔틴 합의의 진행 조건은 <Link to="/cs/blockchain/bft-theory">비잔틴 합의</Link>에서 이어집니다.
        </p>
      </div>

      <aside id="paper-flp-consensus" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">원 논문 · 불가능성의 범위</p>
        <p className="mt-2 text-sm font-semibold">Impossibility of Distributed Consensus with One Faulty Process</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Fischer·Lynch·Paterson은 완전 비동기 메시지 시스템에서 한 process의 중단을 허용하면, 부분적으로 올바른 결정적 합의 프로토콜에도 결정하지 않는 admissible run이 존재함을 보입니다. 확률적 프로토콜이나 부분 동기 모델까지 같은 결론으로 넓혀서는 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf" target="_blank" rel="noreferrer">FLP 원문 보기</a>
      </aside>
    </section>
  );
}
