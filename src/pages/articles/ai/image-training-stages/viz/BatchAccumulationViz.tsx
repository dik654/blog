import SceneShell from "./SceneShell";

/**
 * 본문 대응: #resolution-stage — 160px→320px 전환과 effective batch.
 * S0: 64 images/GPU × 4 GPUs × 1회 누적 = 256. S1: 16 × 4 × 4 = 256.
 * 픽셀: 160² = 25,600, 320² = 102,400 (4배). update당 픽셀 256×25,600 = 6,553,600, 256×102,400 = 26,214,400.
 * 큰 사각형 = GPU 하나, 작은 칸 = 이미지 한 장. 같은 GPU 4개는 본문의 가정입니다.
 */
const SCENES = [
  {
    label: "S0: 한 번 보고 갱신",
    summary: "64 × 4 × 1 = 256장",
    note: "GPU 4개가 각자 160px 이미지 64장을 한 번에 처리합니다(micro-step). S0은 micro-step마다 optimizer를 갱신하므로 update 한 번이 256장을 봅니다.",
  },
  {
    label: "S1: 한 장의 픽셀이 네 배",
    summary: "320² = 160² × 4",
    note: "320px 한 장은 160px 네 장만큼 픽셀을 가집니다. 그래서 한 GPU에 넣을 수 있는 이미지 수가 줄어들 수 있고, 이 글의 S1은 GPU당 16장을 씁니다.",
  },
  {
    label: "S1: 네 번 쌓고 한 번 갱신",
    summary: "16 × 4 × 4 = 256장",
    note: "micro-step 한 번은 16×4=64장입니다. gradient를 네 번 더한 뒤 갱신하므로 update 한 번이 다시 256장을 봅니다.",
  },
  {
    label: "같은 256장, 다른 픽셀 수",
    summary: "update당 픽셀 4배",
    note: "이미지 수는 같아도 update당 픽셀은 4배입니다. effective batch가 같아도 입력의 픽셀 수와 crop 분포는 다르다는 본문의 단서가 이 차이입니다.",
  },
] as const;

const ACC = "#2563eb";
const STEP = "#d97706";
const INK = "#64748b";
const OFF = "#94a3b8";

const BOX = 62;
const GX = (g: number) => 8 + g * (BOX + 12);
const GY = 30;

function GpuGrid({ g, s1, highlight }: { g: number; s1: boolean; highlight: boolean }) {
  const n = s1 ? 4 : 8;
  const tile = BOX / n;
  return (
    <g>
      <text x={GX(g) + BOX / 2} y={GY - 5} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={INK}>
        GPU {g + 1}
      </text>
      {Array.from({ length: n * n }, (_, k) => {
        const r = Math.floor(k / n);
        const c = k % n;
        const hot = highlight && k === 0;
        return (
          <rect
            key={k}
            x={GX(g) + c * tile + 0.5}
            y={GY + r * tile + 0.5}
            width={tile - 1}
            height={tile - 1}
            fill={hot ? STEP : ACC}
            fillOpacity={hot ? 0.45 : 0.16}
            stroke={hot ? STEP : ACC}
            strokeWidth={0.5}
          />
        );
      })}
      <rect x={GX(g)} y={GY} width={BOX} height={BOX} fill="none" stroke={INK} strokeWidth={1} />
    </g>
  );
}

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g stroke={INK} strokeWidth={1} fill="none">
      <line x1={x1} x2={x2 - 4} y1={y} y2={y} />
      <path d={`M${x2 - 5} ${y - 3} L${x2} ${y} L${x2 - 5} ${y + 3}`} />
    </g>
  );
}

function UpdateBox({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={84} height={38} rx={6} fill={ACC} fillOpacity={0.12} stroke={ACC} strokeWidth={1.25} />
      <text x={x + 42} y={y + 15} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={ACC}>
        optimizer update
      </text>
      <text x={x + 42} y={y + 30} textAnchor="middle" fontSize={9.5} fill={ACC}>
        1회 · 256장
      </text>
    </g>
  );
}

