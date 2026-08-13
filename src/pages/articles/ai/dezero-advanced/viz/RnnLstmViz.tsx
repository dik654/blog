import DezeroConceptViz from "../../DezeroConceptViz";

export default function RnnLstmViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="RNN VS LSTM"
      title="LSTM은 기억 경로와 출력 경로를 분리한다"
      summary="기본 RNN은 모든 정보를 하나의 hidden state에 반복해서 압축하지만, LSTM은 cell state를 별도로 두고 세 gate로 흐름을 제어합니다."
      stages={[
        { tag: "RNN", title: "단일 상태 갱신", description: "입력과 이전 hidden state를 합쳐 새 상태를 만듭니다.", detail: "hₜ = tanh(xW + hₜ₋₁U)" },
        { tag: "FORGET", title: "기억 유지 비율", description: "forget gate가 이전 cell state에서 남길 양을 정합니다." },
        { tag: "WRITE", title: "새 정보 기록", description: "input gate와 candidate가 새로 더할 기억을 만듭니다." },
        { tag: "OUTPUT", title: "외부 출력 분리", description: "output gate가 cell state 중 노출할 부분을 선택합니다." },
      ]}
      codeKey="lstm-struct"
      codeLabel="RNN·LSTM 구조 보기"
      onOpenCode={onOpenCode}
    />
  );
}
