import SceneShell from "./SceneShell";

/**
 * 본문 대응: #multimodal-streams, #conditioned-block — text와 image token이 어디서 만나는가.
 * cross-attention: image query가 text key/value를 읽는 한 방향.
 * dual-stream(MMDiT): modality별 weight + joint attention으로 양방향 교환.
 * single-stream: 한 sequence와 공통 block. hybrid: 앞·뒤에서 두 방식을 섞음(배치 순서는 가정).
 * block 4개, token 칩 개수는 그림을 위한 가정이다.
 */
type Kind = "cross" | "dual" | "single";

const TEXT = "#d97706";
const IMAGE = "#2563eb";
const SHARED = "#7c3aed";
const INK = "#334155";

const SCENES = [
  { label: "Cross-attention", summary: "text → image 한 방향", layout: ["cross", "cross", "cross", "cross"], note: "Image token만 block을 지나며 갱신됩니다. 각 block에서 image query가 text의 key/value를 읽지만 text token은 image 쪽 정보로 바뀌지 않습니다." },
  { label: "Dual-stream (MMDiT)", summary: "weight는 따로 · attention은 함께", layout: ["dual", "dual", "dual", "dual"], note: "Dual-stream은 modality별 weight로 먼저 처리한 뒤 attention에서 정보를 교환할 수 있습니다. Stable Diffusion 3의 MMDiT는 별도 weight를 두면서 joint attention으로 text와 image 사이에 양방향 정보가 흐르게 했습니다." },
  { label: "Single-stream", summary: "한 sequence · 공통 block", layout: ["single", "single", "single", "single"], note: "Text와 image token을 한 줄로 이어 같은 block에 넣습니다. kernel과 구현을 단순하게 만들 수 있지만 sequence 길이는 여전히 text + image이므로 계산량 감소가 자동으로 따라오지는 않습니다." },
  { label: "Hybrid", summary: "앞뒤로 두 방식을 섞음", layout: ["dual", "dual", "single", "single"], note: "앞부분과 뒷부분에서 두 방식을 섞습니다(어느 쪽이 앞인지와 개수는 그림의 가정). Krea 2는 자체 ablation에서 hybrid가 약간 앞섰지만 단순성을 위해 single-stream을 골랐다고 보고했습니다. 이 선택과 Stable Diffusion 3의 MMDiT는 서로 다른 데이터·규모·학습 recipe에서 나온 결과라, single-stream을 MMDiT의 상위호환으로 읽을 근거는 없습니다." },
] as const satisfies readonly { label: string; summary: string; layout: readonly Kind[]; note: string }[];

const COL_X = [86, 150, 214, 278] as const;
const COL_W = 52;
const TEXT_Y = 30;
const IMAGE_Y = 118;
const LANE_H = 34;
const MID_Y = 74;

function Chips({ y, colors }: { y: number; colors: readonly string[] }) {
  return (
    <g>
      {colors.map((color, i) => (
        <rect key={i} x={10 + i * 11} y={y + LANE_H / 2 - 5} width={9} height={10} rx={2} fill={color} />
      ))}
    </g>
  );
}

