import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 설명용 승진 장부(실제 기업 통계 아님). 칸 하나가 한 사람이다.
 * 여성 40명 중 8명 → 8/40 = 20%, 남성 60명 중 18명 → 18/60 = 30%, 차이 10%p.
 * 차이가 생겼을 수 있는 자리 세 곳은 본문이 숫자를 주지 않으므로 칸에 나누지 않는다.
 */
const GROUPS = [
  { name: "여성", total: 40, promoted: 8 },
  { name: "남성", total: 60, promoted: 18 },
] as const;

const PLACES: readonly string[] = ["특정 부서 배치", "같은 부서 안의 평가", "후보가 되기 전 이탈"];

const SCENES = [
  { label: "심사 대상 100명", summary: "여성 40 · 남성 60", promoted: false, places: false, note: "칸 하나가 한 사람입니다. 이 숫자는 실제 기업 통계가 아니라 분석 순서를 보여 주는 설명용 예입니다." },
  { label: "승진한 사람", summary: "8/40 = 20% · 18/60 = 30%", promoted: true, places: false, note: "채운 칸이 승진한 사람입니다. 여성은 40명 중 8명, 남성은 60명 중 18명이라 승진율 차이는 30 − 20 = 10%포인트입니다." },
  { label: "차이는 어디서 생겼나", summary: "10%p = 원인이 아니라 신호", promoted: true, places: true, note: "같은 10%포인트라도 부서 배치, 같은 부서 안의 평가, 후보가 되기 전 이탈 가운데 어디서 생겼는지는 평균만으로 알 수 없어 단계별로 봅니다. 본문은 각 자리의 숫자를 주지 않으므로 칸을 나누지 않았습니다." },
] as const;

function PersonGrid({ total, promoted, showPromoted }: { total: number; promoted: number; showPromoted: boolean }) {
  return (
    <ol className="grid grid-cols-10 gap-[2px] sm:gap-[3px]">
      {Array.from({ length: total }, (_, index) => {
        const filled = showPromoted && index < promoted;
        return (
          <li
            key={index}
            className="aspect-square min-w-0 rounded-[3px] transition-colors duration-300 motion-reduce:transition-none"
            style={{ borderWidth: 1, borderStyle: "solid", borderColor: filled ? "#2563eb" : "#94a3b8", backgroundColor: filled ? "#2563eb" : "transparent" }}
          />
        );
      })}
    </ol>
  );
}

export default function PromotionGapViz() {
  return (
    <SceneShell
      eyebrow="평균 아래"
      title="20%와 30%라는 두 숫자가 가리는 경로"
      description="1절의 승진 심사 100명을 칸으로 놓았습니다. 빈 칸은 승진하지 않은 사람, 채운 파란 칸은 승진한 사람입니다(설명용 예)."
      ariaLabel="여성 40명 중 8명, 남성 60명 중 18명 승진과 차이가 생겼을 수 있는 세 자리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {GROUPS.map((group) => (
                <div key={group.name} className="min-w-0">
                  <p className="mb-2 flex flex-wrap justify-between gap-x-2 text-xs sm:text-sm">
                    <span className="font-semibold">{group.name} {group.total}명</span>
                    <span className="font-mono text-muted-foreground">
                      {scene.promoted ? `${group.promoted}명 · ${Math.round((group.promoted / group.total) * 100)}%` : "−"}
                    </span>
                  </p>
                  <PersonGrid total={group.total} promoted={group.promoted} showPromoted={scene.promoted} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PLACES.map((place) => (
                <div
                  key={place}
                  className="min-w-0 rounded-md px-2 py-2 text-xs leading-5 sm:px-3"
                  style={{ borderWidth: 1, borderStyle: "dashed", borderColor: scene.places ? "#d97706" : "#e2e8f0", color: scene.places ? undefined : "#94a3b8" }}
                >
                  <span className="font-semibold">{place}</span>
                  <span className="block">{scene.places ? "여기서? 숫자 미정" : "아직 묻지 않음"}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
