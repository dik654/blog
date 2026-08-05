import {
  ConceptPrimer,
  Misconception,
  QuestionLead,
} from '@/components/learning/ArticleLearning';
import GateEquations from './GateEquations';
import { LSTMCellLab } from './viz/LSTMConceptExplorers';

export default function CellArchitecture() {
  return (
    <section id="cell-architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">한 시점의 LSTM cell을 실행 순서로 읽는다</h2>
      <QuestionLead
        question="이전 기억 Cₜ₋₁=0.8 중 75%를 남기고, 새 후보 0.6 중 40%만 기록하면 새 기억은 얼마일까?"
        answer="과거에서 0.75×0.8=0.60을 남기고 새 후보에서 0.40×0.6=0.24를 기록한 뒤 더해 Cₜ=0.84를 만든다. Output gate는 이 내부 기억 전부를 바로 노출하지 않고 tanh(Cₜ) 중 필요한 성분만 hₜ로 내보낸다."
      />
      <ConceptPrimer items={[
        { term: 'Forget gate fₜ', meaning: 'Cₜ₋₁의 각 성분을 얼마 남길지 정한다.', why: '오래된 state를 무조건 누적하면 쓸모없는 정보와 scale도 계속 남기 때문이다.' },
        { term: 'Input gate iₜ', meaning: '새 후보 C̃ₜ의 각 성분을 얼마 기록할지 정한다.', why: '현재 입력의 모든 변화를 장기 기억에 덮어쓰지 않게 한다.' },
        { term: 'Candidate C̃ₜ', meaning: '현재 xₜ와 이전 hₜ₋₁에서 만든 -1~1 범위의 새 내용이다.', why: 'Gate는 비율만 만들므로 기록할 실제 내용이 별도로 필요하다.' },
        { term: 'Output gate oₜ', meaning: '갱신된 Cₜ 중 외부 hidden state로 보일 성분을 정한다.', why: '내부 기억과 현재 prediction·다음 layer에 전달할 표현을 분리한다.' },
      ]} />
      <LSTMCellLab />
      <GateEquations />
      <Misconception><strong>Cₜ</strong>와 <strong>hₜ</strong>는 같은 값의 다른 이름이 아니다. Cₜ는 시간축 memory path이고, hₜ는 output gate를 거쳐 현재 step 밖으로 노출되는 state다. 둘 다 다음 LSTM step에는 입력된다.</Misconception>
    </section>
  );
}
