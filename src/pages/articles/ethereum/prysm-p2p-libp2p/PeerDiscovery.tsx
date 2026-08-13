import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function PeerDiscovery({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="peer-discovery" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Discv5는 signed ENR 후보를 찾고 갱신하지만 connection을 만들지는 않는다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("discv5-init", codeRefs["discv5-init"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 discovery 초기화 확인</span>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Ethereum Node Record(ENR)는 node identity key가 서명한 key-value record입니다. Sequence number가 증가할수록 새
          address·fork/subnet metadata를 나타내며, 같은 node ID의 낮은 sequence record는 stale 후보로 처리합니다. Signature가
          맞아도 endpoint가 reachable하거나 advertised fork가 실제 handshake와 일치한다는 뜻은 아니므로 candidate state에만
          넣습니다.
        </p>

        <h3>Lookup에서 dial queue까지</h3>
        <ol>
          <li>Bootnode 또는 기존 routing table에서 target과 가까운 node ID를 질의합니다.</li>
          <li>ENR signature·sequence·network-specific field와 address policy를 검증합니다.</li>
          <li>이미 connected/pending/banned인지 dedupe하고 source·freshness를 기록합니다.</li>
          <li>Subnet need와 diversity·backoff·global pending budget으로 dial priority를 정합니다.</li>
          <li>Dial 결과를 candidate의 liveness와 다음 retry 시각에 feedback합니다.</li>
        </ol>
        <p>
          예를 들어 pending budget이 4인데 같은 /24 prefix 후보 20개가 들어오면 앞 4개를 무조건 채우지 않습니다. Prefix·ASN
          diversity 같은 운영 정책과 required subnet을 함께 고려해 correlated failure와 eclipse 위험을 줄입니다. 다만 diversity
          rule 하나가 eclipse resistance를 증명하지는 않으며 seed/source independence와 실제 session outcome을 같이 측정합니다.
        </p>

        <h3>ENR, multiaddr와 PeerId는 역할이 다릅니다</h3>
        <p>
          ENR는 discovery identity와 signed endpoint metadata, multiaddr는 dial할 transport address, PeerId는 libp2p identity
          public key에서 파생한 연결 identity입니다. 같은 endpoint에 여러 record가 있거나 NAT 때문에 advertised address가
          실패할 수 있고, expected PeerId와 secure handshake identity가 다르면 connection을 닫습니다. 이 세 값을 하나의
          “peer 주소” 문자열로 합치면 stale record와 identity mismatch를 구분할 수 없습니다.
        </p>
      </div>
    </section>
  );
}
