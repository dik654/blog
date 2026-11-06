import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 첫 문단과 둘째 문단 앞부분 — bid와 실제 내용이 어디로 이동하는가.
 * 카드 두 장의 자리를 세 구역 사이에서 옮겨 약속과 내용이 따로 움직임을 보입니다. 0.01 ETH는 본문의 설명용 숫자입니다.
 */
type Zone = "builder" | "block" | "public";

const SCENES = [
  { label: "제작자가 만듦", summary: "T1→T2, X의 90·95", content: "builder", bid: null, ptc: false, note: "T1·T2의 순서를 정하고 X의 90·95를 포함한 접근 목록과 실행 결과를 만듭니다." },
  { label: "약속을 씀", summary: "내용 대신 hash를 서명", content: "builder", bid: "builder", ptc: false, note: "hash(자료를 줄여 만든 지문값), slot(블록 하나에 배정된 시간 칸), 부모 블록, 지급 조건을 넣습니다." },
  { label: "제안자가 약속을 담음", summary: "블록엔 bid만", content: "builder", bid: "block", ptc: false, note: "제안자는 적절한 bid를 합의 블록에 담습니다. 실제 내용은 아직 제작자 쪽에 있습니다." },
  { label: "제작자가 내용을 공개", summary: "payload 공개", content: "public", bid: "block", ptc: false, note: "제작자가 bid에 대응하는 실제 내용을 공개합니다. 지급 처리와 내용 공개가 따로 움직이므로 미공개·지연에 관한 규칙도 필요합니다." },
  { label: "PTC가 도착을 확인", summary: "제때 보였는가만", content: "public", bid: "block", ptc: true, note: "PTC는 자료가 제때 보였는지와 관련 가용성을 확인합니다. 이것만으로 X=95의 계산까지 검사했다고 읽지 않습니다." },
] as const satisfies readonly { label: string; summary: string; content: Zone; bid: Zone | null; ptc: boolean; note: string }[];

function BidCard() {
  return (
    <div className="rounded-md border px-2 py-1 text-xs leading-5" style={{ borderColor: "#d97706", backgroundColor: "#d9770614" }}>
      <p className="font-bold" style={{ color: "#b45309" }}>bid (서명한 약속)</p>
      <p>hash·slot·지급 조건</p>
    </div>
  );
}

function ContentCard() {
  return (
    <div className="rounded-md border px-2 py-1 text-xs leading-5" style={{ borderColor: "#2563eb", backgroundColor: "#2563eb14" }}>
      <p className="font-bold" style={{ color: "#2563eb" }}>실제 내용 (payload)</p>
      <p>T1·T2 · X의 90·95</p>
    </div>
  );
}

function ZoneBox({ title, children, badge, minH }: { title: string; children?: ReactNode; badge?: string; minH: string }) {
  return (
    <div className={`flex min-w-0 flex-col rounded-lg border border-border bg-background p-1.5 sm:min-h-[10.5rem] sm:p-2 ${minH}`}>
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{title}</p>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-1">
          {children}
          {badge && <p className="rounded-md border border-dashed px-2 py-1 text-xs font-semibold leading-5" style={{ borderColor: "#16a34a", color: "#15803d" }}>{badge}</p>}
        </div>
      </div>
    </div>
  );
}

export default function DeliverySequenceViz() {
  return (
    <SceneShell
      eyebrow="약속과 내용의 이동"
      title="약속이 먼저 블록에 들어가고 실제 내용은 따로 공개됩니다"
      description="제안과 개발 명세의 동작을 카드로 따라갑니다."
      ariaLabel="bid와 payload가 제작자, 합의 블록, 공개 영역 사이를 이동하는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-2 sm:grid-cols-3">
            <ZoneBox title="제작자(builder) 쪽" minH="min-h-[5.5rem]">
              {scene.content === "builder" && <ContentCard />}
              {scene.bid === "builder" && <BidCard />}
            </ZoneBox>
            <ZoneBox title="합의 블록(제안자가 만듦)" minH="min-h-[5.5rem]">
              {scene.bid === "block" && <BidCard />}
            </ZoneBox>
            <ZoneBox title="공개된 자료" minH="min-h-[5.5rem]" badge={scene.ptc ? "PTC: 제때 보였나?" : undefined}>
              {scene.content === "public" && <ContentCard />}
            </ZoneBox>
          </div>
        );
      }}
    />
  );
}
