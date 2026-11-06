import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — ML-KEM-768 공개 키 1,184·복호 키 2,400·캡슐 1,088·공유 비밀 32바이트.
 * 캡슐 분해는 6절 숫자의 곱입니다: u = 3×256×10비트 = 960바이트, v = 1×256×4비트 = 128바이트, 합 1,088.
 * 압축 전: 3329가지는 12비트가 필요(2¹¹=2048 < 3329 ≤ 4096) → (3+1)×256×12비트 = 1,536바이트, 차이 448.
 */
const MAX = 2400;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";

const SCENES = [
  { label: "네 길이", summary: "32바이트가 가장 작음", note: "FIPS 203 표 3의 ML-KEM-768입니다. 같은 축에 놓으면 공유 비밀 32바이트는 나머지에 비해 아주 짧습니다." },
  { label: "캡슐 안", summary: "960 + 128 = 1,088", note: "6절의 숫자로 맞춰 봅니다. u는 k=3개 다항식×256계수×du=10비트=960바이트, v는 256계수×dv=4비트=128바이트입니다." },
  { label: "압축 전이라면", summary: "1,536 → 1,088", note: "0~3328을 그대로 적으려면 계수당 12비트가 필요합니다. (3+1)×256×12비트는 1,536바이트이므로 압축이 448바이트를 아낍니다. 그 대가가 6절의 복원 오차입니다." },
  { label: "오간 것과 얻은 것", summary: "1,088 ÷ 32 = 34", note: "한 번의 합의에 공개 키 1,184와 캡슐 1,088이 오가고 양쪽에 32바이트가 생깁니다. 캡슐은 비밀의 34배 길이입니다. 본문 데이터는 이 값에 들어 있지 않고 이후 대칭키 암호로 보호합니다." },
] as const;

function Bar({ label, value, color, max = MAX }: { label: string; value: number; color: string; max?: number }) {
  return (
    <div className="grid grid-cols-[5.25rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-6 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `max(2px, ${(value / max) * 100}%)`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-semibold">{value.toLocaleString("en-US")}</span>
    </div>
  );
}

function Split({ parts, max, title }: { parts: readonly { label: string; value: number; color: string }[]; max: number; title: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{title}</p>
      <div className="flex h-9 overflow-hidden rounded-md border border-border" style={{ width: `${(parts.reduce((sum, part) => sum + part.value, 0) / max) * 100}%` }}>
        {parts.map((part) => (
          <div key={part.label} style={{ flexGrow: part.value, flexBasis: 0, backgroundColor: part.color }} />
        ))}
      </div>
      <ul className="mt-2 space-y-1 text-xs sm:text-sm">
        {parts.map((part) => (
          <li key={part.label} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: part.color }} />
            <span className="min-w-0 flex-1">{part.label}</span>
            <span className="font-mono font-semibold">{part.value.toLocaleString("en-US")}바이트</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stage({ active }: { active: number }) {
  if (active === 0) {
    return (
      <div className="space-y-2">
        <Bar label="복호 키" value={2400} color={GRAY} />
        <Bar label="공개 키" value={1184} color={BLUE} />
        <Bar label="캡슐" value={1088} color={AMBER} />
        <Bar label="공유 비밀" value={32} color={RED} />
      </div>
    );
  }
  if (active === 1) {
    return (
      <Split
        title="캡슐 1,088바이트"
        max={1088}
        parts={[
          { label: "u · 3 × 256 × 10비트", value: 960, color: AMBER },
          { label: "v · 256 × 4비트", value: 128, color: BLUE },
        ]}
      />
    );
  }
  if (active === 2) {
    return (
      <div className="space-y-2">
        <Bar label="12비트 그대로" value={1536} color={GRAY} max={1536} />
        <Bar label="실제 캡슐" value={1088} color={AMBER} max={1536} />
        <Bar label="줄인 만큼" value={448} color={RED} max={1536} />
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <Bar label="공개 키 →" value={1184} color={BLUE} max={1184} />
      <Bar label="← 캡슐" value={1088} color={AMBER} max={1184} />
      <Bar label="양쪽의 비밀" value={32} color={RED} max={1184} />
    </div>
  );
}

export default function CapsuleBytesViz() {
  return (
    <SceneShell
      eyebrow="바이트 맞춰 보기"
      title="캡슐 1,088바이트는 6절의 숫자 곱으로 정확히 나옵니다"
      description="막대 길이는 실제 비율입니다. 표 3의 길이를 6절의 k, 계수 수, du, dv로 분해합니다."
      ariaLabel="ML-KEM-768의 키와 캡슐 길이 비교, 캡슐을 u와 v로 나눈 계산, 압축 전 길이와 공유 비밀의 비율"
      scenes={SCENES}
      render={(active) => <Stage active={active} />}
    />
  );
}
