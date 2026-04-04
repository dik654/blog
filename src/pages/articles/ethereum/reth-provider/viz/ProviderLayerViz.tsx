import StepViz from '@/components/ui/step-viz';
import { StepOverview, StepTrait } from './ProviderLayerSteps';
import { StepBundle, StepMDBX, StepStatic } from './ProviderLayerSteps2';

const STEPS = [
  { label: 'Provider 4계층 구조', body: '상태 조회 시 위->아래 순서로 탐색. 메모리 캐시 히트 시 디스크 접근 없음.' },
  { label: 'StateProvider trait -- 모든 계층의 공통 인터페이스', body: 'account(), storage(), bytecode_by_hash() 3개 메서드. 테스트 시 MockProvider 주입 가능.' },
  { label: 'BundleState -- revm 실행 결과를 메모리에 캐시', body: 'revm이 블록 실행 후 생성. reverts 필드로 reorg 시 되돌리기 지원.' },
  { label: 'MDBX -- B+tree 기반 영속 저장소', body: '읽기 최적화 MVCC. Geth의 LevelDB(LSM-tree)와 근본적으로 다른 B+tree.' },
  { label: 'StaticFiles -- finalized 블록의 flat file 아카이브', body: 'finalized 블록 이전 데이터. 블록 번호 = 파일 오프셋으로 O(1) 접근.' },
];

const R = [StepOverview, StepTrait, StepBundle, StepMDBX, StepStatic];

export default function ProviderLayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 430 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
