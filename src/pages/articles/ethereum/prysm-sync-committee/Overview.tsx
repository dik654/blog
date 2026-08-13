import ContextViz from "./viz/ContextViz";
import SyncCommitteeViz from "./viz/SyncCommitteeViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sync committee는 light client가 head를 추적할 집계 서명을 만든다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 싱크 위원회 선정, 매 슬롯 서명, 라이트 클라이언트 증명
          생성 과정을 코드 수준으로 추적한다.
        </p>

        {/* ── Sync Committee 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Sync Committee — light client 지원 (Altair+)
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              문제: Light client의 block root 검증
            </p>
            <p className="text-sm text-foreground/80">
              라이트 클라이언트는 전체 상태와 모든 attestation을 실행하지
              않는다. Altair는 제한된 sync committee의 집계 서명으로 헤더를
              추적하는 별도 경로를 도입했다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              Sync Committee 특성
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70 font-semibold">512 members</p>
                <p className="text-foreground/50">mainnet preset</p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70 font-semibold">256 epochs</p>
                <p className="text-foreground/50">mainnet preset period</p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70 font-semibold">매 slot 서명</p>
                <p className="text-foreground/50">block_root BLS</p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70 font-semibold">
                  SyncAggregate
                </p>
                <p className="text-foreground/50">1 sig + 512 bits</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                Light client 사용 흐름
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>1. trusted sync committee snapshot 로드</p>
                <p>
                  2. 새 <code>LightClientUpdate</code> 수신
                </p>
                <p>
                  3. 현재 committee에 대한 <code>sync_aggregate</code>와 참여
                  bits 검증
                </p>
                <p>
                  4. 참여 임계값·Merkle branch·finality 규칙에 따라
                  optimistic/finalized header 갱신
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                설계 근거
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>위원회 크기와 period는 consensus preset에서 결정</p>
                <p>
                  집계 공개키·서명으로 전체 검증자 집합보다 작은 검증 경로 제공
                </p>
                <p>committee 교체도 update 안의 증명으로 이어서 검증</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Sync Committee는 light client가 매 slot header를 저렴하게 확인할 수
          있도록 선택된 <strong>validator 대표단</strong>이다.
          mainnet preset에서는 512명과 256 epochs를 사용하지만 구현은 preset
          값을 읽어야 하며,
          light client는 집계 서명뿐 아니라 참여도, branch, committee 전환과
          finality 조건을 함께 검증한다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <SyncCommitteeViz />
      </div>
    </section>
  );
}
