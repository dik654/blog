import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import IBCSteps from './IBCSteps';

const STEPS = [
  { label: 'IBC EVM 통합 — 미들웨어 스택', body: 'IBC Transfer Module 위에 ERC20 변환 + 스마트 컨트랙트 콜백을 미들웨어로 추가.\n크로스체인 ERC20 토큰 자동 변환 지원.' },
  { label: 'IBC Callbacks: 스마트 컨트랙트 콜백', body: 'IIBCCallback 인터페이스 구현 시 패킷 수신/확인/타임아웃에 컨트랙트 함수 자동 호출.\n크로스체인 DEX, 스테이킹 등에 활용.' },
  { label: 'ERC20 Middleware: 자동 변환', body: 'OnRecvPacket에서 TokenPair 확인 → Cosmos Coin을 ERC20으로 자동 변환.\nOnSendPacket에서 ERC20을 Cosmos Coin으로 역변환 후 IBC 전송.' },
  { label: 'IBC Transfer Module: 기본 전송', body: '표준 ICS-20 토큰 전송.\n미들웨어 스택이 위에서 아래로 처리 후 기본 전송 모듈 도달.' },
  { label: '수신/송신 양방향 흐름', body: '수신: 패킷 → Callbacks MW → ERC20 MW → Transfer Module.\n송신: Transfer Module → ERC20 MW(역변환) → 패킷 전송.' },
];

const CODE_MAP = ['ev-erc20-middleware', 'ev-erc20-middleware', 'ev-erc20-middleware', 'ev-erc20-middleware', 'ev-erc20-middleware'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function IBCIntegration({ onCodeRef }: Props) {
  return (
    <section id="ibc-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IBC EVM 통합</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        IBC를 확장하여 ERC20 토큰의 크로스체인 전송과 스마트 컨트랙트 콜백 지원.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <IBCSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">ibc_middleware.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="max-w-none mt-6 space-y-5">
        <h3 className="text-xl font-semibold mt-6 mb-3">IBC Middleware Stack</h3>

        {/* IBC 개요 + Middleware Stack */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-2">IBC (Inter-Blockchain Communication)</h4>
          <p className="text-xs text-muted-foreground mb-4">
            Cosmos의 핵심 기능 — 체인 간 자산/메시지 전송, 표준 protocol (ICS).
          </p>
          <h4 className="text-sm font-semibold mb-2">Middleware Stack</h4>
          <div className="flex flex-col items-center gap-0 text-xs w-full max-w-xs mx-auto">
            <span className="w-full text-center px-3 py-1.5 rounded-t border bg-blue-500/10 text-blue-400 font-medium">IBC Transfer App</span>
            <span className="w-full text-center px-3 py-1.5 border-x border-b bg-purple-500/10 text-purple-400 font-medium">ERC20 Middleware <span className="text-muted-foreground font-normal">← Evmos 추가</span></span>
            <span className="w-full text-center px-3 py-1.5 border-x border-b bg-purple-500/10 text-purple-400 font-medium">Callbacks Middleware <span className="text-muted-foreground font-normal">← Evmos 추가</span></span>
            <span className="w-full text-center px-3 py-1.5 border-x border-b bg-muted text-muted-foreground font-medium">Transfer Module (ICS-20)</span>
            <span className="w-full text-center px-3 py-1.5 rounded-b border-x border-b bg-muted text-muted-foreground font-medium">IBC Core</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            <code className="text-[11px]">OnRecvPacket</code>: Core → Transfer → ERC20 → Callbacks &nbsp;|&nbsp;
            <code className="text-[11px]">OnSendPacket</code>: reverse order
          </p>
        </div>

        {/* ERC20 Middleware 동작 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-green-500/30 bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">OnRecvPacket (수신)</h4>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>IBC 패킷 parse</li>
              <li>Cosmos Coin으로 저장 (전통 ICS-20)</li>
              <li>ERC20 <code className="text-[11px]">TokenPair</code> 확인</li>
              <li>있으면 → ERC20 mint to user</li>
              <li>없으면 → Coin 그대로 유지</li>
            </ol>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">OnSendPacket (송신)</h4>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>User가 ERC20 토큰 전송 시도</li>
              <li><code className="text-[11px]">TokenPair</code> 확인</li>
              <li>ERC20 burn</li>
              <li>Cosmos Coin mint (to module escrow)</li>
              <li>IBC 패킷으로 전송</li>
            </ol>
          </div>
        </div>

        {/* Callbacks Middleware */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-2">Callbacks Middleware</h4>
          <p className="text-xs text-muted-foreground mb-2">
            <code className="text-[11px]">IIBCCallback</code> 인터페이스 —
            <code className="text-[11px]">onPacketAcknowledgement(bytes, bytes)</code>,
            <code className="text-[11px]">onPacketTimeout(bytes)</code>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="rounded bg-muted p-3">
              <p className="text-xs font-medium mb-1">Cross-chain DEX</p>
              <p className="text-xs text-muted-foreground">IBC 전송 → 다른 체인에서 swap → callback으로 결과 수신 → 스마트 컨트랙트 자동 처리</p>
            </div>
            <div className="rounded bg-muted p-3">
              <p className="text-xs font-medium mb-1">Cross-chain Staking</p>
              <p className="text-xs text-muted-foreground">IBC로 다른 체인에 delegate → reward callback 재분배 → 복합 yield farming</p>
            </div>
          </div>
        </div>

        {/* IBC Transfer Packet + 실제 사용 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">IBC Transfer Packet</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li><code className="text-[11px]">denom</code>: <code className="text-[11px]">string</code></li>
              <li><code className="text-[11px]">amount</code>: <code className="text-[11px]">string</code></li>
              <li><code className="text-[11px]">sender</code>: <code className="text-[11px]">string</code></li>
              <li><code className="text-[11px]">receiver</code>: <code className="text-[11px]">string</code></li>
              <li><code className="text-[11px]">memo</code>: <code className="text-[11px]">string</code> — callback 정보 인코딩</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-semibold mb-2">실제 사용</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Axelar — 범용 cross-chain bridge</li>
              <li>Squid Router — UX 통합</li>
              <li>Evmos ↔ Osmosis DEX pools</li>
              <li>Noble USDC ↔ Evmos</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
