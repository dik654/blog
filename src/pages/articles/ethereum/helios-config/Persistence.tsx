import type { CodeRef } from '@/components/code/types';
import PersistenceViz from './viz/PersistenceViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function Persistence({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="persistence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Helios는 두 가지 영속 전략으로 가용성을 확보한다.
          FileDB는 체크포인트를 디스크에 저장해 재시작 비용을 줄이고,
          MultiRpc는 RPC 장애 시 자동 전환으로 서비스 중단을 방지한다.
        </p>
      </div>

      {/* Viz: FileDB warm start + MultiRpc fallback */}
      <div className="not-prose my-8">
        <PersistenceViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 저장 비용 차이</strong><br />
          Reth: MDBX에 체인 전체를 저장한다 — 수백 GB.<br />
          Helios: checkpoint.ssz 하나 — 수십 바이트.
          모바일이나 WASM 환경에서도 영속성을 유지할 수 있는 이유다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} Fallback 안전성</strong><br />
          fallback RPC가 악의적이어도 괜찮다.
          모든 응답은 Merkle proof와 BLS 서명으로 검증된다.
          거짓 데이터는 검증 단계에서 즉시 거부된다.
        </p>
      </div>
    </section>
  );
}
