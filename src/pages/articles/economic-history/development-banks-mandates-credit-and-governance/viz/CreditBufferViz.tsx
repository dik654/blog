import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview·#case — 위기 전 100+30=130, 위기 뒤 75+45=120.
 * 민간 −25, 개발은행 +15, 순감소 10. 늘어난 15가 모두 추가 자금인지는 본문이 정하지 않는다.
 */
const TOTAL_SCALE = 130;

interface Segment {
  key: string;
  value: number;
  label: string;
  kind: "private" | "dev" | "devAdded" | "devUnknown" | "gap";
}

const BEFORE: readonly Segment[] = [
  { key: "p", value: 100, label: "민간 100", kind: "private" },
  { key: "d", value: 30, label: "개발 30", kind: "dev" },
];

const SCENES = [
  {
    label: "위기 전",
    summary: "100 + 30 = 130",
    after: [] as readonly Segment[],
    afterTotal: null as number | null,
    caption: "아래 줄은 아직 비어 있습니다.",
    note: "기업이 민간은행에서 100, 개발은행에서 30을 빌려 모두 130을 빌렸습니다. 이 장부는 설명용 가정입니다.",
  },
  {
    label: "민간대출이 25 줄어듦",
    summary: "100 → 75 · 충격 25",
    after: [
      { key: "p", value: 75, label: "민간 75", kind: "private" },
      { key: "d", value: 30, label: "개발 30", kind: "dev" },
      { key: "g", value: 25, label: "−25", kind: "gap" },
    ] as readonly Segment[],
    afterTotal: null,
    caption: "점선 칸 25 = 민간이 줄인 대출. 개발은행이 30에 머물렀다면 75+30=105입니다.",
    note: "위기 뒤 민간대출이 100에서 75로 줄어 점선 칸 25가 생깁니다. 본문이 말하는 '충격 25'가 이 칸입니다.",
  },
  {
    label: "개발은행이 15 늘림",
    summary: "75 + 45 = 120 · 빈칸 10",
    after: [
      { key: "p", value: 75, label: "민간 75", kind: "private" },
      { key: "d", value: 30, label: "개발 30", kind: "dev" },
      { key: "a", value: 15, label: "+15", kind: "devAdded" },
      { key: "g", value: 10, label: "", kind: "gap" },
    ] as readonly Segment[],
    afterTotal: 120,
    caption: "+15가 점선 칸 25 가운데 15를 메우고, 점선 칸 10이 남습니다.",
    note: "개발은행 대출이 30에서 45로 늘어 총대출은 120입니다. 충격 25가 순감소 10으로 줄었지만 전부 메우지는 못했습니다.",
  },
  {
    label: "15는 모두 추가 자금인가",
    summary: "추가인지 대체인지 따로 확인",
    after: [
      { key: "p", value: 75, label: "민간 75", kind: "private" },
      { key: "d", value: 30, label: "개발 30", kind: "dev" },
      { key: "a", value: 15, label: "?", kind: "devUnknown" },
      { key: "g", value: 10, label: "", kind: "gap" },
    ] as readonly Segment[],
    afterTotal: 120,
    caption: "? 칸 15의 안쪽이 추가 대출과 대체 대출로 어떻게 나뉘는지는 이 장부만으로 알 수 없습니다.",
    note: "같은 우량기업이 민간대출 대신 더 싼 개발은행 대출을 받았다면 총투자와 고용의 추가 효과는 작습니다. 추가성, 곧 공공기관이 없었다면 생기지 않았을 대출인지는 대출 전후와 지원받지 않은 비교집단으로 확인합니다.",
  },
] as const;

const STYLE: Record<Segment["kind"], { bg: string; border: string; text: string; dashed: boolean }> = {
  private: { bg: "#94a3b8", border: "#94a3b8", text: "#0f172a", dashed: false },
  dev: { bg: "#2563eb", border: "#2563eb", text: "#ffffff", dashed: false },
  devAdded: { bg: "#60a5fa", border: "#2563eb", text: "#0f172a", dashed: false },
  devUnknown: { bg: "transparent", border: "#2563eb", text: "#2563eb", dashed: true },
  gap: { bg: "transparent", border: "#dc2626", text: "#dc2626", dashed: true },
};

function Row({ label, segments, total }: { label: string; segments: readonly Segment[]; total: number | null }) {
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs sm:grid-cols-[4.5rem_minmax(0,1fr)_3rem] sm:text-sm">
      <span className="font-semibold">{label}</span>
      <div className="flex h-9 min-w-0 rounded-md bg-muted/30">
        {segments.map((segment) => {
          const style = STYLE[segment.kind];
          return (
            <div
              key={segment.key}
              className="flex min-w-0 items-center justify-center overflow-hidden rounded-sm text-[11px] font-bold leading-none sm:text-xs"
              style={{
                width: `${(segment.value / TOTAL_SCALE) * 100}%`,
                backgroundColor: style.bg,
                color: style.text,
                border: `1px ${style.dashed ? "dashed" : "solid"} ${style.border}`,
              }}
            >
              {segment.label}
            </div>
          );
        })}
      </div>
      <span className="text-right font-mono font-bold">{total === null ? "" : total}</span>
    </div>
  );
}

export default function CreditBufferViz() {
  return (
    <SceneShell
      eyebrow="위기 때 대출 완충"
      title="민간이 25를 줄일 때 개발은행의 15가 메우는 몫과 남는 빈칸"
      description="막대 전체 길이가 기업이 빌린 총액입니다. 회색은 민간은행, 파랑은 개발은행 대출이며, 숫자는 특정 나라의 통계가 아닌 설명용 가정입니다."
      ariaLabel="위기 전 총대출 130에서 민간 25 감소와 개발은행 15 증가를 거쳐 위기 뒤 120이 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <Row label="위기 전" segments={BEFORE} total={130} />
            <Row label="위기 뒤" segments={scene.after} total={scene.afterTotal} />
            <StableSceneStack
              active={active}
              scenes={SCENES.map((item) => (
                <p key={item.label} className="text-xs leading-6 text-muted-foreground sm:text-sm">{item.caption}</p>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
