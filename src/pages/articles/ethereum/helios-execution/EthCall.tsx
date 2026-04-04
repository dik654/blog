import EthCallViz from './viz/EthCallViz';
import CodePanel from '@/components/ui/code-panel';
import { evmCode, evmAnnotations } from './codeRefs';

export default function EthCall() {
  return (
    <section id="eth-call" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        eth_call: revm 로컬 실행
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          eth_call은 상태를 변경하지 않는 읽기 전용 실행이다.
          Reth와 Helios 모두 revm을 사용하지만 DB가 다르다.<br />
          Reth: Evm::builder().with_db(StateProvider)<br />
          Helios: Evm::builder().with_db(ProofDB)
        </p>
        <p className="leading-7">
          ProofDB는 EVM 실행 중 필요한 계정·스토리지를
          lazy하게 증명 요청한다.<br />
          한 번 검증된 값은 HashMap에 캐싱하여
          같은 블록 내 중복 요청을 방지한다.
        </p>
      </div>
      <div className="not-prose mb-6"><EthCallViz /></div>
      <CodePanel title="evm.rs — ProofDB → revm 실행"
        code={evmCode} annotations={evmAnnotations} />
    </section>
  );
}
