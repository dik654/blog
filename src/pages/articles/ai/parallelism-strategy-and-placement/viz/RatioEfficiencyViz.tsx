import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overlap-bottleneck — 계산 시간을 1로 두면 step 길이는 1 + R(1−o)이고 효율은 그 역수입니다.
 * C: R=0.21 → 83%, 경계: R=1 → 50%, A: R=3.2 → 24%, A + o=0.5 → 1/2.6 = 38%.
 */
const MAX_LEN = 4.3;

const SCENES = [
  { label: "후보 C", summary: "R 0.21 → E 83%", note: "통신 1.1 ms가 계산 5.2 ms의 0.21배입니다. 병목은 여전히 weight 읽기입니다. TP를 올려 빨라지는 것은 비율이 작게 유지될 때이며, node를 넘겨 TP 16으로 가면 R이 3.2인 후보 A가 됩니다.", r: 0.21, o: 0 },
  { label: "R = 1이 경계", summary: "R 1 → E 50%", note: "통신과 계산이 같으면 효율은 절반입니다. 이 값을 넘으면 GPU가 계산보다 기다리는 시간이 길어지고 병목이 link로 옮겨 갑니다. R 1은 경계를 보이는 값이며 후보가 아닙니다.", r: 1, o: 0 },
  { label: "후보 A", summary: "R 3.2 → E 24%", note: "통신 8.4 ms가 계산 2.6 ms의 3.2배입니다. GPU가 C의 두 배인데 token 당 시간은 더 깁니다.", r: 3.2, o: 0 },
  { label: "후보 A에 overlap 절반", summary: "1 / (1 + 3.2 × 0.5) = 38%", note: "o는 통신 중 계산과 동시에 진행돼 사라지는 몫입니다. 절반을 숨겨도 38%에 그치므로, R이 1을 넘으면 placement를 바꿔 R 자체를 낮춰야 합니다.", r: 3.2, o: 0.5 },
] as const;

const pct = (len: number) => `${(len / MAX_LEN) * 100}%`;

export default function RatioEfficiencyViz() {
  return (
    <SceneShell
      eyebrow="통신 대 계산 비율"
      title="R이 step을 얼마나 늘리는지가 효율을 정합니다"
      description="R은 통신 시간 ÷ 계산 시간, 효율 E는 1 ÷ step 길이입니다. 계산 시간을 길이 1로 맞춘 그림입니다. 후보마다 실제 ms는 다르고, 비율만 비교합니다."
      ariaLabel="계산을 1로 둔 step 길이와 통신 대 계산 비율, overlap 효과"
      scenes={SCENES}
      render={(index) => {
        const { r, o } = SCENES[index];
        const left = r * (1 - o);
        const hidden = r * o;
        return (
          <div className="min-w-0 space-y-3">
            <div className="relative">
              <div className="flex h-10 min-w-0 rounded-sm bg-muted/40 text-[11px] font-semibold">
                <div className="flex h-full items-center justify-center bg-[#64748b]/30" style={{ width: pct(1) }}>계산 1</div>
                <div className="flex h-full items-center justify-center overflow-hidden bg-[#2563eb]/40" style={{ width: pct(left) }}>{left >= 1 ? `통신 ${left}` : ""}</div>
                {left < 1 && <span className="flex h-full items-center pl-1 text-[#2563eb]">통신 {left}</span>}
                {hidden > 0 && <div className="flex h-full items-center justify-center border border-dashed border-[#2563eb] text-[#2563eb]" style={{ width: pct(hidden) }}>겹쳐 사라짐 {hidden}</div>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <span className="rounded-md border border-border py-1.5">비율 R<strong className="block font-mono text-sm">{r}</strong></span>
              <span className="rounded-md border border-border py-1.5">step 길이<strong className="block font-mono text-sm">{(1 + left).toFixed(2)}</strong></span>
              <span className="rounded-md border border-primary bg-primary/10 py-1.5">효율 E<strong className="block font-mono text-sm">{Math.round((1 / (1 + left)) * 100)}%</strong></span>
            </div>
          </div>
        );
      }}
    />
  );
}
