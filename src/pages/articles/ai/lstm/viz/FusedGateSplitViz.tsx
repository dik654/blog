import LstmSceneShell from "./LstmSceneShell";

/**
 * 본문 대응: #gates — [xₜ;hₜ₋₁]를 한 번 곱해 4H 출력을 만들고 H씩 네 구간으로 나눈다.
 * 구간 순서는 library마다 다를 수 있다(i,f,g,o 또는 i,f,o,g). 순서가 다른 checkpoint를
 * 그대로 복사하면 candidate 구간과 output gate 구간이 뒤바뀐다.
 */
type Part = { key: string; name: string; act: string; range: string; tone: "gate" | "cand" };

const PART: Record<"f" | "i" | "g" | "o", Part> = {
  f: { key: "f", name: "a_f → fₜ", act: "σ", range: "0–1 보존 비율", tone: "gate" },
  i: { key: "i", name: "a_i → iₜ", act: "σ", range: "0–1 기록 비율", tone: "gate" },
  g: { key: "g", name: "a_g → gₜ", act: "tanh", range: "−1–1 후보 내용", tone: "cand" },
  o: { key: "o", name: "a_o → oₜ", act: "σ", range: "0–1 공개 비율", tone: "gate" },
};

const ARTICLE_ORDER = [PART.f, PART.i, PART.g, PART.o];
const SAVED = [PART.i, PART.f, PART.g, PART.o];
const READ = [PART.i, PART.f, PART.o, PART.g];

const SCENES = [
  { label: "입력 두 개를 이어 붙입니다", summary: "uₜ = [xₜ ; hₜ₋₁]", note: "세 gate와 candidate는 모두 같은 현재 input xₜ와 직전 hidden hₜ₋₁을 봅니다. 두 vector를 한 줄로 이어 붙인 것이 step context uₜ입니다." },
  { label: "한 번의 곱으로 4H를 만듭니다", summary: "aₜ = W·uₜ + b  (길이 4H)", note: "Gate마다 따로 곱하지 않고 네 묶음의 weight를 한 matrix W로 묶어 한 번 곱합니다. Hidden size가 H이면 출력 aₜ의 길이는 4H입니다." },
  { label: "H씩 잘라 역할을 줍니다", summary: "σ 세 번 · tanh 한 번", note: "4H를 H씩 네 구간으로 자릅니다. 세 구간은 sigmoid로 0–1 비율이 되고, 한 구간은 tanh로 −1–1의 부호 있는 후보 내용이 됩니다. 여기서는 글의 수식 표기 순서 f, i, g, o로 그렸습니다." },
  { label: "구간 순서가 다른 checkpoint", summary: "3·4번 구간이 뒤바뀜", note: "구간 순서는 library마다 다를 수 있습니다. i,f,g,o 순서로 저장한 weight를 i,f,o,g 순서로 읽으면 candidate 구간이 output gate 자리로, output gate 구간이 candidate 자리로 갑니다. 단순 weight copy가 깨지는 지점입니다." },
] as const;

function Seg({ part, warn = false, dim = false }: { part: Part; warn?: boolean; dim?: boolean }) {
  const tone = part.tone === "cand" ? "border-amber-600/70 bg-amber-500/[0.07]" : "border-primary/50 bg-primary/[0.05]";
  return (
    <div className={`min-w-0 rounded-md border px-1.5 py-2 text-center ${warn ? "border-red-600 bg-red-500/[0.07]" : tone} ${dim ? "opacity-40" : ""}`}>
      <p className="font-mono text-[11px] font-bold sm:text-xs">{part.name}</p>
      <p className="mt-1 font-mono text-[11px] text-muted-foreground">{part.act}</p>
      <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{part.range}</p>
    </div>
  );
}

