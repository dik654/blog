import SceneShell from "./SceneShell";

/**
 * 본문 대응: #implementation — 선택기가 같은 5토큰을 어떤 키로 보내는지. source-execution.json의 관찰값과 같다.
 * mixed5 → PIECEWISE(토큰 8·요청 수 미지정). 균일 5 → FULL(토큰 8·요청 8·균일). 균일 5에서 FULL 제외 → PIECEWISE 완화 키.
 * 33 → 최대 32 초과라 NONE. mixed5에서 FULL만 허용 → assertion.
 */
type Mark = "pass" | "over" | "miss" | "off" | "hit" | "unseen";

const MARK_TEXT: Record<Mark, string> = {
  pass: "통과",
  over: "초과",
  miss: "키 없음",
  off: "허용 안 됨",
  hit: "키 찾음",
  unseen: "묻지 않음",
};

interface Scene {
  label: string;
  summary: string;
  note: string;
  input: "mixed" | "uniform" | "over";
  allowed: string;
  size: Mark;
  full: Mark;
  piece: Mark;
  none: Mark;
  result: string;
  bad: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "입력·생성이 섞일 수 있는 5토큰", summary: "PIECEWISE", input: "mixed", allowed: "FULL · PIECEWISE · NONE", size: "pass", full: "miss", piece: "hit", none: "unseen", result: "PIECEWISE · 토큰 8 · 요청 수 미지정", bad: false, note: "크기는 8로 올라갑니다. 맞는 FULL 키가 없어 요청 수를 미지정으로 둔 PIECEWISE 키로 갑니다." },
  { label: "길이가 균일한 생성 요청 5개", summary: "FULL", input: "uniform", allowed: "FULL · PIECEWISE · NONE", size: "pass", full: "hit", piece: "unseen", none: "unseen", result: "FULL · 토큰 8 · 요청 8 · 균일", bad: false, note: "요청당 새 토큰 1개가 다섯 요청이면 토큰도 5, 요청도 5입니다. 두 숫자가 함께 8로 올라간 FULL 키를 찾습니다. 같은 5라는 숫자만으로는 첫 장면과 구분할 수 없습니다." },
  { label: "같은 균일 입력, FULL 제외", summary: "PIECEWISE", input: "uniform", allowed: "PIECEWISE · NONE", size: "pass", full: "off", piece: "hit", none: "unseen", result: "PIECEWISE · 토큰 8 · 요청 수 미지정", bad: false, note: "FULL을 제외하면 요청 수와 균일 조건을 완화한 PIECEWISE 키를 찾습니다. 입력은 앞 장면과 같아도 허용한 모드가 결과를 바꿉니다." },
  { label: "33토큰", summary: "NONE", input: "over", allowed: "FULL · PIECEWISE · NONE", size: "over", full: "unseen", piece: "unseen", none: "unseen", result: "NONE · 이 선택 범위의 graph를 쓰지 않음", bad: false, note: "최대 32보다 크므로 키를 찾기 전에 NONE을 돌려줍니다. 최대 32 graph에 33을 넣는 경로가 아닙니다." },
  { label: "섞인 5토큰, FULL만 허용", summary: "assertion", input: "mixed", allowed: "FULL", size: "pass", full: "miss", piece: "off", none: "off", result: "assertion 발생 · 일반 실행으로 이어지지 않음", bad: true, note: "맞는 키가 없고 NONE도 허용되지 않아 assertion이 납니다. 모든 실패가 자동으로 일반 실행으로 이어지지는 않습니다." },
];

function Slots({ input }: { input: Scene["input"] }) {
  if (input === "over") {
    return <p className="font-mono text-xs leading-5">33토큰 &gt; 준비한 최대 32</p>;
  }
  const uniform = input === "uniform";
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 8 }, (_, index) => (
        <span
          key={index}
          className={`h-6 min-w-0 flex-1 border text-center font-mono text-[11px] leading-[22px] ${index < 5 ? "border-primary bg-primary/20" : "border-dashed border-border"} ${uniform ? "rounded" : ""} ${!uniform && index > 0 ? "-ml-1" : ""}`}
        >
          {index < 5 ? index + 1 : "+"}
        </span>
      ))}
    </div>
  );
}

function Check({ name, mark }: { name: string; mark: Mark }) {
  const strong = mark === "hit";
  return (
    <li className={`flex items-baseline justify-between gap-2 border-b border-border/50 py-1 text-xs leading-5 ${mark === "unseen" ? "opacity-40" : ""}`}>
      <span className="min-w-0">{name}</span>
      <span className={`shrink-0 font-mono ${strong ? "font-bold text-primary" : "text-muted-foreground"}`}>{MARK_TEXT[mark]}</span>
    </li>
  );
}

export default function KeySelectViz() {
  return (
    <SceneShell
      eyebrow="선택기의 검사 순서"
      title="같은 5토큰도 요청 구성과 허용 모드에 따라 다른 기록을 찾습니다"
      description="FULL은 전체를 하나로 묶은 graph, PIECEWISE는 호환되는 일부만 묶은 graph, NONE은 이 선택 범위의 graph를 쓰지 않는다는 뜻입니다. 칸의 +는 8자리로 맞추며 생긴 추가 자리이고, 균일 입력은 칸 하나가 요청 하나입니다. 섞인 입력은 칸을 붙여 토큰 수만 그렸습니다."
      note="관찰 설정: FULL_AND_PIECEWISE, 최대 요청 32개, 요청당 새 토큰 1개, 추가 어댑터 없음. CPU에서 선택 분기만 실행한 결과이며 kernel 지원과 GPU 캡처 성공은 별도 조건입니다."
      ariaLabel="입력 구성과 허용 모드에 따라 선택기가 찾는 키"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="flex h-8 items-center">
              <div className="min-w-0 flex-1"><Slots input={scene.input} /></div>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">허용 모드: <span className="font-mono">{scene.allowed}</span></p>
            <ul className="mt-1">
              <Check name="크기 ≤ 최대 32" mark={scene.size} />
              <Check name="FULL 허용·키" mark={scene.full} />
              <Check name="PIECEWISE 허용·키" mark={scene.piece} />
              <Check name="그래도 없으면 NONE 허용" mark={scene.none} />
            </ul>
            <p className={`mt-2 rounded-md border bg-background px-2 py-1.5 font-mono text-xs font-bold leading-5 [overflow-wrap:anywhere] ${scene.bad ? "border-[#b91c1c] text-[#b91c1c]" : "border-primary"}`}>{scene.result}</p>
          </div>
        );
      }}
    />
  );
}
