import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import MatchingSteps from './MatchingSteps';

const STEPS = [
  { label: '매칭 엔진 전체 흐름', body: 'matchOrder → mustPerformTakerOrderMatching.\nCacheContext로 원자적 롤백 보장 — 매칭 실패 시 모든 상태 변경 롤백.' },
  { label: '1단계: CacheContext로 분기', body: 'branchedContext, writeCache := ctx.CacheContext()\n매칭 성공 시에만 writeCache()로 상태 커밋.' },
  { label: '2단계: 최적 가격 주문 탐색', body: 'getBestOrderOnSide — 반대편 주문서에서 최적 가격 탐색.\n매수: 최저 매도가 / 매도: 최고 매수가.' },
  { label: '3단계: 가격 교차 조건 확인', body: 'canMatchOrders — Taker 매수가 >= Maker 매도가?\n조건 불일치 시 매칭 루프 종료.' },
  { label: '4단계: 담보 확인', body: 'checkCollateralization — 충분한 담보 보유 여부 확인.\n부족 시 UNDERCOLLATERALIZED로 Maker 주문 제거.' },
  { label: '5단계: 체결 실행 & 커밋', body: 'MakerFill 생성 → RemainingQuantums 감소.\n잔량이 0이 되면 매칭 루프 종료 → writeCache() 커밋.' },
];

const CODE_MAP = ['dx-match-order', 'dx-match-order', 'dx-taker-match', 'dx-taker-match', 'dx-taker-match', 'dx-taker-match'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function MatchingEngine({ onCodeRef }: Props) {
  return (
    <section id="matching-engine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">매칭 엔진</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        가격-시간 우선순위(Price-Time Priority) 매칭 알고리즘.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <MatchingSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">
                  {CODE_MAP[step] === 'dx-match-order' ? 'match_order.go' : 'taker_match.go'}
                </span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
