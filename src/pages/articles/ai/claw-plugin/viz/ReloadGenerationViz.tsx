import PluginSceneShell from "./PluginSceneShell";

/**
 * 본문 대응: #lifecycle 마지막 문단 — reload할 때 model이 본 old schema와 새 executor가 섞이지 않도록
 * old generation을 drain하거나 stale call을 거부해야 한다. 서두 질문 3(같은 version 문자열이어도 같은 generation인가)과 이어진다.
 * 시각 t1·t2·t3과 reload 뒤에도 version 문자열이 1.2.0으로 같다는 것은 가정이다.
 */
const W = 400;
const H = 196;
const LANE_X = 92;
const Y_MODEL = 44;
const Y_GEN1 = 110;
const Y_GEN2 = 164;
const T1 = 132;
const T2 = 214;
const T3 = 300;

const SCENES = [
  { label: "model이 schema를 받습니다", summary: "t1 · gen 1 schema", note: "t1에 model은 auth-lint 1.2.0의 generation 1에서 auth_lint tool schema를 받습니다. 이후 model이 만드는 호출은 이 schema를 기준으로 합니다." },
  { label: "Reload로 generation 2", summary: "version 문자열은 그대로 1.2.0", note: "t2에 reload가 일어나 executor가 generation 2로 바뀝니다. Version 문자열이 같다고 가정해도 schema와 executor가 같다는 보장은 아닙니다. Generation은 schema와 executor를 한 묶음으로 가리키는 세대 구분이고, 여기서는 reload 전후를 1과 2로 나눴습니다." },
  { label: "섞이는 경우", summary: "old schema → new executor", note: "t3에 model이 generation 1 schema로 만든 호출을 보냅니다. 이것이 그대로 generation 2 executor에서 실행되면 model이 본 schema와 실제 실행이 어긋납니다." },
  { label: "막는 방법 ① drain", summary: "gen 1 호출은 gen 1이 끝냄", note: "Drain은 old generation을 바로 내리지 않고, 이미 그 schema로 만든 호출을 old executor가 처리한 뒤 내리는 방식입니다." },
  { label: "막는 방법 ② stale call 거부", summary: "generation 불일치 → 거부", note: "다른 방법은 호출이 가리키는 generation이 현재와 다르면 stale call로 보고 실행하지 않는 것입니다. 어느 쪽이든 old schema와 new executor가 한 호출에서 섞이지 않게 합니다." },
] as const;

export default function ReloadGenerationViz() {
  return (
    <PluginSceneShell
      eyebrow="Reload generation"
      title="Reload 뒤 도착한 호출은 어느 generation의 schema로 만들어졌는가"
      description="가로축은 시간이고 맨 위 줄은 model, 아래 두 줄은 auth-lint executor의 generation 1과 2입니다. t1·t2·t3 시각과 reload 뒤 version 문자열이 같다는 것은 가정입니다."
      ariaLabel="reload 전후 tool schema와 executor generation, stale call 처리"
      scenes={SCENES}
      render={(active) => {
        const gen1End = active === 0 ? W - 6 : active === 3 ? T3 + 34 : T2;
        const callTarget = active === 3 ? Y_GEN1 : Y_GEN2;
        const callColor = active === 2 ? "#dc2626" : active === 3 ? "#16a34a" : "#d97706";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={4} y={Y_MODEL + 4} fontSize={15} fill="#64748b">model</text>
            <text x={4} y={Y_GEN1 + 4} fontSize={15} fill="#64748b">gen 1</text>
            <text x={4} y={Y_GEN2 + 4} fontSize={15} fill="#64748b">gen 2</text>
            <line x1={LANE_X} x2={W - 6} y1={Y_MODEL} y2={Y_MODEL} stroke="#94a3b8" strokeWidth={1} />
            <rect x={LANE_X} y={Y_GEN1 - 9} width={gen1End - LANE_X} height={18} rx={4} fill="#2563eb" fillOpacity={0.15} stroke="#2563eb" strokeWidth={1} />
            <text x={LANE_X + 6} y={Y_GEN1 + 4} fontSize={14} fill="#1d4ed8">1.2.0</text>
            {active >= 1 && (
              <>
                <rect x={T2} y={Y_GEN2 - 9} width={W - 6 - T2} height={18} rx={4} fill="#0f766e" fillOpacity={0.15} stroke="#0f766e" strokeWidth={1} />
                <text x={T2 + 6} y={Y_GEN2 + 4} fontSize={14} fill="#0f766e">1.2.0 (가정)</text>
                <line x1={T2} x2={T2} y1={Y_MODEL + 6} y2={H - 8} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <text x={T2} y={14} fontSize={14} fill="#64748b" textAnchor="middle">t2 reload</text>
              </>
            )}
            <line x1={T1} x2={T1} y1={Y_GEN1 - 10} y2={Y_MODEL + 8} stroke="#2563eb" strokeWidth={1.25} />
            <polygon points={`${T1 - 4},${Y_MODEL + 10} ${T1 + 4},${Y_MODEL + 10} ${T1},${Y_MODEL + 3}`} fill="#2563eb" />
            <text x={T1} y={14} fontSize={14} fill="#64748b" textAnchor="middle">t1</text>
            <text x={T1 + 6} y={Y_MODEL + 34} fontSize={13} fill="#2563eb">schema</text>
            {active >= 2 && (
              <>
                <text x={T3} y={14} fontSize={14} fill="#64748b" textAnchor="middle">t3</text>
                <line x1={T3} x2={T3} y1={Y_MODEL + 2} y2={active === 4 ? Y_MODEL + 34 : callTarget - 12} stroke={callColor} strokeWidth={1.25} strokeDasharray={active === 2 ? "4 3" : undefined} />
                {active !== 4 && <polygon points={`${T3 - 4},${callTarget - 14} ${T3 + 4},${callTarget - 14} ${T3},${callTarget - 8}`} fill={callColor} />}
                <circle cx={T3} cy={Y_MODEL} r={5} fill={callColor} />
                <text x={T3 - 8} y={Y_MODEL - 8} fontSize={13} fill={callColor} textAnchor="end">gen 1 schema로 만든 호출</text>
              </>
            )}
            {active === 2 && <text x={T3 + 8} y={Y_GEN2 - 16} fontSize={14} fill="#dc2626" fontWeight={700}>어긋남</text>}
            {active === 3 && <text x={T3 + 8} y={Y_GEN1 - 16} fontSize={14} fill="#16a34a" fontWeight={700}>drain</text>}
            {active === 4 && (
              <>
                <line x1={T3 - 7} x2={T3 + 7} y1={Y_MODEL + 34} y2={Y_MODEL + 48} stroke="#d97706" strokeWidth={1.25} />
                <line x1={T3 + 7} x2={T3 - 7} y1={Y_MODEL + 34} y2={Y_MODEL + 48} stroke="#d97706" strokeWidth={1.25} />
                <text x={T3 - 12} y={Y_MODEL + 46} fontSize={14} fill="#d97706" fontWeight={700} textAnchor="end">stale call 거부</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
