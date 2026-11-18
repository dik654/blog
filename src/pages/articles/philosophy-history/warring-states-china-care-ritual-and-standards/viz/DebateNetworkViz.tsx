import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 묵가는 유가의 두꺼운 장례·음악을 비용 낭비라 비판했고, 맹자·순자는 묵가를 반박했다.
 * 한비자는 앞선 행정 사상을 묶으면서 유가·도가의 언어도 새 방식으로 썼다.
 * 후대의 네 학파 이름만 남기면 이 교차선이 사라진다.
 */
type EdgeKey = "mohistCritique" | "ruRebuttal" | "hanBundle" | "hanRu" | "hanDao";

const SCENES = [
  {
    label: "묵가가 유가를 비판합니다",
    summary: "묵가 → 유가",
    edges: ["mohistCritique"] as readonly EdgeKey[],
    boxes: false,
    note: "묵가는 유가의 두꺼운 장례와 음악을 비용 낭비라고 비판했습니다. 화살표는 비판이 향한 방향입니다.",
  },
  {
    label: "맹자와 순자가 반박합니다",
    summary: "유가 → 묵가",
    edges: ["mohistCritique", "ruRebuttal"] as readonly EdgeKey[],
    boxes: false,
    note: "맹자와 순자는 묵가를 반박했고, 묵가 말고도 다른 경쟁 사상을 반박했습니다. 비판은 한 방향으로만 흐르지 않았습니다.",
  },
  {
    label: "한비자는 묶고 빌립니다",
    summary: "행정 사상 + 유가·도가의 언어",
    edges: ["mohistCritique", "ruRebuttal", "hanBundle", "hanRu", "hanDao"] as readonly EdgeKey[],
    boxes: false,
    note: "한비자는 앞선 행정 사상을 묶었지만, 유가와 도가의 언어도 새 방식으로 사용했습니다. 한 사람의 글 안으로 여러 갈래가 들어옵니다.",
  },
  {
    label: "후대의 네 상자만 남기면",
    summary: "교차선이 사라집니다",
    edges: [] as readonly EdgeKey[],
    boxes: true,
    note: "‘유가·도가·묵가·법가’는 복잡한 저자·편집층·논쟁을 후대에 정리한 이름입니다. 모두가 네 학교 중 하나의 회원이었다고 상상하면 앞 장면의 선, 곧 문헌의 교차와 변화가 사라집니다.",
  },
] as const;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const INK = "#334155";

function Node({ x, y, w, h, title, sub, boxes }: { x: number; y: number; w: number; h: number; title: string; sub: string; boxes: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={boxes ? INK : MUTED} strokeWidth={1} />
      <text x={x + w / 2} y={y + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} className="fill-foreground">
        {title}
      </text>
      <text x={x + w / 2} y={y + 42} textAnchor="middle" fontSize={11} fill={MUTED}>
        {sub}
      </text>
    </g>
  );
}

