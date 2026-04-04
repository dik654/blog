import RuntimeTraitViz from './viz/RuntimeTraitViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function RuntimeFoundation({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="runtime-foundation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Runtime: 모든 모듈의 기반</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Commonware의 모든 프리미티브는 <strong>Runtime trait 집합</strong> 위에서 동작
          <br />
          Runner → Context 주입 → Context가 Clock + Network + Storage + Spawner + Metrics 제공
        </p>
        <p className="leading-7">
          핵심 설계: <strong>구현체를 교체하면 동일 코드가 다른 환경에서 실행</strong>
          <br />
          <code>tokio::Runner</code> — 프로덕션 (실제 TCP, 파일시스템, SystemTime)
          <br />
          <code>deterministic::Runner</code> — 테스트 (가상 네트워크, 메모리, 시뮬레이션 시간)
        </p>
      </div>
      <div className="not-prose mb-8">
        <RuntimeTraitViz onOpenCode={open} />
      </div>
    </section>
  );
}
