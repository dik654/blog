import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sandbox-boundary — hook 출력과 rule 결과가 만나는 세 경우,
 * 그리고 permission이 허용한 뒤에도 따로 남는 층.
 * 앞 세 장면: hook allow는 matching deny·ask를 우회하지 못하고, exit 2 같은 blocking hook는 allow된 call도 멈춘다.
 * 마지막 장면: file tool rule 밖의 Bash subprocess 경로와 credential·filesystem·network·외부 서비스 층.
 */
interface HookScene {
  label: string;
  summary: string;
  note: string;
  call: string;
  hook: string;
  rule: string;
  final: string;
  stopped: boolean;
}

const SCENES: readonly HookScene[] = [
  {
    label: "hook allow + deny 맞음",
    summary: "결과: deny",
    call: "rm -rf build",
    hook: "allow 반환",
    rule: "deny 맞음",
    final: "deny · 차단 유지",
    stopped: true,
    note: "PreToolUse hook가 allow를 돌려줘도 matching deny를 건너뛰지 못합니다. 첫 절의 세 번째 질문에 대한 답입니다.",
  },
  {
    label: "hook allow + ask 맞음",
    summary: "결과: ask",
    call: "git push origin main",
    hook: "allow 반환",
    rule: "ask 맞음",
    final: "ask · 여전히 사용자에게 묻기",
    stopped: false,
    note: "ask도 같습니다. hook의 allow가 사용자 승인을 대신하지 못하므로 call은 사용자의 새 결정을 기다립니다.",
  },
  {
    label: "blocking hook + allow 맞음",
    summary: "결과: 멈춤",
    call: "npm test",
    hook: "exit 2 (blocking)",
    rule: "allow 맞음",
    final: "멈춤 · rule상 허용이어도",
    stopped: true,
    note: "방향은 한쪽만 열려 있습니다. allow를 돌려주는 hook는 deny·ask를 풀지 못하지만, exit 2 같은 blocking hook는 permission상 허용된 call도 먼저 멈출 수 있습니다.",
  },
  {
    label: "permission 밖에 남는 층",
    summary: "file tool rule ≠ 전체 격리",
    call: "Bash subprocess",
    hook: "",
    rule: "",
    final: "",
    stopped: false,
    note: "File tool rule만으로는 Bash subprocess가 file에 닿는 모든 접근을 막았다고 볼 수 없습니다. 그래서 credential scope·filesystem sandbox·network policy·외부 서비스 권한을 별도 층으로 둡니다.",
  },
];

const LAYERS = ["credential scope", "filesystem sandbox", "network policy", "외부 서비스 권한"] as const;

function DecisionPanel({ scene }: { scene: HookScene }) {
  return (
    <div className="min-w-0">
      <div className="rounded-lg border border-border bg-background px-3 py-2 text-center">
        <span className="block text-xs text-muted-foreground">Bash call</span>
        <code className="block break-all font-mono text-sm font-bold">{scene.call}</code>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="min-w-0 rounded-lg border border-border bg-background px-2 py-2 text-center">
          <span className="block text-[11px] text-muted-foreground">PreToolUse hook</span>
          <span className="block text-sm font-bold">{scene.hook}</span>
        </div>
        <div className="min-w-0 rounded-lg border border-border bg-background px-2 py-2 text-center">
          <span className="block text-[11px] text-muted-foreground">deny·ask·allow rule</span>
          <span className="block text-sm font-bold">{scene.rule}</span>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">둘이 만나면</p>
      <div
        className={`mt-2 rounded-lg border px-3 py-2 text-center text-sm font-bold ${
          scene.stopped ? "border-red-600 text-red-700 dark:text-red-400" : "border-amber-600 text-amber-700 dark:text-amber-400"
        }`}
      >
        {scene.final}
      </div>
    </div>
  );
}

function LayerPanel() {
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-2 gap-2">
        <div className="min-w-0 rounded-lg border border-primary bg-primary/10 px-2 py-2 text-center">
          <span className="block text-[11px] text-muted-foreground">file tool 경로</span>
          <span className="block text-sm font-bold">file tool rule 대상</span>
        </div>
        <div className="min-w-0 rounded-lg border border-dashed border-border px-2 py-2 text-center">
          <span className="block text-[11px] text-muted-foreground">Bash subprocess 경로</span>
          <span className="block text-sm font-bold">rule만으로 다 막혔다고 볼 수 없음</span>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">그래서 permission과 따로 두는 층</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {LAYERS.map((layer) => (
          <div key={layer} className="min-w-0 rounded-lg border border-border bg-background px-2 py-2 text-center text-sm font-semibold">
            {layer}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HookLayerViz() {
  return (
    <SceneShell
      eyebrow="hook와 sandbox"
      title="hook allow는 rule을 풀지 못하고, permission은 격리 전체가 아닙니다"
      description="앞의 세 장면은 같은 call에서 hook 출력과 rule 결과가 만날 때 무엇이 남는지, 마지막 장면은 permission 판정 밖에 따로 두는 층을 보여 줍니다."
      note="제품 version과 조직 설정에 따라 mod가 뒤에서 일부 결정을 바꿀 수 있어, managed policy와 실제 runtime 구성을 함께 고정합니다."
      ariaLabel="hook 출력과 permission rule이 만나는 세 경우와 permission 밖의 격리 층"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene, index) =>
            index === SCENES.length - 1 ? <LayerPanel key={scene.label} /> : <DecisionPanel key={scene.label} scene={scene} />,
          )}
        />
      )}
    />
  );
}
