import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dense-vs-global 의 ProgressiveDetail — 패치 벡터 색인 비용.
 * 224픽셀 ÷ 패치 16 = 한 변 14칸 → 14 × 14 = 196개.
 * 1,024차원 × float16(2바이트) = 2KB. 196 × 2KB = 392KB.
 * 1,000만 장: 장면 벡터 1,000만 개·20GB, 패치 벡터 19.6억(약 20억) 개·20GB × 196 = 3,920GB(약 3.9TB).
 */
const SIDE = 224 / 16;
const PATCHES = SIDE * SIDE;
const PER_VECTOR_KB = (1024 * 2) / 1024;
const PER_PHOTO_KB = PATCHES * PER_VECTOR_KB;
const SCENE_GB = 20;
const PATCH_GB = SCENE_GB * PATCHES;

const SCENES = [
  {
    label: "사진 한 장",
    summary: `벡터 1개 vs ${PATCHES}개`,
    note: `224픽셀을 패치 16으로 자르면 한 변에 ${SIDE}칸, 모두 ${PATCHES}칸입니다. 칸마다 1,024차원 벡터가 나오고, float16(값 하나에 2바이트)이면 벡터 하나가 ${PER_VECTOR_KB}KB라서 패치를 다 넣으면 한 장에 ${PER_PHOTO_KB}KB입니다.`,
  },
  {
    label: "1,000만 장",
    summary: `${SCENE_GB}GB vs 약 3.9TB`,
    note: `장면 벡터만 넣으면 1,000만 개·${SCENE_GB}GB입니다. 패치를 다 넣으면 벡터가 ${PATCHES}배인 약 20억 개, 용량은 ${SCENE_GB}GB × ${PATCHES} = ${PATCH_GB.toLocaleString("en-US")}GB입니다. 아래 막대 길이가 그 비율입니다.`,
  },
  {
    label: "후보를 먼저 좁히기",
    summary: "장면 벡터 → 후보 안에서만 패치",
    note: "먼저 장면 벡터 하나로 후보 사진을 고르고, 그 후보 안에서만 패치끼리 비교합니다. 패치 비교 대상이 전체 색인이 아니라 후보 몇 장으로 줄어듭니다. 후보 수는 그림을 위한 가정입니다.",
  },
] as const;

const W = 360;
const H = 210;
const CELL = 8;

function PatchGrid({ x, y, cell, color, opacity = 1 }: { x: number; y: number; cell: number; color: string; opacity?: number }) {
  return (
    <g opacity={opacity}>
      {Array.from({ length: PATCHES }, (_, i) => (
        <rect
          key={i}
          x={x + (i % SIDE) * cell}
          y={y + Math.floor(i / SIDE) * cell}
          width={cell - 1}
          height={cell - 1}
          fill={color}
        />
      ))}
    </g>
  );
}

const PHOTOS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const CANDIDATES = new Set([1, 4, 6]);

export default function PatchIndexCostViz() {
  return (
    <SceneShell
      eyebrow="패치 색인 비용"
      title="벡터 하나가 196개가 되면 색인 전략이 바뀝니다"
      description="본문 숫자 그대로입니다. 224픽셀 입력, 패치 16, 1,024차원 float16, 사진 1,000만 장."
      ariaLabel="장면 벡터 하나와 패치 벡터 196개의 개수·용량 비교, 그리고 후보를 먼저 좁히는 두 단계 검색"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto h-auto w-full max-w-[560px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          {active === 0 && (
            <g>
              <text x={60} y={22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">장면 벡터</text>
              <rect x={60 - (CELL - 1) / 2} y={90} width={CELL - 1} height={CELL - 1} fill="#2563eb" />
              <text x={60} y={124} textAnchor="middle" fontSize={13} fill="#64748b">1개 · {PER_VECTOR_KB}KB</text>
              <line x1={120} x2={120} y1={20} y2={190} stroke="#cbd5e1" strokeWidth={1} />
              <text x={240} y={22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">패치 벡터 {SIDE} × {SIDE}</text>
              <PatchGrid x={240 - (SIDE * CELL) / 2} y={36} cell={CELL} color="#d97706" />
              <text x={240} y={162} textAnchor="middle" fontSize={13} fill="#64748b">{PATCHES}개 · {PER_PHOTO_KB}KB</text>
              <text x={240} y={182} textAnchor="middle" fontSize={12} fill="#64748b">칸 하나 = 벡터 하나(2KB)</text>
            </g>
          )}
          {active === 1 && (
            <g>
              <text x={16} y={40} fontSize={13} fontWeight={700} fill="#2563eb">장면 벡터만</text>
              <text x={344} y={40} textAnchor="end" fontSize={13} fill="#64748b">1,000만 개 · {SCENE_GB}GB</text>
              <rect x={16} y={48} width={Math.max(2, (328 * SCENE_GB) / PATCH_GB)} height={18} fill="#2563eb" />
              <text x={16} y={110} fontSize={13} fontWeight={700} fill="#d97706">패치 벡터 전부</text>
              <text x={344} y={110} textAnchor="end" fontSize={13} fill="#64748b">약 20억 개 · 약 3.9TB</text>
              <rect x={16} y={118} width={328} height={18} fill="#d97706" />
              <text x={16} y={168} fontSize={12} fill="#64748b">위 막대는 아래 막대의 1/{PATCHES}입니다</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <text x={16} y={22} fontSize={13} fontWeight={700} fill="#2563eb">1단계 · 장면 벡터로 후보 고르기</text>
              {PHOTOS.map((p) => (
                <rect
                  key={p}
                  x={16 + p * 42}
                  y={32}
                  width={34}
                  height={26}
                  rx={2}
                  fill={CANDIDATES.has(p) ? "#2563eb" : "#e2e8f0"}
                  stroke={CANDIDATES.has(p) ? "#1d4ed8" : "#cbd5e1"}
                  strokeWidth={1}
                />
              ))}
              <text x={344} y={74} textAnchor="end" fontSize={12} fill="#64748b">파란 칸 = 후보(가정 3장)</text>
              <text x={16} y={100} fontSize={13} fontWeight={700} fill="#d97706">2단계 · 후보 안에서만 패치 비교</text>
              {[...CANDIDATES].map((p, i) => (
                <g key={p}>
                  <PatchGrid x={40 + i * 110} y={110} cell={5} color="#d97706" />
                  <text x={40 + i * 110 + (SIDE * 5) / 2} y={194} textAnchor="middle" fontSize={12} fill="#64748b">후보 {i + 1} · {PATCHES}칸</text>
                </g>
              ))}
            </g>
          )}
        </svg>
      )}
    />
  );
}
