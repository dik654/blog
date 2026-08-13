import TipsetDetailViz from "./viz/TipsetDetailViz";
import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function Tipset({ onCodeRef }: Props) {
  return (
    <section id="tipset" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Tipset은 같은 epoch의 block을 무조건 묶지 않는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          한 epoch에 여러 provider가 당선될 수 있으므로 Filecoin은 호환되는
          block을 tipset으로 묶습니다. Height가 같다는 조건만으로는 부족하며
          parent tipset과 parent state·receipt commitment 등 합의에 필요한
          조건이 일치해야 같은 tipset이 됩니다.
        </p>
        <p>
          Node는 유효한 tipset을 이어 붙여 후보 chain을 만들고 누적 weight로
          local head를 선택합니다. 이 선택은 F3가 만든 finality certificate와
          다릅니다. EC head는 짧은 구간에서 바뀔 수 있지만 F3 finality는
          consumer가 되돌리지 않을 checkpoint 경계를 제공합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <TipsetDetailViz onOpenCode={onCodeRef} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Null round도 chain history의 일부다</h3>
        <p>
          어떤 epoch에는 유효한 block이 없을 수 있습니다. 이때 height는
          건너뛰지만 다음 block의 state transition은 지나간 epoch와 cron
          processing을 반영해야 합니다. 따라서 tipset 수와 epoch 수를 같은
          값으로 가정하면 replay와 state computation을 잘못 해석하게 됩니다.
        </p>
        <h3>Cache 크기는 protocol 상수가 아니다</h3>
        <p>
          Tipset cache와 index는 동기화 성능을 위한 구현 세부사항입니다. 고정된
          개수나 O(1) 문구보다 현재 Lotus build의 eviction policy, hit rate와
          reorg 시 invalidation 경로를 확인하는 편이 정확합니다.
        </p>
      </div>
    </section>
  );
}
