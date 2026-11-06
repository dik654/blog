import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #config-drift, #boundary — 원하는 상태와 실제 상태를 항목별로 맞춰 본다.
 * 출처 셋: 사람의 SSH, 노드 안 자동화, 재부팅. 적지 않은 상태는 비교되지 않아 재부팅 뒤에야 드러난다.
 * 노드 셋과 값 이름은 설명용 가정이다.
 */
interface Row {
  name: string;
  desired: string;
  nodes: readonly [string, string, string];
}

const ROWS_BY_SCENE: readonly (readonly Row[])[] = [
  [
    { name: "패키지 버전", desired: "v1", nodes: ["v1", "v1", "v1"] },
    { name: "설정 파일", desired: "c1", nodes: ["c1", "c1", "c1"] },
    { name: "메모리의 sysctl", desired: "안 적음", nodes: ["s1", "s1", "s1"] },
  ],
  [
    { name: "패키지 버전", desired: "v1", nodes: ["v1", "v1", "v1"] },
    { name: "설정 파일", desired: "c1", nodes: ["손수정", "c1", "c1"] },
    { name: "메모리의 sysctl", desired: "안 적음", nodes: ["s1", "s1", "s1"] },
  ],
  [
    { name: "패키지 버전", desired: "v1", nodes: ["v1", "v2", "v1"] },
    { name: "설정 파일", desired: "c1", nodes: ["손수정", "c1", "c1"] },
    { name: "메모리의 sysctl", desired: "안 적음", nodes: ["s1", "s1", "s1"] },
  ],
  [
    { name: "패키지 버전", desired: "v1", nodes: ["v1", "v2", "v1"] },
    { name: "설정 파일", desired: "c1", nodes: ["손수정", "c1", "c1"] },
    { name: "메모리의 sysctl", desired: "안 적음", nodes: ["s1", "s1", "사라짐"] },
  ],
];

const SCENES = [
  { label: "맞춰 보기", summary: "drift 0건", table: 0, note: "drift_check는 적힌 두 줄만 노드와 비교합니다. 셋째 줄처럼 적지 않은 값은 비교할 대상이 없습니다." },
  { label: "출처 1: 사람의 SSH", summary: "drift 1건", table: 1, note: "노드 A의 설정을 손으로 고쳤습니다. 다음 배포 때 덮이거나 영원히 남습니다." },
  { label: "출처 2: 노드 안의 자동화", summary: "drift 2건", table: 2, note: "unattended-upgrades 같은 자동화가 파이프라인 모르게 노드 B의 패키지를 바꿨습니다." },
  { label: "출처 3: 재부팅", summary: "건수는 그대로 2건", table: 3, note: "재부팅이 메모리에만 있던 값을 지웠습니다. 적지 않은 값이라 건수에 잡히지 않고 재부팅 뒤에야 드러납니다." },
  { label: "감지한 뒤의 두 갈래", summary: "수렴 또는 기록", table: 3, note: "어느 쪽이든 건수를 지표로 두면 둘째 경로가 열려 있는지 사고 전에 알 수 있습니다." },
] as const;

const COUNTS = [0, 1, 2, 2, 2] as const;

function Cell({ value, desired }: { value: string; desired: string }) {
  const compared = desired !== "안 적음";
  const differ = compared ? value !== desired : value === "사라짐";
  return (
    <span className={`rounded-md border px-1 py-1 text-center font-mono text-xs leading-5 ${differ ? "border-red-600 font-bold text-red-700 dark:text-red-400" : "border-border/60 text-muted-foreground"}`}>{value}</span>
  );
}

export default function DriftTableViz() {
  return (
    <SceneShell
      eyebrow="원하는 상태와 실제 상태"
      title="적어 둔 값과 다르면 건수로 잡히고, 적지 않은 값은 비교되지 않습니다"
      description="원하는 상태는 코드로 적어 둔 값, 노드 열은 실제 상태입니다. 빨간 칸이 달라진 곳입니다."
      note="(가정) 노드 셋과 v1·c1·s1 같은 값 이름은 설명용입니다. sysctl은 커널 설정값입니다."
      ariaLabel="원하는 상태와 세 노드의 실제 상태 비교, drift 출처 세 가지와 감지 후 처리"
      scenes={SCENES}
      render={(active) => {
        const rows = ROWS_BY_SCENE[SCENES[active].table];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))] items-center gap-1 text-xs">
              {["항목", "원하는 상태", "노드 A", "노드 B", "노드 C"].map((head) => (
                <span key={head} className="text-center text-[11px] font-bold leading-4 text-muted-foreground">{head}</span>
              ))}
              {rows.map((row) => (
                <div key={row.name} className="contents">
                  <span className="text-xs font-semibold leading-4">{row.name}</span>
                  <span className="rounded-md border border-primary/60 px-1 py-1 text-center font-mono text-xs leading-5 text-primary">{row.desired}</span>
                  {row.nodes.map((value, index) => (
                    <Cell key={index} value={value} desired={row.desired} />
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-sm font-bold">{`drift_check 건수: ${COUNTS[active]}`}</p>
            <StableSceneStack
              active={active === 4 ? 1 : 0}
              className="mt-2"
              scenes={[
                <div key="off" />,
                <div key="on" className="grid gap-1 text-xs leading-4 sm:grid-cols-2 sm:gap-1.5 sm:leading-5">
                  <p className="rounded-md border border-border/70 px-2 py-1"><b>자동 되돌리기(수렴):</b> 급히 고친 것도 지워짐</p>
                  <p className="rounded-md border border-primary/60 px-2 py-1"><b>되돌리기 전 기록:</b> 왜 달라졌는지 남김 · 더 안전</p>
                </div>,
              ]}
            />
          </div>
        );
      }}
    />
  );
}
