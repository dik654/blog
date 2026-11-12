import SceneShell from "./SceneShell";

/**
 * 본문 대응: #patch-embedding — Conv2d(kernel=16, stride=16)가 patch projection과 같은 계산을 하고,
 * 출력 [B,768,14,14]를 reshape → [B,768,196], permute → [B,196,768]로 바꾸는 과정.
 * 224÷16 = 14, 14×14 = 196, 16×16×3 = 768(patch 값 수), D = 768(kernel 수). 예시 칸 (1,2) → 14×1+2 = 16.
 */
const GRID = 14;
const CELL = 10;
const GX = 12;
const GY = 34;
const R = 1;
const S = 2;
const INDEX = GRID * R + S;

const ACCENT = "#2563eb";
const SECOND = "#d97706";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  {
    label: "Kernel 하나가 patch 하나를 읽습니다",
    summary: "768값 · 768weight → 숫자 1개",
    note: "Kernel은 16×16×3 weight 묶음입니다. Stride 16이라 다음 위치는 바로 옆 patch이고 겹치지 않습니다. 한 위치에서 곱해 모두 더하고 bias를 더하면 숫자 하나입니다. 칸 (1,2)는 행·열을 0부터 센 좌표이고 예로 고른 것입니다(가정).",
  },
  {
    label: "Kernel 768개면 칸마다 768개",
    summary: "[B,768,14,14]",
    note: "Kernel D=768개가 같은 patch에서 숫자 768개, 곧 token 하나를 만듭니다. 펼친 kernel d가 E의 d번째 열과 같아 펼친 patch × E와 같은 값이고, 펼치는 순서가 다르면 깨집니다.",
  },
  {
    label: "Reshape: 14×14 격자를 한 줄로",
    summary: "[B,768,14,14] → [B,768,196]",
    note: "격자를 행 순서로 이어 붙이면 위치 196개가 한 줄이 됩니다. (r,s) 칸은 0부터 센 14×r+s번 자리라 (1,2)는 16번(17번째)입니다. Channel 축 768은 그대로입니다.",
  },
  {
    label: "Permute: 축 순서를 바꿉니다",
    summary: "[B,768,196] → [B,196,768]",
    note: "값은 그대로 두고 축 순서만 바꿉니다. 이제 한 행이 token 하나(768개 값)이고 행이 196개입니다. 앞 절처럼 [CLS]를 맨 앞에 붙이면 197입니다. Batch 축 B는 생략했습니다.",
  },
] as const;

function ImageGrid({ active }: { active: number }) {
  return (
    <g>
      <text x={GX} y={22} fontSize={11} fontWeight={700} fill={TEXT}>
        {active === 0 ? "224×224×3 image · 16px 간격" : "출력 격자 14×14"}
      </text>
      {Array.from({ length: GRID * GRID }, (_, i) => {
        const r = Math.floor(i / GRID);
        const s = i % GRID;
        const pick = r === R && s === S;
        const next = active === 0 && r === R && s === S + 1;
        const rowBand = active === 2 && r === R;
        return (
          <rect
            key={i}
            x={GX + s * CELL}
            y={GY + r * CELL}
            width={CELL}
            height={CELL}
            fill={pick ? ACCENT : rowBand ? SECOND : MUTED}
            fillOpacity={pick ? 0.8 : rowBand ? 0.35 : 0.12}
            stroke={next ? ACCENT : "#cbd5e1"}
            strokeWidth={next ? 1.25 : 0.5}
            strokeDasharray={next ? "2 1.5" : undefined}
          />
        );
      })}
      <text x={GX} y={GY + GRID * CELL + 16} fontSize={10} fill={TEXT}>
        224 ÷ 16 = 14칸씩
      </text>
      {active === 0 && (
        <text x={GX} y={GY + GRID * CELL + 30} fontSize={10} fill={ACCENT}>
          점선 = stride 16 뒤 다음 위치
        </text>
      )}
    </g>
  );
}

