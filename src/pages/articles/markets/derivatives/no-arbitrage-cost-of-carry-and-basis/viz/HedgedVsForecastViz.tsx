import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 미래 현물이 80이든 130이든 선물만 든 사람의 손익은 갈리지만,
 * 3절의 복제 묶음(100 차입 → 지수 매수 → 선물 108 매도)은 같은 값이 남는다.
 * 선물 매수자: S − 108 → 80: −28, 130: +22. 선물 매도자(현물 없음): 108 − S → +28, −22.
 * 복제 묶음: 108 − 105 + 2 = +5 (만기 지수는 넘겨주므로 S와 무관).
 */
const FUT = 108;
const REPAY = 105;
const DIV = 2;
const LOCKED = FUT - REPAY + DIV;

const SCENES = [
  { label: "만기 현물 80", spot: 80, summary: "매수자 −28 · 매도자 +28 · 묶음 +5", note: "선물만 산 사람은 80짜리 지수를 108에 사야 해서 28을 잃고, 선물만 판 사람은 28을 얻습니다. 지수를 들고 선물을 판 묶음은 지수를 넘기고 108을 받아 105를 갚고, 받은 배당 2를 더해 5가 남습니다." },
  { label: "만기 현물 130", spot: 130, summary: "매수자 +22 · 매도자 −22 · 묶음 +5", note: "현물이 130이면 선물만 든 두 사람의 손익이 뒤집힙니다. 묶음은 이번에도 지수를 넘기고 108을 받으므로 남는 값이 5로 같습니다. 미래 현물이 묶음 손익에 들어가지 않는다는 점이 4절의 구분입니다." },
] as const;

const SCALE = 30;

function Row({ label, sub, value, color }: { label: string; sub: string; value: number; color: string }) {
  const width = (Math.abs(value) / SCALE) * 50;
  return (
    <div className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:grid-cols-[10rem_minmax(0,1fr)_3.25rem] sm:text-sm">
      <span className="min-w-0 leading-5">
        <span className="block font-semibold">{label}</span>
        <span className="block text-[11px] text-muted-foreground">{sub}</span>
      </span>
      <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
        <div className="absolute inset-y-0 left-1/2 w-px bg-[#94a3b8]" />
        <div
          className="absolute inset-y-0 rounded-sm transition-all duration-300 motion-reduce:transition-none"
          style={{ width: `${width}%`, left: value >= 0 ? "50%" : `${50 - width}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-right font-mono font-bold" style={{ color }}>{value > 0 ? "+" : value < 0 ? "−" : ""}{Math.abs(value)}</span>
    </div>
  );
}

export default function HedgedVsForecastViz() {
  return (
    <SceneShell
      eyebrow="전망과 복제 비용"
      title="미래 현물이 달라도 복제 묶음에 남는 값은 같습니다"
      description="가운데 세로선이 0이고 오른쪽이 이익, 왼쪽이 손실입니다. 선물 약정가 108과 3절의 장부(100 차입, 원리금 105, 배당 2, 거래비용·세금 없음)를 그대로 씁니다. 복제 묶음은 100을 빌려 지수를 사고 선물을 108에 판 3절의 거래입니다."
      ariaLabel="만기 현물이 80일 때와 130일 때 선물 매수자, 선물 매도자, 복제 묶음의 만기 손익 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <Row label="선물 매수자" sub={`현물 ${scene.spot} − 약정 108`} value={scene.spot - FUT} color="#2563eb" />
            <Row label="선물 매도자" sub={`약정 108 − 현물 ${scene.spot}`} value={FUT - scene.spot} color="#d97706" />
            <Row label="복제 묶음" sub="108 − 105 + 배당 2" value={LOCKED} color="#16a34a" />
            <div className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3rem] gap-2 text-[11px] text-muted-foreground sm:grid-cols-[10rem_minmax(0,1fr)_3.25rem]">
              <span />
              <span className="flex justify-between font-mono"><span>−30</span><span>0</span><span>+30</span></span>
              <span />
            </div>
          </div>
        );
      }}
    />
  );
}
