import SyncDetailViz from "./viz/SyncDetailViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function TipsetValidation({ onCodeRef }: Props) {
  return (
    <section id="tipset-validation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Sync는 후보 head를 검증 가능한 tipset chain으로 가져온다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          새 head advertisement를 받았다고 곧바로 local head를 바꾸지는
          않습니다. Syncer는 현재 chain과 후보의 공통 조상을 찾고 필요한
          header와 message를 가져온 뒤, tipset과 block을 순서대로 검증해
          chain store에 반영합니다.
        </p>
        <p>
          Header fetch, message fetch, state computation과 proof verification은
          서로 다른 병목입니다. “네 단계 함수”를 외우기보다 어느 단계가
          network I/O를 기다리고 어느 단계가 parent state를 요구하는지
          추적해야 reorg와 catch-up 문제를 진단할 수 있습니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <SyncDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Batch 크기와 timeout은 구현·운영 설정이다</h3>
        <p>
          한 요청에서 가져오는 tipset 수나 sync 소요 시간을 protocol 상수로
          쓰지 않습니다. Peer latency, chain gap, state snapshot과 local cache에
          따라 달라지므로 stage별 throughput, retry와 invalid-candidate 비율을
          telemetry로 확인합니다.
        </p>
      </div>
    </section>
  );
}
