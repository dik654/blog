import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names 셋째 문단 — 리카도의 숫자 사례.
 * 같은 자본·노동으로 1·2·3등급 땅이 100·90·80쿼터. 경작이 넓어질수록 마지막 땅의 생산이 기준선이 된다.
 * 지대 = 각 땅의 생산 − 마지막 경작지의 생산: 2등급까지 → 1등급 10, 3등급까지 → 1등급 20·2등급 10. 마지막 땅은 0.
 * 막대 높이는 0부터 그린 실제 비율이다(최대 100).
 */
const OUTPUT = [100, 90, 80] as const;
const OUTPUTS: readonly number[] = OUTPUT;
const BAR_H = 168;

const SCENES = [
  { label: "1등급 땅만 경작", summary: "지대 없음", reach: 1, note: "1등급 땅만 경작하는 동안은 비교할 더 나쁜 땅이 없어 지대가 생기지 않습니다. 점선은 아직 경작하지 않은 땅입니다." },
  { label: "인구가 늘어 2등급까지", summary: "1등급 지대 10쿼터", reach: 2, note: "2등급 땅이 같은 자본과 노동으로 90쿼터를 내면, 1등급 땅은 그보다 10쿼터를 더 냅니다. 이 차이 10쿼터가 1등급 땅의 지대가 되고 마지막에 경작된 2등급 땅은 지대를 내지 않습니다." },
  { label: "3등급까지 경작", summary: "1등급 20 · 2등급 10 · 3등급 0", reach: 3, note: "기준선이 80쿼터로 내려가자 2등급 땅에 10쿼터, 1등급 땅에 20쿼터의 지대가 생깁니다. 땅의 생산은 그대로인데 마지막 경작지가 바뀌어 지대가 늘었습니다. 비옥도나 위치 차이에서 생기는 이 몫을 차액지대라고 부릅니다." },
] as const;

export default function RicardoRentLadderViz() {
  return (
    <SceneShell
      eyebrow="리카도의 숫자 사례"
      title="마지막에 경작한 땅이 기준이 되어 지대가 생깁니다"
      description="막대 하나가 같은 자본과 노동을 들인 땅 한 등급의 곡물 생산입니다(쿼터는 곡물을 재는 단위). 빨간 점선이 마지막에 경작된 땅의 생산이고, 그 위로 올라온 부분이 지대입니다."
      ariaLabel="리카도 사례에서 경작이 1등급에서 3등급 땅으로 넓어질 때 각 땅의 지대 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const margin = OUTPUTS[scene.reach - 1];
        const lineBottom = (margin / 100) * BAR_H;
        return (
          <div className="mx-auto min-w-0 max-w-[30rem]">
            <div className="relative grid grid-cols-3 items-end gap-3 sm:gap-6" style={{ height: BAR_H + 22 }}>
              <div className="pointer-events-none absolute inset-x-0 z-10 border-t border-dashed transition-[bottom] duration-300 motion-reduce:transition-none" style={{ bottom: lineBottom, borderColor: "#dc2626" }}/>
              {OUTPUTS.map((output, index) => {
                const farmed = index < scene.reach;
                const rent = farmed ? output - margin : 0;
                const height = (output / 100) * BAR_H;
                const rentHeight = (rent / 100) * BAR_H;
                return (
                  <div key={output} className="relative flex h-full flex-col justify-end">
                    <span className="mb-1 text-center font-mono text-xs font-bold" style={{ color: rent > 0 ? "#b45309" : "#64748b" }}>
                      {farmed ? `지대 ${rent}` : "미경작"}
                    </span>
                    <div
                      className="relative w-full overflow-hidden rounded-t-sm border"
                      style={{ height, borderColor: farmed ? "#64748b" : "#cbd5e1", borderStyle: farmed ? "solid" : "dashed", backgroundColor: farmed ? "#e2e8f0" : "transparent" }}
                    >
                      <div className="absolute inset-x-0 top-0 transition-[height] duration-300 motion-reduce:transition-none" style={{ height: rentHeight, backgroundColor: "#d97706" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3 text-center text-xs sm:gap-6">
              {OUTPUTS.map((output, index) => (
                <div key={output} className="leading-5">
                  <span className="block font-semibold">{index + 1}등급 땅</span>
                  <span className="block font-mono text-muted-foreground">{output}쿼터</span>
                </div>
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#d97706" }} />지대(마지막 경작지보다 더 나는 몫)</li>
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border align-middle" style={{ backgroundColor: "#e2e8f0", borderColor: "#64748b" }} />마지막 경작지와 같은 생산</li>
              <li><span className="mr-1 inline-block w-4 border-t border-dashed align-middle" style={{ borderColor: "#dc2626" }} />마지막 경작지 생산 <span className="font-mono font-semibold">{margin}쿼터</span></li>
            </ul>
          </div>
        );
      }}
    />
  );
}
