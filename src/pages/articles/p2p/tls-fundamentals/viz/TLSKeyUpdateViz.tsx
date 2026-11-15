import SceneShell from "./SceneShell";

/**
 * 본문 대응: #key-schedule — KeyUpdate는 현재 application traffic secret에서 다음 세대를 만들고
 * 이전 세대를 지운다. 과거 레코드는 보호되지만 현재 secret을 얻은 공격자는 이후 세대를 계산한다.
 * 미래를 다시 안전하게 하려면 비대칭 키 교환을 포함한 새 핸드셰이크·새 연결이 필요하다.
 * 세대 수(0~4)와 노출 시점(세대 2)은 설명용 가정이다.
 */
const GENS = [0, 1, 2, 3, 4] as const;
const LEAK = 2;

type CellState = "live" | "deleted" | "future" | "leaked" | "derived";

const SCENES = [
  {
    label: "다음 세대는 현재 secret에서 나옵니다",
    summary: "세대 0 → 1 → 2 → …",
    note: "KeyUpdate는 현재 application traffic secret에서 다음 세대 secret을 만듭니다. 세대마다 그 secret으로 보호한 레코드 묶음이 따로 있습니다. 세대 수는 설명을 위한 가정입니다.",
  },
  {
    label: "이전 세대는 지웁니다",
    summary: "세대 2 사용 중 · 0과 1 삭제",
    note: "다음 세대로 넘어가면 이전 세대 secret을 지웁니다. 지운 secret은 끝점 메모리에 남지 않으므로, 그 세대로 보호한 과거 레코드를 보호합니다.",
  },
  {
    label: "현재 secret이 새면 그 뒤 세대는 모두 계산됩니다",
    summary: "세대 2 노출 → 3, 4도 노출",
    note: "공격자가 세대 2 secret을 얻었다고 가정합니다. 이미 지운 세대 0과 1의 레코드는 여전히 보호되지만, 세대 3과 4는 세대 2에서 결정적으로 나오므로 공격자도 똑같이 계산합니다. KeyUpdate를 더 해도 이 노출은 풀리지 않습니다.",
  },
  {
    label: "미래를 되찾으려면 새 핸드셰이크가 필요합니다",
    summary: "새 연결 · 새 키 교환 · 새 사슬",
    note: "비대칭 키 교환을 포함한 새 핸드셰이크와 새 연결을 맺으면, 새 사슬은 노출된 세대 2에서 이어지지 않습니다. 기존 연결의 세대 3·4가 노출됐다는 사실은 그대로입니다.",
  },
] as const;

const STYLE: Record<CellState, { stroke: string; text: string; dash?: string; caption: string }> = {
  live: { stroke: "#2563eb", text: "#2563eb", caption: "사용" },
  deleted: { stroke: "#94a3b8", text: "#94a3b8", dash: "3 3", caption: "삭제" },
  future: { stroke: "#64748b", text: "#64748b", caption: "다음" },
  leaked: { stroke: "#dc2626", text: "#dc2626", caption: "노출" },
  derived: { stroke: "#dc2626", text: "#dc2626", dash: "3 3", caption: "계산됨" },
};

function stateOf(gen: number, active: number): CellState {
  if (active === 0) return gen === 0 ? "live" : "future";
  if (gen < LEAK) return "deleted";
  if (active === 1) return gen === LEAK ? "live" : "future";
  return gen === LEAK ? "leaked" : "derived";
}

const CELL_W = 56;
const GAP = 14;
const X0 = 12;
const cx = (gen: number) => X0 + gen * (CELL_W + GAP);

export default function TLSKeyUpdateViz() {
  return (
    <SceneShell
      eyebrow="KeyUpdate"
      title="세대를 넘기면 과거는 지켜지지만 미래는 되돌아오지 않습니다"
      description="네모 하나가 application traffic secret의 한 세대이고, 화살표는 현재 세대에서 다음 세대를 만드는 방향입니다. 세대 수와 노출 시점은 설명용 가정입니다."
      ariaLabel="KeyUpdate 세대 사슬에서 삭제, 노출, 새 핸드셰이크의 효과"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={X0} y={14} fontSize={11} fontWeight={700} fill="#475569">
            기존 연결
          </text>
          {GENS.map((gen) => {
            const state = stateOf(gen, active);
            const style = STYLE[state];
            return (
              <g key={gen}>
                <rect x={cx(gen)} y={24} width={CELL_W} height={40} rx={8} fill="none" stroke={style.stroke} strokeWidth={1} strokeDasharray={style.dash} />
                <text x={cx(gen) + CELL_W / 2} y={41} textAnchor="middle" fontSize={11} fontWeight={700} fill={style.text}>
                  세대 {gen}
                </text>
                <text x={cx(gen) + CELL_W / 2} y={56} textAnchor="middle" fontSize={10} fill={style.text}>
                  {style.caption}
                </text>
                <text x={cx(gen) + CELL_W / 2} y={82} textAnchor="middle" fontSize={10} fill={style.text}>
                  {state === "deleted" ? "보호" : state === "leaked" || state === "derived" ? "읽힘 가능" : "레코드"}
                </text>
                {gen < GENS.length - 1 && (
                  <g>
                    <line x1={cx(gen) + CELL_W + 1} x2={cx(gen + 1) - 5} y1={44} y2={44} stroke="#64748b" strokeWidth={1} />
                    <path d={`M ${cx(gen + 1) - 1} 44 l -6 -3.5 l 0 7 z`} fill="#64748b" />
                  </g>
                )}
              </g>
            );
          })}
          <g opacity={active === 3 ? 1 : 0.12}>
            <text x={X0} y={112} fontSize={11} fontWeight={700} fill="#059669">
              새 연결 · 새 키 교환
            </text>
            {[0, 1].map((gen) => (
              <g key={gen}>
                <rect x={cx(gen + 3)} y={122} width={CELL_W} height={40} rx={8} fill="none" stroke="#059669" strokeWidth={1} />
                <text x={cx(gen + 3) + CELL_W / 2} y={146} textAnchor="middle" fontSize={11} fontWeight={700} fill="#059669">
                  새 {gen}
                </text>
              </g>
            ))}
            <line x1={cx(3) + CELL_W + 1} x2={cx(4) - 5} y1={142} y2={142} stroke="#059669" strokeWidth={1} />
            <path d={`M ${cx(4) - 1} 142 l -6 -3.5 l 0 7 z`} fill="#059669" />
            <text x={cx(3) - 8} y={146} textAnchor="end" fontSize={10} fill="#059669">
              세대 2와 연결 없음
            </text>
          </g>
        </svg>
      )}
    />
  );
}
