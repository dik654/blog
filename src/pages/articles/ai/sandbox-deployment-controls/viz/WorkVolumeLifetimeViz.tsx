import SceneShell from "./SceneShell";

/**
 * 본문 대응: #writable-surface — 컨테이너 종료와 Pod 삭제는 다른 사건이고,
 * /work emptyDir은 Pod 수명을, 외부 object storage 결과는 별도 보존 정책을 따른다.
 * 가로축은 사건 순서일 뿐 시간 비례가 아니다. 재시작과 업로드 시점은 설명용 가정.
 */
const EVENTS = [
  { x: 30, label: "① 배치" },
  { x: 100, label: "② 재시작" },
  { x: 170, label: "③ exit 0" },
  { x: 240, label: "④ Pod 삭제" },
] as const;
const END_X = 296;
const UPLOAD_X = 145;

const SCENES = [
  { label: "Pod 배치", summary: "/work emptyDir 생성", cut: 0, note: "Pod가 노드에 배치될 때 /work emptyDir이 생깁니다. 루트 파일시스템은 읽기 전용이라 중간 파일은 /work에만 씁니다." },
  { label: "컨테이너 재시작 (가정)", summary: "컨테이너는 다시 뜨고 /work는 그대로", cut: 1, note: "같은 Pod 안에서 컨테이너가 재시작돼도 Pod는 남아 있으므로 /work의 데이터도 유지됩니다. 재시작이 일어나는 시점은 설명용 가정입니다." },
  { label: "exit 0 · Job 완료", summary: "컨테이너 종료 ≠ Pod 삭제", cut: 2, note: "generator가 exit 0으로 끝나도 완료된 Pod가 남아 있으면 /work도 남습니다. 결과는 그 전에 object gateway로 올라가 외부에 있습니다(업로드 시점은 가정)." },
  { label: "Pod 삭제", summary: "/work 정리 · 외부 결과는 남음", cut: 3, note: "TTL이나 운영자가 Pod를 삭제해야 Pod 수명에 묶인 emptyDir이 정리됩니다. 외부 object storage의 결과는 이 사건으로 지워지지 않고 만료·사용자 삭제 같은 별도 보존 정책을 따릅니다." },
] as const;

const TRACKS = [
  { y: 56, name: "Pod", color: "#64748b" },
  { y: 98, name: "컨테이너", color: "#2563eb" },
  { y: 140, name: "/work emptyDir", color: "#d97706" },
  { y: 182, name: "외부 결과", color: "#16a34a" },
] as const;

function Bar({ y, from, to, cut, color }: { y: number; from: number; to: number; cut: number; color: string }) {
  const end = Math.min(to, cut);
  if (end <= from) return null;
  return <rect x={from} y={y - 6} width={end - from} height="12" rx="3" fill={color} fillOpacity="0.55" stroke={color} strokeWidth="1" />;
}

export default function WorkVolumeLifetimeViz() {
  return (
    <SceneShell
      eyebrow="세 가지 수명"
      title="컨테이너가 끝나도 /work는 Pod가 삭제될 때까지 남습니다"
      description="img-job-91의 Pod, generator 컨테이너, /work emptyDir, 외부에 올린 결과가 각각 언제 생기고 사라지는지 사건 순서대로 놓았습니다. 가로축은 순서일 뿐 시간 길이에 비례하지 않습니다."
      note="막대의 길이는 실제 시간이 아닙니다. 재시작이 일어나는지와 업로드 시점은 설명용 가정이며, 실제 Pod 삭제 시점은 TTL이나 운영자 설정이 정합니다."
      ariaLabel="Pod 배치, 컨테이너 재시작, 컨테이너 종료, Pod 삭제 사건에 따라 Pod, 컨테이너, emptyDir, 외부 결과의 존재 구간이 달라지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        // 각 장면은 그 사건 직후부터 다음 사건 직전까지의 상태를 보인다. exit 0 장면에서
        // /work·Pod 막대가 컨테이너 막대보다 길게 이어져야 "컨테이너가 끝나도 남는다"가 읽힌다.
        const cut = scene.cut === EVENTS.length - 1 ? END_X : (EVENTS[scene.cut].x + EVENTS[scene.cut + 1].x) / 2;
        const [placed, restart, exit, removed] = EVENTS;
        return (
          <svg viewBox="0 0 300 196" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="사건 순서에 따른 네 가지 존재 구간">
            {EVENTS.map((e, i) => (
              <g key={e.label}>
                <line x1={e.x} y1="28" x2={e.x} y2="192" stroke={i === scene.cut ? "#2563eb" : "#94a3b8"} strokeWidth={i === scene.cut ? 1.25 : 1} strokeDasharray={i === scene.cut ? undefined : "3 3"} opacity={i <= scene.cut ? 1 : 0.35} />
                <text x={e.x} y="16" textAnchor={i === 0 ? "start" : "middle"} fontSize="10" fontWeight={i === scene.cut ? 700 : 400} fill="currentColor" opacity={i <= scene.cut ? 1 : 0.45}>{e.label}</text>
              </g>
            ))}
            {TRACKS.map((t) => (
              <text key={t.name} x="4" y={t.y - 11} fontSize="10" fontWeight="700" fill="currentColor">{t.name}</text>
            ))}
            <Bar y={TRACKS[0].y} from={placed.x} to={removed.x} cut={cut} color={TRACKS[0].color} />
            <Bar y={TRACKS[1].y} from={placed.x} to={restart.x - 6} cut={cut} color={TRACKS[1].color} />
            <Bar y={TRACKS[1].y} from={restart.x + 4} to={exit.x} cut={cut} color={TRACKS[1].color} />
            <Bar y={TRACKS[2].y} from={placed.x} to={removed.x} cut={cut} color={TRACKS[2].color} />
            <Bar y={TRACKS[3].y} from={UPLOAD_X} to={END_X} cut={cut} color={TRACKS[3].color} />
            {cut > UPLOAD_X && <text x={UPLOAD_X} y={TRACKS[3].y - 11} fontSize="10" fill="#16a34a">업로드</text>}
            {scene.cut === 3 && <text x={removed.x + 5} y={TRACKS[2].y + 4} fontSize="10" fill="#d97706">정리됨</text>}
            {scene.cut === 3 && <text x={END_X} y={TRACKS[3].y - 11} textAnchor="end" fontSize="10" fill="#16a34a">별도 보존 →</text>}
          </svg>
        );
      }}
    />
  );
}
