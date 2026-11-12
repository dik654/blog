import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory-limit — memory limit이 memory.max가 된 뒤 일어나는 순서.
 * memory.max에 닿음 → page cache 회수 → 회수할 것이 없으면 cgroup 안 OOM killer가 SIGKILL
 * → 주 프로세스가 죽으면 exit 137 · OOMKilled → restartPolicy에 따라 재시작.
 * 노드 전체가 모자라면 limit 안의 컨테이너도 전역 OOM 후보가 됩니다.
 * 막대 길이는 크기를 정하지 않은 모양용 가정이며 눈금이 없습니다.
 */
const SCENES = [
  { label: "limit이 memory.max가 됨", summary: "kubelet이 그대로 씀", app: 0.5, cache: 0.28, killed: false, restarted: false, node: false, note: "kubelet은 memory limit 값을 컨테이너 cgroup의 memory.max에 그대로 씁니다. 그 뒤로 이 선을 지키는 것은 Kubernetes가 아니라 커널입니다. 막대에는 프로세스가 쓰는 메모리와 그 cgroup에 잡힌 page cache(파일을 읽고 쓰며 커널이 메모리에 남겨 둔 사본)가 함께 들어 있습니다." },
  { label: "선에 닿음", summary: "먼저 page cache 회수", app: 0.82, cache: 0.18, killed: false, restarted: false, node: false, note: "사용량이 memory.max에 닿으면 커널은 먼저 이 cgroup의 page cache를 회수합니다. 공식 문서는 이 집행을 reactively라고 적습니다. 커널이 메모리 압력을 감지했을 때만 죽이므로 닿는 순간 바로 죽지 않을 수 있습니다." },
  { label: "회수할 것이 없음", summary: "cgroup 안 OOM killer → SIGKILL", app: 1, cache: 0, killed: true, restarted: false, node: false, note: "회수할 page cache가 없으면 커널은 이 cgroup 안에서 OOM killer를 불러 프로세스 하나에 SIGKILL을 보냅니다. oom.group이 켜져 있으면 cgroup 안의 프로세스 전부가 대상입니다. 그림은 OOM killer가 주 프로세스를 골랐다고 가정했습니다. CPU limit처럼 다음 주기까지 멈췄다 이어 가는 일은 없습니다." },
  { label: "exit 137 · OOMKilled", summary: "restartPolicy에 따라 다시 뜸", app: 0.22, cache: 0.08, killed: true, restarted: true, node: false, note: "주 프로세스가 죽으면 컨테이너는 exit code 137, reason OOMKilled로 끝나고 restartPolicy에 따라 같은 Pod 안에서 다시 뜹니다. 확인할 곳은 lastState.terminated.reason, memory.events의 oom_kill, dmesg의 'Memory cgroup out of memory' 줄입니다." },
  { label: "노드 전체가 모자람", summary: "limit 안이어도 전역 OOM 후보", app: 0.6, cache: 0.12, killed: false, restarted: false, node: true, note: "자기 memory.max 아래에 있어도 노드 전체 메모리가 모자라면 이 컨테이너는 전역 OOM의 후보가 됩니다. 그 전에 노드의 memory.available이 eviction 하한 아래로 내려가면 8절의 kubelet eviction 경로가 먼저 열립니다." },
] as const;

const W = 360;
const BAR_X = 20;
const BAR_W = 300;
const BLUE = "#2563eb";
const CACHE = "#94a3b8";
const RED = "#b91c1c";
const AMBER = "#b45309";

