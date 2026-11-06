import SceneShell from "./SceneShell";

/**
 * 본문 대응: #research — 새 입력 5를 고르는 세 경로. 일반 재생은 A의 내용을 덮어쓰고,
 * CUDA 명시적 갱신은 kernel 인수를 바꾸고, PyGraph는 kernel이 주소표를 읽게 만든다.
 * 값은 본문 사례: 3이면 22, 5이면 30.
 */
const SCENES = [
  { label: "일반 재생 · A에 복사", summary: "A 내용 3 → 5 · 답 30", path: "copy", note: "kernel 인수는 그대로 A입니다. B의 5를 A로 복사해 A의 내용을 바꿉니다. 큰 입력이면 이 복사 비용이 graph의 이득을 줄일 수 있다는 것이 PyGraph가 다룬 문제입니다." },
  { label: "CUDA 명시적 갱신", summary: "인수를 A → B로", path: "update", note: "별도 API로 허용된 kernel 인수를 직접 바꿉니다. context와 node 종류의 제약을 충족하고 갱신 결과를 확인해야 하며, PyTorch 일반 replay가 자동으로 해 주는 일이 아닙니다. (가정) B로 갱신됐다면 답은 30입니다." },
  { label: "PyGraph · 표가 A를 가리킴", summary: "입력 3 → 답 22", path: "tableA", note: "parameter indirection은 kernel이 큰 데이터 대신 주소를 담은 작은 표를 읽게 바꾸는 방법입니다. 표가 A를 가리키면 입력 3의 답은 22입니다." },
  { label: "PyGraph · 표가 B를 가리킴", summary: "입력 5 → 답 30", path: "tableB", note: "큰 입력을 복사하지 않고 표의 주소만 갱신합니다. 일반 replay의 인수가 저절로 바뀐 결과가 아니라 표를 읽는 kernel과 표의 갱신이 함께 필요합니다. 작게 복사하는 경우에는 표를 옮기는 비용이 오히려 클 수 있습니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#b45309";
const GREY = "#94a3b8";

function Box({ x, y, w, label, sub, strong = false }: { x: number; y: number; w: number; label: string; sub?: string; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={40} rx={4} className="fill-background" stroke={strong ? BLUE : GREY} strokeWidth={strong ? 1.25 : 1} />
      <text x={x + w / 2} y={y + (sub ? 16 : 24)} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">{label}</text>
      {sub && <text x={x + w / 2} y={y + 32} textAnchor="middle" fontSize={11} className="fill-muted-foreground">{sub}</text>}
    </g>
  );
}

export default function InputPathsViz() {
  return (
    <SceneShell
      eyebrow="새 값을 고르는 경로"
      title="새 입력 5를 쓰는 길은 복사, 인수 갱신, 주소표로 갈립니다"
      description="왼쪽이 첫 작업의 kernel, 오른쪽이 입력 자리 A(값 3)와 B(값 5)입니다. 화살표는 kernel이 어디를 읽는지입니다. PyGraph는 입력 복사 비용을 다룬 2025년 연구입니다. 값은 이 글의 사례를 빌린 가정입니다."
      ariaLabel="kernel이 입력을 읽는 세 경로 비교"
      scenes={SCENES}
      render={(active) => {
        const path = SCENES[active].path;
        const usesTable = path === "tableA" || path === "tableB";
        const readsB = path === "update" || path === "tableB";
        const fromX = usesTable ? 200 : 92;
        const fromY = 62;
        const targetY = readsB ? 104 : 22;
        return (
          <svg viewBox="0 0 340 130" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              <marker id="input-path-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0L8 4L0 8" fill={BLUE} />
              </marker>
              <marker id="input-copy-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0L8 4L0 8" fill={AMBER} />
              </marker>
            </defs>
            <Box x={4} y={42} w={88} label="kernel" sub={usesTable ? "표를 읽게 바꿈" : "첫 작업"} />
            {usesTable && <Box x={124} y={42} w={76} label="주소표" sub={readsB ? "→ B" : "→ A"} strong />}
            {usesTable && <line x1={92} x2={122} y1={62} y2={62} stroke={BLUE} strokeWidth={1.25} markerEnd="url(#input-path-arrow)" />}
            <Box x={252} y={2} w={84} label="A" sub={path === "copy" ? "3 → 5" : "3"} strong={!readsB} />
            <Box x={252} y={84} w={84} label="B" sub="5" strong={readsB} />
            <path d={`M${fromX} ${fromY} L250 ${targetY}`} fill="none" stroke={BLUE} strokeWidth={1.25} markerEnd="url(#input-path-arrow)" />
            {path === "copy" && (
              <>
                <line x1={294} x2={294} y1={84} y2={44} stroke={AMBER} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#input-copy-arrow)" />
                <text x={288} y={68} textAnchor="end" fontSize={11} fontWeight={700} fill={AMBER}>복사</text>
              </>
            )}
            {path === "update" && <text x={160} y={112} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>인수를 B로 갱신</text>}
          </svg>
        );
      }}
    />
  );
}
