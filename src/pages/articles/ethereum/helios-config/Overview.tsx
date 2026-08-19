import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import { CodeViewButton } from "@/components/code";
import HeliosContractViz from "../helios-contract-viz";
import { codeRefsReal } from "./codeRefsReal";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

const HELIOS_SHA = "43a8c9f3cdda41a6f383c4db41d9a83f102638b1";

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">설정은 문자열 목록이 아니라 이번 실행의 trust boundary다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Helios가 시작할 때 고르는 값은 단순한 편의 옵션이 아닙니다. Network는 genesis·fork schedule을, checkpoint는 처음 믿을 consensus
          root를, consensus/execution endpoint는 서로 다른 data source를, bind address는 누가 local RPC에 접근할지를 정합니다. 하나라도 다른
          실행에서 가져오면 “연결은 됐지만 다른 chain을 검증하는” 구성이 될 수 있습니다.
        </p>
        <p>
          고정 예시는 HTTP port의 후보가 network default 8,545, TOML 9,545, CLI 10,545인 실행입니다. Pinned source의
          <code> BaseConfig → TOML → CLI</code> merge 순서에서는 최종값 10,545와 <code>source=CLI</code>, 가려진 두 후보, config digest를 함께
          기록합니다. 값 10,545만 남기면 재시작 때 왜 달라졌는지 설명할 수 없습니다.
        </p>
        <div className="not-prose my-4">
          <CodeViewButton
            label="Config::from_file() — Figment merge"
            onClick={() => onCodeRef("helios-config-merge", codeRefsReal["helios-config-merge"])}
          />
        </div>
        <p>
          일반적인 설정 provenance는 <Link to="/blockchain/reth-cli#overview">Reth CLI 글</Link>의 정본을 재사용합니다. 이 글은 Helios의
          network bundle, checkpoint source/age, endpoint role, FileDB snapshot에만 범위를 좁힙니다.
        </p>
      </div>
      <ContentBoundary article="helios-config" />
      <HeliosContractViz mode="config-precedence" />

      <div id="paper-helios-config-source" className="scroll-mt-24">
        <CitationBlock
          source="a16z/helios Ethereum config · pinned source"
          href={`https://github.com/a16z/helios/tree/${HELIOS_SHA}/ethereum/src/config`}
          citeKey={1}
          type="code"
        >
          문제: Network default, TOML과 CLI를 실행 가능한 typed config로 합칩니다. 기여: Figment merge order, network bundle, checkpoint·endpoint
          field를 보여 줍니다. 전제: commit {HELIOS_SHA.slice(0, 8)}와 target binary를 고정합니다. 근거 범위: 이 snapshot의 config
          implementation입니다. 비주장: parse 성공이 endpoint trust·filesystem durability·readiness를 보장하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-helios-builder-source" className="scroll-mt-24">
        <CitationBlock
          source="a16z/helios EthereumClientBuilder · pinned source"
          href={`https://github.com/a16z/helios/blob/${HELIOS_SHA}/ethereum/src/builder.rs`}
          citeKey={2}
          type="code"
        >
          문제: Library embedding과 config file 값을 같은 client construction으로 수렴시킵니다. 기여: explicit builder field와 Config fallback,
          execution provider·database 선택을 연결합니다. 전제: 같은 commit과 target(native/WASM)을 사용합니다. 근거 범위: build-time wiring입니다.
          비주장: object 생성이 consensus sync·endpoint health·public RPC readiness를 뜻하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-helios-operator-config" className="scroll-mt-24">
        <CitationBlock
          source="a16z/helios operator configuration"
          href={`https://github.com/a16z/helios/blob/${HELIOS_SHA}/config.md`}
          citeKey={3}
        >
          문제: Operator가 checkpoint·endpoint·bind·data directory를 안전하게 지정합니다. 기여: current option 의미와 external checkpoint fallback의
          보안 경고를 문서화합니다. 전제: pinned README/config와 실제 binary help를 함께 확인합니다. 근거 범위: documented operator surface입니다.
          비주장: 예시 URL의 영구 가용성·신뢰성이나 모든 network의 동일 default를 보장하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
