import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PoLSteps from './PoLSteps';

const STEPS = [
  { label: 'PoL 플라이휠 전체 구조', body: '유동성 제공 → BGT 보상 → 검증자 위임 → 블록 생성 → BGT 배분 → 재투자.\n3토큰 모델: BERA(가스) + BGT(거버넌스, 양도불가) + HONEY(스테이블).' },
  { label: '1단계: DeFi 프로토콜에 유동성 제공', body: '사용자가 DEX, 대출 풀에 유동성을 공급.\nEthereum PoS와 달리 스테이킹이 아닌 유동성 기여로 보안 확보.' },
  { label: '2단계: Reward Vault에서 BGT 수령', body: '유동성 공급 대가로 BGT(Bera Governance Token)를 보상.\nBGT는 양도 불가 — 위임만 가능하여 투기 방지.' },
  { label: '3단계: 검증자에게 BGT 위임', body: 'BGT 홀더가 원하는 검증자에게 위임(boost).\n검증자의 투표 파워 = 위임받은 BGT 총량.' },
  { label: '4단계: 블록 생성 & BGT 배분', body: '검증자가 블록 제안 시 게이지 가중치에 따라 BGT를 프로토콜에 배분.\n프로토콜은 유동성 유치를 위해 검증자에게 인센티브 제공.' },
  { label: '5단계: 선순환 (플라이휠)', body: '프로토콜 인센티브 → 검증자 → 위임자 → 다시 유동성 제공.\n네트워크 보안 = 스테이킹 + DeFi TVL 합산.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function PoLArchitecture({ onCodeRef }: Props) {
  return (
    <section id="pol-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proof of Liquidity (PoL)</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        이더리움 PoS — ETH 스테이킹으로 보안 확보.<br />
        Berachain PoL — 유동성 제공으로 보안 확보하는 새로운 합의 경제 모델.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <PoLSteps step={step} />
            {onCodeRef && step >= 3 && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('bk-block-builder', codeRefs['bk-block-builder'])} />
                <span className="text-[10px] text-muted-foreground">block_builder.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Proof of Liquidity 경제 모델</h3>
        {/* Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">기존 PoS의 문제</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>스테이커가 ETH/SOL 잠금 → 수익률 수령</li>
              <li>자본이 유휴 상태 (네트워크 보안만 담당)</li>
              <li>DeFi 프로토콜이 스테이킹과 자본 경쟁</li>
              <li>유동성 파편화 발생</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">PoL 해결책</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>유동성 제공자가 합의 파워 획득</li>
              <li>자본이 동시에 DEX/대출 유동성 제공 (생산적)</li>
              <li>BGT 위임으로 네트워크 보안 확보</li>
              <li>통합 경제 플라이휠</li>
            </ul>
          </div>
        </div>

        {/* Token roles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">BERA <span className="text-xs text-muted-foreground">(gas token)</span></h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>가스 지불용</li>
              <li>일반 ERC-20 전송/스왑</li>
              <li>최대 공급량: ~500M</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">BGT <span className="text-xs text-muted-foreground">(soulbound)</span></h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>LP 제공 / Reward Vault 예치로 획득</li>
              <li>양도 불가 (매매 불가)</li>
              <li>검증자 위임 → 투표 파워 증가</li>
              <li>BERA로 소각 (1:1 비율)</li>
              <li>거버넌스 투표</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">HONEY <span className="text-xs text-muted-foreground">(stablecoin)</span></h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>초과 담보 스테이블코인</li>
              <li>화이트리스트 자산 예치로 발행</li>
              <li>BeraBorrowing으로 $1 페그 유지</li>
            </ul>
          </div>
        </div>

        {/* Flywheel steps */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">유동성 플라이휠 (7단계)</h4>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">1.</span>
              <span>사용자가 BEX 풀(BERA/HONEY)에 LP 제공 → 100 HONEY + 50 BERA 예치</span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">2.</span>
              <span>LP 토큰을 Reward Vault에 스테이킹 → 거버넌스가 정한 비율로 BGT 수령</span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">3.</span>
              <span>BGT가 사용자 주소에 축적 (soulbound) → 7일간 100 BGT 획득</span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">4.</span>
              <span>BGT를 원하는 검증자에게 위임 → 검증자 V의 투표 파워 증가</span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">5.</span>
              <span>검증자 V가 블록 제안자가 될 확률 증가 → 블록 보상 + 가스 수수료 획득</span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">6.</span>
              <span>검증자 V가 인센티브 프로토콜에 BGT 배분 → BEX 50%, BEND 30%, 기타 20%</span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">7.</span>
              <span>프로토콜이 BGT를 LP 보상으로 분배 → 1단계로 순환 (유동성 증가)</span>
            </div>
          </div>
        </div>

        {/* Validator selection */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">검증자 선출</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <span className="text-muted-foreground">가중치</span>
            <span><code className="text-xs bg-background/50 px-1 rounded">Weight(V)</code> = V에게 위임된 BGT 총합</span>
            <span className="text-muted-foreground">제안자 확률</span>
            <span><code className="text-xs bg-background/50 px-1 rounded">Weight(V) / Total_BGT</code></span>
            <span className="text-muted-foreground">위임 철회</span>
            <span>에폭 경계에서 가능 → 악성 검증자는 위임 빠르게 상실</span>
          </div>
        </div>

        {/* Gauges */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">거버넌스 풀 (Gauges)</h4>
          <p className="text-sm text-muted-foreground mb-2">BGT 홀더가 게이지에 투표: "어떤 프로토콜에 검증자 보상을 지급할 것인가?"</p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>검증자가 블록당 BGT를 투표 승리 게이지에 투표 가중치 비례 배분</li>
            <li>프로토콜은 BGT 홀더에게 투표 유도를 위한 인센티브 제공 (뇌물: 외부 보상, 에어드롭 등)</li>
            <li>Curve의 veCRV 게이지 시스템과 유사</li>
          </ul>
        </div>

        {/* PoS comparison */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">PoS 체인 비교</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">Ethereum PoS</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>스테이킹 = ETH를 Beacon Chain에 잠금</li>
                <li>수익률 = ~4% APR</li>
                <li>자본 효율: 낮음 (유휴 상태)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Berachain PoL</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>"스테이킹" = DeFi 유동성 제공</li>
                <li>수익률 = LP 수수료 + BGT 보상</li>
                <li>자본 효율: 높음 (DeFi에서 활용)</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-3 pt-2">
            <p className="text-xs font-medium mb-1">Trade-off</p>
            <p className="text-xs text-muted-foreground">PoL 복잡도 높음 / BGT 변동성이 보안에 영향 / 검증자-프로토콜 결탁 위험</p>
          </div>
        </div>

        {/* BGT burn mechanism */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">BGT → BERA 소각 메커니즘</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-2">
            <span className="text-muted-foreground">변환</span>
            <span>X BGT 소각 → X BERA 수령 (단방향, 역방향 불가)</span>
            <span className="text-muted-foreground">유인</span>
            <span>BGT 유지 → 검증자 보상 수령 / 또는 소각 → BERA 현금화</span>
          </div>
          <div className="border-t border-border/50 pt-2">
            <p className="text-xs font-medium mb-1">경제적 효과</p>
            <p className="text-xs text-muted-foreground">BGT 공급 증가 (배출) → BGT 소각 시 BERA 공급 증가 → 순 BERA 인플레이션은 BGT 배출량에 연동</p>
          </div>
        </div>

        {/* Reward Vaults */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">Reward Vaults</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-2">
            <span className="text-muted-foreground"><code className="text-xs bg-background/50 px-1 rounded">stake(uint256)</code></span><span>LP 토큰 예치</span>
            <span className="text-muted-foreground"><code className="text-xs bg-background/50 px-1 rounded">withdraw(uint256)</code></span><span>LP 토큰 인출</span>
            <span className="text-muted-foreground"><code className="text-xs bg-background/50 px-1 rounded">getReward()</code></span><span>BGT 청구</span>
            <span className="text-muted-foreground"><code className="text-xs bg-background/50 px-1 rounded">notifyRewardAmount(uint256)</code></span><span>보상 알림</span>
          </div>
          <p className="text-xs text-muted-foreground">자산당 다수 vault 존재 — 각 vault는 서로 다른 프로토콜이 인센티브 — 검증자가 BGT 배출을 vault 간 할당</p>
        </div>

        {/* Security */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">보안 가정</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-2">
            <span className="text-muted-foreground">정직 다수 (BFT)</span>
            <span>2/3+ 검증자가 정직</span>
            <span className="text-muted-foreground">정직 자본</span>
            <span>2/3+ BGT가 정직한 검증자에게 위임</span>
          </div>
          <div className="border-t border-border/50 pt-2 text-xs text-muted-foreground space-y-0.5">
            <p>악성 고래가 1/3+ BGT 위임 시 → 체인 중단 가능 (재작성 불가)</p>
            <p>2/3+ BGT 악성 시 → Safety 위반 가능</p>
          </div>
        </div>

        {/* Protocols */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">Berachain 실제 프로토콜</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm">
            <span><span className="font-medium">BEX</span> <span className="text-muted-foreground">— DEX (Balancer fork)</span></span>
            <span><span className="font-medium">BEND</span> <span className="text-muted-foreground">— 렌딩 마켓</span></span>
            <span><span className="font-medium">BERPS</span> <span className="text-muted-foreground">— 퍼페추얼</span></span>
            <span><span className="font-medium">InfraRed</span> <span className="text-muted-foreground">— 리퀴드 BGT 스테이킹</span></span>
            <span><span className="font-medium">Kodiak</span> <span className="text-muted-foreground">— 집중 유동성</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
