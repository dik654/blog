import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 쿠데타·내전을 외부 힘과 국내 다툼 두 축으로 읽는다.
 * 한쪽 축을 빼면 무엇이 사라지는지만 보여 준다. 축의 크기나 비중은 본문에 없으므로 그리지 않는다.
 */
const SCENES = [
  { label: "두 축을 함께 놓으면", summary: "외부 힘 + 국내 다툼", note: "같은 쿠데타나 내전에 두 방향의 설명이 함께 들어옵니다. 어느 쪽이 더 컸는지는 사건마다 따로 봐야 하므로 화살표 굵기로 비중을 나타내지 않았습니다.", outer: true, inner: true, lost: "" },
  { label: "강대국의 지시만으로 설명하면", summary: "국내 갈등이 지워짐", note: "농민·노동자·기업·군부·지역 지도자가 토지와 임금, 언어와 자치, 수입 허가를 두고 벌인 다툼이 설명에서 빠집니다.", outer: true, inner: false, lost: "이 설명에서 빠짐: 국내 갈등" },
  { label: "국내 문제만으로 설명하면", summary: "무기·자금·제재의 힘을 놓침", note: "반대로 외부 축을 빼면 밖에서 들어온 무기와 자금, 제재가 그 다툼에 미친 힘을 볼 수 없습니다.", outer: false, inner: true, lost: "이 설명에서 빠짐: 무기·자금·제재" },
] as const;

function Arrow({ on }: { on: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width="24" height="24" className="mx-auto shrink-0 rotate-90 sm:rotate-0" fill="none" stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth="1.25" strokeDasharray={on ? undefined : "3 3"}>
      <path d="M2 12h19M15 6l6 6-6 6" />
    </svg>
  );
}

function Axis({ on, title, who, items, lost }: { on: boolean; title: string; who: string; items: string; lost: string }) {
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-3 text-sm leading-6 ${on ? "border-border bg-background" : "border-dashed border-red-600"}`}>
      <p className={`font-bold ${on ? "" : "text-muted-foreground line-through"}`}>{title}</p>
      <p className={on ? "text-muted-foreground" : "text-muted-foreground/60"}>{who}</p>
      <p className={on ? "" : "text-muted-foreground/60"}>{items}</p>
      {!on && <p className="mt-1 text-xs font-bold leading-5 text-red-700 dark:text-red-400">{lost}</p>}
    </div>
  );
}

export default function TwoAxesViz() {
  return (
    <SceneShell
      eyebrow="다른 축에 놓기"
      title="쿠데타·내전 설명에서 한 축을 빼면 무엇이 사라질까요"
      description="양쪽 상자가 설명의 두 축이고, 가운데가 설명하려는 사건입니다. 빨간 점선 상자는 그 설명에서 빠진 축입니다."
      ariaLabel="외부 힘과 국내 다툼이 쿠데타와 내전 설명으로 들어오는 두 축"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_24px_minmax(0,0.7fr)_24px_minmax(0,1fr)]">
            <Axis on={scene.outer} title="외부 축" who="미국과 소련" items="무기·자금·제재" lost={scene.lost} />
            <Arrow on={scene.outer} />
            <div className="rounded-lg border border-foreground/60 px-3 py-3 text-center text-sm font-bold leading-6">쿠데타나 내전</div>
            <div className="rotate-180">
              <Arrow on={scene.inner} />
            </div>
            <Axis on={scene.inner} title="국내 축" who="농민·노동자·기업·군부·지역 지도자" items="토지와 임금, 언어와 자치, 수입 허가" lost={scene.lost} />
          </div>
        );
      }}
    />
  );
}
