import OverviewViz from './viz/OverviewViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시퀀스 모델 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          dezero_rs의 기본 신경망(Linear, ReLU, SGD)은 고정 크기 입력을 처리
          <br />
          시퀀스 데이터(텍스트, 시계열)는 길이가 가변이고 순서가 중요
          <br />
          RNN은 은닉 상태 <code>h</code>로 시퀀스를 순차 처리하지만 긴 의존성에서 기울기 소실
        </p>
        <p className="leading-7">
          LSTM은 셀 상태 <code>c</code>와 4개 게이트(forget, input, candidate, output)로 해결
          <br />
          LayerNorm은 레이어 출력 분포를 안정화하고 Dropout은 과적합을 방지
          <br />
          Embedding은 정수 ID를 학습 가능한 벡터로 변환 — Transformer의 입력층
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          모든 상태(h, c, mask)를 <code>RefCell</code>로 관리하는 패턴이 반복
          <br />
          <code>&amp;self</code> 참조만으로 내부 상태를 변경할 수 있어 불변 인터페이스 유지
          <br />
          학습/추론 모드 전환은 <code>thread_local</code> + RAII guard — Python의 <code>with</code> 문을 Rust 관용구로 구현
        </p>
      </div>
    </section>
  );
}
