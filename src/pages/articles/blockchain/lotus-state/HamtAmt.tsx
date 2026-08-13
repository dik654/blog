import { codeRefs } from "./codeRefs";
import HamtDetailViz from "./viz/HamtDetailViz";
import type { CodeRef } from "@/components/code/types";

export default function HamtAmt({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="hamt-amt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        HAMT·AMT parameter도 schema의 일부다
      </h2>
      <div className="not-prose mb-8">
        <HamtDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          HAMT는 hashed key의 bit slice로 sparse branch를 선택하고 AMT는 integer
          index를 trie path로 나눈다. 둘 다 child를 CID로 연결하므로 변경 경로만
          새 block으로 쓰고 나머지 branch는 이전 root와 공유할 수 있다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">HAMT lookup</h3>
            <p className="text-sm text-muted-foreground">
              hash algorithm·bit width·bucket policy로 path를 계산하고 bitfield
              rank를 통해 compact pointer index를 찾는다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">AMT lookup</h3>
            <p className="text-sm text-muted-foreground">
              height와 bit width로 index digits를 나눠 sparse array node를
              내려가며 value 또는 child link를 찾는다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          bit width 5, bucket size 3, SHA-256 같은 값은 특정 HAMT
          version·사용처의 parameter일 수 있지만 모든 actor collection의 영구
          상수는 아니다. decoding할 때 actor schema가 기대하는 library version과
          options를 함께 사용해야 같은 root를 재현한다.
        </p>
      </div>
    </section>
  );
}
