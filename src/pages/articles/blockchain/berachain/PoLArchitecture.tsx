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
    </section>
  );
}
