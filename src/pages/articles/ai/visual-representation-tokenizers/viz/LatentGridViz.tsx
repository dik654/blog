import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reconstruction — 1024×1024 RGB image를 공간축 8배 압축하면 128×128 latent grid, channel 16이면
 * 원 pixel scalar 1024·1024·3 = 3,145,728(약 314만) → latent scalar 128·128·16 = 262,144(약 26만).
 * 위치 수 1,048,576 → 16,384 = 1/64(= 8²), 8×8 pixel 블록 하나의 값 192(64×3) → 16.
 * 마지막 장면: decoder는 z에 없는 정보를 되살리지 못하므로 denoiser가 완벽해도 reconstruction ceiling이 남는다.
 */
const SCENES = [
  {
    label: "원본 image",
    summary: "1024 × 1024 × 3 = 3,145,728",
    note: "pixel 하나에 R·G·B 숫자 3개가 있습니다. 1024×1024 image는 위치 1,048,576개, scalar(낱개 숫자) 약 314만 개입니다. 오른쪽은 그중 가로세로 8 pixel짜리 블록 하나를 확대한 것으로, 이 블록에만 64 × 3 = 192개의 숫자가 있습니다.",
  },
  {
    label: "공간축을 각각 8배 압축",
    summary: "128 × 128 = 16,384 위치",
    note: "Height와 width를 각각 8로 나누므로 8×8 pixel 블록 하나가 latent 위치 하나가 됩니다. 위치 수는 1,048,576에서 16,384로 8² = 64분의 1이 됩니다. Denoiser가 반복해서 처리할 위치 수가 줄어드는 지점입니다.",
  },
  {
    label: "위치마다 channel 16개",
    summary: "16,384 × 16 = 262,144",
    note: "줄어든 위치 하나가 숫자 16개(latent channel c_z)를 운반합니다. 블록당 숫자는 192에서 16으로, 전체 scalar는 약 314만에서 약 26만으로 약 12분의 1입니다. 위치는 64분의 1인데 scalar는 12분의 1이므로, 비용이 정확히 64분의 1이 되는 것은 아닙니다.",
  },
  {
    label: "Decoder는 z에 남은 것만 되살림",
    summary: "복원 상한 = D(z)",
    note: "생성은 latent z에서 반복되고 마지막에 decoder D가 image로 되돌립니다. 압축 단계에서 가는 글자 획이나 피부 texture가 z에 남지 않았다면, denoiser가 완벽한 latent를 만들어도 D가 그 detail을 복구할 수 없습니다. 압축률이 생성 가능한 detail의 상한이 되는 이유입니다.",
  },
] as const;

const PIX = 11;

function GridScene({ active }: { active: number }) {
  const latentOn = active >= 1;
  const channelsOn = active >= 2;
  return (
    <svg viewBox="0 0 360 170" className="mx-auto block w-full max-w-lg" role="img" aria-label="image의 8×8 pixel 블록이 latent 위치 하나로 압축되는 그림">
      <rect x="8" y="34" width="96" height="96" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
      <rect x="8" y="34" width="14" height="14" fill="#2563eb33" stroke="#2563eb" strokeWidth="1.25" />
      <text x="56" y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">image x</text>
      <text x="56" y="146" textAnchor="middle" fontSize="11" fill="#64748b">1024 × 1024</text>
      <text x="8" y="160" fontSize="10.5" fill="#64748b">파란 칸 = 블록(과장)</text>
      <line x1="22" y1="34" x2="124" y2="34" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="22" y1="48" x2="124" y2="122" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" />
      {Array.from({ length: 64 }, (_, i) => (
        <rect key={i} x={124 + (i % 8) * PIX} y={34 + Math.floor(i / 8) * PIX} width={PIX} height={PIX} fill="#dbeafe" stroke="#2563eb" strokeWidth="0.5" />
      ))}
      <text x="168" y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">8×8 pixel 블록</text>
      <text x="168" y="146" textAnchor="middle" fontSize="11" fill="#64748b">64칸 × RGB 3 = 192값</text>
      <g opacity={latentOn ? 1 : 0.18}>
        <line x1="216" y1="78" x2="252" y2="78" stroke="#059669" strokeWidth="1.25" />
        <path d="M247 73 L254 78 L247 83" fill="none" stroke="#059669" strokeWidth="1.25" />
        <text x="235" y="68" textAnchor="middle" fontSize="10" fill="#059669">E</text>
        <rect x="262" y="58" width="40" height="40" fill="#d1fae5" stroke="#059669" strokeWidth="1.25" />
        <text x="306" y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">latent 위치 1개</text>
        <text x="306" y="146" textAnchor="middle" fontSize="11" fill="#64748b">grid 128 × 128</text>
      </g>
      <g opacity={channelsOn ? 1 : 0}>
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={310} y={34 + i * 6} width="34" height="4" fill="#059669" opacity={0.35 + (i % 4) * 0.15} />
        ))}
        <text x="306" y="160" textAnchor="middle" fontSize="11" fontWeight="700" fill="#059669">c_z = 16값</text>
      </g>
    </svg>
  );
}

