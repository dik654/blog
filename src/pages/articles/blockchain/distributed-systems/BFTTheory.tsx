import { Link } from "react-router-dom";
import ByzantineViz from "./viz/ByzantineViz";

export default function BFTTheory() {
  return (
    <section id="bft-theory" className="scroll-mt-20">
      <header className="space-y-4">
        <p className="text-sm font-bold text-primary">04 · 임의 행동</p>
        <h2 className="text-2xl font-bold">비잔틴 장애는 서로 다른 거짓말까지 허용합니다</h2>
        <p className="max-w-3xl text-lg leading-8 text-foreground/90">
          멈춘 노드는 더 이상 메시지를 보내지 않습니다. 비잔틴 노드는 같은 단계에서도 수신자마다 다른 값을 보낼 수 있습니다. 서명이 있어도 왜 합의 규칙이 더 필요한지 장면으로 확인합니다.
        </p>
      </header>

      <ByzantineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>서명은 거짓말을 막지 않고 증거를 남깁니다</h3>
        <p>
          Crash-fault process는 멈추기 전까지 프로토콜을 따릅니다. Byzantine process는 잘못된 상태 제안, 선택적 침묵, 수신자별 모순 메시지처럼 임의로 행동할 수 있습니다. 디지털 서명은 발신자와 내용의 무결성을 확인하므로 나중에 모순 행동을 증명하는 데 유용하지만, 발신자가 한 값만 보냈다고 보장하지는 않습니다.
        </p>

        <h3>인원수 공식은 시간·인증 모델과 함께 읽습니다</h3>
        <p>
          자주 보는 <code>n ≥ 3f + 1</code>은 모든 비잔틴 시스템에 적용되는 보편 상수가 아닙니다. Lamport·Shostak·Pease의 원 논문에서도 발신자를 위조할 수 없는 서명 메시지와 일반 메시지를 구분합니다. 동기·부분 동기·비동기, 인증 방식, 요구하는 안전성과 진행성에 따라 가능한 조건이 달라집니다.
        </p>
        <p>
          이 글에서는 장애 능력의 경계만 정합니다. 두 결정 증거가 어떻게 겹쳐야 하고 다음 라운드에서 어떤 표를 잠가야 하는지는 <Link to="/cs/blockchain/bft-theory">비잔틴 합의</Link>에서 계산합니다.
        </p>
      </div>

      <aside id="paper-lamport-byzantine" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">원 논문 · 비잔틴 장군 문제</p>
        <p className="mt-2 text-sm font-semibold">The Byzantine Generals Problem</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          목표는 일부 참여자가 모순된 정보를 보내도 정직한 참여자들이 같은 명령을 따르게 하는 것입니다. 원 논문은 일반 메시지와 위조할 수 없는 서명 메시지를 분리하고 각 모델의 알고리즘과 한계를 제시합니다. 이를 부분 동기 블록체인의 진행성이나 경제적 공격 비용으로 바로 넓혀서는 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://lamport.azurewebsites.net/pubs/byz.pdf" target="_blank" rel="noreferrer">Lamport·Shostak·Pease 원문 보기</a>
      </aside>
    </section>
  );
}