function Block({ x, y, h, color, label }: { x: number; y: number; h: number; color: string; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={COL_W} height={h} rx={6} fill="#ffffff" stroke={color} strokeWidth={1.25} />
      <text x={x + COL_W / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

function Column({ kind, x }: { kind: Kind; x: number }) {
  if (kind === "cross") {
    return (
      <g>
        <line x1={x + COL_W / 2} x2={x + COL_W / 2} y1={TEXT_Y + LANE_H / 2 + 6} y2={IMAGE_Y - 4} stroke={TEXT} strokeWidth={1} markerEnd="url(#stream-arrow-text)" />
        <text x={x + COL_W / 2 + 4} y={MID_Y + 4} fontSize={9} fill={TEXT}>K/V</text>
        <Block x={x} y={IMAGE_Y} h={LANE_H} color={IMAGE} label="image" />
      </g>
    );
  }
  if (kind === "dual") {
    return (
      <g>
        <Block x={x} y={TEXT_Y} h={LANE_H} color={TEXT} label="text W" />
        <Block x={x} y={IMAGE_Y} h={LANE_H} color={IMAGE} label="image W" />
        <rect x={x + 6} y={TEXT_Y + LANE_H + 6} width={COL_W - 12} height={IMAGE_Y - TEXT_Y - LANE_H - 12} rx={4} fill="#f5f3ff" stroke={SHARED} strokeWidth={1} />
        <text x={x + COL_W / 2} y={MID_Y + 8} textAnchor="middle" fontSize={9} fontWeight={700} fill={SHARED}>joint</text>
        <text x={x + COL_W / 2} y={MID_Y + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={SHARED}>⇅</text>
      </g>
    );
  }
  return <Block x={x} y={TEXT_Y} h={IMAGE_Y + LANE_H - TEXT_Y} color={SHARED} label="공통" />;
}

export default function StreamTopologyViz() {
  return (
    <SceneShell
      eyebrow="Text와 image가 만나는 곳"
      title="같은 token이라도 weight와 attention을 어디서 나누느냐에 따라 구조가 달라집니다"
      description="왼쪽 칩은 token(주황 = text, 파랑 = image), 오른쪽 상자 하나는 block 하나입니다. 상자 색은 그 block을 어느 token이 지나는지를 뜻합니다. block 4개와 칩 개수는 그림을 위한 가정입니다."
      ariaLabel="cross-attention, dual-stream, single-stream, hybrid에서 text와 image token이 만나는 위치 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const merged = (scene.layout as readonly Kind[]).every((kind) => kind === "single");
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 340 176" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <defs>
                <marker id="stream-arrow-text" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
                  <path d="M0,0 L6,3 L0,6Z" fill={TEXT} />
                </marker>
              </defs>
              {merged ? (
                <g>
                  <text x={10} y={MID_Y - 12} fontSize={10} fill={INK}>한 sequence</text>
                  <Chips y={MID_Y - LANE_H / 2 + 4} colors={[TEXT, TEXT, IMAGE, IMAGE, IMAGE]} />
                  <line x1={66} x2={COL_X[0] - 2} y1={MID_Y + 4} y2={MID_Y + 4} stroke={INK} strokeWidth={1} />
                </g>
              ) : (
                <g>
                  <text x={10} y={TEXT_Y - 4} fontSize={10} fill={TEXT}>text</text>
                  <Chips y={TEXT_Y} colors={[TEXT, TEXT]} />
                  <text x={10} y={IMAGE_Y - 4} fontSize={10} fill={IMAGE}>image</text>
                  <Chips y={IMAGE_Y} colors={[IMAGE, IMAGE, IMAGE]} />
                  <line x1={36} x2={COL_X[3] + COL_W} y1={TEXT_Y + LANE_H / 2} y2={TEXT_Y + LANE_H / 2} stroke={TEXT} strokeWidth={1} strokeDasharray={scene.layout[0] === "cross" ? "4 3" : undefined} opacity={0.6} />
                  <line x1={48} x2={COL_X[3] + COL_W} y1={IMAGE_Y + LANE_H / 2} y2={IMAGE_Y + LANE_H / 2} stroke={IMAGE} strokeWidth={1} opacity={0.6} />
                </g>
              )}
              {scene.layout.map((kind, i) => (
                <Column key={i} kind={kind} x={COL_X[i]} />
              ))}
              {scene.layout[0] === "cross" && (
                <text x={COL_X[0]} y={TEXT_Y + LANE_H / 2 - 6} fontSize={9} fill={TEXT}>text는 갱신되지 않음</text>
              )}
              <text x={COL_X[0]} y={170} fontSize={9} fill="#64748b">앞쪽 block</text>
              <text x={COL_X[3] + COL_W} y={170} textAnchor="end" fontSize={9} fill="#64748b">뒤쪽 block</text>
            </svg>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: TEXT }} />text 전용 weight</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: IMAGE }} />image 전용 weight</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: SHARED }} />text·image가 함께 지나는 곳(공통 block 또는 joint attention)</span>
            </div>
          </div>
        );
      }}
    />
  );
}
