import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Protocol({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Challenge와 Merkle 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("pdp-main", codeRefs["pdp-main"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            번들 코드는 흐름을 보여 주는 축약 스냅샷
          </span>
        </div>
        <p className="leading-7">
          PDPVerifier는 data set을 piece들의 논리적 배열로 본다. 각 piece는
          CID·크기와 Merkle commitment를 가지며, verifier는 전체 크기에서
          challenge 위치를 정한 뒤 그 위치가 어느 piece와 leaf에 속하는지
          찾는다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          아이디어를 자료구조로 옮기기
        </h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Piece collection</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>data set 안에 순서 있는 piece 목록을 유지</li>
              <li>piece 추가·삭제 뒤에도 전체 logical offset을 계산</li>
              <li>크기 누적 검색을 위해 Fenwick/BIT 계열 인덱스를 사용</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Proof item</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>challenge가 가리킨 leaf</li>
              <li>piece 내부의 leaf offset</li>
              <li>등록된 root까지 이어지는 Merkle sibling 경로</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          한 proving period의 실행 흐름
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-5 gap-2 my-4">
          {[
            ["1", "Epoch 확정", "서비스가 다음 challenge 기준 epoch을 가진다"],
            ["2", "Seed 도출", "Filecoin L1의 과거 chain randomness를 읽는다"],
            [
              "3",
              "위치 선택",
              "data set 크기에 맞춰 challenge offset을 정한다",
            ],
            ["4", "Proof 구성", "provider가 leaf와 Merkle path를 모은다"],
            ["5", "온체인 검증", "root 일치 여부와 제출 시점을 확인한다"],
          ].map(([n, title, text]) => (
            <div key={n} className="rounded-lg border bg-card p-3">
              <div className="text-xs font-semibold text-muted-foreground mb-1">
                {n}
              </div>
              <div className="text-xs font-semibold mb-1">{title}</div>
              <p className="text-[11px] text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <p className="leading-7">
          challenge 수와 proving period는 탐지 확률·가스·서비스 비용 사이의
          선택이다. 따라서 특정 proof 크기나 검증 비용을 영구적인 상수로
          제시하지 않고, 배포된 계약 버전과 서비스 설정에서 확인해야 한다.
        </p>
      </div>
    </section>
  );
}
