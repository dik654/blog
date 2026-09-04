import ContextViz from "./viz/ContextViz";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PDP는 저장 후에도 데이터를 보유하는지 주기적으로 증명한다</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Filecoin의 PoRep·PoSt는 장기 보관과 네트워크 파워를 증명하는 핵심
          프로토콜이다. 하지만 애플리케이션이 자주 읽는 데이터에는 원본을 접근
          가능한 형태로 두고, 그 데이터가 계속 존재하는지만 가볍게 확인하는 별도
          서비스가 필요하다.
          <strong> Provable Data Possession(PDP)</strong>는 바로 이 warm-storage
          경계를 다룬다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          문제 — 신뢰와 전체 재다운로드 사이
        </h3>
        <p className="leading-7">
          제공자의 API가 “보관 중”이라고 답하는 것만으로는 데이터 보유를 검증할 수 없다. 반대로 확인할 때마다 전체 데이터 세트를 내려받으면 데이터가 커질수록 검증 비용도 함께
          커진다. 필요한 것은 작은 증명으로 임의 위치의 데이터를 확인하고 검사를 반복하며 손실 탐지 확률을 쌓는 방식이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          아이디어 — 데이터 세트 전체에서 무작위 leaf를 검사
        </h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Data set</h4>
            <p className="text-xs text-muted-foreground">
              여러 piece와 크기를 논리적 배열로 묶고 각 piece의 Merkle root를
              기록한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Random challenge</h4>
            <p className="text-xs text-muted-foreground">
              체인 randomness에서 예측하기 어려운 위치를 골라 제공자가 미리
              표본만 보관하지 못하게 한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Merkle proof</h4>
            <p className="text-xs text-muted-foreground">
              선택된 leaf와 경로가 등록된 piece root에 포함되는지 온체인에서
              확인한다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">PoRep와의 관계</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">PoRep·PoSt</h4>
            <p className="text-xs text-muted-foreground">
              복제된 섹터와 장기 보관을 Filecoin L1의 파워·합의 경제에 연결한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">PDP</h4>
            <p className="text-xs text-muted-foreground">
              서비스 계약이 접근 가능한 원본 데이터 세트를 계속 보유하고 있는지 검증한다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          둘의 관계를 “cold 대 hot”이라는 가격표로 단순 치환할 수는 없다. 증명 대상과 경제적 역할이 다르므로 애플리케이션은 접근성, 장기 보존, 결제 조건에 맞춰 조합한다.
        </p>

        <CitationBlock
          {...OFFICIAL_SOURCES.filecoin.pdp}
          citeKey={1}
          type="code"
        >
          공개 PDP 저장소는 verifier와 listener/service 계약을 분리하고,
          mainnet·calibration 배포를 안내하면서도 계약이 beta 상태임을 명시한다.
          이 글은 고정된 160바이트·가스·가격 수치를 프로토콜 규칙으로 취급하지
          않는다.
        </CitationBlock>
      </div>
    </section>
  );
}
