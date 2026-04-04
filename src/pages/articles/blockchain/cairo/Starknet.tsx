import CodePanel from '@/components/ui/code-panel';
import StarknetContractViz from './viz/StarknetContractViz';
import {
  CONTRACT_CODE, CONTRACT_ANNOTATIONS,
  ABI_CODE, ABI_ANNOTATIONS,
} from './StarknetData';

export default function Starknet({ title }: { title?: string }) {
  return (
    <section id="starknet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Starknet 컨트랙트 컴파일'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Starknet 컨트랙트는 일반 Cairo 프로그램과 달리 플러그인 기반 처리,
          ABI 생성, 클래스 해시 계산 등 추가적인 컴파일 단계가 필요합니다.
          <code>cairo-lang-starknet</code> crate가 이를 담당합니다.
        </p>
      </div>

      <StarknetContractViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>플러그인 시스템 & 컨트랙트 발견</h3>
        <CodePanel title="starknet_plugin_suite()" code={CONTRACT_CODE}
          annotations={CONTRACT_ANNOTATIONS} />

        <h3>ABI 생성 & 클래스 해시</h3>
        <CodePanel title="ABI Builder + ContractClass" code={ABI_CODE}
          annotations={ABI_ANNOTATIONS} />
      </div>
    </section>
  );
}