function Right({ active }: { active: number }) {
  const x = 170;
  if (active === 0) {
    return (
      <g>
        <rect x={x} y={34} width={176} height={34} rx={4} fill={ACCENT} fillOpacity={0.12} stroke={ACCENT} strokeWidth={1} />
        <text x={x + 8} y={50} fontSize={11} fontWeight={700} fill={ACCENT}>patch (1,2)</text>
        <text x={x + 8} y={63} fontSize={10} fill={TEXT}>16×16×3 = 768개 값</text>
        <rect x={x} y={78} width={176} height={34} rx={4} fill={SECOND} fillOpacity={0.12} stroke={SECOND} strokeWidth={1} />
        <text x={x + 8} y={94} fontSize={11} fontWeight={700} fill={SECOND}>kernel K_d</text>
        <text x={x + 8} y={107} fontSize={10} fill={TEXT}>16×16×3 = 768개 weight</text>
        <text x={x + 8} y={134} fontSize={11} fill={TEXT}>칸끼리 곱해 모두 더하고 + b_d</text>
        <text x={x + 8} y={156} fontSize={12} fontWeight={700} fill={TEXT}>= 숫자 1개 · y(1,2,d)</text>
      </g>
    );
  }
  if (active === 1) {
    const segs = 12;
    return (
      <g>
        <text x={x} y={22} fontSize={11} fontWeight={700} fill={TEXT}>(1,2) 칸의 출력</text>
        {Array.from({ length: segs }, (_, i) => (
          <rect key={i} x={x} y={32 + i * 11} width={22} height={10} fill={ACCENT} fillOpacity={0.25 + (i % 3) * 0.15} />
        ))}
        <text x={x + 11} y={32 + segs * 11 + 13} textAnchor="middle" fontSize={10} fill={ACCENT}>⋮</text>
        <text x={x + 30} y={44} fontSize={10} fill={TEXT}>K_1 → 1번째 값</text>
        <text x={x + 30} y={66} fontSize={10} fill={TEXT}>K_2 → 2번째 값</text>
        <text x={x + 30} y={160} fontSize={10} fill={TEXT}>K_768 → 768번째 값</text>
        <text x={x + 30} y={100} fontSize={11} fontWeight={700} fill={ACCENT}>= token 하나</text>
        <text x={x + 30} y={116} fontSize={10} fill={TEXT}>flatten(K_d) = E의 d열</text>
        <text x={x} y={192} fontSize={10} fill={SECOND}>이 768 = kernel 수 D</text>
        <text x={x} y={206} fontSize={10} fill={SECOND}>(patch 값 16×16×3 = 768과 다른 축)</text>
      </g>
    );
  }
  if (active === 2) {
    const bw = 176 / GRID;
    return (
      <g>
        <text x={x} y={22} fontSize={11} fontWeight={700} fill={TEXT}>위치 196개 한 줄</text>
        {Array.from({ length: GRID }, (_, row) => (
          <g key={row}>
            <rect x={x + row * bw} y={70} width={bw - 1} height={22} fill={row === R ? SECOND : MUTED} fillOpacity={row === R ? 0.35 : 0.15} />
          </g>
        ))}
        <text x={x} y={64} fontSize={10} fill={TEXT}>행0</text>
        <text x={x + R * bw + 2} y={108} fontSize={10} fill={SECOND}>행1 = 14~27</text>
        <rect x={x + R * bw + (S / GRID) * bw} y={70} width={Math.max(2, bw / GRID)} height={22} fill={ACCENT} />
        <text x={x + 176} y={64} textAnchor="end" fontSize={10} fill={TEXT}>행13 → 195</text>
        <text x={x} y={140} fontSize={11} fontWeight={700} fill={ACCENT}>(1,2) → 14×1 + 2 = 16</text>
        <text x={x} y={160} fontSize={10} fill={TEXT}>14 × 14 = 196 · channel 768 그대로</text>
      </g>
    );
  }
  return null;
}

function Permute() {
  const left = { x: 20, y: 46, w: 150, h: 70 };
  const right = { x: 236, y: 30, w: 70, h: 150 };
  const col = left.x + (INDEX / 196) * left.w;
  const row = right.y + (INDEX / 196) * right.h;
  return (
    <g>
      <text x={left.x} y={22} fontSize={11} fontWeight={700} fill={TEXT}>[768, 196]</text>
      <rect x={left.x} y={left.y} width={left.w} height={left.h} fill={MUTED} fillOpacity={0.15} stroke={MUTED} strokeWidth={1} />
      <rect x={col} y={left.y} width={3} height={left.h} fill={ACCENT} />
      <text x={left.x} y={left.y - 6} fontSize={10} fill={TEXT}>→ 위치 196</text>
      <text x={left.x - 6} y={left.y + left.h / 2} fontSize={10} fill={TEXT} textAnchor="middle" transform={`rotate(-90 ${left.x - 6} ${left.y + left.h / 2})`}>
        channel 768
      </text>
      <text x={left.x} y={left.y + left.h + 16} fontSize={10} fill={ACCENT}>16번 열 = 768개 값</text>
      <line x1={left.x + left.w + 10} x2={right.x - 12} y1={left.y + left.h / 2} y2={left.y + left.h / 2} stroke={TEXT} strokeWidth={1} />
      <path d={`M ${right.x - 12} ${left.y + left.h / 2 - 4} L ${right.x - 6} ${left.y + left.h / 2} L ${right.x - 12} ${left.y + left.h / 2 + 4} Z`} fill={TEXT} />
      <text x={right.x} y={22} fontSize={11} fontWeight={700} fill={TEXT}>[196, 768]</text>
      <rect x={right.x} y={right.y} width={right.w} height={right.h} fill={MUTED} fillOpacity={0.15} stroke={MUTED} strokeWidth={1} />
      <rect x={right.x} y={row} width={right.w} height={3} fill={ACCENT} />
      <text x={right.x + right.w + 6} y={row + 4} fontSize={10} fill={ACCENT}>token 16</text>
      <text x={right.x + right.w + 6} y={right.y + right.h} fontSize={10} fill={TEXT}>행 196개</text>
    </g>
  );
}

export default function ConvPatchProjectionViz() {
  return (
    <SceneShell
      eyebrow="Conv2d로 만든 patch token"
      title="Kernel 16·stride 16 convolution이 token 196개를 만드는 순서"
      description="왼쪽 격자 한 칸이 16×16 patch 하나입니다. 같은 값이 어느 축에 놓이는지만 바뀌는 과정을 따라갑니다."
      ariaLabel="Conv2d patch projection과 reshape, permute로 바뀌는 tensor 축"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox="0 0 360 210"
          className="mx-auto h-auto w-full max-w-[560px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          {active === 3 ? (
            <Permute />
          ) : (
            <>
              <ImageGrid active={active} />
              <Right active={active} />
            </>
          )}
        </svg>
      )}
    />
  );
}