export default function MemoryLimitPathViz() {
  return (
    <SceneShell
      eyebrow="memory limit 집행"
      title="memory.max에 닿으면 회수부터 하고, 회수할 것이 없으면 죽입니다"
      description="막대 하나가 컨테이너 하나의 cgroup 메모리이고 세로 실선이 memory.max입니다. 막대 길이는 순서를 보이려는 모양일 뿐 실제 크기가 아닙니다(가정)."
      note="5번 장면의 노드 막대도 크기가 아니라 관계만 그렸습니다. 점수 계산과 희생자 선택은 리눅스 메모리 글이 맡습니다."
      ariaLabel="memory limit에 닿은 컨테이너가 회수, OOM kill, 재시작으로 가는 순서"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const appW = s.app * BAR_W;
        const cacheW = s.cache * BAR_W;
        const lineX = BAR_X + BAR_W;
        return (
          <svg viewBox={`0 0 ${W} 176`} className="mx-auto block h-auto w-full max-w-[26rem]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            {/* 노드 전체 (5번 장면) */}
            {s.node ? (
              <g>
                <text x={BAR_X} y={14} fontSize={11.5} fontWeight={700} fill={AMBER}>노드 전체 메모리 · 거의 다 참</text>
                <rect x={BAR_X} y={20} width={BAR_W + 20} height={14} rx={3} fill="none" stroke={AMBER} />
                <rect x={BAR_X} y={20} width={BAR_W + 14} height={14} rx={3} fill="#fde68a" />
                <text x={BAR_X + 6} y={30} fontSize={11.5} fill="#78350f">이 컨테이너 + 다른 Pod들 + 시스템</text>
              </g>
            ) : (
              <text x={BAR_X} y={14} fontSize={11.5} fontWeight={700} fill="#64748b">컨테이너 cgroup 하나</text>
            )}

            {/* 컨테이너 막대 */}
            <rect x={BAR_X} y={56} width={BAR_W} height={30} rx={4} fill="none" stroke="#cbd5e1" strokeDasharray="3 3" />
            <rect x={BAR_X} y={56} width={appW} height={30} rx={4} fill={s.killed && !s.restarted ? "#fecaca" : BLUE} />
            {cacheW > 0 ? <rect x={BAR_X + appW} y={56} width={cacheW} height={30} rx={2} fill={CACHE} /> : null}
            {s.app >= 0.3 ? (
              <text x={BAR_X + 8} y={75} fontSize={11} fontWeight={700} fill={s.killed && !s.restarted ? RED : "#ffffff"}>
                {s.killed && !s.restarted ? "프로세스 메모리 · 더 줄 곳 없음" : "프로세스 메모리"}
              </text>
            ) : null}
            {cacheW >= 30 ? (
              <text x={BAR_X + appW + cacheW / 2} y={75} fontSize={11.5} textAnchor="middle" fill="#0f172a">cache</text>
            ) : null}
            <line x1={lineX} y1={44} x2={lineX} y2={98} stroke={RED} strokeWidth={1.25} />
            <text x={lineX} y={110} fontSize={11} fontWeight={700} textAnchor="end" fill={RED}>memory.max = limit</text>

            {/* 단계 표시 */}
            {active === 1 ? (
              <text x={BAR_X + appW + cacheW / 2} y={50} fontSize={10.5} fontWeight={700} textAnchor="middle" fill="#64748b">← cache 회수</text>
            ) : null}

            {/* 프로세스 줄 */}
            <text x={BAR_X} y={134} fontSize={11} fontWeight={700} fill="#64748b">프로세스</text>
            {[0, 1].map((i) => {
              const x = BAR_X + 96 + i * 108;
              const dead = s.killed && !s.restarted && i === 0;
              const fresh = s.restarted && i === 0;
              return (
                <g key={i}>
                  <rect x={x} y={120} width={100} height={22} rx={6} fill={dead ? "#fee2e2" : "none"} stroke={dead ? RED : fresh ? "#15803d" : "#94a3b8"} strokeDasharray={!dead && !fresh && i === 1 ? "3 2" : undefined} />
                  <text x={x + 50} y={135} fontSize={10.5} textAnchor="middle" fill={dead ? RED : fresh ? "#15803d" : "#64748b"} fontWeight={dead || fresh ? 700 : 400}>
                    {i === 0 ? (dead ? "주 프로세스 ✕" : fresh ? "새 주 프로세스" : "주 프로세스") : "다른 프로세스"}
                  </text>
                </g>
              );
            })}
            <text x={BAR_X} y={166} fontSize={11} fontWeight={700} fill={s.killed && !s.restarted ? RED : s.restarted ? "#15803d" : "#64748b"}>
              {s.killed && !s.restarted
                ? "SIGKILL · oom.group이면 전부"
                : s.restarted
                  ? "exit 137 · reason OOMKilled → restartPolicy"
                  : s.node
                    ? "자기 선 아래여도 전역 OOM 후보"
                    : "실행 중"}
            </text>
          </svg>
        );
      }}
    />
  );
}
