import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import BeaconKitCompareViz from './viz/BeaconKitCompareViz';

const STEPS = [
  { label: '이더리움 Beacon Chain vs BeaconKit 전체 비교', body: 'BeaconKit — 이더리움 Beacon Chain 스펙을 CometBFT 위에서 구현.\nEngine API로 이더리움 EL 클라이언트(geth/reth)를 그대로 재활용.' },
  { label: 'CL: Casper FFG → CometBFT', body: '이더리움의 확률적 최종성(2 에폭, ~12.8분) 대신 CometBFT의 즉시 최종성(1 블록). reorg 발생 불가.' },
  { label: '포크 선택: LMD-GHOST → 불필요', body: 'BFT 합의에서는 포크가 발생하지 않으므로 포크 선택 규칙 자체가 불필요. 아키텍처 단순화.' },
  { label: 'P2P: libp2p → MConnection', body: 'Tendermint의 MConnection 멀티플렉싱 P2P. 기존 Cosmos 생태계의 피어 디스커버리/가십과 호환.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Berachain BeaconKit 개요</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Berachain — Proof of Liquidity(PoL) 합의를 사용하는 EVM 호환 블록체인.<br />
        BeaconKit 프레임워크 — 이더리움 EL+CL 아키텍처를 Cosmos에 가장 직접적으로 이식.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <BeaconKitCompareViz />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('bk-service', codeRefs['bk-service'])} />
                <span className="text-[10px] text-muted-foreground">service.go</span>
                <CodeViewButton onClick={() => onCodeRef('bk-state-processor', codeRefs['bk-state-processor'])} />
                <span className="text-[10px] text-muted-foreground">state_processor.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Berachain 아키텍처 상세</h3>
        {/* Foundation */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">Foundation</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <span className="text-muted-foreground">타입</span><span>EVM L1 + Proof of Liquidity (PoL)</span>
            <span className="text-muted-foreground">기반</span><span>BeaconKit (CometBFT + Ethereum spec)</span>
            <span className="text-muted-foreground">EL</span><span>Reth 또는 Geth (이더리움 클라이언트 그대로)</span>
            <span className="text-muted-foreground">CL</span><span>BeaconKit (Prysm/Lighthouse 대신)</span>
            <span className="text-muted-foreground">합의 엔진</span><span>CometBFT (Casper FFG 대신)</span>
            <span className="text-muted-foreground">경제 모델</span><span>PoL (PoS 대신)</span>
          </div>
        </div>

        {/* Three-token system */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">BERA</h4>
            <p className="text-xs text-muted-foreground mb-1">Native gas token</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>트랜잭션 가스 지불</li>
              <li>양도 가능 (일반 ERC-20)</li>
              <li>이더리움의 ETH 역할</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">BGT <span className="text-xs text-muted-foreground">(Bera Governance Token)</span></h4>
            <p className="text-xs text-muted-foreground mb-1">Soulbound (양도 불가)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>유동성 제공으로 획득</li>
              <li>검증자 위임 + 거버넌스 투표</li>
              <li>BGT → BERA 단방향 소각만 가능</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">HONEY</h4>
            <p className="text-xs text-muted-foreground mb-1">Native stablecoin (초과 담보)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>화이트리스트 자산(USDC, pyUSD)으로 발행</li>
              <li>DEX 풀, 대출 마켓에서 사용</li>
              <li>차익거래 + 담보로 페그 유지</li>
            </ul>
          </div>
        </div>

        {/* BeaconKit vs other Cosmos EVM */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">BeaconKit vs 기존 Cosmos EVM</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">Evmos / Cronos</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>EVM을 Cosmos SDK 모듈 위에 부착</li>
                <li>이더리움과 다른 계정 모델</li>
                <li>커스텀 수수료 시장 (<code className="text-xs bg-background/50 px-1 rounded">x/feemarket</code>)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">BeaconKit (Berachain)</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>진정한 이더리움 아키텍처</li>
                <li>CL-EL 간 Engine API 연결</li>
                <li>geth/reth 수정 없이 사용</li>
                <li>검증자 키: BLS (이더리움 스펙)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why BeaconKit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">이더리움 호환성</h4>
            <ul className="text-sm space-y-1">
              <li>✓ 동일 EL 클라이언트 (geth, reth, nethermind)</li>
              <li>✓ 동일 Engine API (포크 선택 분리)</li>
              <li>✓ 동일 RPC 메서드 (<code className="text-xs bg-background/50 px-1 rounded">eth_*</code>)</li>
              <li>✓ 동일 프리컴파일 + EVM 옵코드</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Cosmos 이점</h4>
            <ul className="text-sm space-y-1">
              <li>✓ 즉시 최종성 (1 블록, 2 에폭 아님)</li>
              <li>✓ 재정렬 불가 (BFT safety)</li>
              <li>✓ IBC 호환 (브릿지 연동)</li>
              <li>✓ 빠른 반복 (CometBFT 업데이트)</li>
            </ul>
          </div>
        </div>

        {/* Finality comparison */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">최종성 비교</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">Ethereum PoS</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>에폭 = 32 슬롯 = ~6.4분</li>
                <li>최종성 = 2 에폭 = ~12.8분</li>
                <li>최종성 전까지 재정렬 가능</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Berachain BeaconKit</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>블록 타임 = ~2초</li>
                <li>최종성 = 1 블록 (BFT)</li>
                <li>재정렬 불가</li>
                <li>2/3+ 정직한 검증자 필요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Engine API */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">Engine API</h4>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[180px_1fr] gap-x-4 gap-y-1">
              <span className="font-medium"><code className="text-xs bg-background/50 px-1 rounded">engine_forkchoiceUpdatedV3</code></span>
              <span className="text-muted-foreground">CL → EL: "head X 위에서 블록 빌드" → <code className="text-xs bg-background/50 px-1 rounded">payload_id</code> 반환</span>
              <span className="font-medium"><code className="text-xs bg-background/50 px-1 rounded">engine_getPayloadV3</code></span>
              <span className="text-muted-foreground">CL → EL: "빌드된 페이로드 전달" → <code className="text-xs bg-background/50 px-1 rounded">ExecutionPayload</code> 반환</span>
              <span className="font-medium"><code className="text-xs bg-background/50 px-1 rounded">engine_newPayloadV3</code></span>
              <span className="text-muted-foreground">CL → EL: "이 페이로드 검증" → <code className="text-xs bg-background/50 px-1 rounded">VALID | INVALID</code> 반환</span>
            </div>
            <div className="border-t border-border/50 pt-2">
              <p className="text-xs text-muted-foreground font-medium mb-1">BeaconKit 호출 시점</p>
              <div className="grid grid-cols-[160px_1fr] gap-x-4 gap-y-1 text-xs">
                <span>PrepareProposal</span><span className="text-muted-foreground">→ forkchoiceUpdated + getPayload</span>
                <span>ProcessProposal</span><span className="text-muted-foreground">→ newPayload</span>
                <span>FinalizeBlock</span><span className="text-muted-foreground">→ forkchoiceUpdated (head 확정)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Use cases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">DeFi 프리미티브</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>BEX (네이티브 DEX)</li>
              <li>BERPS (퍼페추얼)</li>
              <li>BEND (렌딩)</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">리퀴드 스테이킹</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>BGT 파생 스테이킹 (iBGT 등)</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">EVM dApps</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Uniswap, Aave 이식</li>
              <li>이더리움 dApp 수정 없이 배포</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
