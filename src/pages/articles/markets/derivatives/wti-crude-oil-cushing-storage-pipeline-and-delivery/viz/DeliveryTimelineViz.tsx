import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism·#source — 마지막 거래일 T, T+1 15시 인수 의사 통지, T+2 통지일 짝짓기,
 * T+3 인도 지시서와 전액 인도증거금, 인도월 첫날~마지막 날의 흐름, 인도월 다음 달 20일 지급.
 * 금액은 가정한 최종가격 70달러×1,000배럴=70,000달러와 배럴당 0.12달러 이전비 120달러.
 * 칸 간격은 순서만 뜻하며 실제 날짜 간격이 아니다.
 */
const SCENES = [
  {
    slot: "T",
    label: "T · 마지막 거래일",
    summary: "1계약이 만기까지 남음",
    who: "포지션 보유자",
    what: "거래가 끝난 뒤에도 매수 포지션 1계약이 남았습니다. 이제 원유 1천 배럴을 받을 의무로 바뀌는 절차가 시작됩니다.",
    money: "최종가격 70달러를 대금 기준으로 삼습니다(가정).",
    note: "마지막 거래일을 T라고 부르고, 이후 일정을 T부터 센 영업일로 적습니다.",
  },
  {
    slot: "T+1",
    label: "T+1 · 오후 3시까지",
    summary: "인수 의사 통지",
    who: "매수 청산회원 → 청산소",
    what: "매수자 이름과 계약 수 1을 적은 인수 의사 통지를 냅니다.",
    money: "아직 돈은 움직이지 않습니다.",
    note: "청산회원은 고객 대신 청산소와 거래하는 회원사입니다. 매수 쪽이 먼저 받겠다는 뜻을 청산소에 알립니다.",
  },
  {
    slot: "T+2",
    label: "T+2 · 통지일",
    summary: "매수·매도를 크기대로 짝지음",
    who: "청산소 → 양쪽 청산회원",
    what: "청산소가 매수 측 통지를 매도 측 인도 통지와 크기대로 짝지어 양쪽에 알립니다.",
    money: "아직 돈은 움직이지 않습니다.",
    note: "이 날부터 누가 누구에게 1천 배럴을 넘길지가 정해집니다.",
  },
  {
    slot: "T+3",
    label: "T+3 · 지시서와 증거금",
    summary: "받을 시설 지정 · 전액 증거금",
    who: "매수 청산회원 → 매도 측·거래소",
    what: "인도 방법과 받을 송유관·저장시설을 적은 인도 지시서를 보냅니다.",
    money: "인도할 원유의 전액 가치만큼 증거금: 70달러×1,000=70,000달러(가정).",
    note: "받을 시설은 짝이 정해진 다음 영업일에 정합니다. 같은 셋째 영업일에 매수자에게서 원유 전액 가치만큼 증거금을 받습니다(8절).",
  },
  {
    slot: "인도월",
    label: "인도월 첫날 ~ 마지막 날",
    summary: "원유가 고르게 흐름",
    who: "매도자 → 매수자 지정 시설",
    what: "매도자가 준비한 수취 물량과 송유관 일정에 따라 원유 또는 소유권이 넘어갑니다.",
    money: "시설 간 이전비 0.12달러×1,000=120달러는 별도 청구입니다(가정).",
    note: "매도자는 인도월 첫날부터 원유가 고르게 흐를 수 있도록 일정을 준비합니다.",
  },
  {
    slot: "다음 달 20일",
    label: "인도월 다음 달 20일 · 지급일",
    summary: "대금 70,000달러 지급",
    who: "매수자 → 매도자",
    what: "대금을 치르고, 수량 증서와 소유권 문서가 대금과 맞으면 인도 장부를 닫습니다.",
    money: "대금 70,000달러(가정). 이전비 120달러는 이 대금에 넣지 않고 따로 청구합니다(가정).",
    note: "실제 청구서는 측정 수량, 시설 요금과 세금에 따라 달라집니다. 70,000달러와 120달러는 구조를 익히기 위한 값입니다.",
  },
] as const;

export default function DeliveryTimelineViz() {
  return (
    <SceneShell
      eyebrow="인도 일정"
      title="마지막 거래일에서 지급일까지 여섯 칸"
      description="칸은 일어나는 순서이며 실제 날짜 간격이 아닙니다. 금액은 최종가격 70달러와 이전비 배럴당 0.12달러를 가정한 값입니다."
      ariaLabel="WTI 한 계약의 인도 통지부터 지급까지 순서"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-6 gap-1">
              {SCENES.map((item, slot) => (
                <li key={item.slot} className="min-w-0 text-center">
                  <span
                    className={`mx-auto block h-2 rounded-full ${slot < index ? "bg-[#2563eb]/45" : slot === index ? "bg-[#2563eb]" : "bg-muted"}`}
                  />
                  <span className={`mt-1 block break-keep text-[11px] leading-4 sm:text-xs ${slot === index ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                    {item.slot}
                  </span>
                </li>
              ))}
            </ol>
            <dl className="mt-4 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm sm:grid-cols-[6rem_minmax(0,1fr)]">
              <dt className="text-xs font-semibold text-muted-foreground">누가→누구</dt>
              <dd className="font-semibold">{scene.who}</dd>
              <dt className="text-xs font-semibold text-muted-foreground">무엇을</dt>
              <dd className="leading-6">{scene.what}</dd>
              <dt className="text-xs font-semibold text-muted-foreground">돈</dt>
              <dd className="rounded-lg border border-border px-3 py-2 font-mono text-xs leading-5 sm:text-sm">{scene.money}</dd>
            </dl>
          </div>
        );
      }}
    />
  );
}
