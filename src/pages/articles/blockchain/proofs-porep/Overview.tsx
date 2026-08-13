import ContextViz from "./viz/ContextViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PoRep는 데이터를 replica로 인코딩한 과정과 commitment를 증명한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PoRep는 “디스크에 파일이 하나 있다”는 선언을 확인하는 검사가 아닙니다.
          원본 데이터 commitment와 provider·sector·randomness에 묶인
          <code> replica_id</code>를 사용해 replica를 인코딩하고, 그 결과가
          protocol이 정한 graph와 commitment 규칙을 따랐음을 증명합니다.
        </p>
        <p>
          구현은 PC1, PC2, C1, C2로 나뉩니다. PC1이 graph dependency를 따라
          label을 만들고, PC2가 replica와 Merkle commitment를 완성합니다.
          Randomness가 정해진 뒤 C1이 challenge용 witness를 준비하고 C2가
          on-chain verification에 사용할 SNARK proof를 생성합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>순차 dependency가 storage commitment를 만든다</h3>
        <p>
          PC1의 label은 graph parent의 이전 결과에 의존하므로 모든 node를
          독립적으로 한 번에 계산할 수 없습니다. 이 구조가 계산·공간
          tradeoff를 제한하지만 “어떤 병렬화도 불가능하다”는 뜻은 아닙니다.
          Layer, window와 batch 안에서 가능한 병렬화는 현재 구현과 parameter
          set을 기준으로 확인해야 합니다.
        </p>
        <h3>시간과 용량은 protocol 상수가 아니다</h3>
        <p>
          Sector size, proof parameter, storage layout, CPU·GPU와 software
          version이 달라지면 각 phase의 시간과 peak memory도 달라집니다. 과거
          장비의 고정 시간표 대신 phase별 wall time, read·write bytes, CPU
          utilization과 GPU kernel time을 같은 fixture에서 기록합니다.
        </p>
      </div>
    </section>
  );
}
