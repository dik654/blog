import FusionSceneShell from "./FusionSceneShell";

/**
 * 본문 대응: #flash-attention — naive attention은 QKᵀ·softmax·PV 사이의 큰 attention matrix를 HBM에
 * materialize하기도 한다. FlashAttention은 Q·K·V tiles를 on-chip memory에 stage하고 online softmax와 V 곱을
 * tile budget 안에서 연결해 full matrix HBM 왕복을 피한다.
 * 왼쪽 = HBM, 오른쪽 = on-chip(register·shared memory). 격자 = attention score matrix를 tile로 나눈 자리 표시. 실제로 on-chip에 있는 것은 진한 tile 하나뿐이다.
 * 4×4 tile 분할은 그림을 위한 가정.
 */
const N = 4;

const SCENES = [
  {
    label: "Naive: score matrix 전체가 HBM을 거칩니다",
    summary: "QKᵀ → HBM → softmax → HBM → PV",
    note: "QKᵀ 결과인 score matrix 전체를 HBM에 쓰고, softmax가 다시 읽어 결과를 또 HBM에 쓰고, PV가 그것을 읽는 구현이 있습니다.",
    done: 0,
  },
  {
    label: "Q tile 하나와 K·V 첫 tile을 on-chip에 올립니다",
    summary: "tile 1개 계산 · HBM 쓰기 없음",
    note: "Q의 한 tile과 K·V의 첫 tile만 on-chip memory에 올려 그 부분의 score를 계산합니다. 이 조각은 HBM에 쓰지 않고 바로 softmax와 V 곱에 넘깁니다.",
    done: 1,
  },
  {
    label: "다음 K·V tile이 오면 지금까지의 합을 고쳐 씁니다",
    summary: "online softmax로 부분 출력 갱신",
    note: "online softmax는 tile마다 지금까지 본 최댓값과 지수 합을 갱신하고, 앞서 쌓은 부분 출력을 새 최댓값 기준으로 다시 맞추는 방식입니다. 그래서 행 전체를 한꺼번에 보지 않고도 같은 softmax 결과에 도달합니다.",
    done: 2,
  },
  {
    label: "모든 K·V tile을 지나면 출력만 HBM에 씁니다",
    summary: "HBM에는 O만 · full matrix 왕복 없음",
    note: "Q tile 한 줄의 출력이 완성되면 O만 HBM에 쓰고, 다른 Q tile 줄도 같은 방식으로 처리합니다. tile 크기는 register·shared memory 예산 안에서 정하므로 이 방식은 무제한 fusion이 아니라 자원에 맞춘 경계입니다.",
    done: N,
  },
] as const;

const W = 340;
const H = 190;
const GRID_X = 196;
const GRID_Y = 52;
const T = 22;

function Box({ x, y, w, label, color, faded = false }: { x: number; y: number; w: number; label: string; color: string; faded?: boolean }) {
  return (
    <g opacity={faded ? 0.35 : 1}>
      <rect x={x} y={y} width={w} height={20} rx={4} fill="#ffffff" stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function FlashTileViz() {
  return (
    <FusionSceneShell
      eyebrow="Tile-budgeted fusion"
      title="FlashAttention은 score matrix를 tile 단위로 on-chip에서 소비합니다"
      description="왼쪽은 HBM, 오른쪽은 on-chip memory(register·shared memory)입니다. 격자는 attention score matrix의 tile 자리이며 한 번에 on-chip에 있는 것은 진한 tile 하나입니다. 4×4 분할은 설명을 위한 가정입니다."
      ariaLabel="naive attention과 FlashAttention의 score matrix HBM 왕복 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const naive = active === 0;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={4} y={4} width={150} height={182} rx={8} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1} />
            <text x={14} y={22} fontSize={11} fontWeight={700} fill="#334155">HBM</text>
            <Box x={14} y={32} w={38} label="Q" color="#2563eb" />
            <Box x={58} y={32} w={38} label="K" color="#2563eb" />
            <Box x={102} y={32} w={38} label="V" color="#2563eb" />
            {naive ? (
              <>
                <rect x={14} y={62} width={126} height={70} rx={4} fill="#fee2e2" stroke="#dc2626" strokeWidth={1} />
                <text x={77} y={84} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b91c1c">score matrix 전체</text>
                <text x={77} y={100} textAnchor="middle" fontSize={10} fill="#b91c1c">QKᵀ가 씀 · softmax가 읽음</text>
                <text x={77} y={115} textAnchor="middle" fontSize={10} fill="#b91c1c">softmax 결과도 씀 · PV가 읽음</text>
              </>
            ) : (
              <>
                <rect x={14} y={62} width={126} height={70} rx={4} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
                <text x={77} y={101} textAnchor="middle" fontSize={10} fill="#94a3b8">score matrix 없음</text>
              </>
            )}
            <Box x={14} y={146} w={126} label={naive ? "O" : active === 3 ? "O · 이제 씀" : "O · 아직 안 씀"} color={active === 3 || naive ? "#16a34a" : "#94a3b8"} faded={!naive && active < 3} />

            <rect x={166} y={4} width={170} height={182} rx={8} fill="#ffffff" stroke="#475569" strokeWidth={1.25} />
            <text x={176} y={22} fontSize={11} fontWeight={700} fill="#334155">on-chip</text>
            {naive ? (
              <text x={251} y={100} textAnchor="middle" fontSize={10} fill="#64748b">단계마다 HBM에서 다시 읽음</text>
            ) : (
              <>
                <text x={GRID_X - 6} y={GRID_Y - 8} fontSize={10} fill="#64748b">K·V tile →</text>
                {Array.from({ length: N * N }, (_, cell) => {
                  const row = Math.floor(cell / N);
                  const col = cell % N;
                  const current = row === 0 && col === scene.done - 1;
                  const used = row === 0 && col < scene.done - 1;
                  return (
                    <rect
                      key={cell}
                      x={GRID_X + col * (T + 4)}
                      y={GRID_Y + row * (T + 4)}
                      width={T}
                      height={T}
                      rx={3}
                      fill={current ? "#f59e0b" : used ? "#fef3c7" : "none"}
                      stroke={current ? "#b45309" : row === 0 ? "#d97706" : "#cbd5e1"}
                      strokeWidth={1}
                      strokeDasharray={current ? undefined : "3 3"}
                    />
                  );
                })}
                <text x={GRID_X + N * (T + 4) + 2} y={GRID_Y + 16} fontSize={10} fill="#b45309">Q tile</text>
                <text x={176} y={168} fontSize={10} fontWeight={700} fill="#b45309">진한 칸 하나만 지금 on-chip</text>
                <text x={176} y={181} fontSize={10} fill="#334155">
                  {active === 1 ? "부분 출력 1개 tile 반영" : active === 2 ? "최댓값·지수 합 갱신 후 재조정" : "한 줄 완료 → O만 내보냄"}
                </text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
