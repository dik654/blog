import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mount — 전파 유형. 뒤늦게 만든 mount가 건너가는 방향만 본다.
 * shared 양방향, private 단절, slave 호스트→컨테이너 한 방향. 런타임 기본 private, HostToContainer가 slave.
 */
const SCENES = [
  { label: "shared", summary: "양방향", toContainer: true, toHost: true, note: "호스트에서 새로 마운트한 것이 컨테이너 안에도 나타나고, 컨테이너에서 새로 마운트한 것도 호스트에 나타납니다." },
  { label: "private", summary: "단절 · 컨테이너 런타임의 기본", toContainer: false, toHost: false, note: "bind가 끝난 뒤에는 어느 쪽에서 새로 마운트해도 건너가지 않습니다. 컨테이너 런타임의 기본이 이것입니다." },
  { label: "slave", summary: "호스트 → 컨테이너 한 방향", toContainer: true, toHost: false, note: "호스트의 새 mount는 컨테이너에 나타나지만 반대로는 가지 않습니다. Kubernetes volumeMount의 mountPropagation: HostToContainer가 이것입니다." },
] as const;

const OK = "#16a34a";
const OFF = "#94a3b8";

function Lane({ y, on, toRight, text }: { y: number; on: boolean; toRight: boolean; text: string }) {
  const color = on ? OK : OFF;
  const [x1, x2] = toRight ? [122, 238] : [238, 122];
  const dir = toRight ? -1 : 1;
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "4 3"} />
      <path d={`M${x2 + dir * 7} ${y - 4} L${x2} ${y} L${x2 + dir * 7} ${y + 4}`} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} />
      {!on && <path d={`M175 ${y - 6} L185 ${y + 6} M185 ${y - 6} L175 ${y + 6}`} stroke="#dc2626" strokeWidth={1.25} />}
      <text x={180} y={y - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? OK : "#64748b"}>{text}</text>
    </g>
  );
}

export default function MountPropagationViz() {
  return (
    <SceneShell
      eyebrow="전파 유형"
      title="나중에 만든 mount가 어느 쪽으로 건너가는가"
      description="왼쪽이 호스트, 오른쪽이 컨테이너입니다. 실선은 건너감, 점선과 X는 건너가지 않음입니다."
      ariaLabel="shared, private, slave 전파 방향"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <svg viewBox="0 0 360 132" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            <rect x={10} y={14} width={112} height={104} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={66} y={62} textAnchor="middle" fontSize={13} fontWeight={700} fill="#475569">호스트</text>
            <text x={66} y={82} textAnchor="middle" fontSize={11} fill="#64748b">mount 표</text>
            <rect x={238} y={14} width={112} height={104} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={294} y={62} textAnchor="middle" fontSize={13} fontWeight={700} fill="#475569">컨테이너</text>
            <text x={294} y={82} textAnchor="middle" fontSize={11} fill="#64748b">mount 표</text>
            <Lane y={50} on={s.toContainer} toRight text={s.toContainer ? "새 mount 나타남" : "안 건너감"} />
            <Lane y={104} on={s.toHost} toRight={false} text={s.toHost ? "새 mount 나타남" : "안 건너감"} />
          </svg>
        );
      }}
    />
  );
}