function Arrow({ d, head }: { d: string; head: string }) {
  return (
    <g fill="none" stroke="#64748b" strokeWidth="1">
      <path d={d} />
      <path d={head} />
    </g>
  );
}

function CeilingScene() {
  const box = (x: number, y: number, label: string, sub: string, color: string) => (
    <g>
      <rect x={x} y={y} width="96" height="44" rx="8" fill="none" stroke={color} strokeWidth="1.25" />
      <text x={x + 48} y={y + 19} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{label}</text>
      <text x={x + 48} y={y + 34} textAnchor="middle" fontSize="9.5" fill="#64748b">{sub}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 360 170" className="mx-auto block w-full max-w-lg" role="img" aria-label="encoder, denoiser, decoder 순서와 복원 상한">
      {box(8, 14, "학습 image x", "글자 획·texture 포함", "#64748b")}
      {box(132, 14, "Encoder E", "압축", "#059669")}
      {box(256, 14, "latent z", "획·texture 빠짐(가정)", "#059669")}
      <Arrow d="M104 36 L130 36" head="M125 32 L130 36 L125 40" />
      <Arrow d="M228 36 L254 36" head="M249 32 L254 36 L249 40" />
      <text x="180" y="78" textAnchor="middle" fontSize="10" fontWeight="700" fill="#dc2626">✕ 여기서 잃은 detail은 z에 없음</text>
      <Arrow d="M304 58 L304 96" head="M300 91 L304 96 L308 91" />
      {box(256, 98, "Denoiser", "완벽하다고 가정", "#2563eb")}
      {box(132, 98, "Decoder D", "z만 입력", "#059669")}
      {box(8, 98, "생성 image", "획·texture 상한", "#dc2626")}
      <Arrow d="M254 120 L230 120" head="M235 116 L230 120 L235 124" />
      <Arrow d="M130 120 L106 120" head="M111 116 L106 120 L111 124" />
      <text x="180" y="162" textAnchor="middle" fontSize="10" fill="#64748b">D가 되살릴 수 있는 것 ≤ z에 남은 것</text>
    </svg>
  );
}

function Counts({ active }: { active: number }) {
  const rows = [
    { name: "위치 수", from: "1,048,576", to: "16,384", ratio: "1/64", show: 1 },
    { name: "위치당 숫자", from: "3", to: "16", ratio: "", show: 2 },
    { name: "전체 scalar", from: "3,145,728", to: "262,144", ratio: "약 1/12", show: 2 },
  ] as const;
  return (
    <div className="mt-3 grid grid-cols-[4.75rem_minmax(0,1fr)_minmax(0,1fr)_3.25rem] gap-x-2 gap-y-1 whitespace-nowrap font-mono text-[11px] sm:text-sm">
      <span />
      <span className="text-muted-foreground">image</span>
      <span className="text-muted-foreground">latent</span>
      <span className="text-right text-muted-foreground">비율</span>
      {rows.map((row) => (
        <div key={row.name} className="contents">
          <span className="font-sans text-muted-foreground">{row.name}</span>
          <span>{row.from}</span>
          <span className={active >= row.show ? "font-bold text-[#059669]" : "text-muted-foreground/40"}>{active >= row.show ? row.to : "?"}</span>
          <span className="text-right font-bold">{active >= row.show ? row.ratio : ""}</span>
        </div>
      ))}
    </div>
  );
}

export default function LatentGridViz() {
  return (
    <SceneShell
      eyebrow="공간 압축"
      title="8×8 pixel 블록 하나가 숫자 16개짜리 latent 위치 하나가 됩니다"
      description="본문 예시인 1024×1024 RGB image, 공간 압축률 8, latent channel 16을 그대로 계산합니다. 마지막 장면은 압축된 z가 생성 결과의 detail 상한이 되는 순서를 보입니다."
      ariaLabel="image pixel이 latent grid로 압축될 때 위치 수와 scalar 수의 변화"
      scenes={SCENES}
      render={(active) =>
        active < 3 ? (
          <div className="min-w-0">
            <GridScene active={active} />
            <Counts active={active} />
          </div>
        ) : (
          <div className="min-w-0">
            <CeilingScene />
          </div>
        )
      }
    />
  );
}
