import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #source-accept — 어휘 2개(A=0, B=1), 후보 A·B·B·A, 비교값 .6 .4 .8.
 * 주소 = 위치×2 + 토큰 ID → 0, 3, 5. 결과 버퍼는 [0,1,0,-1,-1].
 */
interface Scene extends ShellScene {
  read: number | null;
  written: number;
  rejected: boolean;
  check: string;
}

const SCENES: readonly Scene[] = [
  { label: "pos 0 · A", summary: "주소 0×2+0 = 0", read: 0, written: 1, rejected: false, check: ".7 / .4 = 1.75 ≥ .6 → 참", note: "첫 후보 A의 q=.4와 p=.7을 읽습니다. 비율이 비교값 .6 이상이므로 ID 0을 씁니다." },
  { label: "pos 1 · B", summary: "주소 1×2+1 = 3", read: 3, written: 2, rejected: false, check: ".3 / .6 = .5 ≥ .4 → 참", note: "둘째 후보 B의 q=.6과 p=.3을 읽습니다. .5가 비교값 .4 이상이므로 ID 1을 씁니다." },
  { label: "pos 2 · B", summary: "주소 2×2+1 = 5", read: 5, written: 3, rejected: true, check: ".3 / .6 = .5 ≥ .8 → 거짓", note: "셋째 후보 B는 같은 비율 .5가 비교값 .8보다 작아 거부됩니다. 후보 ID 대신 미리 준비한 교체 토큰 ID 0을 쓰고 rejected를 켭니다." },
  { label: "pos 3 · 건너뜀", summary: "읽지 않음", read: null, written: 3, rejected: true, check: "rejected가 켜져 판정 생략", note: "rejected가 켜져 있으면 다음 위치의 판정과 쓰기를 건너뜁니다. 비교값 .2는 쓰이지 않습니다." },
  { label: "끝 · 보너스 없음", summary: "[0, 1, 0, −1, −1]", read: null, written: 3, rejected: true, check: "rejected가 켜져 보너스 추가 안 함", note: "다섯째 칸은 모두 수락했을 때만 쓰는 보너스 자리입니다. −1은 빈 자리 표시입니다. 이 값은 CPU 대역 실행 결과이며 GPU 성능을 잰 것이 아닙니다." },
];

const ADDRESSES = [0, 1, 2, 3, 4, 5, 6, 7];
const OUTPUT = [0, 1, 0];
const BUFFER = [0, 1, 2, 3, 4];

export default function KernelScanViz() {
  return (
    <SceneShell
      eyebrow="v0.27.1 · 한 요청"
      title="한 줄로 편 확률 배열을 앞에서 훑다가 첫 거부에서 쓰기를 멈춥니다"
      description="어휘가 A(ID 0)·B(ID 1) 둘이라 주소는 위치×2+토큰 ID입니다. p·q와 비교값은 앞 절의 가정입니다."
      ariaLabel="확률 배열 주소를 읽어 후보를 판정하고 출력 버퍼에 쓰는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="text-xs font-bold text-muted-foreground">한 줄로 편 확률 배열의 주소 (위치 0~3)</p>
            <div className="mt-1.5 grid grid-cols-8 gap-1">
              {ADDRESSES.map((address) => {
                const on = address === scene.read;
                return (
                  <span
                    key={address}
                    className={`flex h-11 flex-col items-center justify-center rounded-md border font-mono text-xs leading-4 ${on ? "border-[#2563eb] bg-[#2563eb]/15 font-bold" : "border-border text-muted-foreground"} ${address % 2 === 0 && address > 0 ? "ml-0.5 sm:ml-1.5" : ""}`}
                  >
                    <span>{address}</span>
                    <span className="text-[10px]">{address % 2 === 0 ? "A" : "B"}</span>
                  </span>
                );
              })}
            </div>

            <p className={`mt-3 rounded-md border px-3 py-2 text-xs font-bold tabular-nums sm:text-sm ${scene.check.includes("거짓") ? "border-[#dc2626] text-red-700 dark:text-red-400" : scene.read === null ? "border-dashed border-border text-muted-foreground" : "border-border"}`}>
              {scene.check}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-muted-foreground">출력 버퍼 다섯 칸</p>
              <span className={`rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${scene.rejected ? "border-[#dc2626] text-red-700 dark:text-red-400" : "border-border text-muted-foreground"}`}>
                rejected = {scene.rejected ? "참" : "거짓"}
              </span>
            </div>
            <div className="mt-1.5 grid grid-cols-5 gap-1.5">
              {BUFFER.map((slot) => {
                const filled = slot < scene.written;
                const isReplacement = slot === 2 && filled;
                return (
                  <span
                    key={slot}
                    className={`flex h-10 flex-col items-center justify-center rounded-md border font-mono text-sm font-bold leading-4 ${
                      isReplacement ? "border-[#16a34a] bg-[#16a34a]/15" : filled ? "border-[#2563eb] bg-[#2563eb]/15" : "border-dashed border-border text-muted-foreground"
                    }`}
                  >
                    {filled ? OUTPUT[slot] : "−1"}
                    {isReplacement && <span className="font-sans text-[10px] font-semibold leading-3">교체</span>}
                  </span>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
