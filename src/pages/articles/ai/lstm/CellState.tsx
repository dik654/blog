import CellStateViz from './viz/CellStateViz';

export default function CellState() {
  return (
    <section id="cell-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">셀 상태와 정보 흐름</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        셀 상태(Cell State) — 컨베이어 벨트처럼 직선으로 흐르는 LSTM의 핵심 통로.<br />
        C_t = f_t * C_(t-1) + i_t * C̃_t — 덧셈 구조가 기울기 소실을 방지한다.
      </p>
      <CellStateViz />
    </section>
  );
}
