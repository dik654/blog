import OverviewViz from './viz/OverviewViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Layer 트레이트 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          dezero_rs의 신경망 레이어는 <code>Model</code> trait으로 통합
          <br />
          <code>forward()</code>와 <code>layers()</code> 두 메서드만 구현하면
          cleargrads, params, save/load가 자동 제공
          <br />
          Python DeZero는 <code>__setattr__</code>로 레이어를 자동 등록하지만
          Rust에서는 사용자가 <code>layers()</code>에서 명시적으로 나열
        </p>
        <p className="leading-7">
          <code>Linear</code>은 W를 <code>RefCell&lt;Option&lt;Variable&gt;&gt;</code>로 감싸서 lazy init
          <br />
          생성 시점에 in_size를 모르기 때문 — 첫 forward 호출 시 <code>x.shape()[1]</code>로 자동 결정
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Python의 동적 속성 등록(<code>__setattr__</code>)을 Rust에서는 trait의 명시적 메서드로 대체
          <br />
          자유도는 줄지만 컴파일 타임에 레이어 누락을 잡을 수 있는 장점
          <br />
          <code>&apos;a</code> 라이프타임으로 SGD가 Model을 빌리는 관계를 컴파일러가 보장
        </p>
      </div>
    </section>
  );
}
