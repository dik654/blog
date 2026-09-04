import { CitationBlock } from "@/components/ui/citation";
import ResolutionViz from "./viz/ResolutionViz";

export default function Resolution() {
  return (
    <section id="resolution" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Mutable name은 최신 CID를 가리키되, freshness와 authority를 따로
        검증합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Content가 바뀌면 CID도 바뀌므로 “내 사이트의 최신 version”처럼 안정적인 이름을 제공하려면 mutable pointer가 필요합니다. IPNS name은
          public key에서 파생되고 해당 private key가 value path·sequence·validity·TTL을 포함한 record에 서명합니다. Resolver는
          signature가 맞는지만 보고 끝낼 것이 아니라 validity가 남았는지, 후보 중 어떤 sequence가 최신인지도 확인해야 합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <ResolutionViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>IPNS와 DNSLink의 trust anchor가 다릅니다</h3>
        <p>
          IPNS는 name의 key가 record signature authority가 되고 routing system은 record를 배포합니다. DHT에서 찾았다는 사실만으로
          record를 신뢰할 수 있는 것은 아닙니다. DNSLink는 _dnslink TXT record로 /ipfs/ 또는 /ipns/ path를 가리키며 DNS 운영 권한과
          DNSSEC·HTTPS gateway 같은 기존 web trust chain을 사용합니다. 둘 다 resolver cache의 TTL 때문에 갱신 직후 old value를 볼 수
          있습니다.
        </p>
        <h3>Mutable pointer는 content integrity를 대체하지 않습니다</h3>
        <p>
          Name resolution이 CID를 돌려준 뒤에는 provider discovery와 block fetch가 이어지고 받은 block은 다시 CID로 검증합니다. Private
          key가 탈취되면 attacker가 유효한 새 IPNS record를 만들 수 있으므로 key rotation·recovery policy가 필요합니다. 반대로 routing
          node가 거짓 bytes를 주어도 최종 CID 검사는 실패합니다.
        </p>
        <div
          id="paper-ipns-spec"
          className="scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">
            명세 읽기 · IPNS record
          </p>
          <p>
            IPNS specification은 key type, name, signed record fields,
            creation과 verification을 정의합니다. 특정 DHT가 언제나 빠르게 최신
            record를 반환한다거나 DNSLink보다 더 안전하다는 일반 성능 결론은
            포함하지 않습니다.
          </p>
          <CitationBlock
            source="IPFS Standards — IPNS Record and Protocol"
            citeKey={2}
            href="https://specs.ipfs.tech/ipns/ipns-record/"
          >
            Signature, sequence, validity, TTL과 routing record 배포를 구분해
            mutable pointer의 authority·freshness 경계를 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
