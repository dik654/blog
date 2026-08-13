import { codeRefs } from "./codeRefs";
import PC2DetailViz from "./viz/PC2DetailViz";
import type { CodeRef } from "@/components/code/types";

export default function PC2({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="pc2" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PC2는 label column을 replica와 Merkle commitment로 접는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PC1이 만든 여러 layer의 label을 node별 column으로 모으고 hash해
          encoding key를 만듭니다. 이 key를 원본 데이터에 적용해 replica를
          만들고, data·column·replica에 대응하는 Merkle commitment를
          계산합니다.
        </p>
        <p>
          Poseidon은 유한체 연산으로 구성돼 proof circuit 안에서 다루기
          유리하지만, “SHA-256보다 언제나 수백 배 빠르다”는 일반 성능 주장은
          아닙니다. Native hashing 비용과 circuit constraint 비용을 구분해서
          비교해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <PC2DetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>GPU 처리량과 storage I/O를 함께 본다</h3>
        <p>
          Column hash와 tree construction을 GPU로 옮겨도 layer data를 읽고
          replica와 tree를 쓰는 경로가 병목이면 전체 시간은 줄지 않습니다.
          Kernel time, host-device transfer, disk throughput와 peak VRAM을 같은
          sector fixture에서 기록해야 최적화 효과를 설명할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
