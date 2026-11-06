import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #netting-efficiency — 같은 축에서 총액과 순액을 비교한다.
 * 여섯 건 G=260·N=10 → 1−10/260=25/26≈96.15%. 첫 두 건 G=190·N=10 → 18/19≈94.74%.
 * 순포지션 절댓값 합 20은 같은 이동을 양쪽에서 적은 값이다.
 */
const AXIS_MAX = 260;

const SCENES: readonly ShellScene[] = [
  { label: "여섯 건", summary: "1 − 10/260 = 25/26 ≈ 96.15%", note: "막대 전체가 지시 금액의 합 260, 진한 조각이 차액으로 옮길 10입니다. 이 비율은 지급량이 줄어든 비율이며 위험이 줄어든 비율이 아닙니다." },
  { label: "첫 두 건만", summary: "1 − 10/190 = 18/19 ≈ 94.74%", note: "지시 집합이 달라지면 분모가 190으로 바뀌어 비율도 달라집니다. 순액이 똑같이 10이어도 그렇습니다. 총액이 0이면 나눌 수 없어 비율을 정의하지 않습니다." },
  { label: "20이 아니라 10", summary: "|−10| + |+10| = 20 → 절반인 10", note: "순포지션은 은행별로 받은 합에서 보낸 합을 뺀 값입니다. A의 지급 10과 C의 수취 10은 같은 이동을 양쪽에서 적은 것이므로, 순지급 은행 쪽이나 순수취 은행 쪽 한 줄만 셉니다." },
];

function GrossBar({ gross, net }: { gross: number; net: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground" style={{ width: `${(gross / AXIS_MAX) * 100}%` }}>
        <span>총액 {gross}</span>
        <span>줄어든 지급량 {gross - net}</span>
      </div>
      <div className="mt-1 h-7 rounded-sm bg-muted/30">
        <div className="flex h-full rounded-sm" style={{ width: `${(gross / AXIS_MAX) * 100}%`, backgroundColor: "#cbd5e1" }}>
          <div className="h-full rounded-l-sm" style={{ width: `${(net / gross) * 100}%`, backgroundColor: "#2563eb" }} />
        </div>
      </div>
      <p className="mt-1 text-xs font-semibold text-blue-700 dark:text-blue-400">왼쪽 끝 진한 조각 = 순액 {net}</p>
    </div>
  );
}

function Leg({ name, sign, counted }: { name: string; sign: string; counted: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2 ${counted ? "border-primary bg-primary/5" : "border-dashed border-border"}`}>
      <p className="text-sm font-semibold">{name}</p>
      <p className="font-mono text-lg font-bold">{sign}</p>
      <p className={`text-xs ${counted ? "font-semibold text-primary" : "text-muted-foreground"}`}>{counted ? "이쪽만 셉니다" : "같은 이동의 맞은편"}</p>
    </div>
  );
}

export default function NetShareViz() {
  return (
    <SceneShell
      eyebrow="지급량 비교"
      title="총액과 순액을 같은 눈금에 놓으면 96.15%가 보입니다"
      description="단위는 억 원입니다. 첫 두 장면의 막대는 눈금이 같아 길이를 그대로 비교할 수 있습니다."
      ariaLabel="총액 260과 190, 순액 10, 순포지션 절댓값 합 20의 비교"
      scenes={SCENES}
      render={(active) =>
        active < 2 ? (
          <GrossBar gross={active === 0 ? 260 : 190} net={10} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Leg name="A의 순지급" sign="−10" counted />
            <Leg name="C의 순수취" sign="+10" counted={false} />
          </div>
        )
      }
    />
  );
}