function Bottom({ active }: { active: number }) {
  const y = 110;
  if (active === 0) {
    return (
      <g>
        <rect x={8} y={y} width={120} height={38} rx={6} fill={STEP} fillOpacity={0.12} stroke={STEP} strokeWidth={1} />
        <text x={68} y={y + 15} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={STEP}>
          micro-step 1
        </text>
        <text x={68} y={y + 30} textAnchor="middle" fontSize={9.5} fill={STEP}>
          64 × 4 = 256장
        </text>
        <Arrow x1={134} x2={204} y={y + 19} />
        <text x={169} y={y + 12} textAnchor="middle" fontSize={9} fill={INK}>
          누적 1회
        </text>
        <UpdateBox x={208} y={y} />
      </g>
    );
  }
  if (active === 1) {
    return (
      <g>
        <rect x={8} y={y} width={50} height={50} fill={STEP} fillOpacity={0.2} stroke={STEP} strokeWidth={1} />
        <line x1={33} x2={33} y1={y} y2={y + 50} stroke={STEP} strokeWidth={1} strokeDasharray="2 2" />
        <line x1={8} x2={58} y1={y + 25} y2={y + 25} stroke={STEP} strokeWidth={1} strokeDasharray="2 2" />
        <text x={68} y={y + 12} fontSize={9.5} fontWeight={700} fill={STEP}>
          320 × 320 = 102,400 px
        </text>
        <text x={68} y={y + 28} fontSize={9.5} fill={INK}>
          점선 한 칸: 160 × 160 = 25,600 px
        </text>
        <text x={68} y={y + 44} fontSize={9.5} fill={INK}>
          102,400 ÷ 25,600 = 4
        </text>
        <text x={8} y={y + 68} fontSize={9.5} fontWeight={700} fill={ACC}>
          한 GPU: 64장(S0) → 16장(S1, 이 글의 설정)
        </text>
      </g>
    );
  }
  if (active === 2) {
    const w = 38;
    const bx = (i: number) => 8 + i * (w + 10);
    return (
      <g>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={bx(i)} y={y} width={w} height={38} rx={5} fill={STEP} fillOpacity={0.12} stroke={STEP} strokeWidth={1} />
            <text x={bx(i) + w / 2} y={y + 15} textAnchor="middle" fontSize={9} fontWeight={700} fill={STEP}>
              step {i + 1}
            </text>
            <text x={bx(i) + w / 2} y={y + 30} textAnchor="middle" fontSize={9} fill={STEP}>
              64장
            </text>
            {i < 3 && (
              <text x={bx(i) + w + 5} y={y + 23} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>
                +
              </text>
            )}
          </g>
        ))}
        <Arrow x1={188} x2={206} y={y + 19} />
        <UpdateBox x={208} y={y} />
        <text x={8} y={y + 56} fontSize={9.5} fill={INK}>
          네 step의 gradient를 더하는 동안 갱신은 없음
        </text>
      </g>
    );
  }
  const full = 222;
  const rows = [
    { name: "S0", px: "256 × 25,600 = 6,553,600 px", w: full / 4, c: OFF },
    { name: "S1", px: "256 × 102,400 = 26,214,400 px", w: full, c: ACC },
  ];
  return (
    <g>
      <text x={8} y={y + 2} fontSize={9.5} fontWeight={700} fill={INK}>
        update 한 번이 보는 픽셀
      </text>
      {rows.map((row, i) => (
        <g key={row.name}>
          <text x={8} y={y + 22 + i * 32} fontSize={9.5} fontWeight={700} fill={INK}>
            {row.name} · 256장
          </text>
          <rect x={70} y={y + 12 + i * 32} width={row.w} height={12} rx={2} fill={row.c} fillOpacity={0.5} />
          <text x={70} y={y + 36 + i * 32} fontSize={9} fill={INK}>
            {row.px}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function BatchAccumulationViz() {
  return (
    <SceneShell
      eyebrow="effective batch"
      title="update 한 번에 256장: S0은 한 번에, S1은 네 번 나눠 쌓습니다"
      description="큰 사각형 하나가 GPU 하나, 안의 작은 칸이 이미지 한 장입니다. 두 단계가 같은 GPU 4개를 쓴다는 본문의 가정을 따릅니다. gradient 누적은 optimizer를 한 번 갱신하기 전에 여러 micro-step의 gradient를 더하는 것입니다."
      ariaLabel="160px 단계와 320px 단계에서 GPU 4개와 gradient 누적으로 update당 256장을 맞추는 과정"
      scenes={SCENES}
      render={(active) => {
        const s1 = active >= 1;
        return (
          <svg viewBox="0 0 300 184" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={8} y={11} fontSize={10} fontWeight={700} fill={s1 ? ACC : INK}>
              {s1 ? "S1 · 320px · GPU당 16장" : "S0 · 160px · GPU당 64장"}
            </text>
            {[0, 1, 2, 3].map((g) => (
              <GpuGrid key={g} g={g} s1={s1} highlight={active === 1 && g === 0} />
            ))}
            <Bottom active={active} />
          </svg>
        );
      }}
    />
  );
}
