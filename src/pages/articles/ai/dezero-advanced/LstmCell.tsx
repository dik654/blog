import LstmViz from './viz/LstmViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function LstmCell({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="lstm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LSTM 셀 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          4개 게이트 각각 독립 파라미터: <code>x2f, x2i, x2o, x2g</code> (Linear) + <code>w_hf..w_hg</code>
          <br />
          forget/input/output은 sigmoid(0~1 범위) — "얼마나"를 비율로 결정
          <br />
          candidate는 tanh(-1~1 범위) — "무엇을"의 새 후보 생성
        </p>
        <p className="leading-7">
          셀 업데이트: <code>c = f*c_prev + i*g</code> — 이전 기억의 선택적 보존 + 새 기억 추가
          <br />
          은닉 출력: <code>h = o*tanh(c)</code> — 장기 기억을 필터링해서 외부에 전달
          <br />
          첫 스텝에서는 <code>c=None</code>이므로 <code>c = i*g</code> (forget 없이 전부 새 기억)
        </p>
      </div>
      <div className="not-prose mb-8">
        <LstmViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          <code>h→gate</code> 가중치를 lazy init하는 이유: 생성 시점에 hidden_size만 알고 있음
          <br />
          <code>init_w_h()</code>가 Xavier 초기화된 (H, H) 행렬을 4개 독립 생성
          <br />
          같은 시드에서 4개 다른 가중치가 나오도록 <code>rng_state: Cell&lt;u64&gt;</code>가 순차 진행
        </p>
      </div>
    </section>
  );
}
