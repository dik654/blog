import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #token-cashflow-control — A의 10개를 B에게 10.15에 판다(가상). 장부 평가 10.20과의 차이 .05.
 * 원자적 교환은 함께 성공하거나 되돌아간다. 결제 토큰과 은행 달러는 다르다.
 */
interface Holdings { aShare: string; aPay: string; bShare: string; bPay: string; bank: string }
const BEFORE: Holdings = { aShare: "10개", aPay: "0", bShare: "0개", bPay: "10.15", bank: "아직 없음" };
const AFTER: Holdings = { aShare: "0개", aPay: "10.15", bShare: "10개", bPay: "0", bank: "아직 없음" };

const SCENES: readonly { label: string; summary: string; note: string; step: number; hold: Holdings; hot: readonly (keyof Holdings)[]; fail?: boolean }[] = [
  { label: "자격 확인", summary: "상품 · 받을 주소", step: 0, hold: BEFORE, hot: [], note: "먼저 상품과 받을 주소의 자격을 확인합니다. 자격이 없으면 거래가 성립하지 않을 수 있습니다." },
  { label: "가격과 견적", summary: "10.20 평가 · 10.15 견적", step: 1, hold: BEFORE, hot: [], note: "평가 시각·가격과 견적 유효기간을 확인합니다. B가 10.15를 제시하고 A가 동의했다고 합시다. 장부 평가 10.20과의 차이는 0.05입니다." },
  { label: "교환 성공", summary: "A: −10개 · +10.15", step: 2, hold: AFTER, hot: ["aShare", "aPay", "bShare", "bPay"], note: "원자적 교환은 한 체인 거래 안에서 두 자산의 전달이 함께 성공하거나 함께 되돌아가는 성질입니다. 여기서는 두 전달이 함께 끝났습니다." },
  { label: "교환 실패", summary: "둘 다 처음 상태로", step: 2, hold: BEFORE, hot: ["aShare", "aPay", "bShare", "bPay"], fail: true, note: "같은 거래 안에서 전달이 실패하면 둘 다 되돌아갑니다. A가 토큰만 내주고 대금을 못 받는 상태는 이 거래 안에서 생기지 않습니다. 체인 밖 자산의 건전성까지 검사하는 것은 아닙니다." },
  { label: "은행까지", summary: "결제 토큰 ≠ 은행 달러", step: 3, hold: AFTER, hot: ["bank"], note: "교환이 성공한 경우로 돌아갑니다. 결제 토큰을 받았다는 사실과 은행의 달러를 받았다는 사실은 다릅니다. 발행자에게 상환을 신청할 자격, 수수료, 은행 송금 시각을 추가로 확인해야 하므로 은행 칸의 금액을 적지 않았습니다." },
];

const STEPS = ["자격", "견적", "교환", "은행"];

function Slot({ name, value, hot, fail }: { name: string; value: string; hot: boolean; fail?: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 ${hot ? (fail ? "border-red-600 bg-red-600/10" : "border-primary bg-primary/5") : "border-border bg-background"}`}>
      <p className="text-xs leading-5 text-muted-foreground">{name}</p>
      <p className={`font-mono text-sm leading-5 ${hot ? "font-bold" : ""}`}>{value}</p>
    </div>
  );
}

export default function SwapTraceViz() {
  return (
    <SceneShell
      eyebrow="같은 10개 따라가기"
      title="교환이 끝나도 은행 달러까지는 한 구간이 더 남습니다"
      description="가상 사례입니다. A가 B에게 지분 10개를 팔고 결제 토큰(체인에서 대금으로 쓰는 토큰)을 받습니다. 칸의 숫자는 이 거래에 걸린 몫만 적었습니다."
      ariaLabel="자격 확인, 견적, 원자적 교환, 은행 입금까지 A와 B의 보유 변화"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="min-w-0">
              <ol className="grid grid-cols-4 gap-1">
                {STEPS.map((step, index) => (
                  <li key={step} className={`rounded-md border px-1 py-1 text-center text-xs font-semibold ${index === scene.step ? (scene.fail ? "border-red-600 text-red-700 dark:text-red-400" : "border-primary text-primary") : index < scene.step ? "border-border text-muted-foreground" : "border-border/40 text-muted-foreground/50"}`}>
                    {index + 1} {step}
                  </li>
                ))}
              </ol>
              <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2">
                <p className="text-xs font-bold text-muted-foreground">A</p>
                <p className="text-xs font-bold text-muted-foreground">B</p>
                <Slot name="지분" value={scene.hold.aShare} hot={scene.hot.includes("aShare")} fail={scene.fail} />
                <Slot name="지분" value={scene.hold.bShare} hot={scene.hot.includes("bShare")} fail={scene.fail} />
                <Slot name="결제 토큰" value={scene.hold.aPay} hot={scene.hot.includes("aPay")} fail={scene.fail} />
                <Slot name="결제 토큰" value={scene.hold.bPay} hot={scene.hot.includes("bPay")} fail={scene.fail} />
                <div className="col-span-2">
                  <Slot name="A의 은행 계좌에 들어온 이 거래 대금" value={scene.hold.bank} hot={scene.hot.includes("bank")} />
                </div>
              </div>
            </div>
          ))}
        />
      )}
    />
  );
}
