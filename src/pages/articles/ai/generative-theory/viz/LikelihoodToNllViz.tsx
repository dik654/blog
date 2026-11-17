import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #evaluation — interpretation의 두 sample(probability .8, .25)을 공식 세 줄대로 계산한다.
 * L = .8 × .25 = .2, ℓ = ln .8 + ln .25 ≈ −0.223 − 1.386 = −1.609, NLL = 1.609 / 2 ≈ .805.
 * 마지막 장면은 같은 두 sample 쌍을 반복했다는 가정에서 L이 0.2^k로 줄어도 NLL은 .805로 남는 것을 보인다.
 */
const P1 = 0.8;
const P2 = 0.25;
const L = P1 * P2;
const LOG1 = Math.log(P1);
const LOG2 = Math.log(P2);
const ELL = LOG1 + LOG2;
const NLL = -ELL / 2;

const SCENES = [
  {
    label: "두 sample의 probability",
    summary: "p(x₁)=.8 · p(x₂)=.25",
    note: "Model이 첫 observation에 .8, 둘째에 .25를 줬습니다. 막대 길이가 probability이고 오른쪽 끝이 1입니다.",
  },
  {
    label: "곱하면 likelihood",
    summary: ".8 × .25 = .2",
    note: "두 sample을 독립으로 평가하므로 probability를 곱합니다. 곱한 값 .2는 두 값 어느 것보다도 작습니다.",
  },
  {
    label: "log를 취하면 합",
    summary: "−0.223 + (−1.386) ≈ −1.609",
    note: "log는 곱을 합으로 바꿉니다. 1보다 작은 probability의 log는 음수라서 ℓ도 음수입니다. 이 막대는 크기만 그리고 부호는 숫자로 적었습니다.",
  },
  {
    label: "부호를 뒤집고 N으로 나누기",
    summary: "1.609 ÷ 2 ≈ .805",
    note: "부호를 뒤집어 양수로 만들고 sample 수 N=2로 나누면 평균 NLL ≈ .805입니다. 작을수록 model이 관측에 높은 probability를 준 것입니다.",
  },
  {
    label: "같은 쌍을 반복하면 (가정)",
    summary: "L → 0 · NLL은 .805",
    note: "같은 두 sample을 k번 반복했다고 가정하면 L은 0.2를 k번 곱해 금세 0에 가까워지지만, log 합은 −1.609씩 늘고 N으로 나눈 NLL은 그대로입니다. 같은 NLL만으로 image가 더 자연스러운지는 알 수 없습니다.",
  },
] as const;

const fmt = (value: number) => `${value < 0 ? "−" : ""}${Math.abs(value).toFixed(3)}`;

function Row({ label, value, width, shown, tone }: { label: string; value: string; width: number; shown: boolean; tone: string }) {
  return (
    <div className={`grid grid-cols-[5.5rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-xs sm:text-sm ${shown ? "" : "opacity-20"}`}>
      <span className="font-mono">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${shown ? width * 100 : 0}%`, backgroundColor: tone }} />
      </div>
      <span className="text-right font-mono font-bold">{shown ? value : ""}</span>
    </div>
  );
}

function StepPanel({ active }: { active: number }) {
  return (
    <div className="min-w-0 space-y-2">
      <p className="text-[11px] text-muted-foreground">probability 막대: 끝 = 1</p>
      <Row label="p(x₁)" value=".800" width={P1} shown tone="#64748b" />
      <Row label="p(x₂)" value=".250" width={P2} shown tone="#64748b" />
      <Row label="L = 곱" value=".200" width={L} shown={active >= 1} tone="#2563eb" />
      <p className="pt-2 text-[11px] text-muted-foreground">log 막대: 끝 = 크기 2, 부호는 숫자로</p>
      <Row label="log p(x₁)" value={fmt(LOG1)} width={-LOG1 / 2} shown={active >= 2} tone="#d97706" />
      <Row label="log p(x₂)" value={fmt(LOG2)} width={-LOG2 / 2} shown={active >= 2} tone="#d97706" />
      <Row label="ℓ = 합" value={fmt(ELL)} width={-ELL / 2} shown={active >= 2} tone="#d97706" />
      <Row label="NLL = −ℓ/2" value={fmt(NLL)} width={NLL / 2} shown={active >= 3} tone="#16a34a" />
    </div>
  );
}

const REPEATS = [
  { k: 1, likelihood: ".2" },
  { k: 5, likelihood: "3.2×10⁻⁴" },
  { k: 50, likelihood: "1.1×10⁻³⁵" },
] as const;

function RepeatPanel() {
  return (
    <div className="min-w-0 space-y-2">
      <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_4.25rem_2.75rem] gap-2 text-[11px] text-muted-foreground">
        <span>N</span>
        <span>L (끝 = .2)</span>
        <span className="text-right">ℓ</span>
        <span className="text-right">NLL</span>
      </div>
      {REPEATS.map(({ k, likelihood }) => {
        const value = L ** k;
        return (
          <div key={k} className="grid grid-cols-[3.5rem_minmax(0,1fr)_4.25rem_2.75rem] items-center gap-2 text-xs sm:text-sm">
            <span className="font-mono">N = {2 * k}</span>
            <div className="min-w-0">
              <div className="h-4 rounded-sm bg-muted/40">
                <div className="h-full rounded-sm" style={{ width: `${(value / L) * 100}%`, backgroundColor: "#2563eb" }} />
              </div>
              <span className="mt-0.5 block whitespace-nowrap font-mono text-[11px]">{likelihood}</span>
            </div>
            <span className="text-right font-mono">{fmt(ELL * k)}</span>
            <span className="text-right font-mono font-bold">{fmt(NLL)}</span>
          </div>
        );
      })}
      <p className="pt-1 text-[11px] text-muted-foreground">반복 횟수 k = 1, 5, 50은 보이려고 고른 값입니다(가정).</p>
    </div>
  );
}

export default function LikelihoodToNllViz() {
  return (
    <SceneShell
      eyebrow="likelihood → NLL"
      title="두 probability가 평균 NLL .805가 되기까지"
      description="아래 공식 해석의 두 sample(probability .8과 .25)을 공식 세 줄의 순서대로 계산합니다. 마지막 장면은 왜 곱 대신 log 합을 쓰는지 반복 가정으로 보여 줍니다."
      ariaLabel="probability .8과 .25에서 likelihood .2, log-likelihood −1.609, 평균 NLL .805까지 계산하는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active === SCENES.length - 1 ? 1 : 0}
          scenes={[<StepPanel key="steps" active={active} />, <RepeatPanel key="repeat" />]}
        />
      )}
    />
  );
}
