import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reuse — 128 B 조각을 여덟 차례(가정). 매번 읽기 8×128=1024 B, 보관 128 B.
 * 출력 128 B는 별도. (128+128)/8=32 B/차례, R=1이면 (128+128)/1=256 B/차례입니다.
 */
const SCENES: { label: string; summary: string; note: string; passes: number; reads: number; store: boolean; every: boolean }[] = [
  { label: "매번 읽기", summary: "입력 8×128 = 1024 B", passes: 8, reads: 8, store: true, every: true, note: "한 차례는 조각 전체를 한 번 사용하는 계산입니다. 매번 같은 입력을 읽으면 입력 요청이 1024바이트입니다. 출력 128바이트는 별도입니다." },
  { label: "한 번 가져오기", summary: "입력 128 B", passes: 8, reads: 1, store: true, every: false, note: "처음 한 번 가져와 shared memory에 두고 나머지 차례에서는 그것을 씁니다. 입력 요청은 128바이트입니다." },
  { label: "차례당 배분", summary: "(128+128) ÷ 8 = 32 B", passes: 8, reads: 1, store: true, every: false, note: "가져온 입력과 마지막 출력을 합친 256바이트를 여덟 차례에 나눕니다. Cache가 반복 읽기를 이미 흡수하거나 compiler가 같은 읽기를 합쳤다면 실제 전송량이 이 비율대로 줄지는 않습니다." },
  { label: "한 번만 쓰면", summary: "R=1 · 절약할 읽기 없음", passes: 1, reads: 1, store: true, every: false, note: "조각을 한 번만 쓰면 재사용으로 읽기를 절약할 여지가 없습니다. 추가 복사가 오히려 비용이 될 수 있습니다." },
];

const X0 = 68;
const SLOT = 35.5;
const ROW_READ = 34;
const ROW_USE = 74;
const ROW_WRITE = 114;
const H = 30;

export default function ReusePassViz() {
  return (
    <SceneShell
      eyebrow="여덟 차례"
      title="같은 입력을 몇 번 읽는지 차례별로 셉니다"
      description="한 열이 조각 전체를 쓰는 한 차례입니다(가정). 칸 하나가 128바이트이며 cache hit와 요청 구간의 남는 바이트를 생략한 모델입니다."
      ariaLabel="여덟 차례에서 입력 읽기와 출력 쓰기 칸 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 154" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={6} y={ROW_READ + 20} fontSize={10} fontWeight={700} fill="#2563eb">global 읽기</text>
            <text x={6} y={ROW_USE + 20} fontSize={10} fill="#64748b">조각 사용</text>
            <text x={6} y={ROW_WRITE + 20} fontSize={10} fontWeight={700} fill="#d97706">global 쓰기</text>
            {Array.from({ length: 8 }, (_, pass) => {
              const live = pass < scene.passes;
              const read = live && pass < scene.reads;
              const last = pass === scene.passes - 1;
              const x = X0 + pass * SLOT;
              return (
                <g key={pass} opacity={live ? 1 : 0.18}>
                  <text x={x + 16} y={22} textAnchor="middle" fontSize={10} fill="#64748b">{pass + 1}</text>
                  <rect x={x} y={ROW_READ} width={32} height={H} rx={4} fill={read ? "#2563eb" : "none"} fillOpacity={read ? 0.25 : 0} stroke={read ? "#2563eb" : "#94a3b8"} strokeWidth={1} strokeDasharray={read ? undefined : "3 3"} />
                  {read && <text x={x + 16} y={ROW_READ + 19} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">128</text>}
                  <rect x={x} y={ROW_USE} width={32} height={H} rx={4} fill="#64748b" fillOpacity={0.15} stroke="#94a3b8" strokeWidth={1} />
                  <rect x={x} y={ROW_WRITE} width={32} height={H} rx={4} fill={last ? "#d97706" : "none"} fillOpacity={last ? 0.25 : 0} stroke={last ? "#d97706" : "#94a3b8"} strokeWidth={1} strokeDasharray={last ? undefined : "3 3"} />
                  {last && <text x={x + 16} y={ROW_WRITE + 19} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">128</text>}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
