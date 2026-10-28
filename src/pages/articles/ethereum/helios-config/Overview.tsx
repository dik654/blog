import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import { CodeViewButton } from "@/components/code";
import { codeRefsReal } from "./codeRefsReal";
import ConfigStartupTraceViz from "./viz/ConfigStartupTraceViz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

const HELIOS_SHA = "2af9b41887e069144ee56cd710f3ddca195473f8";

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-3 text-2xl font-bold">시작 계약</h2>
      <p className="mb-6 max-w-3xl break-keep text-lg leading-8 text-muted-foreground">
        Helios를 운영에 올리려면 설정이 해석됐다는 사실과 검증된 head로 요청에 답할 준비가 됐다는 사실을 나눠야 합니다.
      </p>

      <ConfigStartupTraceViz />
      <ContentBoundary article="helios-config" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 글은 Helios 0.12.0의 실제 시작 경로를 기준선으로 고정합니다. <strong>[O]</strong>는 공식 릴리스·소스에서 확인한 현재 동작이고,
          <strong>[A]</strong>는 운영 환경에 적용할 제안입니다. 시작 시간, 오류율, 복구 시간은 아직 대상 환경에서 재지 않았으므로
          <strong>[M] 미측정</strong>으로 남깁니다.
        </p>
        <p>
          고정 사례 <code>run-17</code>에는 같은 RPC port를 가리키는 세 후보가 있습니다. Network 기본값은 8,545, TOML은 9,545,
          CLI는 10,545입니다. 0.12.0의 <code>Config::from_file()</code>은 base→TOML→CLI 순서로 병합하므로 최종값은 10,545입니다.
        </p>
        <p>
          구현이 자동으로 <code>source=CLI</code>와 가려진 두 값을 보존하지는 않습니다. 그 provenance를 launch receipt에 남기는 일은
          이 글의 운영 제안입니다.{" "}
          <CodeViewButton
            label="Config::from_file() — 0.12.0 merge"
            onClick={() => onCodeRef("helios-config-merge", codeRefsReal["helios-config-merge"])}
          />
        </p>
        <p>
          설정 정규화 뒤에는 checkpoint 선택, bootstrap·update 검증, initial execution block 확보가 이어집니다. 이 메커니즘은
          <Link to="/cs/blockchain/helios-bootstrap#overview"> checkpoint 부트스트랩</Link>,
          <Link to="/cs/blockchain/helios-consensus#sync-loop"> consensus sync</Link>,
          <Link to="/cs/blockchain/helios-state#overview"> state proof</Link>에서 이미 설명했습니다. 여기서는 이를 다시 가르치지 않고,
          어느 상태를 운영 준비 판정에 사용할지만 다룹니다.
        </p>
      </div>

      <div id="paper-helios-config-source" className="scroll-mt-24">
        <CitationBlock
          source="a16z/helios 0.12.0 · Ethereum config"
          href={`https://github.com/a16z/helios/tree/${HELIOS_SHA}/ethereum/src/config`}
          citeKey={1}
          type="code"
        >
          문제: BaseConfig·TOML·CLI가 어떤 순서로 하나의 Config가 되는지 확인합니다. 기여: Figment merge order, network profile,
          checkpoint·endpoint field를 보여 줍니다. 전제: release 0.12.0, commit {HELIOS_SHA.slice(0, 8)}를 고정합니다. 근거 범위: 이
          릴리스의 설정 구현입니다. 주장하지 않는 것: Parse 성공이 endpoint 신뢰·sync 완료·서비스 readiness를 보장하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-helios-builder-source" className="scroll-mt-24">
        <CitationBlock
          source="a16z/helios 0.12.0 · EthereumClientBuilder와 HeliosClient"
          href={`https://github.com/a16z/helios/blob/${HELIOS_SHA}/ethereum/src/builder.rs`}
          citeKey={2}
          type="code"
        >
          문제: Config가 consensus client·execution provider·local JSON-RPC로 조립되는 시점을 확인합니다. 기여: Builder fallback과
          client construction을 보여 줍니다. 전제: 같은 release와 native target을 사용합니다. 근거 범위: Build-time wiring입니다.
          주장하지 않는 것: Object 생성이나 socket bind가 verified head 확보를 뜻하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-helios-operator-config" className="scroll-mt-24">
        <CitationBlock
          source="a16z/helios 0.12.0 · operator configuration"
          href={`https://github.com/a16z/helios/blob/${HELIOS_SHA}/config.md`}
          citeKey={3}
        >
          문제: Operator가 checkpoint·endpoint·bind·data directory와 checkpoint age를 지정합니다. 기여: Option 의미와 external
          fallback 보안 경고를 문서화합니다. 전제: 0.12.0 문서와 실제 소스를 함께 확인합니다. 근거 범위: 공개 운영 표면입니다.
          주장하지 않는 것: 예시 endpoint의 영구 가용성·신뢰성이나 대상 환경의 권장값을 보장하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
