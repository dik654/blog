import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import OverviewSteps from './OverviewSteps';

const STEPS = [
  { label: 'EVM 통합 3가지 접근법 비교', body: '이더리움 네이티브 / Octane(외부 geth 연결) / MiniEVM(Cosmos 모듈 내부 임베딩).\nInitia는 세 번째 방식 — EVM을 x/evm 모듈로 직접 임베딩.' },
  { label: '이더리움 네이티브: CL + Engine API + EL', body: 'Beacon Chain이 Engine API로 geth와 통신.\n가장 표준적인 구조이지만 Cosmos 생태계와 호환 불가.' },
  { label: 'Octane: CometBFT → Engine API → geth', body: 'ABCI 콜백을 Engine API로 변환하여 외부 geth를 연결.\n장점: EL 클라이언트 재활용 / 단점: IPC 통신 오버헤드.' },
  { label: 'MiniEVM: Cosmos 모듈 안에 EVM 임베딩', body: 'go-ethereum의 EVM을 x/evm Keeper 내부에서 직접 실행.\nCosmos IBC와 EVM이 같은 상태 공간 공유 — 네이티브 상호운용.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Initia MiniEVM 개요</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Initia의 MiniEVM — Cosmos SDK 모듈로 구현된 경량 EVM.<br />
        EVM을 Cosmos 모듈 내부에 직접 임베딩하여 IBC + EVM 네이티브 통합.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <OverviewSteps step={step} />
            {onCodeRef && step === 3 && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('mini-keeper', codeRefs['mini-keeper'])} />
                <span className="text-[10px] text-muted-foreground">keeper.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