function Concat({ faded = false }: { faded?: boolean }) {
  return (
    <div className={`grid grid-cols-[1fr_1fr] gap-px rounded-md border border-border bg-border ${faded ? "opacity-60" : ""}`}>
      <div className="bg-background px-2 py-3 text-center"><p className="font-mono text-sm font-bold">xₜ</p><p className="mt-1 text-[11px] text-muted-foreground">현재 input</p></div>
      <div className="bg-background px-2 py-3 text-center"><p className="font-mono text-sm font-bold">hₜ₋₁</p><p className="mt-1 text-[11px] text-muted-foreground">직전 hidden (크기 H)</p></div>
    </div>
  );
}

function FourH({ labels }: { labels: readonly string[] }) {
  return (
    <div className="grid grid-cols-4 gap-px rounded-md border border-border bg-border">
      {labels.map((label, index) => (
        <div key={`${label}-${index}`} className="bg-background px-1 py-2 text-center font-mono text-[11px] font-bold sm:text-xs">{label}</div>
      ))}
    </div>
  );
}

function Down({ text }: { text: string }) {
  return <p className="my-2 text-center font-mono text-xs text-primary">↓ {text}</p>;
}

export default function FusedGateSplitViz() {
  return (
    <LstmSceneShell
      eyebrow="Fused gate 계산"
      title="한 번 곱한 4H 출력을 H씩 잘라 세 gate와 candidate에 나눠 줍니다"
      description="칸 하나가 길이 H인 구간입니다. xₜ의 길이는 글에 정해져 있지 않아 두 칸 폭을 같게 그렸을 뿐 실제 크기를 뜻하지 않습니다."
      note="i,f,g,o와 i,f,o,g는 글이 예로 든 두 순서입니다. 실제 checkpoint layout은 사용하는 library에서 확인합니다."
      ariaLabel="입력 결합, fused matrix 곱, 4H 출력 분할, gate 순서 불일치의 네 장면"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <div className="mx-auto max-w-xl">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-dashed border-border px-2 py-3 text-center"><p className="font-mono text-sm font-bold">xₜ</p><p className="mt-1 text-[11px] text-muted-foreground">현재 input</p></div>
                <div className="rounded-md border border-dashed border-border px-2 py-3 text-center"><p className="font-mono text-sm font-bold">hₜ₋₁</p><p className="mt-1 text-[11px] text-muted-foreground">직전 hidden (크기 H)</p></div>
              </div>
              <Down text="이어 붙이기 (concatenate)" />
              <Concat />
              <p className="mt-3 text-center text-xs text-muted-foreground">이 한 줄 uₜ가 네 계산 모두의 공통 입력입니다.</p>
            </div>
          );
        }
        if (active === 1) {
          return (
            <div className="mx-auto max-w-xl">
              <Concat faded />
              <Down text="W·uₜ + b  (matrix 곱 한 번)" />
              <FourH labels={["H", "H", "H", "H"]} />
              <p className="mt-2 text-center font-mono text-xs text-muted-foreground">aₜ 길이 = 4H</p>
            </div>
          );
        }
        if (active === 2) {
          return (
            <div className="mx-auto max-w-xl">
              <FourH labels={["a_f", "a_i", "a_g", "a_o"]} />
              <Down text="구간마다 다른 함수" />
              <div className="grid grid-cols-4 gap-1.5">
                {ARTICLE_ORDER.map((part) => <Seg key={part.key} part={part} />)}
              </div>
            </div>
          );
        }
        return (
          <div className="mx-auto max-w-xl space-y-3">
            <div>
              <p className="mb-1.5 text-xs font-semibold">저장한 순서 i, f, g, o</p>
              <div className="grid grid-cols-4 gap-1.5">{SAVED.map((part, index) => <Seg key={part.key} part={part} warn={index >= 2} dim={index < 2} />)}</div>
            </div>
            <p className="text-center font-mono text-xs text-red-700 dark:text-red-400">↓ 같은 위치 그대로 복사</p>
            <div>
              <p className="mb-1.5 text-xs font-semibold">읽는 쪽 순서 i, f, o, g</p>
              <div className="grid grid-cols-4 gap-1.5">{READ.map((part, index) => <Seg key={part.key} part={part} warn={index >= 2} dim={index < 2} />)}</div>
            </div>
          </div>
        );
      }}
    />
  );
}
