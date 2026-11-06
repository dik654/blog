import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory-pool — 세 graph의 임시 공간 16·24·32 KiB. 따로면 72, 완전 재사용 모형이면 max = 32.
 * 막대 길이는 KiB에 비례한다. 출력 자리의 위치는 본문이 정하지 않았으므로 마지막 장면은 축척 없는 칸으로 그린다.
 */
const GRAPHS = [
  { name: "graph 1", kib: 16, color: "#64748b" },
  { name: "graph 2", kib: 24, color: "#2563eb" },
  { name: "graph 3", kib: 32, color: "#0f766e" },
] as const;

const SCENES = [
  { label: "따로 잡으면", summary: "16 + 24 + 32 = 72 KiB", mode: "apart", note: "세 graph가 임시 작업 공간을 각자 잡으면 합계 72 KiB입니다. 숫자는 설명을 위한 가정입니다." },
  { label: "같은 공간을 재사용하면", summary: "max(16, 24, 32) = 32 KiB", mode: "shared", note: "서로 동시에 실행하지 않고 수명 조건을 지키며 임시 공간을 완전히 재사용할 수 있다는 모형에서는 가장 큰 32 KiB로 충분합니다. 실제 예약 메모리에는 살아 있는 출력과 allocator의 배치 등이 더해지므로 보장된 사용량이 아닙니다." },
  { label: "번갈아 쓸 때만", summary: "동시 실행 없음", mode: "turns", note: "공식 문서는 같은 캡처 순서로 재생하고 동시 실행하지 않는 공유 조건을 설명합니다. 서로의 출력에 의존하지 않는 별도 graph는 동시 실행하지 않는 조건으로 공유할 수도 있습니다. 위에서 아래로 한 번에 한 graph만 그렸고, 이 차례는 예시입니다(가정)." },
  { label: "출력은 덮일 수 있습니다", summary: "22를 남기려면 먼저 복사", mode: "output", note: "공유한 공간의 출력은 다른 graph의 재생으로 덮일 수 있습니다. 앞 답 22를 남겨야 한다면 덮어쓰기 전에 별도 복사본이 필요하고, 그 복사 비용도 함께 계산해야 합니다. 이 장면의 칸 크기는 KiB 축척이 아닙니다." },
] as const;

const W = 340;
const LEFT = 52;
const SCALE = (W - LEFT - 8) / 72;
const ROW = 30;
const TOP = 10;
const OFFSETS = GRAPHS.map((_, index) => GRAPHS.slice(0, index).reduce<number>((sum, graph) => sum + graph.kib, 0));

function Bar({ x, y, kib, color, label }: { x: number; y: number; kib: number; color: string; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={kib * SCALE} height={22} fill={color} opacity={0.25} stroke={color} strokeWidth={1} />
      <text x={x + (kib * SCALE) / 2} y={y + 15} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">{label}</text>
    </g>
  );
}

export default function SharedPoolViz() {
  return (
    <SceneShell
      eyebrow="graph 전용 공간"
      title="동시에 돌지 않으면 임시 공간을 겹쳐 쓸 수 있습니다"
      description="가로 길이가 임시 작업 공간의 크기(KiB)입니다. 세 graph의 16·24·32 KiB는 가정이고, 앞 문단의 메모리 pool은 graph 전용으로 잡아 두는 공간입니다."
      note="과거의 35개×200 MB=7 GB와 공유 후 200 MB 계산도 임시 공간의 완전 재사용을 가정한 산술로만 성립합니다."
      ariaLabel="세 graph의 임시 공간을 따로 잡을 때와 공유할 때 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} 112`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.mode === "apart" && (
              <>
                {GRAPHS.map((graph, index) => (
                  <Bar key={graph.name} x={LEFT + OFFSETS[index] * SCALE} y={TOP + ROW} kib={graph.kib} color={graph.color} label={`${graph.kib}`} />
                ))}
                <text x={0} y={TOP + ROW + 15} fontSize={11} fontWeight={700} className="fill-foreground">메모리</text>
                {GRAPHS.map((graph, index) => (
                  <text key={graph.name} x={LEFT + (OFFSETS[index] + graph.kib / 2) * SCALE} y={TOP + ROW - 6} textAnchor="middle" fontSize={11} className="fill-muted-foreground">{graph.name}</text>
                ))}
              </>
            )}
            {(scene.mode === "shared" || scene.mode === "turns") &&
              GRAPHS.map((graph, index) => (
                <g key={graph.name}>
                  <text x={0} y={TOP + index * ROW + 15} fontSize={11} fontWeight={700} className="fill-foreground">{scene.mode === "turns" ? `${index + 1}번째` : graph.name}</text>
                  <Bar x={LEFT} y={TOP + index * ROW} kib={graph.kib} color={graph.color} label={scene.mode === "turns" ? `${graph.name} ${graph.kib}` : `${graph.kib}`} />
                  {scene.mode === "turns" && <text x={LEFT + 32 * SCALE + 6} y={TOP + index * ROW + 15} fontSize={11} className="fill-muted-foreground">나머지는 실행 안 함</text>}
                </g>
              ))}
            {scene.mode === "shared" && (
              <rect x={LEFT} y={TOP - 3} width={32 * SCALE} height={ROW * 3 + 1} fill="none" stroke="#b45309" strokeWidth={1.25} strokeDasharray="4 3" />
            )}
            {scene.mode === "shared" && <text x={LEFT + 32 * SCALE + 6} y={TOP + ROW + 15} fontSize={11} fontWeight={700} fill="#b45309">공유 공간 32</text>}
            {scene.mode === "output" && (
              <>
                <text x={0} y={TOP + 15} fontSize={11} fontWeight={700} className="fill-foreground">출력 자리</text>
                <rect x={LEFT + 8} y={TOP} width={70} height={22} rx={2} fill="#2563eb" opacity={0.2} stroke="#2563eb" strokeWidth={1} />
                <text x={LEFT + 43} y={TOP + 15} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">22</text>
                <text x={LEFT + 90} y={TOP + 15} fontSize={11} className="fill-muted-foreground">다른 graph 재생 →</text>
                <rect x={LEFT + 196} y={TOP} width={70} height={22} rx={2} fill="#b45309" opacity={0.2} stroke="#b45309" strokeWidth={1} />
                <text x={LEFT + 231} y={TOP + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">덮임</text>
                <path d={`M${LEFT + 43} ${TOP + 24}V${TOP + 58}`} stroke="#0f766e" strokeWidth={1} strokeDasharray="3 2" />
                <text x={0} y={TOP + 76} fontSize={11} fontWeight={700} className="fill-foreground">복사본</text>
                <rect x={LEFT + 8} y={TOP + 60} width={70} height={22} rx={2} fill="#0f766e" opacity={0.2} stroke="#0f766e" strokeWidth={1} />
                <text x={LEFT + 43} y={TOP + 75} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">22</text>
                <text x={LEFT + 90} y={TOP + 75} fontSize={11} className="fill-muted-foreground">덮이기 전에 다른 공간으로</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
