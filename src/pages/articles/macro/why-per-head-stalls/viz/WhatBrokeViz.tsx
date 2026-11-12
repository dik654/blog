import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: what-broke 절. 숫자는 본문과 인용 2·3의 값 그대로입니다.
 * 1820 → 2022: 인구 1,042,017 → 7,802,034(천 명) = 약 7.5배, 1인당 GDP 1,127.7 → 16,676.7(2011년 달러) = 약 15배.
 * 1950 → 2022: 1인당 GDP 3,360.2 → 16,676.7(약 5배). 합계출산율 1950년 4.85 → 2023년 2.25(절반 아래).
 */
const POP_1820 = 1042017;
const POP_2022 = 7802034;
const GDP_1820 = 1127.7;
const GDP_1950 = 3360.2;
const GDP_2022 = 16676.7;
const TFR_1950 = 4.85;
const TFR_2023 = 2.25;

const POP_X = POP_2022 / POP_1820;
const GDP_X = GDP_2022 / GDP_1820;
const GDP_X_1950 = GDP_2022 / GDP_1950;
const TFR_X = TFR_2023 / TFR_1950;

const SCENES = [
  {
    label: "1820 → 2022: 둘 다 올랐습니다",
    summary: `사람 ×${POP_X.toFixed(1)} · 한 사람 몫 ×${GDP_X.toFixed(1)}`,
    note: "1820년을 1로 놓고 늘어난 배수를 그렸습니다. 고리가 닫혀 있었다면 한 사람 몫은 오르내려도 긴 눈으로 보면 한자리에 묶였을 것입니다. 실제로는 사람이 약 7.5배 느는 동안 한 사람 몫은 약 15배가 됐습니다. 여기서 한 사람 몫은 식량만이 아니라 생산 전체를 사람 수로 나눈 1인당 GDP입니다.",
  },
  {
    label: "몫이 늘던 시기에 출산은 줄었습니다",
    summary: `1인당 GDP ×${GDP_X_1950.toFixed(1)} · 출산율 ×${TFR_X.toFixed(2)}`,
    note: "고리의 마지막 화살표는 몫이 늘면 사람 수가 는다는 것입니다. 1950년 이후 세계 평균으로는 몫이 약 5배가 되는 동안 합계출산율(여성 한 명이 평생 낳을 것으로 보는 아이 수)은 절반 아래로 내려갔습니다. 두 표는 함께 움직였다는 것만 보여 주고, 소득이 출산을 줄였다는 인과까지 보여 주지는 않습니다.",
  },
  {
    label: "세 가정 중 둘이 깨졌습니다",
    summary: "깨짐 2 · 유지 1",
    note: "첫째 판정(거두는 양의 곱셈적 증가)은 이 글이 통계로 따로 확인하지 않은 일반적인 서술이고, 둘째 판정에는 앞 장면의 숫자가 붙습니다. 셋째 가정은 아직 깨지지 않았습니다. 늘어난 것은 땅이 아니라 같은 땅에서 거두는 양입니다.",
  },
] as const;

const POP = "#ef4444";
const FOOD = "#0ea5e9";
const MUTED = "#94a3b8";

function Row({
  label,
  detail,
  value,
  max,
  color,
  text,
}: {
  label: string;
  detail: string;
  value: number;
  max: number;
  color: string;
  text: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_4rem] items-end gap-x-3 gap-y-1 text-xs sm:text-sm">
      <span className="col-span-2 font-semibold">
        {label} <span className="font-normal text-muted-foreground">{detail}</span>
      </span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
        <div className="absolute -top-1 h-6 border-l border-dashed" style={{ left: `${(1 / max) * 100}%`, borderColor: "#334155" }} />
      </div>
      <span className="text-right font-mono font-bold">{text}</span>
    </div>
  );
}

function SinceIndustry() {
  const max = 16;
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">막대 = 1820년을 1로 놓은 배수 (눈금 0 ~ {max})</p>
      <div className="space-y-4">
        <Row label="사람 수" detail="약 10억 4천만 → 약 78억 명" value={POP_X} max={max} color={POP} text={`×${POP_X.toFixed(1)}`} />
        <Row
          label="한 사람 몫(1인당 GDP)"
          detail="1,128 → 16,677달러(2011년 달러)"
          value={GDP_X}
          max={max}
          color={FOOD}
          text={`×${GDP_X.toFixed(1)}`}
        />
        <p className="text-xs text-muted-foreground">세로 점선 = 1820년 수준(×1). 이 셈의 결론대로라면 한 사람 몫은 오르내려도 긴 눈으로 보면 한자리에 묶입니다.</p>
      </div>
    </div>
  );
}

