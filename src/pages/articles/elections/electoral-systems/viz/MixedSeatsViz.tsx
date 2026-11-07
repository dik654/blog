import SceneShell from "./SceneShell";
import { PARTY_COLORS, PARTY_NAMES } from "./parties";

/**
 * 본문 대응: #mixed — 지역구 9석(지도 B 3·6·0) + 비례 9석(가정)을 섞는 두 방법.
 * 따로 더하기: 비례 9석 큰 몫 순서 4·4·1 → 7·10·1, 불비례 12.8.
 * 전체 먼저: 18석 큰 몫 순서 8·8·2 − 3·6·0 = 5·2·2, 불비례 3.7. 지역구만이면 22.3.
 */
const DISTRICT: readonly number[] = [3, 6, 0];

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  list: readonly number[];
  empty: readonly number[];
  share: string;
  index: string;
}[] = [
  {
    label: "공통 출발 · 지역구 9석",
    summary: "3 · 6 · 0",
    list: [0, 0, 0],
    empty: [0, 0, 0],
    share: "33.3·66.7·0",
    index: "22.3",
    note: "앞에서 본 지도 B의 지역구 결과입니다. 득표율 44·41·15와 어긋나 있습니다. 여기에 비례 9석을 더한다고 두고 두 방법을 비교합니다(가정).",
  },
  {
    label: "따로 계산해 더하기",
    summary: "3·6·0 + 4·4·1 = 7·10·1",
    list: [4, 4, 1],
    empty: [0, 0, 0],
    share: "38.9·55.6·5.6",
    index: "12.8",
    note: "비례 9석을 지역구 결과와 상관없이 득표대로 나눠 더합니다. 지역구에서 생긴 불비례는 비례 의석 수만큼만 줄어듭니다. 나당은 여전히 득표율보다 많은 의석을 얻습니다.",
  },
  {
    label: "전체 의석을 먼저 정하기",
    summary: "18석 → 8 · 8 · 2",
    list: [0, 0, 0],
    empty: [5, 2, 2],
    share: "44.4·44.4·11.1",
    index: "계산 전",
    note: "이번에는 득표율에 따라 전체 18석의 몫을 먼저 정합니다. 점선 칸이 지역구 당선 의석으로 채우지 못한 자리입니다.",
  },
  {
    label: "지역구를 뺀 나머지 채우기",
    summary: "8·8·2 − 3·6·0 = 5·2·2",
    list: [5, 2, 2],
    empty: [0, 0, 0],
    share: "44.4·44.4·11.1",
    index: "3.7",
    note: "비례 9석으로 빈 칸을 채우면 최종 의석이 먼저 정한 몫과 같아져 득표율에 더 가까워집니다. 겉으로는 같은 혼합형이고 지역구 결과도 같지만 결과를 만드는 원리가 다릅니다.",
  },
];

function Slot({ kind, color }: { kind: "district" | "list" | "empty" | "none"; color: string }) {
  if (kind === "none") return <div className="h-7 min-w-0 rounded-sm border border-dashed border-border/30" />;
  if (kind === "empty") return <div className="h-7 min-w-0 rounded-sm border border-dashed" style={{ borderColor: color }} />;
  if (kind === "district") {
    return (
      <div className="flex h-7 min-w-0 items-center justify-center rounded-sm text-[11px] font-bold text-white" style={{ backgroundColor: color }}>
        지
      </div>
    );
  }
  return (
    <div className="flex h-7 min-w-0 items-center justify-center rounded-sm border text-[11px] font-bold" style={{ borderColor: color, color, backgroundColor: `${color}26` }}>
      비
    </div>
  );
}

export default function MixedSeatsViz() {
  return (
    <SceneShell
      eyebrow="혼합 제도"
      title="따로 더하느냐 전체를 먼저 정하느냐에 따라 최종 의석이 달라집니다"
      description="지역구 9석과 비례 9석, 득표 44·41·15로 둔 예입니다(가정). 비례와 전체 몫은 앞 절의 큰 몫 순서 방식으로 계산했습니다. 칸의 '지'는 지역구, '비'는 비례 의석입니다."
      note="어느 정당도 지역구 의석이 전체 몫을 넘지 않는 경우입니다. 넘는 경우의 처리는 이 글이 다루지 않습니다."
      ariaLabel="혼합 제도의 두 방식에서 정당별 의석 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="space-y-1.5">
              {PARTY_NAMES.map((name, party) => {
                const d = DISTRICT[party];
                const l = scene.list[party];
                const e = scene.empty[party];
                return (
                  <div key={name} className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.25rem] items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: PARTY_COLORS[party] }}>
                      {name}
                    </span>
                    <div className="grid grid-cols-10 gap-0.5">
                      {Array.from({ length: 10 }, (_, slot) => {
                        const kind = slot < d ? "district" : slot < d + l ? "list" : slot < d + l + e ? "empty" : "none";
                        return <Slot key={slot} kind={kind} color={PARTY_COLORS[party]} />;
                      })}
                    </div>
                    <span className="text-right font-mono text-xs font-bold">{d + l}석</span>
                  </div>
                );
              })}
            </div>
            <dl className="grid grid-cols-[auto_auto_auto] justify-between gap-2 border-t border-border pt-3 text-xs">
              <div className="min-w-0">
                <dt className="text-muted-foreground">득표율 %</dt>
                <dd className="mt-0.5 font-mono font-bold">44·41·15</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted-foreground">{active === 2 ? "정한 몫 %" : "의석률 %"}</dt>
                <dd className="mt-0.5 font-mono font-bold">{scene.share}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted-foreground">불비례 지수</dt>
                <dd className="mt-0.5 font-mono font-bold">{scene.index}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
