import KgSceneShell from "./KgSceneShell";

/**
 * 본문 대응: #validation — staging에 쓰고 검사한 뒤 조회 경로만 kg-v42에서 kg-v43으로 넘기는 패턴.
 * node 5·edge 4·source 3은 #pipeline AlgorithmBlock의 설명용 가정 값이고,
 * edge_key는 #property-graph 의사 코드의 값입니다. 실패 항목 예시는 설명용 가정입니다.
 */

type Target = "v42" | "v43";

interface SceneData {
  label: string;
  summary: string;
  note: string;
  pointer: Target;
  staging: string;
  stagingTone: "work" | "fail" | "ok" | "live";
  detail: "none" | "fail" | "rerun" | "switch";
}

const SCENES: readonly SceneData[] = [
  {
    label: "staging에 먼저 씁니다",
    summary: "조회 경로는 kg-v42",
    note: "추출 결과는 staging에 쓰고 schema 제약, 필수 provenance와 중복 키를 검사합니다. 이 동안 조회 경로는 계속 kg-v42를 봅니다.",
    pointer: "v42",
    staging: "새 배치 · 검사 중",
    stagingTone: "work",
    detail: "none",
  },
  {
    label: "검사에 실패한 항목이 있으면",
    summary: "실패 항목은 staging에 남음",
    note: "검사를 통과하지 못한 항목은 staging에 남고 조회 경로는 바뀌지 않습니다. 실패한 배치가 현재 서비스 그래프에 섞이는 범위를 줄이는 것이 목적입니다.",
    pointer: "v42",
    staging: "실패 항목 격리",
    stagingTone: "fail",
    detail: "fail",
  },
  {
    label: "같은 입력을 다시 처리하면",
    summary: "node 5 · edge 4 그대로",
    note: "같은 입력을 다시 처리했을 때 node와 edge 수가 늘지 않는지도 확인합니다. source_id를 포함한 edge_key가 실행마다 같으면 MERGE가 기존 edge를 재사용합니다.",
    pointer: "v42",
    staging: "재처리 검사",
    stagingTone: "work",
    detail: "rerun",
  },
  {
    label: "검증이 끝난 버전으로 전환",
    summary: "조회 경로 → kg-v43",
    note: "검증된 node 5개와 edge 4개만 kg-v43에 기록하고 조회 경로를 전환합니다. 이 원자적 전환을 transaction, 별도 database, snapshot, alias, version pointer 가운데 무엇이 보장하는지는 구현마다 확인해야 합니다.",
    pointer: "v43",
    staging: "검증된 node 5 · edge 4 · 조회 대상",
    stagingTone: "live",
    detail: "switch",
  },
];

const TONE = { work: "#64748b", fail: "#dc2626", ok: "#059669", live: "#2563eb" } as const;

function VersionBox({ title, body, color, pointed }: { title: string; body: string; color: string; pointed: boolean }) {
  return (
    <div className="min-w-0 rounded-md border px-3 py-2" style={{ borderColor: color, borderWidth: pointed ? 1.25 : 1 }}>
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2">
        <span className="font-mono text-xs font-bold">{title}</span>
        <span className="text-[11px] font-bold" style={{ color: pointed ? "#2563eb" : "#94a3b8" }}>
          {pointed ? "← 조회 경로" : "조회 안 됨"}
        </span>
      </div>
      <p className="mt-1 break-keep text-[11px] leading-4 text-muted-foreground">{body}</p>
    </div>
  );
}

export default function VersionSwitchViz() {
  return (
    <KgSceneShell
      eyebrow="검증 · 버전 전환 · 설명용 사례"
      title="새 결과는 staging에서 검사하고, 통과한 뒤에만 조회 경로를 옮깁니다"
      description="위 칸은 기존 공개 버전 kg-v42, 아래 칸은 새 배치가 쓰이는 staging(전환 뒤 kg-v43)입니다. ‘← 조회 경로’ 표시가 붙은 쪽을 서비스가 조회합니다."
      note="kg-v42·kg-v43과 node·edge 수는 설명용 가정입니다. 이 전환은 이해를 위한 안전한 패턴이며 모든 graph DB가 제공하는 자동 기능이 아닙니다."
      ariaLabel="staging 검사와 조회 경로 전환 네 장면"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="grid min-w-0 content-start gap-2">
              <VersionBox
                title={scene.pointer === "v42" ? "kg-v42 · 공개" : "kg-v42 · 이전 버전"}
                body={scene.pointer === "v42" ? "현재 서비스 그래프" : "유지 중 · 조회 경로는 떠남"}
                color="#64748b"
                pointed={scene.pointer === "v42"}
              />
              <VersionBox
                title={scene.pointer === "v43" ? "kg-v43" : "staging"}
                body={scene.staging}
                color={TONE[scene.stagingTone]}
                pointed={scene.pointer === "v43"}
              />
            </div>
            <div className="min-w-0 rounded-md border border-border p-3 text-xs leading-5">
              {scene.detail === "none" && (
                <ul className="grid gap-1">
                  {["유형 제약", "필수 source_id", "중복 edge_key", "재처리 시 수 불변"].map((item) => (
                    <li key={item} className="border-l-2 border-border pl-2 text-muted-foreground">{item} 검사 대기</li>
                  ))}
                </ul>
              )}
              {scene.detail === "fail" && (
                <div className="grid gap-2">
                  <p className="border-l-2 pl-2 font-semibold" style={{ borderColor: TONE.fail }}>예: source_id가 빠진 edge 하나 (가정)</p>
                  <p className="text-muted-foreground">→ staging에 남김 · 공개 버전에 섞지 않음</p>
                  <p className="text-muted-foreground">→ 조회 경로 변경 없음</p>
                  <p className="text-muted-foreground">이 사례의 edge 4개는 이 검사를 통과했다고 가정합니다.</p>
                </div>
              )}
              {scene.detail === "rerun" && (
                <div className="grid gap-2">
                  <div className="grid grid-cols-[4.5rem_repeat(2,minmax(0,1fr))] gap-1 text-center">
                    <span />
                    <span className="font-bold text-muted-foreground">node</span>
                    <span className="font-bold text-muted-foreground">edge</span>
                    <span className="text-left font-bold">1회 처리</span>
                    <span className="font-mono font-bold">5</span>
                    <span className="font-mono font-bold">4</span>
                    <span className="text-left font-bold">다시 처리</span>
                    <span className="font-mono font-bold" style={{ color: TONE.ok }}>5</span>
                    <span className="font-mono font-bold" style={{ color: TONE.ok }}>4</span>
                  </div>
                  <p className="break-all font-mono text-[11px] text-muted-foreground">edge_key d-22:m-03:reported:m-05 → 같은 key, 같은 edge</p>
                </div>
              )}
              {scene.detail === "switch" && (
                <div className="grid gap-2">
                  <p className="border-l-2 pl-2 font-semibold" style={{ borderColor: TONE.live }}>조회 경로: kg-v42 → kg-v43</p>
                  <p className="text-muted-foreground">검증된 node 5개 · edge 4개 · source 3건</p>
                  <p className="text-muted-foreground">전환 수단은 구현마다 다름: transaction · 별도 database · snapshot · alias · version pointer</p>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
