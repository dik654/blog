import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ChainSync 전체 흐름</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Lotus 체인 동기화 4단계 — 부트스트랩 → 헤더 수집 → 블록 검증 → 상태 계산<br />
        Syncer가 조율, StateManager가 FVM으로 메시지 실행
      </p>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
