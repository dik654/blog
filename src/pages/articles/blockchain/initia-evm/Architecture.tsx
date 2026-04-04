import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ArchSteps from './ArchSteps';

const STEPS = [
  { label: 'Cosmos 상태와 EVM 상태 매핑 전체', body: 'MiniEVM은 Ethereum의 StateDB를 Cosmos KVStore로 대체.\n같은 상태 공간에서 IBC와 EVM이 공존.' },
  { label: '상태 저장소: MPT → IAVL Tree', body: 'Ethereum: Patricia Merkle Trie + LevelDB.\nMiniEVM: Cosmos KVStore + IAVL Tree. Merkle 증명 방식은 다르지만 동일한 상태 무결성 보장.' },
  { label: '계정: Account → x/auth + x/bank', body: 'EVM address(20byte) ↔ Cosmos address(bech32) 매핑.\nnonce → x/auth sequence number, balance → x/bank 잔액.' },
  { label: 'Storage: KVStore 직접 저장', body: 'key = address + slot, value = bytes32.\nEthereum의 storageRoot 트리 구조 대신 플랫 KV 매핑.' },
  { label: 'Code: KVStore에 저장', body: 'key = codeHash, value = bytecode.\n동일한 Solidity 바이트코드를 그대로 실행 가능.' },
];

const CODE_MAP = ['mini-statedb', 'mini-statedb', 'mini-statedb', 'mini-statedb', 'mini-statedb'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Architecture({ onCodeRef }: Props) {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 매핑 & 실행 흐름</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        이더리움 EVM 상태를 Cosmos KVStore로 어댑팅하는 핵심 메커니즘.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <ArchSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">statedb.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
