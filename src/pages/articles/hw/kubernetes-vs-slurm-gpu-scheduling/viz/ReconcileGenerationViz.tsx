import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 두 번째 문단 — GPU Operator(controller)가 구분해야 하는
 * spec 세대와 처리한 세대, update 충돌, 같은 event 재전달, 삭제 전 정리.
 * 숫자 7·8은 실물 4의 예시 출력(generation=7/observedGeneration=7 → generation=8/observedGeneration=7)이다.
 * 잘못된 구현·안전한 경계 문구는 "Operator가 같은 객체를 안전하게 되돌리는 원장" 표의 행이다.
 */
interface Scene {
  label: string;
  summary: string;
  note: string;
  generation: number;
  observed: number;
  ready: string;
  deletion: string;
  wrong: string;
  safe: string;
  lagging: boolean;
}

const SCENES: readonly Scene[] = [
  {
    label: "수렴한 상태",
    summary: "7 = 7 · Ready",
    note: "spec 세대와 controller가 처리했다고 기록한 세대가 같습니다. 이때의 Ready는 현재 spec을 처리한 결과입니다.",
    generation: 7,
    observed: 7,
    ready: "True",
    deletion: "없음",
    wrong: "Ready=True 한 줄만 봄",
    safe: "두 세대가 같을 때의 Ready만 현재 spec의 결과로 읽음",
    lagging: false,
  },
  {
    label: "사용자가 spec을 바꿈",
    summary: "8 ≠ 7 · Ready는 옛 결과",
    note: "spec 세대가 8로 올랐지만 처리한 세대는 아직 7입니다. 화면의 Ready=True는 이전 세대의 결과일 수 있습니다.",
    generation: 8,
    observed: 7,
    ready: "True · 옛 결과일 수 있음",
    deletion: "없음",
    wrong: "Ready=True를 새 spec의 완료로 읽음",
    safe: "observedGeneration 7 < generation 8 → 아직 처리 전",
    lagging: true,
  },
  {
    label: "status만 바뀐 event",
    summary: "새 설치 요청이 아님",
    note: "controller가 status를 고칠 때도 event가 옵니다. 이것까지 새 설치 요청으로 처리하면 status가 바뀔 때마다 controller가 자기 자신을 다시 깨우는 loop가 됩니다.",
    generation: 8,
    observed: 7,
    ready: "True · 옛 결과일 수 있음",
    deletion: "없음",
    wrong: "status 갱신도 새 설치 요청으로 처리",
    safe: "spec 변경과 status-only event를 구분하고 condition으로 완료 표시",
    lagging: true,
  },
  {
    label: "두 worker가 같은 객체를 update",
    summary: "409 Conflict",
    note: "다른 쪽이 먼저 객체를 고쳐 resourceVersion(객체의 현재 버전 표시)이 달라지면 HTTP 409가 돌아옵니다. 오래된 객체를 그대로 다시 보내지 않고 최신 객체를 읽어 제한된 횟수만 재시도합니다.",
    generation: 8,
    observed: 7,
    ready: "True · 옛 결과일 수 있음",
    deletion: "없음",
    wrong: "오래된 객체를 그대로 재전송",
    safe: "최신 객체를 다시 읽어 RetryOnConflict",
    lagging: true,
  },
  {
    label: "새 spec 처리 완료",
    summary: "8 = 8 · Ready",
    note: "controller가 세대 8을 처리했다고 기록하면 두 숫자가 다시 같아집니다. 이제 Ready는 현재 spec의 결과입니다.",
    generation: 8,
    observed: 8,
    ready: "True",
    deletion: "없음",
    wrong: "—",
    safe: "처리한 세대를 기록하고 condition으로 완료 표시",
    lagging: false,
  },
  {
    label: "같은 event가 다시 옴",
    summary: "이미 맞으면 no-op",
    note: "같은 event가 재전달돼도 결과가 달라지면 안 됩니다. desired와 observed가 이미 같으면 외부 작업을 새로 만들지 않고 끝냅니다.",
    generation: 8,
    observed: 8,
    ready: "True",
    deletion: "없음",
    wrong: "매번 외부 작업을 다시 생성",
    safe: "Reconcile을 idempotent하게 · 이미 맞으면 no-op",
    lagging: false,
  },
  {
    label: "삭제 요청",
    summary: "정리 확인 뒤 finalizer 제거",
    note: "finalizer는 외부 정리를 마칠 때까지 객체를 지우지 않고 남겨 두는 표시입니다. 삭제 요청이 오면 driver 같은 외부 산출물을 정리했는지 확인한 뒤 자기 finalizer만 제거합니다.",
    generation: 8,
    observed: 8,
    ready: "True",
    deletion: "삭제 시각 기록 · finalizer 남음",
    wrong: "외부 driver artifact를 남긴 채 CR(custom resource) 삭제",
    safe: "외부 정리를 확인한 뒤 자기 finalizer만 제거",
    lagging: false,
  },
];

function Tile({ name, meaning, value, alert = false }: { name: string; meaning: string; value: string; alert?: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border bg-background px-3 py-2 ${alert ? "border-red-600/70" : "border-border"}`}>
      <p className="break-words font-mono text-[11px] font-semibold text-muted-foreground">{name}</p>
      <p className="break-words text-[11px] leading-4 text-muted-foreground">{meaning}</p>
      <p className={`mt-1 break-words font-mono font-bold ${value.length > 6 ? "text-xs leading-5" : "text-sm"} ${alert ? "text-red-700 dark:text-red-400" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

export default function ReconcileGenerationViz() {
  return (
    <SceneShell
      eyebrow="Operator의 되돌리기"
      title="Ready=True만 보면 옛 결과를 새 완료로 읽을 수 있습니다"
      description="GPU Operator는 GPU driver 같은 노드 준비 상태를 선언한 값으로 되돌리는 controller입니다. 위 칸은 그 Operator가 관리하는 객체의 상태 필드이고, 아래는 같은 사건에서 잘못된 구현과 안전한 경계입니다. 숫자 7·8은 이 절 끝 실물 4의 예시 출력이며 실측이 아닙니다."
      ariaLabel="spec 세대와 처리한 세대, 충돌, 재전달, 삭제에서 controller가 하는 일"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 grid-cols-2 gap-2 lg:grid-cols-4">
              <Tile name="generation" meaning="spec 세대" value={String(scene.generation)} />
              <Tile name="observedGeneration" meaning="처리한 세대" value={String(scene.observed)} alert={scene.lagging} />
              <Tile name="Ready" meaning="완료 condition" value={scene.ready} alert={scene.lagging} />
              <Tile name="삭제 상태" meaning="삭제 시각·finalizer" value={scene.deletion} />
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <div className="min-w-0 rounded-lg border border-dashed border-red-600/60 px-3 py-2">
                <p className="text-xs font-bold text-red-700 dark:text-red-400">✕ 잘못된 구현</p>
                <p className="mt-1 break-words text-xs leading-5 sm:text-sm sm:leading-6">{scene.wrong}</p>
              </div>
              <div className="min-w-0 rounded-lg border border-emerald-600/60 px-3 py-2">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">✓ 안전한 경계</p>
                <p className="mt-1 break-words text-xs leading-5 sm:text-sm sm:leading-6">{scene.safe}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
