import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PrecompileSteps from './viz/PrecompileSteps';

const STEPS = [
  { label: '프리컴파일 카테고리 4가지', body: 'EVM 기본(Berlin) + ICosmos + ERC20Registry + JSONUtils.\nKeeper.precompiles()에서 등록하여 EVM에 주입.' },
  { label: 'EVM 기본 프리컴파일', body: 'go-ethereum이 제공하는 표준 프리컴파일.\necRecover(0x01), SHA256(0x02), RIPEMD-160(0x03), bn256 등.\nBerlin 하드포크 규칙에 따라 활성화.' },
  { label: 'ICosmos 프리컴파일', body: 'EVM에서 Cosmos 기능 호출의 핵심.\nexecute_cosmos: IBC 전송·스테이킹·거버넌스를 Solidity에서 실행.\nquery_cosmos: 화이트리스트 기반 Cosmos gRPC 쿼리.\n서명자 검증으로 권한 확인.' },
  { label: 'ERC20 Registry 프리컴파일', body: 'Cosmos denom ↔ ERC20 컨트랙트 주소 양방향 매핑.\nregister_erc20_store: 사용자 ERC20 스토어 등록.\nCosmos 네이티브 토큰이 EVM에서 ERC20으로 동작.' },
  { label: 'JSONUtils 프리컴파일', body: 'Solidity의 JSON 파싱 한계를 보완.\nCosmos 메시지는 JSON 형식이므로 EVM 내부에서 구성 필요.\n가스 효율적인 네이티브 JSON 처리.' },
];

const CODE_MAP = ['mini-precompile-reg', 'mini-precompile-reg', 'mini-execute-cosmos', 'mini-precompile-reg', 'mini-precompile-reg'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Precompiles({ onCodeRef }: Props) {
  return (
    <section id="precompiles" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프리컴파일: EVM-Cosmos 브릿지</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        MiniEVM의 프리컴파일 — EVM에서 Cosmos 기능에 접근하는 네이티브 인터페이스.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <PrecompileSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">
                  {step === 2 ? 'cosmos/contract.go' : 'precompiles.go'}
                </span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
