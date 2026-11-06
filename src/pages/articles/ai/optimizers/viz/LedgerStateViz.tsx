import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #parts — 현재 값, 변화율 합, 개수를 담는 세 칸의 상태 변화.
 * 3·0·0 → 3·4·2 → 3·32·8 → 평균 4 → 2.6 → 2.6·0·0. 마지막 장면은 앞 묶음 직후 덮어쓴 잘못된 분기.
 */
interface LedgerScene extends ShellScene {
  theta: string;
  sum: string;
  count: string;
  doing: string;
  changed: readonly ("theta" | "sum" | "count")[];
  wrong?: boolean;
}

const SCENES: readonly LedgerScene[] = [
  { label: "시작", summary: "현재 값 3 · 합 0 · 개수 0", theta: "3", sum: "0", count: "0", doing: "아직 자료를 읽지 않았습니다.", changed: [], note: "현재 값을 보관하는 칸, 변화율을 더하는 칸, 개수를 세는 칸이 따로 있습니다." },
  { label: "첫 묶음 2개", summary: "합 +4 · 개수 +2", theta: "3", sum: "4", count: "2", doing: "현재 값 3에서 계산한 변화율 합 4를 더합니다.", changed: ["sum", "count"], note: "묶음 계산을 끝냈지만 현재 값은 3 그대로 둡니다." },
  { label: "둘째 묶음 6개", summary: "합 +28 · 개수 +6", theta: "3", sum: "32", count: "8", doing: "같은 현재 값 3에서 계산한 변화율 합 28을 더합니다.", changed: ["sum", "count"], note: "두 묶음이 모두 같은 지점에서 계산됐으므로 그 합을 같은 함수의 변화율로 다룰 수 있습니다." },
  { label: "평균 내고 한 번 이동", summary: "32 ÷ 8 = 4 · 3 − 0.4 = 2.6", theta: "2.6", sum: "32", count: "8", doing: "평균 4에 이동 크기 0.1을 곱해 현재 값에서 뺍니다.", changed: ["theta"], note: "평균을 만드는 계산과 3에서 0.4를 빼는 계산은 다른 단계입니다. 현재 값이 바뀌는 곳은 여기 한 번입니다." },
  { label: "합계 지우기", summary: "합 0 · 개수 0", theta: "2.6", sum: "0", count: "0", doing: "다음 갱신을 위해 합과 개수를 비웁니다.", changed: ["sum", "count"], note: "지우지 않으면 다음 갱신에서 같은 값을 중복해서 더합니다." },
  { label: "만약 먼저 덮어쓰면", summary: "둘째 묶음의 시작점이 3이 아님", theta: "3이 아닌 값", sum: "4", count: "2", doing: "첫 묶음 직후 현재 값을 고치면 둘째 묶음은 다른 지점에서 계산됩니다.", changed: ["theta"], wrong: true, note: "이렇게 하면 뒤 묶음의 변화율은 같은 함수의 같은 지점에서 구한 값이 아닙니다. 위 순서와 다른 잘못된 분기입니다." },
];

function Slot({ name, value, changed, wrong }: { name: string; value: string; changed: boolean; wrong?: boolean }) {
  const box = wrong ? "border-red-600" : changed ? "border-primary bg-primary/5" : "border-border bg-background";
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-3 text-center ${box}`}>
      <p className="text-xs leading-5 text-muted-foreground">{name}</p>
      <p className={`mt-1 min-h-14 font-mono font-bold ${value.length > 4 ? "text-sm leading-7" : "text-2xl"} ${wrong ? "text-red-700 dark:text-red-400" : ""}`}>{value}</p>
      <p className={`text-xs ${changed ? "font-semibold" : "text-muted-foreground/60"}`}>{changed ? "바뀜" : "그대로"}</p>
    </div>
  );
}

export default function LedgerStateViz() {
  return (
    <SceneShell
      eyebrow="세 칸의 상태"
      title="합이 쌓이는 동안 현재 값은 움직이지 않습니다"
      description="칸 세 개의 숫자가 장면마다 어떻게 바뀌는지 봅니다. 묶음 크기 2와 6, 변화율 합 4와 28, 이동 크기 0.1은 첫 사례의 가정입니다 (가정)."
      ariaLabel="현재 값, 변화율 합, 개수 칸의 상태 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-2">
              <Slot name="현재 값" value={scene.theta} changed={scene.changed.includes("theta")} wrong={scene.wrong} />
              <Slot name="변화율 합" value={scene.sum} changed={scene.changed.includes("sum")} />
              <Slot name="개수" value={scene.count} changed={scene.changed.includes("count")} />
            </div>
            <p className="mt-3 text-sm font-semibold leading-6">{scene.doing}</p>
          </div>
        );
      }}
    />
  );
}
