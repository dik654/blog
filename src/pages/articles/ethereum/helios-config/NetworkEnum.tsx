import NetworkViz from './viz/NetworkViz';
import CodePanel from '@/components/ui/code-panel';
import { networkCode, networkAnnotations } from './codeRefs';

export default function NetworkEnum() {
  return (
    <section id="network-enum" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Network enum (mainnet · sepolia · holesky)
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth: ChainSpec::mainnet()으로 체인 파라미터를 로드한다.
          genesis 블록, 하드포크 블록 번호, chain_id 등을 포함.<br />
          Helios: Network enum으로 체인을 선택한다.
          각 variant에 ConsensusSpec이 매핑된다.
        </p>
        <p className="leading-7">
          Network 선택 시 자동으로 결정되는 것들:<br />
          genesis_validators_root — BLS 도메인 계산에 필수.
          fork_versions — Bellatrix/Capella/Deneb 각 4바이트.
          기본 체크포인트 — 하드코딩된 최신 finalized 슬롯.
        </p>
      </div>
      <div className="not-prose mb-6"><NetworkViz /></div>
      <CodePanel title="config/src/lib.rs — Network enum"
        code={networkCode} annotations={networkAnnotations} />
    </section>
  );
}
