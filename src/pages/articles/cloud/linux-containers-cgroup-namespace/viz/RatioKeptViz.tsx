import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #kubelet-translation — 숫자는 두 번 바뀌지만 Pod끼리의 비율은 약 1:2:4로 남는다.
 * 500m·1000m·2000m → shares 512·1024·2048 → weight 20·39·79 → 커널 shares 205·399·809.
 * 막대는 줄마다 합을 100%로 놓은 몫이다.
 */
const POD_COLORS: readonly string[] = ["#2563eb", "#b45309", "#475569"];

const ROWS: readonly { name: string; values: readonly number[] }[] = [
  { name: "requests.cpu (milliCPU)", values: [500, 1000, 2000] },
  { name: "shares = milliCPU × 1024 ÷ 1000", values: [512, 1024, 2048] },
  { name: "cpu.weight = 1 + (shares − 2) × 9999 ÷ 262142", values: [20, 39, 79] },
  { name: "커널 저장값 = weight × 1024 ÷ 100", values: [205, 399, 809] },
];

const SCENES: readonly ShellScene[] = [
  { label: "처음 숫자", summary: "500 : 1000 : 2000", note: "세 Pod의 requests.cpu입니다. m은 CPU의 1000분의 1입니다. A·B·C의 몫은 14.3%·28.6%·57.1%입니다." },
  { label: "shares로", summary: "512 : 1024 : 2048", note: "shares는 cgroup v1 시절의 비율 단위로 1 CPU가 1024입니다. 모두 같은 수를 곱해 몫은 바뀌지 않습니다." },
  { label: "cpu.weight로", summary: "20 : 39 : 79", note: "cgroup v2의 cpu.weight 범위 1~10000으로 눌러 넣습니다. 식의 +1·−2와 정수 나눗셈 때문에 몫이 14.5%·28.3%·57.2%로 조금 어긋납니다." },
  { label: "커널 저장값", summary: "205 : 399 : 809", note: "커널이 자기 기준으로 다시 저장합니다. 몫은 14.5%·28.2%·57.3%로 약 1:2:4가 남고, CPU가 모자랄 때 이 비율로 나눕니다." },
];

export default function RatioKeptViz() {
  return (
    <SceneShell
      eyebrow="requests → cpu.weight"
      title="숫자는 단계마다 바뀌어도 세 Pod의 몫은 거의 그대로입니다"
      description="막대 하나를 100%로 놓고 왼쪽부터 Pod A·B·C의 몫을 나눴습니다. 막대 안 숫자가 그 단계의 값입니다."
      ariaLabel="세 Pod의 CPU 요청이 네 단계를 거치며 비율을 유지하는 모습"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          {ROWS.map((row, index) => {
            const shown = index <= active;
            const total = row.values.reduce<number>((sum, value) => sum + value, 0);
            return (
              <div key={row.name} className={shown ? "" : "opacity-30"}>
                <p className="mb-1 text-xs font-semibold">{row.name}</p>
                <div className="flex h-6 min-w-0 gap-px overflow-hidden rounded-sm border border-border/70">
                  {row.values.map((value, pod) => (
                    <div
                      key={pod}
                      className="flex items-center justify-center font-mono text-[11px] font-bold text-white sm:text-xs"
                      style={{ width: `${(value / total) * 100}%`, backgroundColor: shown ? POD_COLORS[pod] : "#94a3b8" }}
                    >
                      {shown ? value : ""}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
