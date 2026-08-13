import DezeroConceptViz from "../../DezeroConceptViz";

export default function LstmViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="LSTM CELL"
      title="네 개의 projection을 두 개의 상태 업데이트로 합친다"
      summary="forget·input·output gate와 candidate를 계산한 뒤 cell state를 먼저 갱신하고, 그 결과에서 hidden state를 만듭니다."
      stages={[
        { tag: "PROJECT", title: "네 projection 계산", description: "현재 입력과 이전 hidden state를 각 gate와 candidate 공간으로 보냅니다." },
        { tag: "GATE", title: "sigmoid·tanh 적용", description: "gate는 0~1 비율을, candidate는 -1~1의 새 내용을 만듭니다." },
        { tag: "CELL", title: "cell state 갱신", description: "이전 기억을 남기고 새 후보를 더합니다.", detail: "cₜ = f⊙cₜ₋₁ + i⊙g" },
        { tag: "HIDDEN", title: "hidden state 출력", description: "갱신된 기억 중 이번 시점에 드러낼 부분을 고릅니다.", detail: "hₜ = o⊙tanh(cₜ)" },
      ]}
      codeKey="lstm-forward"
      codeLabel="LSTM forward 보기"
      onOpenCode={onOpenCode}
    />
  );
}
