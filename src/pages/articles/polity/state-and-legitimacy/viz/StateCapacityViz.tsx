import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #state-capacity — 정보 → 징세 → 집행 자원이 맞물려 있고, 그 집행 자원이
 * 앞 절 부등식의 R̄가 된다. 인구 1,000만·1인당 비용 1·가용 50만은 앞 절 예시 그대로,
 * 25만과 순응률 96%는 설명용 가정이다.
 * 필요 = (1 − p) × 1,000만 × 1 → 96%: 40만, 90%: 100만. 최소 순응률 = 1 − R̄/1,000만 → 50만: 95%, 25만: 97.5%.
 */
const POPULATION = 1000; // 만 명
const COST = 1;

const SCENES = [
  {
    label: "세 역량은 차례로 맞물립니다",
    summary: "정보 → 징세 → 집행",
    broken: -1,
    compliance: null,
    available: null,
    note: "누가 어디서 무엇을 버는지 알아야 걷을 수 있고, 걷어야 집행할 자원이 생깁니다. 정보·징세·집행이 이 순서로 서로에게 기댑니다.",
  },
  {
    label: "정보가 비면 뒤가 함께 빕니다",
    summary: "정보 ✗ → 징세 ✗ → 집행 ✗",
    broken: 0,
    compliance: null,
    available: null,
    note: "과세 대상을 모르면 세율을 아무리 정해도 걷히지 않고, 걷지 못하면 집행할 자원도 없습니다.",
  },
  {
    label: "같은 순응률, 다른 능력",
    summary: "순응 96%: 필요 40만",
    broken: -1,
    compliance: 96,
    available: [50, 25],
    note: "집행 자원은 앞 절 부등식의 R̄입니다. 순응률 96%(가정)면 필요한 자원은 4% × 1,000만 × 1 = 40만입니다. 가용 50만이면 감당되지만 25만(가정)이면 모자랍니다. 최소 순응률도 95%에서 97.5%로 오릅니다.",
  },
  {
    label: "같은 능력, 다른 순응률",
    summary: "가용 50만: 필요 40만 vs 100만",
    broken: -1,
    compliance: 90,
    available: [50],
    note: "가용 자원을 50만으로 두고 순응률만 96%(가정)에서 90%로 낮추면 필요한 자원은 100만으로 가용의 두 배가 됩니다. 능력과 정당성은 곱해지듯 작용해, 어느 한쪽이 낮아도 무너집니다.",
  },
] as const;

const LINKS = [
  { name: "정보 역량", detail: "누가 얼마를 버는지 앎" },
  { name: "징세 역량", detail: "법정 세액을 실제로 걷음" },
  { name: "집행 역량", detail: "판정을 물리적으로 관철" },
] as const;

const MAX = 100; // 만, 막대 눈금 상한

function need(compliance: number) {
  return ((100 - compliance) / 100) * POPULATION * COST;
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / MAX) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{value}만</span>
    </div>
  );
}

function CapacityBody({ active }: { active: number }) {
        const scene = SCENES[active];
        const available: readonly number[] = scene.available ?? [];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2">
              {LINKS.map((link, index) => {
                const off = scene.broken >= 0 && index >= scene.broken;
                return [
                  <div
                    key={link.name}
                    className={`min-w-0 rounded-lg border px-1 py-2 text-center text-[11px] leading-4 transition-colors duration-300 motion-reduce:transition-none sm:text-xs ${
                      off ? "border-dashed border-red-600 text-red-700 dark:text-red-400" : "border-emerald-600 bg-emerald-500/10"
                    }`}
                  >
                    <span className="block font-semibold">
                      {off ? "✗ " : "✓ "}
                      {link.name}
                    </span>
                    <span className="block text-muted-foreground">{link.detail}</span>
                  </div>,
                  index < LINKS.length - 1 ? (
                    <span key={`${link.name}-arrow`} className="text-sm text-muted-foreground" aria-hidden>
                      →
                    </span>
                  ) : null,
                ];
              })}
            </div>

            <div className="space-y-2">
              {scene.compliance === null ? (
                <p className="text-xs leading-6 text-muted-foreground sm:text-sm">
                  집행 역량이 만드는 자원이 앞 절 부등식의 &ldquo;동원 가능한 집행 자원&rdquo;입니다. 다음 장면에서 그 크기를 바꿔 봅니다.
                </p>
              ) : (
                <>
                  <Bar label={`필요 (순응 ${scene.compliance}%)`} value={need(scene.compliance)} color="#d97706" />
                  {available.map((value) => {
                    const ok = need(scene.compliance) <= value;
                    return (
                      <div key={value} className="space-y-1">
                        <Bar label={`가용${value === 25 ? " (가정)" : ""}`} value={value} color="#2563eb" />
                        <p className={`pl-[7rem] text-xs font-semibold ${ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                          {ok ? "✓ 감당됨" : "✗ 모자람"} · 최소 순응률 {100 - (value / (POPULATION * COST)) * 100}%
                        </p>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        );
}

export default function StateCapacityViz() {
  return (
    <SceneShell
      eyebrow="국가 능력"
      title="능력이 끊기면 정당성이 같아도 감당하지 못합니다"
      description="위 띠는 세 역량의 순서, 아래 막대는 앞 절 부등식의 필요 자원과 가용 자원입니다. 인구 1,000만, 한 명을 강제하는 비용 1은 앞 절 예시를 그대로 씁니다."
      note="정보·징세·집행 사이에 정확히 어떤 비율로 손실이 옮겨 가는지는 본문이 정하지 않으므로 끊김 여부만 표시했습니다."
      ariaLabel="정보, 징세, 집행 역량의 연쇄와 순응률·가용 자원의 관계"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene, index) => <CapacityBody key={scene.label} active={index} />)} />
      )}
    />
  );
}