function FertilityRow({
  label,
  unit,
  from,
  to,
  max,
  fromYear,
  toYear,
  color,
}: {
  label: string;
  unit: string;
  from: number;
  to: number;
  max: number;
  fromYear: string;
  toYear: string;
  color: string;
}) {
  return (
    <div className="space-y-1 text-xs sm:text-sm">
      <p className="font-semibold">
        {label} <span className="font-normal text-muted-foreground">{unit}</span>
      </p>
      {[
        { year: fromYear, v: from, strong: false },
        { year: toYear, v: to, strong: true },
      ].map((r) => (
        <div key={r.year} className="grid grid-cols-[3rem_minmax(0,1fr)_4.5rem] items-center gap-2">
          <span className="text-muted-foreground">{r.year}</span>
          <div className="h-4 min-w-0 rounded-sm bg-muted/40">
            <div className="h-full rounded-sm" style={{ width: `${(r.v / max) * 100}%`, backgroundColor: color, opacity: r.strong ? 0.9 : 0.45 }} />
          </div>
          <span className={`text-right font-mono ${r.strong ? "font-bold" : ""}`}>{r.v.toLocaleString("en-US")}</span>
        </div>
      ))}
    </div>
  );
}

function Fertility() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">두 줄은 단위가 달라 각자의 눈금으로 그렸습니다. 방향만 견줍니다.</p>
      <FertilityRow label="한 사람 몫(1인당 GDP)" unit="2011년 달러, 세계" from={Math.round(GDP_1950)} to={Math.round(GDP_2022)} max={17000} fromYear="1950" toYear="2022" color={FOOD} />
      <FertilityRow label="합계출산율" unit="여성 1명당 아이 수, 세계 평균" from={TFR_1950} to={TFR_2023} max={5} fromYear="1950" toYear="2023" color={POP} />
      <p className="text-xs text-muted-foreground">고리가 기대한 방향: 몫 ↑ → 사람 수 ↑ · 이 기간 세계 평균: 몫 ↑, 출산율 ↓</p>
    </div>
  );
}

const ASSUMPTIONS = [
  { name: "거두는 양은 같은 양씩 더해진다", verdict: "깨짐", why: "같은 땅에서 거두는 양이 곱해지는 쪽에 가깝게 바뀜 (통계로 따로 확인하지 않은 서술)" },
  { name: "몫이 늘면 사람 수가 그만큼 는다", verdict: "깨짐", why: "마지막 화살표가 약해졌고, 방향이 뒤집힌 곳도 있음" },
  { name: "땅은 늘지 않는다", verdict: "유지", why: "지금도 그렇다. 늘어난 것은 땅이 아니라 같은 땅에서 거두는 양" },
] as const;

function Verdicts() {
  return (
    <ol className="space-y-3 text-xs sm:text-sm">
      {ASSUMPTIONS.map((a, i) => {
        const broke = a.verdict === "깨짐";
        return (
          <li key={a.name} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3rem] items-start gap-2 border-l pl-3" style={{ borderColor: broke ? POP : MUTED }}>
            <span className="font-mono text-muted-foreground">{i + 1}</span>
            <span>
              <span className="block font-semibold">{a.name}</span>
              <span className="block text-muted-foreground">{a.why}</span>
            </span>
            <span className="text-right font-bold" style={{ color: broke ? POP : "#64748b" }}>
              {a.verdict}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function WhatBrokeViz() {
  return (
    <SceneShell
      eyebrow="빗나간 예측"
      title="사람도 늘고 한 사람 몫도 올랐습니다"
      description="고리가 말한 대로라면 한 사람 몫은 제자리여야 했습니다. 실제 숫자를 그 예측 옆에 놓고, 어느 가정이 깨졌는지 짚습니다."
      note="숫자는 Maddison Project Database 2023 세계 추정치와 유엔 세계인구전망 2024입니다. 배수는 그 값으로 나눈 것입니다."
      ariaLabel="1820년 이후 인구와 1인당 GDP의 배수, 1950년 이후 출산율, 세 가정의 판정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={[<SinceIndustry key="a" />, <Fertility key="b" />, <Verdicts key="c" />]} />
      )}
    />
  );
}
