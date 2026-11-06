import SceneShell from "./SceneShell";

/**
 * 본문 대응: #implementation — kf_bfly4에 m=1, 입력 1,2,3,4를 넣은 임시 값의 변화입니다.
 * 원문 순서: scratch[0..2] → scratch[5], Fout[0] → scratch[3], scratch[4] → Fout[2], Fout[0] → Fout[1], Fout[3].
 */
const FOUT: string[][] = [
  ["1", "2", "3", "4"],
  ["1", "2", "3", "4"],
  ["4", "2", "3", "4"],
  ["4", "2", "3", "4"],
  ["10", "2", "−2", "4"],
  ["10", "−2+2i", "−2", "−2−2i"],
];
const SCRATCH: string[][] = [
  ["", "", "", "", "", ""],
  ["2", "3", "4", "", "", ""],
  ["2", "3", "4", "", "", "−2"],
  ["2", "3", "4", "6", "−2", "−2"],
  ["2", "3", "4", "6", "−2", "−2"],
  ["2", "3", "4", "6", "−2", "−2"],
];
const CHANGED: { fout: number[]; scratch: number[] }[] = [
  { fout: [0, 1, 2, 3], scratch: [] },
  { fout: [], scratch: [0, 1, 2] },
  { fout: [0], scratch: [5] },
  { fout: [], scratch: [3, 4] },
  { fout: [0, 2], scratch: [] },
  { fout: [1, 3], scratch: [] },
];
const SCENES = [
  { label: "인수 고르기", summary: "분해 기록 [4, 1] · p=4, m=1", note: "kf_factor는 인수 4부터 시도합니다. 길이 4가 바로 4로 나뉘므로 kf_work는 입력 네 값을 복사한 뒤 kf_bfly4를 부릅니다. 두 단계의 radix-2 경로가 아닙니다." },
  { label: "회전값 곱하기", summary: "scratch[0..2] = 2, 3, 4", note: "m=1이라 첫 회전값이 모두 1입니다. 뒤쪽 세 입력이 값 그대로 임시 칸 scratch로 옮겨 갑니다." },
  { label: "위치 0·2 묶기", summary: "1−3 = −2 · 1+3 = 4", note: "차 −2는 scratch[5]에 두고, 합 4는 첫 출력 칸에 임시로 적습니다. 4절의 첫 묶음과 같은 값입니다." },
  { label: "위치 1·3 묶기", summary: "2+4 = 6 · 2−4 = −2", note: "합은 scratch[3], 차는 scratch[4]입니다. 4절의 둘째 묶음과 같은 값입니다." },
  { label: "합으로 두 출력", summary: "4−6 = −2 · 4+6 = 10", note: "세 번째 출력을 먼저 만들고 첫 출력을 덮어씁니다. 합 두 개를 빼고 더해 출력 두 개를 얻습니다." },
  { label: "차로 두 출력", summary: "−2+2i · −2−2i", note: "순방향 분기에서 둘째 출력의 실수부는 −2+0, 허수부는 0−(−2)=2이고 넷째는 −2−2i입니다. 계산 그래프는 다르지만 같은 네 복소 출력입니다." },
] as const;

const Cell = ({ x, y, width, name, value, hit }: { x: number; y: number; width: number; name: string; value: string; hit: boolean }) => (
  <g>
    <text x={x + width / 2} y={y - 5} textAnchor="middle" fontSize={10} fill="#64748b">{name}</text>
    <rect x={x} y={y} width={width} height={36} rx={6} fill={hit ? "#2563eb" : "none"} fillOpacity={hit ? 0.15 : 0} stroke={hit ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
    <text x={x + width / 2} y={y + 23} textAnchor="middle" fontSize={value.length > 3 ? 12 : 14} fontWeight={700} fill={hit ? "#2563eb" : "#64748b"}>{value === "" ? "·" : value}</text>
  </g>
);

export default function KissScratchViz() {
  return (
    <SceneShell
      eyebrow="실제 C 경로"
      title="KISS FFT의 네 갈래 계산은 임시 칸을 이렇게 채웁니다"
      description="고정한 원문에 1, 2, 3, 4를 넣은 float 경로입니다. Fout은 출력 칸, scratch는 임시 칸이고 파란 칸이 이번 단계에 바뀐 값입니다."
      ariaLabel="kf_bfly4 실행 중 출력 칸과 임시 칸의 값 변화"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {FOUT[active].map((value, i) => (
            <Cell key={i} x={8 + i * 87} y={20} width={82} name={`Fout[${i}]`} value={value} hit={CHANGED[active].fout.includes(i)} />
          ))}
          {SCRATCH[active].map((value, i) => (
            <Cell key={i} x={8 + i * 58} y={96} width={54} name={`scratch[${i}]`} value={value} hit={CHANGED[active].scratch.includes(i)} />
          ))}
        </svg>
      )}
    />
  );
}
