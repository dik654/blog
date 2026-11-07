import SceneShell from "./SceneShell";

/**
 * 본문 대응: #codegen — build.rs의 세 호출과 이름 기준 중복 제거.
 * 등록 시도 Scalar / Fp+Scalar / Fp2+Scalar = 5번, 남는 field 3개, 연산 3묶음.
 */
const FIELDS = ["Scalar", "Fp", "Fp2"] as const;
const OPS = ["FFT", "G1 MSM", "G2 MSM"] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  fields: number;
  ops: number;
  attempts: readonly { name: string; role: string; dup: boolean }[];
}[] = [
  {
    label: "add_fft::<Scalar>()",
    summary: "field 1개 · 연산 1개",
    note: "빈 집합에 Scalar가 들어가고 FFT 연산이 추가됩니다.",
    fields: 1,
    ops: 1,
    attempts: [{ name: "Scalar", role: "FFT용", dup: false }],
  },
  {
    label: "add_multiexp::<G1Affine, Fp>()",
    summary: "field 2개 · 연산 2개",
    note: "좌표 field Fp는 새로 들어가고, 함께 등록하는 scalar field는 이름이 같은 Scalar가 이미 있어 빠집니다.",
    fields: 2,
    ops: 2,
    attempts: [{ name: "Fp", role: "좌표", dup: false }, { name: "Scalar", role: "scalar", dup: true }],
  },
  {
    label: "add_multiexp::<G2Affine, Fp2>()",
    summary: "field 3개 · 연산 3개",
    note: "이번에도 좌표 field Fp2만 새로 들어갑니다. 등록 시도는 모두 5번이었지만 집합에는 3개만 남습니다. 이 결과가 generate로 넘어갑니다.",
    fields: 3,
    ops: 3,
    attempts: [{ name: "Fp2", role: "좌표", dup: false }, { name: "Scalar", role: "scalar", dup: true }],
  },
];

function Slot({ text, on, fresh }: { text: string; on: boolean; fresh: boolean }) {
  return (
    <div className={`flex h-10 min-w-0 items-center justify-center rounded-lg border text-xs font-semibold sm:text-sm ${on ? (fresh ? "border-primary bg-background text-primary" : "border-border bg-background") : "border-dashed border-border/50 font-normal text-muted-foreground/50"}`}>
      {on ? text : "빈 칸"}
    </div>
  );
}

export default function FieldDedupViz() {
  return (
    <SceneShell
      eyebrow="중복 제거"
      title="세 번 호출해도 field는 이름마다 한 번만 남습니다"
      description="장면 하나가 build.rs의 호출 하나입니다. MSM은 add_multiexp가 등록하는 multi-scalar multiplication 연산입니다."
      ariaLabel="build.rs의 세 호출이 field 집합과 연산 목록을 채우는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-1.5">
              <p className="text-sm font-semibold">이번 호출이 등록하려는 field</p>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((slot) => {
                  const attempt = scene.attempts[slot];
                  if (!attempt) return <div key={slot} className="min-h-14 rounded-lg border border-dashed border-border/40" />;
                  return (
                    <div key={slot} className={`min-h-14 rounded-lg border px-2 py-1.5 text-center text-xs leading-5 sm:text-sm ${attempt.dup ? "border-dashed border-border text-muted-foreground" : "border-primary bg-background"}`}>
                      <span className={`block font-mono font-semibold ${attempt.dup ? "line-through" : ""}`}>{attempt.name}</span>
                      <span className="block">{attempt.role} · {attempt.dup ? "이미 있어 제거" : "새로 등록"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold">field 집합</p>
              <div className="grid grid-cols-3 gap-2">
                {FIELDS.map((field, index) => <Slot key={field} text={field} on={index < scene.fields} fresh={index === scene.fields - 1} />)}
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold">연산 묶음</p>
              <div className="grid grid-cols-3 gap-2">
                {OPS.map((op, index) => <Slot key={op} text={op} on={index < scene.ops} fresh={index === scene.ops - 1} />)}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
