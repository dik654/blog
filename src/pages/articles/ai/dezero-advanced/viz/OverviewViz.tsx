import DezeroConceptViz from "../../DezeroConceptViz";

export default function OverviewViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="STATEFUL LAYERS"
      title="시간 상태와 실행 모드를 레이어 계약에 추가한다"
      summary="순환 모델은 이전 시점의 상태를, dropout은 train/eval 모드를, normalization과 embedding은 별도의 파라미터 및 인덱스 규칙을 필요로 합니다."
      stages={[
        { tag: "TIME", title: "RNN 상태", description: "hidden state를 다음 시점 입력과 함께 사용합니다." },
        { tag: "MEMORY", title: "LSTM cell state", description: "gate로 장기 기억과 외부 출력을 따로 제어합니다." },
        { tag: "SCALE", title: "LayerNorm", description: "샘플별 feature 통계를 안정된 범위로 맞춥니다." },
        { tag: "MODE", title: "Dropout·Embedding", description: "학습 모드와 정수 인덱스에 맞는 forward/backward 규칙을 둡니다." },
      ]}
      codeKey="rnn-struct"
      codeLabel="상태 레이어 구현 보기"
      onOpenCode={onOpenCode}
    />
  );
}
