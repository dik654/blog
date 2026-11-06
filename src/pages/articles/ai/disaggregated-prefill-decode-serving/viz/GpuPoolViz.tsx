import SceneShell from "./SceneShell";

/**
 * 본문 대응: #provisioning — 요청률 × 요청당 GPU·초 ÷ 이용률 → 올림.
 * P 9.5/0.8=11.875→12, D 5.68/0.8=7.1→8, D 2GPU 11.36/1.6=7.1→8복사본=16, P 0.024: 2.4/0.8=3.
 */
const SCENES = [
  { label: "P: 복사본 1GPU", summary: "9.5 ÷ 0.8 = 11.875 → 12", gpus: 12, work: 9.5, pairs: false, flag: -1, tag: "100요청/s × 0.095 = 9.5 GPU·초/초", note: "11.875개는 설치할 수 없어 12로 올립니다. 12개에 고르게 나누면 한 개당 약 0.79로 목표 0.8 아래입니다." },
  { label: "D: 복사본 1GPU", summary: "5.68 ÷ 0.8 = 7.1 → 8", gpus: 8, work: 5.68, pairs: false, flag: -1, tag: "256 × 0.0142 ÷ 64 = 0.0568 → ×100 = 5.68", note: "1GPU에서 64요청을 함께 처리하고 같은 batch 상태가 유지된다는 가정입니다. 12:8은 이 가정의 용량 후보일 뿐 두 지연 목표를 만족하는 최소 조합이라고 확정하지 않습니다." },
  { label: "D: 복사본 2GPU", summary: "11.36 ÷ 1.6 = 7.1 → 8복사본 = 16", gpus: 16, work: 11.36, pairs: true, flag: 15, tag: "2 × 0.0568 = 0.1136 → ×100 = 11.36", note: "복사본 하나가 2GPU를 쓰면서 batch 시간은 같다고 새로 가정한 값입니다. GPU 수만 올림하면 11.36 ÷ 0.8 = 14.2에서 15개인데, 15개는 완전한 2GPU 복사본으로 나눌 수 없습니다. 복사본을 8로 올려 16GPU를 잡습니다. 표시한 칸이 그 16번째입니다." },
  { label: "P: 별도 측정이 0.024라면", summary: "2.4 ÷ 0.8 = 3", gpus: 3, work: 2.4, pairs: false, flag: -1, tag: "100요청/s × 0.024 = 2.4 GPU·초/초", note: "별도 측정으로 값이 바뀐 경우입니다. prompt 길이가 1/4이라는 이유만으로 0.095를 자동으로 1/4로 만들지는 않습니다." },
] as const;

const CELL = 34;
const H = 38;
const GAP = 9;
const X0 = 8;

export default function GpuPoolViz() {
  return (
    <SceneShell
      eyebrow="(가정) 평균 용량 근사"
      title="요청당 GPU 시간이 설치할 GPU 칸 수가 되는 과정"
      description="칸 하나가 GPU 한 개이고 채운 높이가 평균 이용률, 점선이 목표 0.8입니다. GPU·초는 GPU 한 개를 1초 쓰는 양입니다."
      ariaLabel="요청률과 요청당 GPU 시간에서 GPU 개수를 구하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const util = scene.work / scene.gpus;
        return (
          <svg key={scene.label} viewBox="0 0 360 134" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={13} fontSize={12} fontWeight={600} fill="currentColor">{scene.tag}</text>
            {Array.from({ length: scene.gpus }, (_, index) => {
              const col = index % 8;
              const row = Math.floor(index / 8);
              const cx = X0 + col * (CELL + GAP);
              const cy = 24 + row * (H + 12);
              const fill = H * util;
              const flagged = index === scene.flag;
              return (
                <g key={index}>
                  <rect x={cx} y={cy} width={CELL} height={H} rx={3} fill="none" stroke={flagged ? "#dc2626" : "#94a3b8"} strokeWidth={flagged ? 1.25 : 1} />
                  <rect x={cx + 0.5} y={cy + H - fill} width={CELL - 1} height={fill} rx={2} fill="#2563eb" fillOpacity={0.75} />
                  <line x1={cx} x2={cx + CELL} y1={cy + H * 0.2} y2={cy + H * 0.2} stroke="currentColor" strokeWidth={1} strokeDasharray="2 2" />
                  {flagged && <text x={cx + CELL / 2} y={cy + H - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">16</text>}
                </g>
              );
            })}
            {scene.pairs &&
              Array.from({ length: 8 }, (_, pair) => {
                const col = (pair % 4) * 2;
                const row = Math.floor(pair / 4);
                return <rect key={pair} x={X0 + col * (CELL + GAP) - 3} y={24 + row * (H + 12) - 3} width={2 * CELL + GAP + 6} height={H + 6} rx={6} fill="none" stroke="#7c3aed" strokeWidth={1} />;
              })}
          </svg>
        );
      }}
    />
  );
}
