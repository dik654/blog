import SceneShell from "./SceneShell";
import TwoPartyFlow from "./TwoPartyFlow";

/**
 * 본문 대응: #comparison — 뉴욕 연은과 한국은행 설명의 현금 방향.
 * 100억 증권·95억 현금·95억95만 환매는 3절의 가정을 대입한 값이고, 흡수 쪽 금액은 본문에 없어 적지 않는다.
 */
const W = 372;
const BLUE = "#2563eb";
const GREEN = "#16a34a";

const SCENES = [
  { label: "중앙은행이 증권을 삽니다", summary: "상대방에 현금 들어옴 · 자금 공급", note: "뉴욕 연방준비은행은 자신이 증권을 사서 나중에 되파는 레포를 은행 준비금을 일시적으로 늘리는 거래로 설명합니다. 한국은행의 RP매입도 정해진 기간 동안 자금을 공급하는 데 쓰입니다." },
  { label: "만기에 되돌립니다", summary: "95억95만 원을 돌려받음", note: "상대방이 약정한 돈을 내고 증권을 돌려받는 단계입니다. 앞 장면의 95억 원 공급과는 다른 날의 흐름이므로 구별해서 읽습니다." },
  { label: "중앙은행이 증권을 팝니다", summary: "중앙은행으로 현금 들어옴 · 자금 흡수", note: "반대로 중앙은행이 증권을 팔고 나중에 되사기로 하면 자금을 흡수하는 방향입니다. 본문이 이 방향의 금액을 정하지 않아 숫자를 적지 않았습니다." },
  { label: "이름보다 화살표", summary: "같은 화살표 · 두 가지 이름", note: "첫 장면과 같은 화살표입니다. 6절의 기준으로는 증권을 사는 쪽에서 본 이름이 역레포인데, 미국 제도의 명칭은 중앙은행 거래 관행의 관점으로 쓰일 수 있습니다. 단어만 보지 말고 누가 현금을 줬는지부터 확인합니다." },
] as const;

export default function CentralBankDirectionViz() {
  return (
    <SceneShell
      eyebrow="현금의 방향"
      title="누가 현금을 줬는지가 자금 공급과 흡수를 가릅니다"
      description="왼쪽이 중앙은행, 오른쪽이 거래 상대방입니다. 95억 원과 95억95만 원은 3절의 가정을 대입한 값입니다."
      note="미국·한국의 실제 적격 증권, 거래 상대방과 만기는 각각 공고를 확인해야 합니다."
      ariaLabel="중앙은행 거래에서 증권과 현금의 방향"
      scenes={SCENES}
      render={(active) => {
        const flows = [
          [
            { label: "증권", toRight: false, color: BLUE },
            { label: "현금 95억", toRight: true, color: GREEN },
          ],
          [
            { label: "증권", toRight: true, color: BLUE },
            { label: "95억95만 원", toRight: false, color: GREEN },
          ],
          [
            { label: "증권", toRight: true, color: BLUE },
            { label: "현금", toRight: false, color: GREEN },
          ],
          [
            { label: "증권", toRight: false, color: BLUE },
            { label: "현금", toRight: true, color: GREEN },
          ],
        ][active];
        const holdings = [
          [["증권 받음"], ["현금 95억 받음"]],
          [["95억95만 원 받음"], ["증권 돌려받음"]],
          [["현금 받음"], ["증권 받음"]],
          [["증권 받음"], ["현금 받음"]],
        ][active];
        const footer = [
          ["자금 공급", "준비금 일시 증가"],
          ["앞 장면과 다른 날의 흐름", "공급은 일시적"],
          ["자금 흡수", "금액은 본문에 없음"],
          ["6절 기준: 사는 쪽에서 보면 역레포", "뉴욕 연은 설명: 자신이 사는 거래를 레포"],
        ][active];
        return (
          <svg viewBox={`0 0 ${W} 150`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <TwoPartyFlow y={2} width={W} left={{ name: "중앙은행", lines: holdings[0] }} right={{ name: "거래 상대방", lines: holdings[1] }} flows={flows} />
            <text x={W / 2} y={120} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">{footer[0]}</text>
            <text x={W / 2} y={140} textAnchor="middle" fontSize={13} className="fill-muted-foreground">{footer[1]}</text>
          </svg>
        );
      }}
    />
  );
}
