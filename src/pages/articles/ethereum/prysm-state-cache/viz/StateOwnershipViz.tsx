import SceneShell from "./SceneShell";

/**
 * 본문 대응: #copy-boundary — 같은 cache hit라도 caller가 받는 것이 사본인지 공유 object인지가 다르다.
 * 일반 get = Copy() 사본, NoCopy = 같은 object를 ReadOnlyBeaconState로, lock은 lookup 동안만,
 * StateByRootInitialSync = 복사 없이 mutation 후 parent root entry 삭제.
 */
const W = 360;
const H = 176;

const SCENES = [
  {
    label: "일반 StateByRoot",
    summary: "cache hit → Copy() 사본",
    note: "Cache entry가 가리키는 object는 그대로 두고, Copy()로 만든 사본을 caller에게 줍니다. Caller가 사본을 바꿔도 cache의 object와는 분리되어 있습니다.",
  },
  {
    label: "NoCopy",
    summary: "같은 object · read-only",
    note: "StateByRootNoCopy는 사본을 만들지 않고 cache에 있는 바로 그 object를 ReadOnlyBeaconState로 건넵니다. 복사 비용은 피하지만, 같은 object를 cache와 나눠 쓰므로 caller는 바꾸면 안 됩니다.",
  },
  {
    label: "Lock의 범위",
    summary: "lookup 동안만 map 보호",
    note: "Lock은 map에서 entry를 찾는 동안만 걸립니다. 반환된 뒤 공유 object를 임의로 바꾸는 행위까지 lock이 막아 주지는 않습니다.",
  },
  {
    label: "초기 동기화 예외",
    summary: "복사 없이 mutation",
    note: "StateByRootInitialSync는 선형 block batch를 전제로 cached pre-state를 복사하지 않고 바꿀 수 있습니다. 함수는 parent root entry를 나중에 hot cache에서 지우며, source는 block tree가 적용되는 일반 경로에서 쓰지 말라고 경고합니다.",
  },
] as const;

function Box({ x, y, w, h, title, sub, color, dashed }: { x: number; y: number; w: number; h: number; title: string; sub: string; color: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{title}</text>
      <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize={9.5} fill="#64748b">{sub}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, label, labelX, labelY }: { x1: number; y1: number; x2: number; y2: number; color: string; label?: string; labelX?: number; labelY?: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a1 = angle + Math.PI - 0.45;
  const a2 = angle + Math.PI + 0.45;
  const head = `${x2},${y2} ${x2 + 7 * Math.cos(a1)},${y2 + 7 * Math.sin(a1)} ${x2 + 7 * Math.cos(a2)},${y2 + 7 * Math.sin(a2)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} />
      <polygon points={head} fill={color} />
      {label && (
        <text x={labelX ?? (x1 + x2) / 2} y={labelY ?? (y1 + y2) / 2 - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{label}</text>
      )}
    </g>
  );
}

export default function StateOwnershipViz() {
  return (
    <SceneShell
      eyebrow="반환 object의 소유권"
      title="Cache hit라도 사본을 받는지, 같은 object를 빌리는지가 다릅니다"
      description="왼쪽은 hot cache의 entry, 가운데는 메모리의 BeaconState object, 오른쪽은 state를 요청한 caller입니다. 화살표는 '이 object를 가리킨다'는 뜻입니다."
      ariaLabel="일반 StateByRoot, NoCopy, lock 범위, 초기 동기화 예외에서 cache와 caller가 가리키는 object"
      scenes={SCENES}
      render={(active) => {
        const initial = active === 3;
        const shared = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 2 && (
              <g>
                <rect x={6} y={20} width={112} height={66} rx={8} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
                <text x={62} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">lock · lookup 동안</text>
                <text x={300} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">반환 뒤: lock 밖</text>
              </g>
            )}

            <Box
              x={12}
              y={30}
              w={100}
              h={46}
              title="cache entry"
              sub={initial ? "parent → pre-state" : "root → state"}
              color={initial ? "#94a3b8" : "#64748b"}
              dashed={initial}
            />
            {initial && (
              <text x={62} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">나중에 entry 삭제</text>
            )}

            <Box x={132} y={30} w={96} h={46} title="state object" sub={initial ? "cached pre-state" : "cache가 보관"} color="#64748b" />
            <Arrow x1={112} y1={53} x2={130} y2={53} color={initial ? "#94a3b8" : "#64748b"} />

            {!shared && (
              <>
                <Box x={132} y={112} w={96} h={46} title="사본" sub="Copy()로 생성" color="#2563eb" />
                <Arrow x1={180} y1={78} x2={180} y2={110} color="#2563eb" label="Copy()" labelX={204} labelY={98} />
              </>
            )}

            <Box
              x={250}
              y={shared ? 30 : 112}
              w={100}
              h={46}
              title="caller"
              sub={active === 0 ? "사본을 바꿔도 됨" : initial ? "복사 없이 바꿈" : "ReadOnly · 수정 금지"}
              color={initial ? "#dc2626" : active === 0 ? "#2563eb" : "#d97706"}
            />
            {active === 0 && <Arrow x1={248} y1={135} x2={230} y2={135} color="#2563eb" />}
            {shared && (
              <Arrow
                x1={248}
                y1={53}
                x2={230}
                y2={53}
                color={initial ? "#dc2626" : "#d97706"}
              />
            )}
            {shared && (
              <text x={180} y={104} textAnchor="middle" fontSize={10} fontWeight={700} fill={initial ? "#dc2626" : "#d97706"}>
                {initial ? "caller가 cache의 object를 복사 없이 바꿀 수 있음" : "cache와 caller가 같은 object를 가리킴"}
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
