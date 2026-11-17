import OneShotSceneShell from "./OneShotSceneShell";

/**
 * 본문 대응: #calibration — Wanda score S = |W_ij| × ‖X_:,j‖₂ 가 같은 output row 안에서 무엇을 남기는지.
 * 본문 숫자: |w|=.2인 두 연결의 input norm 1과 10 → score .2와 2.
 * 나머지 두 연결(|w| .5·.3, norm 1·2), 50% 제거, 다른 traffic의 norm 1은 설명용 가정입니다.
 */
interface Link {
  name: string;
  w: number;
  norm: number;
}

const CALIB: readonly Link[] = [
  { name: "j1", w: 0.2, norm: 1 },
  { name: "j2", w: 0.2, norm: 10 },
  { name: "j3", w: 0.5, norm: 1 },
  { name: "j4", w: 0.3, norm: 2 },
];

const SHIFTED: readonly Link[] = CALIB.map((link) => (link.name === "j2" ? { ...link, norm: 1 } : link));

type Mode = "inputs" | "magnitude" | "score" | "wanda" | "shifted";

const SCENES: readonly { label: string; summary: string; note: string; mode: Mode }[] = [
  {
    label: "한 output row의 네 연결",
    summary: "|w|와 ‖X_j‖를 따로 봅니다",
    note: "Output i에 들어오는 연결 네 개입니다. 위 숫자 |w|는 연결 자체의 크기, 아래 ‖X_j‖는 calibration prompt를 흘렸을 때 input channel j가 얼마나 세게 쓰였는지를 L2 norm으로 요약한 값입니다. j1·j2는 본문 예시이고 j3·j4는 가정입니다.",
    mode: "inputs",
  },
  {
    label: "Magnitude만 보면",
    summary: "|w| 낮은 두 개 제거 → j1·j2",
    note: "이 row에서 절반을 지운다고 정하면(가정) |w|만 보는 기준은 가장 작은 .2 두 개를 고릅니다. j2가 자주 크게 쓰이는 channel에 연결돼 있다는 정보는 쓰지 않습니다.",
    mode: "magnitude",
  },
  {
    label: "Wanda score를 곱합니다",
    summary: "S = |w| × ‖X_j‖",
    note: "같은 |w|=.2라도 j1은 .2×1=.2, j2는 .2×10=2가 됩니다. j3은 .5×1=.5, j4는 .3×2=.6입니다.",
    mode: "score",
  },
  {
    label: "같은 row 안에서 낮은 score 제거",
    summary: "제거 → j1·j3, j2는 보호",
    note: "Score가 가장 낮은 .2(j1)와 .5(j3)를 지웁니다. Magnitude 기준이 지웠던 j2는 score 2로 가장 높아 남습니다. 비교는 이 output row 안에서만 합니다.",
    mode: "wanda",
  },
  {
    label: "다른 traffic의 norm이면",
    summary: "j2 norm 10 → 1(가정)",
    note: "배포 traffic에서 channel j2가 거의 쓰이지 않는다면(가정) score는 .2가 되고 j2가 다시 제거 후보가 됩니다. Mask는 calibration에서 이미 정해졌으므로, 이 traffic 기준으로는 덜 쓰이는 j2(.2)를 남기고 더 쓰이는 j3(.5)를 지운 셈입니다. Calibration prompt가 배포 언어·길이·domain을 대표하지 못하면 같은 방식으로 mask가 달라질 수 있습니다.",
    mode: "shifted",
  },
];

const SCORE_MAX = 2;

function removed(links: readonly Link[], key: (link: Link) => number): ReadonlySet<string> {
  const sorted = [...links].sort((a, b) => key(a) - key(b));
  return new Set(sorted.slice(0, 2).map((link) => link.name));
}

const fmt = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/^0/, ""));

function Row({ mode }: { mode: Mode }) {
  const links = mode === "shifted" ? SHIFTED : CALIB;
  const showScore = mode === "score" || mode === "wanda" || mode === "shifted";
  const cut =
    mode === "magnitude"
      ? removed(links, (link) => link.w)
      : mode === "wanda" || mode === "shifted"
        ? removed(links, (link) => link.w * link.norm)
        : new Set<string>();
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-4 gap-2">
        {links.map((link) => {
          const score = link.w * link.norm;
          const isCut = cut.has(link.name);
          const changedNorm = mode === "shifted" && link.name === "j2";
          return (
            <div
              key={link.name}
              className={`min-w-0 rounded-lg border px-1.5 py-2 text-center ${isCut ? "border-dashed border-red-600" : "border-border"}`}
            >
              <span className="block font-mono text-xs font-bold">{link.name}</span>
              <span className="mt-1 block text-[11px] text-muted-foreground">|w|</span>
              <span className="block font-mono text-sm font-bold">{fmt(link.w)}</span>
              <span className="mt-1 block text-[11px] text-muted-foreground">‖X_j‖</span>
              <span className={`block font-mono text-sm font-bold ${changedNorm ? "text-amber-700 dark:text-amber-400" : ""}`}>{link.norm}</span>
              <span className="mt-1 block text-[11px] text-muted-foreground">score</span>
              <span className="block font-mono text-sm font-bold text-primary">{showScore ? fmt(score) : "−"}</span>
              <div className="mx-auto mt-1 flex h-10 w-5 items-end rounded-sm bg-muted/40">
                <div
                  className="w-full rounded-sm transition-[height] duration-300 motion-reduce:transition-none"
                  style={{ height: showScore ? `${(score / SCORE_MAX) * 100}%` : "0%", backgroundColor: "#2563eb" }}
                />
              </div>
              <span className={`mt-1 block text-[11px] font-semibold ${isCut ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>
                {isCut ? "제거" : cut.size > 0 ? "유지" : " "}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {mode === "magnitude"
          ? "기준: |w| 작은 순서"
          : mode === "wanda" || mode === "shifted"
            ? "기준: score 작은 순서 · 막대 높이 = score"
            : mode === "score"
              ? "막대 높이 = score (최대 2)"
              : "아직 아무것도 지우지 않았습니다"}
      </p>
    </div>
  );
}

export default function WandaRowMaskViz() {
  return (
    <OneShotSceneShell
      eyebrow="Wanda · per-output 선택"
      title="같은 |w|라도 input 세기가 남길 연결을 바꿉니다"
      description="한 output row에 연결 네 개가 있고 그중 절반을 지운다고 둡니다(가정). j1·j2의 |w| .2와 norm 1·10은 본문 예시이며 나머지 값은 설명용 가정입니다."
      ariaLabel="한 output row에서 magnitude 기준과 Wanda score 기준이 서로 다른 연결을 지우는 과정"
      scenes={SCENES}
      render={(index) => <Row mode={SCENES[index].mode} />}
    />
  );
}
