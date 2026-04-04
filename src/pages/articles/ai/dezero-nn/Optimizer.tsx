import OptimizerViz from './viz/OptimizerViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Optimizer({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="optimizer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">옵티마이저 (SGD, Adam)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          SGD: <code>p -= lr * grad</code> — 가장 단순한 경사 하강법
          <br />
          <code>&apos;a</code> 라이프타임으로 Model 참조를 빌림 — <code>setup(&amp;model)</code>로 연결 후 <code>update()</code> 호출
          <br />
          모든 파라미터에 동일한 학습률 → 희소한(sparse) 기울기에 취약
        </p>
        <p className="leading-7">
          Adam: 1차 모멘트(기울기 방향 이동평균) + 2차 모멘트(기울기 크기 이동평균)
          <br />
          바이어스 보정: 초기 m, v가 0이라 작은 값으로 편향 → <code>lr_t</code>로 보정
          <br />
          AdamW: 가중치 감쇠(weight decay)를 모멘트 밖에서 분리 적용 — Transformer 학습의 표준
        </p>
      </div>
      <div className="not-prose mb-8">
        <OptimizerViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Adam의 ms, vs를 <code>RefCell&lt;Vec&lt;ArrayD&gt;&gt;</code>로 관리 — lazy init 패턴
          <br />
          첫 update 시 shape를 모르므로 빈 배열로 시작, grad.shape()와 불일치하면 재할당
          <br />
          SGD는 <code>&apos;a</code> 라이프타임으로 Model을 빌리지만,
          Adam은 params를 직접 받아 라이프타임 없이 동작하는 설계 차이
        </p>
      </div>
    </section>
  );
}
