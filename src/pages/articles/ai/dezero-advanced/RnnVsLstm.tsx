import RnnLstmViz from './viz/RnnLstmViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function RnnVsLstm({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="rnn-vs-lstm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RNN → LSTM 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          RNN: <code>h = tanh(x@W_x + h_prev@W_h)</code> — 단일 tanh 게이트
          <br />
          모든 시간 정보를 하나의 <code>h</code> 벡터에 압축
          <br />
          tanh 기울기 최대 1.0 → 50스텝이면 0.7^50 ≈ 0.02% — 초기 입력 영향 소멸
        </p>
        <p className="leading-7">
          LSTM: 셀 상태 <code>c</code>가 <strong>덧셈</strong>으로 전달 — <code>c = f*c + i*g</code>
          <br />
          덧셈의 기울기는 1이므로 forget gate가 1에 가까우면 기울기가 그대로 흐름
          <br />
          4개 독립 게이트가 "무엇을 잊을지/기억할지/출력할지" 각각 학습
        </p>
      </div>
      <div className="not-prose mb-8">
        <RnnLstmViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          RNN과 LSTM 모두 <code>RefCell&lt;Option&lt;Variable&gt;&gt;</code>로 상태 관리
          <br />
          차이: RNN은 <code>w_h</code> 1개, LSTM은 <code>w_hf..w_hg</code> 4개
          <br />
          파라미터 4배 → 연산량 4배지만 긴 시퀀스에서의 학습 안정성이 근본적으로 달라짐
        </p>
      </div>
    </section>
  );
}
