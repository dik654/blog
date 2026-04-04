import OasisLayerViz from './viz/OasisLayerViz';
import OasisArchFlowViz from './viz/OasisArchFlowViz';
import LayerDesignViz from './viz/LayerDesignViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 2계층 아키텍처'}</h2>
      <div className="not-prose mb-8"><OasisLayerViz /></div>
      <div className="not-prose mb-8">
        <h3 className="text-lg font-semibold mb-3">2계층 아키텍처 플로우</h3>
        <OasisArchFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Oasis Network는 <strong>합의 계층(Consensus Layer)</strong>과
          <strong>런타임 계층(Runtime Layer)</strong>을 분리한 2계층 블록체인입니다.<br />
          TEE(Intel SGX/TDX) 기반 기밀 컴퓨팅을 런타임 레벨에서 지원합니다.<br />
          Sapphire는 EVM 호환 기밀 스마트 컨트랙트를 제공합니다.
        </p>

        <h3>계층 구조</h3>
        <div className="not-prose space-y-2 my-4">
          {[
            {
              name: '합의 계층 (Consensus Layer)',
              color: '#6366f1',
              items: ['CometBFT 기반 BFT 합의', '밸리데이터 관리 & 스테이킹', '거버넌스 & 레지스트리', '루트해시 서비스 (Runtime 상태 커밋)'],
            },
            {
              name: '런타임 계층 (Runtime Layer / ParaTime)',
              color: '#10b981',
              items: ['컴퓨트 워커: 트랜잭션 실행', 'TEE 기반 기밀 실행 (SGX/TDX)', '키매니저: 암호화 키 관리', 'Sapphire: EVM + 기밀성'],
            },
          ].map(l => (
            <div key={l.name} className="rounded-xl border p-4"
              style={{ borderColor: l.color + '30', background: l.color + '06' }}>
              <p className="font-semibold text-sm mb-2" style={{ color: l.color }}>{l.name}</p>
              <ul className="space-y-1">
                {l.items.map(i => (
                  <li key={i} className="text-sm text-foreground/75 flex gap-2">
                    <span className="text-foreground/30">•</span>{i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('full-service', codeRefs['full-service'])} />
            <span className="text-[10px] text-muted-foreground self-center">full.go · 합의 노드</span>
            <CodeViewButton onClick={() => onCodeRef('executor-worker', codeRefs['executor-worker'])} />
            <span className="text-[10px] text-muted-foreground self-center">worker.go · 런타임 워커</span>
          </div>
        )}

        <h3>분리 설계의 장점</h3>
      </div>
      <LayerDesignViz />
    </section>
  );
}
