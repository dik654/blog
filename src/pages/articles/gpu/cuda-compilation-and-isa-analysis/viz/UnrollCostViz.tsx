import SceneShell from "./SceneShell";

/**
 * 본문 대응: #unrolling — 가정한 모델 b=4, o=3, R₀=10, ℓ=3.
 * 원소당 명령 = b + o/U → 7, 5.5, 4.75, 4.375. Register 모델값 = 10 + 3(U−1) → 10, 13, 19, 31.
 */
const B = 4;
const O = 3;
const R0 = 10;
const L = 3;
const UNITS = [1, 2, 4, 8] as const;
const perElement = (u: number) => B + O / u;
const registers = (u: number) => R0 + (u - 1) * L;

const SCENES = [
  { label: "U = 1", summary: "7명령 · register 10", note: "원소당 본문 4개와 제어 3개로 7개입니다. 저장 자리는 기존 10개입니다." },
  { label: "U = 2", summary: "5.5명령 · register 13", note: "11/2=5.5개입니다. 묶음마다 값 하나와 64비트 주소(자리 둘)가 더 산다고 가정해 3칸이 늡니다." },
  { label: "U = 4", summary: "4.75명령 · register 19", note: "19/4=4.75개로 U=1보다 약 32.1% 적습니다. 나눠 떨어지지 않는 입력의 마지막 원소는 별도 처리해야 합니다." },
  { label: "U = 8", summary: "4.375명령 · register 31", note: "U가 두 배가 될 때 명령 감소는 1.5, 0.75, 0.375로 작아지고 register 증가는 3, 6, 12칸으로 커집니다. 실제 배정은 다를 수 있습니다." },
] as const;

function Cells({ count, className }: { count: number; className: string }) {
  return (
    <span className="flex flex-wrap gap-[2px]">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={`block h-2.5 w-2.5 rounded-[2px] ${className}`} />
      ))}
    </span>
  );
}

function Meter({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs">
      <span className="font-semibold">{label}</span>
      <span className="h-3 min-w-0 rounded-sm bg-muted/40">
        <span className="block h-full rounded-sm" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
      </span>
      <span className="text-right font-mono font-bold">{value}</span>
    </div>
  );
}

export default function UnrollCostViz() {
  return (
    <SceneShell
      eyebrow="U = 반복 한 번에 처리하는 원소 수"
      title="제어 칸은 나눠 내지만 저장 칸은 계속 쌓입니다"
      description="칸은 명령(파랑 본문, 주황 제어) 또는 32비트 저장 자리(회색 기존, 빨강 추가)입니다. 실제 add의 수가 아닙니다(가정)."
      ariaLabel="반복 묶음 크기 1, 2, 4, 8에서 반복 한 번의 명령 칸과 저장 자리 칸, 원소당 명령 수와 register 모델값"
      scenes={SCENES}
      render={(active) => {
        const unit = UNITS[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded border border-border p-2.5">
                <p className="mb-1.5 text-xs font-semibold">반복 한 번의 명령: {B}×{unit} + {O} = {B * unit + O}개</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {Array.from({ length: unit }, (_, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <Cells count={B} className="bg-[#2563eb]" />
                    </span>
                  ))}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Cells count={O} className="bg-[#d97706]" /> 제어 {O}개
                </div>
              </div>
              <div className="min-w-0 rounded border border-border p-2.5">
                <p className="mb-1.5 text-xs font-semibold">저장 자리: {R0} + {unit - 1}×{L} = {registers(unit)}개</p>
                <div className="flex flex-wrap gap-[2px]">
                  <Cells count={R0} className="bg-[#94a3b8]" />
                  <Cells count={registers(unit) - R0} className="bg-[#dc2626]" />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Meter label="원소당 명령" value={perElement(unit)} max={perElement(1)} color="#2563eb" />
              <Meter label="register 모델값" value={registers(unit)} max={registers(8)} color="#dc2626" />
            </div>
          </div>
        );
      }}
    />
  );
}
