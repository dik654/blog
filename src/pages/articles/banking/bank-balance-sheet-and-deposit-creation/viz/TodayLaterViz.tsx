import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits(22 중복 계산)·#maturity-transformation — 14+86=92+8에서 예금 20 지급 요구.
 * 두 막대는 같은 축척. 14 < 20이라 부족 6. 100−92=8은 장부 잔여이지 별도 현금이 아니다.
 */
const U = 3.3;
const X0 = 15;
const px = (v: number) => X0 + v * U;
const A_Y = 34;
const B_Y = 106;
const BAR = 36;

const SCENES = [
  { label: "오늘 요구 20, 오늘 돈 14", summary: "20 − 14 = 6 부족", focus: "gap", extra: "오늘 보낼 수 있는 칸과 오늘 요구받은 칸의 차이입니다.", note: "상환까지 끝난 A은행에 예금 92 중 20의 지급 요구가 들어온 사례입니다. 왼쪽을 맞춰 놓으면 준비금 14가 요구 20에 6 모자랍니다." },
  { label: "86은 나중에 돌아오는 돈", summary: "대출 86 · 장부에 있는 것만으로는 지급 못 함", focus: "later", extra: "만기 변환: 짧은 시점에 인출될 수 있는 부채로 더 긴 자산을 보유하는 일입니다.", note: "대출 86이 장부에 있다는 사실만으로 오늘의 지급 지시가 완료되지는 않습니다. 고객은 필요할 때 잔액을 쓰고 공장은 긴 기간 기계를 쓰며 갚습니다." },
  { label: "14 + 8로 세면 안 됩니다", summary: "22는 중복 계산", focus: "equity", extra: "자본 8은 자산 100에서 부채 92를 뺀 잔여입니다. 별도의 현금 칸이 아닙니다.", note: "13절의 경고입니다. 8을 준비금 14에 더하면 22가 되어 요구 20을 넘는 것처럼 보이지만, 같은 자산의 잔여 지분을 현금처럼 두 번 세는 계산입니다." },
  { label: "질문이 두 개입니다", summary: "오늘 현금화 · 끝내 회수", focus: "both", extra: "유동성은 오늘 현금화할 수 있는지, 지급 능력은 만기까지 기다리면 회수할 가치가 충분한지 묻습니다.", note: "이 장부에서는 오늘 6이 부족해도 장부상 자산은 부채보다 8 많습니다. 다만 두 판단에는 불확실성이 있을 수 있고, 한쪽 문제가 다른 쪽으로 번질 수 있습니다." },
] as const;

function Seg({ from, to, y, label, color, on }: { from: number; to: number; y: number; label: string; color: string; on: boolean }) {
  return (
    <g opacity={on ? 1 : 0.55}>
      <rect x={px(from)} y={y} width={(to - from) * U} height={BAR} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1} />
      <text x={(px(from) + px(to)) / 2} y={y + 23} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function TodayLaterViz() {
  return (
    <SceneShell
      eyebrow="같은 장부, 다른 시점"
      title="자산이 100이어도 오늘 지급에 쓸 칸은 14입니다"
      description="단위는 억 원이고 두 막대의 축척은 같습니다. 칸의 너비는 금액이며, 대출이 언제 돌아오는지는 이 사례에서 정하지 않았습니다."
      ariaLabel="예금 20 지급 요구와 준비금 14, 대출 86, 자본 8의 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const f = s.focus;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 184" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
              <text x={X0} y={A_Y - 9} fontSize={13} fontWeight={700} fill="#64748b">자산 100 = 준비금 14 + 대출 86</text>
              <Seg from={0} to={14} y={A_Y} label="14" color="#2563eb" on={f !== "later"} />
              <Seg from={14} to={100} y={A_Y} label="대출 86 (나중)" color="#64748b" on={f === "later" || f === "both"} />
              <text x={X0} y={B_Y + BAR + 16} fontSize={13} fontWeight={700} fill="#64748b">부채·자본 100 = 예금 20 + 72 + 자본 8</text>
              <Seg from={0} to={20} y={B_Y} label="20" color="#d97706" on={f === "gap" || f === "both"} />
              <Seg from={20} to={92} y={B_Y} label="나머지 예금 72" color="#64748b" on={false} />
              <Seg from={92} to={100} y={B_Y} label="8" color="#16a34a" on={f === "equity" || f === "both"} />
              {(f === "gap" || f === "both") && (
                <g>
                  <rect x={px(14)} y={A_Y + BAR + 1} width={6 * U} height={B_Y - A_Y - BAR - 2} fill="#dc2626" fillOpacity={0.14} />
                  <line x1={px(14)} x2={px(14)} y1={A_Y} y2={B_Y + BAR} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
                  <line x1={px(20)} x2={px(20)} y1={A_Y} y2={B_Y + BAR} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
                  <text x={px(20) + 6} y={A_Y + BAR + 19} fontSize={13} fontWeight={700} fill="#dc2626">부족 6</text>
                </g>
              )}
              {f === "equity" && (
                <text x={px(100)} y={B_Y + BAR + 34} textAnchor="end" fontSize={13} fontWeight={700} fill="#16a34a">100 − 92 = 8 (잔여)</text>
              )}
            </svg>
            <p className="mt-2 rounded-lg border border-border/60 px-3 py-2 text-xs leading-5 text-muted-foreground">{s.extra}</p>
          </div>
        );
      }}
    />
  );
}
