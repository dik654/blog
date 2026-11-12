import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #how-evidence — 자료의 힘과 그 자료를 법정에서 쓸 수 있는지는 서로 다른 문턱이다.
 * 문턱 순서는 본문 AlgorithmBlock("H 사건에서 판결 이유를 만드는 순서")의 2~6단계를 따른다.
 * 조항: 대한민국 형사소송법 제307조·제308조의2·제309조·제310조(본문과 인용 블록 기준).
 */
const GATES = [
  { no: 1, name: "수집 절차", rule: "제308조의2" },
  { no: 2, name: "증거의 힘", rule: "관련성·신뢰성" },
  { no: 3, name: "같은 출처", rule: "중복 세지 않기" },
  { no: 4, name: "자백 규칙", rule: "제309조·제310조" },
  { no: 5, name: "전체 판단", rule: "제307조" },
] as const;

interface Card {
  item: string;
  lines: readonly string[];
  tag: string;
}

const CARDS: readonly Card[] = [
  {
    item: "H의 보관함에서 나온 물건",
    lines: ["내용은 강해 보여도 어떻게 찾았는지를 먼저 봅니다.", "적법 절차를 따르지 않고 수집했다면 증거로 쓰지 못할 수 있습니다."],
    tag: "믿을 만한지와 별개인 문턱",
  },
  {
    item: "같은 CCTV를 본 보고서 둘",
    lines: ["보고서 A와 B는 출처가 CCTV 하나입니다.", "독립된 증거 두 개처럼 곱하면 확신이 부풀 수 있습니다."],
    tag: "추론 원칙 · 제310조의 뜻이 아님",
  },
  {
    item: "강요된 자백",
    lines: ["이유 ① 강요 때문에 거짓 자백이 생길 수 있습니다(신뢰성).", "이유 ② 국가가 고문·폭행·협박 등으로 진술을 만들어서는 안 됩니다(권리·절차)."],
    tag: "제309조 · 임의성이 의심되는 자백 배제",
  },
  {
    item: "자백만 있는 경우",
    lines: ["피고인의 자백이 유일한 불리한 증거이면 그것을 유죄 증거로 삼지 못합니다.", "자백 하나에 유죄 전체를 걸지 않게 하는 보강 규칙입니다."],
    tag: "제310조 · 한국법의 규칙",
  },
  {
    item: "남은 증거 전체",
    lines: ["허용된 증거 전체와 H의 대안 설명을 함께 놓습니다.", "합리적 의심 없이 증명됐는지, 남은 합리적 대안이 무엇인지 이유를 적습니다."],
    tag: "제307조 · 숫자 문턱을 대입하지 않음",
  },
];

const ACTIVE_GATE: readonly number[] = [0, 2, 3, 3, 4];

const SCENES = [
  { label: "보관함의 물건", summary: "1번 문턱 · 수집 절차", note: "힘이 강해 보이는 자료라도 수집 절차가 첫 문턱입니다. 위반이 있으면 2번 문턱에서 힘을 따지기 전에 멈출 수 있습니다." },
  { label: "같은 출처 둘", summary: "3번 문턱 · 중복", note: "두 보고서가 같은 CCTV에서 나왔다면 새로운 관측 두 개가 아닐 수 있습니다. 이것은 증거의 힘을 평가할 때의 추론 원칙입니다." },
  { label: "강요된 자백", summary: "4번 문턱 · 이유 둘", note: "강요된 자백을 빼는 이유는 하나가 아닙니다. “어차피 확률을 올리지 못해서 버린다” 하나로 설명하면 권리와 절차의 이유를 놓칩니다." },
  { label: "자백뿐인 경우", summary: "4번 문턱 · 보강 규칙", note: "제310조는 모든 증거가 통계적으로 독립이어야 한다는 일반 공식이 아닙니다. 자백이 유일한 불리한 증거일 때만 걸리는 규칙입니다." },
  { label: "전체 판단", summary: "5번 문턱 · 이유 제시", note: "앞 문턱을 지난 증거만으로, H의 설명까지 포함해 국가가 범죄사실을 합리적 의심 없이 증명했는지 판단하고 그 이유를 공개합니다." },
] as const;

const C = { active: "#4f46e5", muted: "#94a3b8" } as const;

export default function EvidenceGatesViz() {
  return (
    <SceneShell
      eyebrow="증거의 별도 문턱"
      title="자료 하나가 판결 이유에 들어가기까지 서로 다른 문턱을 지납니다"
      description="왼쪽은 아래 판결 이유 순서 블록의 문턱을 차례로 놓은 것이고, 오른쪽은 지금 보는 자료입니다. 조항 번호는 대한민국 형사소송법이며 H 사건은 가상입니다."
      ariaLabel="H 사건의 자료가 수집 절차, 증거의 힘, 같은 출처, 자백 규칙, 전체 판단 문턱을 지나는 순서"
      scenes={SCENES}
      render={(active) => {
        const gate = ACTIVE_GATE[active];
        return (
          <div className="grid min-w-0 grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-5">
            <ol className="space-y-2">
              {GATES.map((g, index) => {
                const on = index === gate;
                const passed = index < gate;
                return (
                  <li
                    key={g.no}
                    className="rounded-lg border px-2 py-1.5 text-xs leading-5 sm:px-3 sm:text-sm"
                    style={{ borderColor: on ? C.active : C.muted, backgroundColor: on ? "#4f46e514" : "transparent", opacity: on || passed ? 1 : 0.55 }}
                  >
                    <span className="block font-bold" style={{ color: on ? C.active : undefined }}>
                      {g.no} {g.name}
                    </span>
                    <span className="block text-[11px] text-muted-foreground sm:text-xs">{g.rule}</span>
                  </li>
                );
              })}
            </ol>
            <StableSceneStack
              active={active}
              scenes={CARDS.map((card) => (
                <div key={card.item} className="h-full rounded-lg border px-3 py-3 sm:px-4" style={{ borderColor: C.active }}>
                  <p className="text-sm font-bold">{card.item}</p>
                  <ul className="mt-2 space-y-2 text-xs leading-5 sm:text-sm sm:leading-6">
                    {card.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className="mt-3 border-t pt-2 text-[11px] font-bold leading-5 sm:text-xs" style={{ color: C.active }}>
                    {card.tag}
                  </p>
                </div>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