function Diagram({ index }: { index: number }) {
  const scene = SCENES[index];
  const on = (key: EdgeKey) => scene.edges.includes(key);
  const newest = (key: EdgeKey) => {
    const previous: readonly EdgeKey[] = index > 0 ? SCENES[index - 1].edges : [];
    return on(key) && !previous.includes(key);
  };
  const stroke = (key: EdgeKey) => (newest(key) ? ACCENT : MUTED);
  const marker = (key: EdgeKey) => (newest(key) ? "url(#dn-arrow-accent)" : "url(#dn-arrow-muted)");
  const labelFill = (key: EdgeKey) => (newest(key) ? ACCENT : MUTED);
  const boxes = scene.boxes;

  return (
    <div className="mx-auto w-full max-w-[22rem]">
      <svg viewBox="0 0 360 300" className="block h-auto w-full" role="img" aria-label={scene.label}>
        <defs>
          <marker id="dn-arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={ACCENT} />
          </marker>
          <marker id="dn-arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={MUTED} />
          </marker>
        </defs>

        <Node x={14} y={20} w={120} h={66} title="유가" sub={boxes ? "후대 분류 이름" : "맹자 · 순자"} boxes={boxes} />
        <Node x={226} y={20} w={120} h={66} title="묵가" sub={boxes ? "후대 분류 이름" : "공격 전쟁 반대"} boxes={boxes} />
        <Node x={14} y={200} w={120} h={66} title="도가" sub={boxes ? "후대 분류 이름" : "도가 계열"} boxes={boxes} />

        <g>
          <rect x={226} y={170} width={120} height={112} rx={8} fill="none" stroke={boxes ? INK : MUTED} strokeWidth={1} />
          <text x={286} y={190} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} className="fill-foreground">
            법가
          </text>
          {boxes ? (
            <text x={286} y={208} textAnchor="middle" fontSize={11} fill={MUTED}>
              후대 분류 이름
            </text>
          ) : (
            <>
              <rect x={238} y={200} width={96} height={26} rx={6} fill="none" stroke={on("hanBundle") ? stroke("hanBundle") : MUTED} strokeWidth={1} strokeDasharray="3 3" />
              <text x={286} y={217} textAnchor="middle" fontSize={11} fill={MUTED}>
                앞선 행정 사상
              </text>
              <line x1={286} y1={226} x2={286} y2={246} stroke={on("hanBundle") ? stroke("hanBundle") : "none"} strokeWidth={1} markerEnd={on("hanBundle") ? marker("hanBundle") : undefined} />
              <text x={292} y={240} fontSize={11} fill={on("hanBundle") ? labelFill("hanBundle") : "none"}>
                묶음
              </text>
              <rect x={238} y={248} width={96} height={26} rx={6} fill="none" stroke={INK} strokeWidth={1} />
              <text x={286} y={265} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK} className="fill-foreground">
                한비자
              </text>
            </>
          )}
        </g>

        {on("mohistCritique") ? (
          <>
            <line x1={226} y1={42} x2={136} y2={42} stroke={stroke("mohistCritique")} strokeWidth={1.25} markerEnd={marker("mohistCritique")} />
            <text x={181} y={35} textAnchor="middle" fontSize={11} fill={labelFill("mohistCritique")}>
              장례·음악은 낭비
            </text>
          </>
        ) : null}
        {on("ruRebuttal") ? (
          <>
            <line x1={134} y1={66} x2={224} y2={66} stroke={stroke("ruRebuttal")} strokeWidth={1.25} markerEnd={marker("ruRebuttal")} />
            <text x={181} y={82} textAnchor="middle" fontSize={11} fill={labelFill("ruRebuttal")}>
              반박
            </text>
          </>
        ) : null}
        {on("hanRu") ? (
          <>
            <line x1={120} y1={86} x2={236} y2={246} stroke={stroke("hanRu")} strokeWidth={1.25} markerEnd={marker("hanRu")} />
            <text x={160} y={150} textAnchor="end" fontSize={11} fill={labelFill("hanRu")}>
              언어를 새 방식으로
            </text>
          </>
        ) : null}
        {on("hanDao") ? (
          <>
            <line x1={134} y1={256} x2={236} y2={260} stroke={stroke("hanDao")} strokeWidth={1.25} markerEnd={marker("hanDao")} />
            <text x={180} y={250} textAnchor="middle" fontSize={11} fill={labelFill("hanDao")}>
              언어 사용
            </text>
          </>
        ) : null}
      </svg>
    </div>
  );
}

export default function DebateNetworkViz() {
  return (
    <SceneShell
      eyebrow="논쟁망"
      title="학파 상자 사이에 비판과 차용의 선이 있습니다"
      description="상자는 후대에 붙은 학파 이름, 화살표는 본문이 말하는 비판·반박·차용의 방향입니다. 파란 선이 이번 장면에서 새로 생긴 선입니다."
      ariaLabel="묵가의 유가 비판, 맹자와 순자의 반박, 한비자의 묶음과 차용을 선으로 잇고, 후대의 네 상자만 남기면 선이 사라지는 네 장면"
      scenes={SCENES}
      render={(active) => <Diagram index={active} />}
    />
  );
}
