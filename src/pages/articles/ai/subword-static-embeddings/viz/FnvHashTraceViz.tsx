import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-hash — Dictionary::hash를 그대로 따른 계산.
 * <ru 1467166842, run 718098122, un> 2161437548 → 나머지 2, 2, 4.
 * <é>는 부호 있는 바이트 1002806231, 부호 없는 바이트 4222937559.
 */
const SEED = 2166136261;
const PRIME = 16777619;

const bytesOf = (text: string) => Array.from(new TextEncoder().encode(text));

interface Step {
  before: number;
  xored: number;
  after: number;
}

function trace(text: string, signed: boolean) {
  return bytesOf(text).reduce<Step[]>((steps, byte) => {
    const before = steps.length > 0 ? steps[steps.length - 1].after : SEED;
    const value = signed ? ((byte << 24) >> 24) >>> 0 : byte;
    const xored = (before ^ value) >>> 0;
    return [...steps, { before, xored, after: Math.imul(xored, PRIME) >>> 0 }];
  }, []);
}

const hashOf = (text: string, signed = true) => trace(text, signed).slice(-1)[0].after;
const RU_STEPS = trace("<ru", true);
const RU_LABELS = ["<", "r", "u"];
const RU_HEX = bytesOf("<ru").map((byte) => byte.toString(16).toUpperCase());
const PIECES = ["<ru", "run", "un>"];
const SIGNED_E = hashOf("<é>");
const UNSIGNED_E = hashOf("<é>", false);
const PAPER_BUCKETS = 2000000;

const SCENES = [
  { label: "시작값", summary: "h = 2166136261", note: "XOR은 두 수를 비트마다 비교해 다르면 1로 두는 연산입니다. 이 계산은 정해진 시작값 하나에서 출발해, 바이트 하나마다 XOR 한 번과 곱셈 한 번을 되풀이합니다." },
  { label: "첫 바이트 <", summary: `→ ${RU_STEPS[0].after}`, note: "바이트 3C를 XOR하고 16777619를 곱합니다. 32비트 부호 없는 계산이라 범위를 넘은 상위 비트는 남지 않습니다. 그래서 값이 커지기만 하지 않습니다." },
  { label: "둘째 바이트 r", summary: `→ ${RU_STEPS[1].after}`, note: "앞 단계의 결과가 다음 단계의 시작값이 됩니다. 앞 글자가 달랐다면 여기부터 다른 수가 이어집니다." },
  { label: "셋째 바이트 u", summary: `<ru → ${RU_STEPS[2].after}`, note: "바이트가 끝나면 마지막 값이 조각 <ru의 해시입니다." },
  { label: "8로 나눈 나머지", summary: "2, 2, 4", note: "세 해시는 모두 다른 정수인데, 8로 나눈 나머지가 앞의 두 개에서 2로 같습니다. 줄 번호는 이 나머지이므로 해시 충돌이 여기서 생깁니다." },
  { label: "ASCII 밖의 바이트", summary: "C3: FFFFFFC3 vs 000000C3", note: "é의 첫 바이트 C3은 부호 있는 8비트로 읽으면 −61이어서 XOR에 FFFFFFC3이 들어갑니다. 이 조각에서 8로 나눈 나머지는 둘 다 7이지만, 논문 예의 2,000,000개 bucket으로 나누면 값이 갈립니다. 다른 라이브러리의 해시로 바꾸면 행 주소가 달라질 수 있는 이유입니다." },
] as const;

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-border/60 py-1.5 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono ${strong ? "font-bold text-blue-700 dark:text-blue-400" : ""}`}>{value}</span>
    </div>
  );
}

export default function FnvHashTraceViz() {
  return (
    <SceneShell
      eyebrow="바이트별 해시"
      title="조각 <ru가 줄 번호 2가 되기까지"
      description="h는 계산 중인 32비트 정수입니다. 원문 Dictionary::hash의 규칙을 같은 바이트에 그대로 적용한 값입니다."
      ariaLabel="조각의 바이트마다 XOR과 곱셈을 반복해 해시를 만들고 나머지로 줄 번호를 고르는 과정"
      scenes={SCENES}
      render={(active) => {
        if (active === 4) {
          return (
            <div className="min-w-0">
              {PIECES.map((piece) => {
                const hash = hashOf(piece);
                return <Row key={piece} label={`${piece}  ${hash} ÷ 8의 나머지`} value={`${hash % 8}번 줄`} strong />;
              })}
            </div>
          );
        }
        if (active === 5) {
          return (
            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold">조각 &lt;é&gt; (3C C3 A9 3E)</p>
              <Row label="부호 있는 바이트 (원문)" value={String(SIGNED_E)} strong />
              <Row label="부호 없는 바이트" value={String(UNSIGNED_E)} />
              <Row label="8개 bucket: 원문 / 부호 없음" value={`${SIGNED_E % 8} / ${UNSIGNED_E % 8}`} />
              <Row label="2,000,000개 bucket: 원문 / 부호 없음" value={`${SIGNED_E % PAPER_BUCKETS} / ${UNSIGNED_E % PAPER_BUCKETS}`} />
            </div>
          );
        }
        const step = active === 0 ? null : RU_STEPS[active - 1];
        return (
          <div className="min-w-0 space-y-3">
            <div className="flex justify-center gap-2">
              {RU_LABELS.map((char, index) => (
                <span key={char} className={`w-14 rounded-md border py-1 text-center ${index === active - 1 ? "border-blue-600 bg-blue-500/15" : "border-border bg-background"}`}>
                  <span className="block font-mono text-base font-bold">{char}</span>
                  <span className="block font-mono text-[11px] text-muted-foreground">{RU_HEX[index]}</span>
                </span>
              ))}
            </div>
            <div className="border-b border-border/60">
              <Row label="이전 h" value={String(step ? step.before : SEED)} />
              <Row label="h XOR 바이트" value={step ? String(step.xored) : "−"} />
              <Row label="× 16777619 (32비트)" value={step ? String(step.after) : "−"} strong />
            </div>
          </div>
        );
      }}
    />
  );
}
