import ContextViz from './viz/ContextViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IPC 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('ipc-subnet', codeRefs['ipc-subnet'])} />
          <span className="text-[10px] text-muted-foreground self-center">subnet.go — IPC 서브넷</span>
        </div>
        <p>
          IPC(InterPlanetary Consensus)는 Filecoin의 L2 서브넷 프레임워크.<br />
          메인넷의 보안을 상속하면서 커스텀 합의와 실행 환경을 구성
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 IPC가 Filecoin을 "범용 L1"으로 변환</strong> — 스토리지 전용이 아닌 컴퓨팅 플랫폼.<br />
          서브넷에서 DeFi, AI 추론, 게임 등 다양한 워크로드를 실행 가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">IPC Architecture 상세</h3>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Why IPC?</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Filecoin 메인넷은 고정된 합의(EC + F3), 스토리지 전용, 30s 에폭, ~100 TPS 한계.
            </p>
            <p className="text-xs">
              IPC 서브넷은 <code>custom consensus</code> 선택, 높은 처리량, 특화된 워크로드, 크로스 서브넷 메시지를 제공
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">계층 구조</h4>
            <p className="text-xs">
              Filecoin mainnet (L1) → Subnet A (L2) → Subnet B (L3) → 재귀적.<br />
              수평 파티셔닝으로 확장, 메인넷 보안 상속, 합의 유연성, 앱 전용 체인 구성
            </p>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Gateway Actor</h4>
            <p className="text-xs text-muted-foreground">부모 체인에 배포</p>
            <ul className="text-xs mt-1 space-y-0.5 list-disc list-inside">
              <li>서브넷 레지스트리</li>
              <li>검증자 관리</li>
              <li>체크포인팅</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Subnet Actor</h4>
            <p className="text-xs text-muted-foreground">서브넷별 상태 관리</p>
            <ul className="text-xs mt-1 space-y-0.5 list-disc list-inside">
              <li>체크포인트 수락</li>
              <li>자금 관리</li>
              <li>검증자 세트</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Subnet Nodes</h4>
            <p className="text-xs text-muted-foreground">독립 검증자 운영</p>
            <ul className="text-xs mt-1 space-y-0.5 list-disc list-inside">
              <li>커스텀 합의 실행</li>
              <li>로컬 트랜잭션 처리</li>
              <li>블록 생산</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Use Cases</h4>
            <ul className="text-xs space-y-0.5 list-disc list-inside">
              <li><strong>DeFi</strong> — fast finality</li>
              <li><strong>AI 추론</strong> — high throughput</li>
              <li><strong>게임</strong> — low latency</li>
              <li><strong>컴플라이언스</strong> — permissioned</li>
              <li><strong>엔터프라이즈</strong> — private data</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">비교 &amp; 영향</h4>
            <p className="text-xs">
              Ethereum: single chain + rollups / Polkadot: parachains / Cosmos: sovereign chains + IBC / <strong>Filecoin: IPC subnets (recursive)</strong>
            </p>
            <p className="text-xs mt-2 text-muted-foreground">
              타임라인: 2022 spec → 2023 testnet → 2024 mainnet beta → 2025 production
            </p>
          </div>
        </div>
        <p className="leading-7">
          IPC: <strong>hierarchical L2 subnets + custom consensus</strong>.<br />
          Filecoin mainnet → subnets → sub-subnets (recursive).<br />
          inherited security, application-specific optimization.
        </p>
      </div>
    </section>
  );
}
