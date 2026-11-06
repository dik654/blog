import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rwa-release — 102의 근거, 100의 등록, 1.02의 시각, 81.60의 가정, 10.15의 실제 수령.
 * 부채 3을 빠뜨리면 105 → 105/100=1.05 → 105×.8=84.00.
 */
type Mark = "ok" | "bad" | "warn";
const LABELS = ["102의 근거", "100의 등록", "1.02의 시각", "81.60의 가정", "10.15의 실제 수령"];

const SCENES: readonly { label: string; summary: string; note: string; rows: readonly { value: string; mark: Mark; text: string }[] }[] = [
  {
    label: "제대로 맞을 때",
    summary: "다섯 숫자가 이어집니다",
    note: "앞 네 숫자는 계산으로 이어지고, 10.15는 B가 제시한 견적입니다. 판단의 끝에는 이 다섯 질문을 다시 놓습니다. 토큰 이름이나 총발행액 하나로 대신할 수 없습니다.",
    rows: [
      { value: "102", mark: "ok", text: "자산 105 − 부채·비용 3" },
      { value: "100개", mark: "ok", text: "등록부와 토큰 공급량" },
      { value: "1.02", mark: "ok", text: "102 ÷ 100, 같은 기준 시각" },
      { value: "81.60", mark: "ok", text: "102 × 0.8, 20% 할인 가정" },
      { value: "10.15", mark: "ok", text: "B의 견적, 교환 성공 시 결제 토큰" },
    ],
  },
  {
    label: "부채 3을 빠뜨리면",
    summary: "1.02 → 1.05 · 81.60 → 84.00",
    note: "평가가 오래됐거나 부채를 빠뜨리면 최초 1.02부터 잘못됩니다. 105 ÷ 100 = 1.05, 105 × 0.8 = 84.00은 빠뜨린 금액으로 계산해 본 값입니다. 10.15는 견적이라 이 계산에서 나오지 않으므로 맞다고도 틀렸다고도 적지 않고 따로 확인합니다.",
    rows: [
      { value: "105", mark: "bad", text: "부채 3을 빠뜨림" },
      { value: "100개", mark: "ok", text: "등록은 그대로" },
      { value: "1.05", mark: "bad", text: "처음부터 잘못된 개당 값" },
      { value: "84.00", mark: "bad", text: "담보 평가도 같이 틀어짐" },
      { value: "10.15", mark: "warn", text: "견적, 이 식으로 계산되지 않음" },
    ],
  },
  {
    label: "이전이 막히면",
    summary: "계산이 맞아도 거래가 안 될 수 있음",
    note: "받을 주소가 자격을 잃거나 이전이 중지되면 원자적 거래는 성립하지 않을 수 있습니다. 앞 네 숫자가 정확해도 마지막 칸이 비어 있을 수 있습니다.",
    rows: [
      { value: "102", mark: "ok", text: "계산은 그대로" },
      { value: "100개", mark: "ok", text: "등록도 그대로" },
      { value: "1.02", mark: "ok", text: "평가도 그대로" },
      { value: "81.60", mark: "ok", text: "평가도 그대로" },
      { value: "10.15", mark: "warn", text: "거래 성립 안 될 수 있음" },
    ],
  },
  {
    label: "법적 관계가 틀리면",
    summary: "기록이 정확해도 청구 대상이 달라짐",
    note: "수탁·발행·등록의 법적 관계가 잘못되면 체인 기록이 정확해도 누구에게 어떤 청구를 할 수 있는지가 달라집니다. 위탁기관과 발행 문서는 국가·상품마다 다르므로 미국의 사모 펀드 조건을 다른 곳에 복사하지 않습니다.",
    rows: [
      { value: "102", mark: "warn", text: "수탁 관계 다시 확인" },
      { value: "100개", mark: "warn", text: "체인 기록 정확, 권리는 별개" },
      { value: "1.02", mark: "ok", text: "계산은 그대로" },
      { value: "81.60", mark: "ok", text: "계산은 그대로" },
      { value: "10.15", mark: "warn", text: "누구에게 청구하는지 달라짐" },
    ],
  },
];

const MARK = { ok: "맞음", bad: "틀림", warn: "확인" } as const;
const TONE = {
  ok: "border-border bg-background",
  bad: "border-red-600 bg-red-600/10",
  warn: "border-amber-600 bg-amber-600/10",
} as const;

export default function FailureChainViz() {
  return (
    <SceneShell
      eyebrow="다섯 숫자 점검"
      title="어디가 틀렸는지에 따라 다섯 숫자 중 무너지는 칸이 다릅니다"
      description="글 전체의 가상 사례를 이은 줄입니다. 한 줄이 판단에 쓰는 숫자 하나입니다. 빠른 결제가 앞줄의 잘못을 없애지는 않습니다."
      ariaLabel="평가, 등록, 거래, 법적 관계의 실패가 다섯 숫자에 미치는 영향"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <ol key={scene.label} className="min-w-0 space-y-1">
              {scene.rows.map((row, index) => (
                <li key={LABELS[index]} className={`grid min-w-0 grid-cols-[3.25rem_minmax(0,1fr)_2.25rem] items-center gap-2 rounded-lg border px-2 py-1 ${TONE[row.mark]}`}>
                  <span className="font-mono text-sm font-bold">{row.value}</span>
                  <span className="min-w-0 text-xs leading-5">
                    <span className="block font-semibold">{LABELS[index]}</span>
                    <span className="block text-muted-foreground">{row.text}</span>
                  </span>
                  <span className="text-right text-xs font-bold">{MARK[row.mark]}</span>
                </li>
              ))}
            </ol>
          ))}
        />
      )}
    />
  );
}
