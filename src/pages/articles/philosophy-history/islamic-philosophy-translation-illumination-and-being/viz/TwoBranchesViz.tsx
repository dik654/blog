import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 아랍어 철학이 서쪽(라틴 서방)과 동쪽(이란·중앙·남아시아) 두 갈래로 이어진 모습.
 * 줄기: 8~10세기 번역 운동(절정 9세기) → 11세기 이븐 시나(3·4절).
 * 서쪽: 안달루스·시칠리아 등의 번역 → 이븐 시나·이븐 루시드가 라틴 철학의 논리·영혼·형이상학·자연철학에 영향(4·8절).
 * 동쪽: 12세기 수흐라와르디 조명, 신비 사상·시아파 경전 해석 → 16~17세기 이스파한 학파·17세기 물라 사드라(4·9절).
 * 알가잘리 비판과 이븐 루시드 반론은 이 글이 연대를 적지 않아 세기 칸 없이 둔다(5절).
 */
type NodeKey = "trunk" | "sina" | "debate" | "west1" | "west2" | "east1" | "east2" | "east3";

const SCENES: readonly { label: string; summary: string; on: readonly NodeKey[]; ghost: readonly NodeKey[]; note: string }[] = [
  {
    label: "출발: 공통 줄기",
    summary: "8~10세기 → 11세기",
    on: ["trunk", "sina"],
    ghost: [],
    note: "바그다드와 여러 번역·후원 중심에서 그리스어 문헌이 아랍어로 옮겨지며 철학 어휘가 정교해집니다. 11세기 이븐 시나는 존재와 본질을 체계화합니다.",
  },
  {
    label: "서쪽 갈래",
    summary: "번역 → 라틴 서방",
    on: ["trunk", "sina", "west1", "west2"],
    ghost: [],
    note: "안달루스와 시칠리아 등의 번역을 거쳐 이븐 시나와 이븐 루시드가 라틴 철학의 논리·영혼·형이상학·자연철학에 큰 영향을 줍니다.",
  },
  {
    label: "동쪽 갈래",
    summary: "12세기 → 17세기",
    on: ["trunk", "sina", "west1", "west2", "east1", "east2", "east3"],
    ghost: [],
    note: "같은 이븐 시나 철학이 동쪽에서는 수흐라와르디의 조명철학, 신비 사상과 시아파 경전 해석 속에서 계속 변해 이스파한 학파와 물라 사드라의 종합에 이릅니다.",
  },
  {
    label: "라틴어 쪽만 보면",
    summary: "동쪽 갈래가 사라짐",
    on: ["trunk", "sina", "west1", "west2"],
    ghost: ["east1", "east2", "east3"],
    note: "라틴 서방에 도착한 부분만 따라가면 오른쪽 갈래가 시야에서 빠집니다. 그러면 이슬람 철학이 고대 지식을 유럽에 넘긴 중간 통로로만 보입니다.",
  },
  {
    label: "비판 뒤에도 이어짐",
    summary: "비판 ≠ 학문 소멸",
    on: ["trunk", "sina", "debate", "west1", "west2", "east1", "east2", "east3"],
    ghost: [],
    note: "알가잘리는 철학자들의 세 주장을 강하게 비판하면서도 논리와 철학적 논증을 폭넓게 썼습니다. 이븐 루시드의 반론 뒤에도 이븐 시나 주석, 조명철학과 신비 형이상학은 여러 지역에서 이어졌습니다.",
  },
];

function Node({ id, active, when, title, body }: { id: NodeKey; active: number; when?: string; title: string; body: string }) {
  const scene = SCENES[active];
  const on = scene.on.includes(id);
  const ghost = scene.ghost.includes(id);
  const tone = ghost
    ? "border-dashed border-border text-muted-foreground opacity-40"
    : on
      ? "border-primary/60 text-foreground"
      : "border-dashed border-border text-muted-foreground opacity-25";
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-1 sm:px-3 ${tone}`}>
      <span className="block text-sm font-semibold leading-5">
        {when ? <span className="mr-1 text-xs font-normal text-muted-foreground">{when}</span> : null}
        {title}
      </span>
      <span className="block text-xs leading-5 text-muted-foreground">{body}</span>
    </div>
  );
}

function Arrow({ show, side = false }: { show: boolean; side?: boolean }) {
  return (
    <span aria-hidden className={`block text-center text-sm leading-4 text-primary ${side ? "sm:self-center" : ""} ${show ? "" : "opacity-25"}`}>
      {side ? (
        <>
          <span className="sm:hidden">↓</span>
          <span className="hidden sm:inline">→</span>
        </>
      ) : (
        "↓"
      )}
    </span>
  );
}

export default function TwoBranchesViz() {
  return (
    <SceneShell
      eyebrow="두 방향으로 뻗은 지식"
      title="바그다드의 번역에서 라틴 서방과 이스파한까지"
      description="맨 위가 공통 줄기, 아래 왼쪽이 서쪽·오른쪽이 동쪽 갈래입니다. 흐린 칸은 그 장면에서 보지 않는 흐름입니다."
      ariaLabel="8~10세기 번역 운동과 11세기 이븐 시나에서 서쪽 라틴 철학과 동쪽 조명철학·물라 사드라로 갈라지는 흐름을 다섯 장면으로 보여 줍니다"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const westOn = scene.on.includes("west1");
        const eastOn = scene.on.includes("east1") && !scene.ghost.includes("east1");
        return (
          <div className="min-w-0 space-y-1.5">
            <div className="grid min-w-0 gap-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch">
              <Node id="trunk" active={active} when="8~10세기 · 절정 9세기" title="번역 운동" body="그리스어 문헌 → 아랍어 철학 어휘" />
              <Arrow show side />
              <Node id="sina" active={active} when="11세기" title="이븐 시나" body="존재·본질, 가능한 존재·필연적 존재 체계" />
              <Arrow show={scene.on.includes("debate")} side />
              <Node id="debate" active={active} title="알가잘리 비판 ↔ 이븐 루시드 반론" body="연대는 이 글에 없음 · 비판 뒤에도 두 갈래가 이어짐" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <span className={`text-center text-xs font-semibold ${westOn ? "text-foreground" : "text-muted-foreground opacity-40"}`}>↙ 서쪽 갈래</span>
              <span className={`text-center text-xs font-semibold ${eastOn ? "text-foreground" : "text-muted-foreground opacity-40"}`}>동쪽 갈래 ↘</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="min-w-0 space-y-1">
                <Node id="west1" active={active} title="안달루스·시칠리아 등의 번역" body="연대는 이 글에 없음 · 이븐 시나·이븐 루시드가 라틴어로" />
                <Arrow show={westOn} />
                <Node id="west2" active={active} title="라틴 철학" body="논리·영혼·형이상학·자연철학에 영향" />
              </div>
              <div className="min-w-0 space-y-1">
                <Node id="east1" active={active} when="12세기" title="수흐라와르디 조명철학" body="빛과 현전(직접 드러남)으로 재구성" />
                <span aria-hidden className={`block text-center text-sm leading-4 text-primary ${eastOn ? "" : "opacity-25"}`}>＋</span>
                <Node id="east2" active={active} title="신비 사상·시아파 경전 해석" body="조명철학과 나란히 이븐 시나 철학을 바꾼 맥락 · 이란·중앙·남아시아" />
                <Arrow show={eastOn} />
                <Node id="east3" active={active} when="16~17세기" title="이스파한 학파·물라 사드라(17세기)" body="철학·지적 직관·수행을 종합" />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
