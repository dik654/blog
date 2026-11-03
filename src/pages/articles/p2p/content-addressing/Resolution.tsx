import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ResolutionViz from "./viz/ResolutionViz";

export default function Resolution() {
  return (
    <section id="resolution" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        바뀌지 않는 이름은 최신 CID를 고르고, CID는 그 뒤 받은 bytes를
        검증합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <strong>
            IPNS와 DNSLink는 content address를 대체하지 않고, 자주 바뀌는 최신
            CID 앞에 mutable pointer 한 층을 더합니다.
          </strong>{" "}
          이름 해석의 질문은 “누가 어떤 CID를 최신이라고 말했나?”이고, CID
          검증의 질문은 “실제로 받은 bytes가 그 CID와 맞나?”입니다.
        </p>
        <p>
          Project v1의 <code>C_root1</code>은 그대로 남고, lib.rs를 고친 v2는
          <code>C_root2</code>가 됩니다. 같은 IPNS name 아래 seq 7 record가
          C_root1을, seq 8 record가 C_root2를 가리킨다고 해 보겠습니다. 높은
          sequence만 보고 고르면 안 됩니다. 먼저 name에 맞는 key로 signature를
          검증하고 validity가 끝나지 않은 후보만 남겨야 합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <ResolutionViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>IPNS에서 sequence·validity·TTL은 서로 다른 질문에 답합니다</h3>
        <p>
          IPNS name은 serialized public key의 multihash입니다. Current string
          representation은 <code>libp2p-key</code> codec을 쓴 CIDv1입니다.
          Record의 signature는 “이 key의 소유자가 이 data를 만들었나?”를
          확인하고, sequence는 여러 유효 후보 중 version을 비교하며, validity는
          만료 시각을 제한합니다. TTL은 resolver가 다시 확인하기 전 cache할
          시간을 알려 주는 hint입니다.
        </p>
        <AlgorithmBlock
          title="seq 7과 seq 8에서 C_root2를 고르는 순서"
          input={[
            "IPNS name /ipns/k51…",
            "candidate A: seq=7 → C_root1, candidate B: seq=8 → C_root2",
          ]}
          steps={[
            {
              code: "decode candidate; enforce record_size <= 10 KiB",
              note: "구조와 자원 한계를 먼저 확인합니다.",
            },
            {
              code: "derive_public_key(name); verify_signatureV2(data)",
              note: "DHT에서 받았다는 사실이 아니라 name의 key가 authority입니다.",
            },
            {
              code: "reject if validity_expired(candidate)",
              note: "Sequence가 높아도 만료된 record는 최신 유효 후보가 아닙니다.",
            },
            {
              code: "best = max(valid_candidates, key=sequence)",
              note: "검증을 통과한 후보 안에서 seq 8을 고릅니다.",
            },
            {
              code: "cache_until_ttl_hint; resolve(best.value)",
              note: "TTL 뒤에는 더 최신 record가 있는지 다시 확인합니다.",
            },
            {
              code: "fetch(C_root2); verify_each_block_by_cid()",
              note: "Mutable pointer가 맞아도 content bytes 검증은 생략하지 않습니다.",
            },
          ]}
          output="유효한 최신 path /ipfs/C_root2 + 검증된 DAG blocks"
        />

        <h3>DNSLink는 같은 결과를 다른 authority에서 얻습니다</h3>
        <p>
          DNSLink는 <code>_dnslink.docs.example</code> TXT record에서
          <code>dnslink=/ipfs/C_root2</code> 같은 path를 얻습니다. 이때
          authority는 IPNS private key가 아니라 DNS zone 운영 권한입니다. DNSSEC
          사용 여부, resolver와 cache 정책, domain recovery를 별도로 판단해야
          합니다.
        </p>
        <p>
          DNSLink는 다른 DNSLink나 IPNS path를 가리킬 수도 있습니다. Gateway는
          추가 path segment를 보존하고 recursion limit을 둬야 합니다. 어느 이름
          체계를 쓰든 마지막 immutable CID를 얻은 뒤 provider discovery와 block
          fetch가 이어지고, 받은 block은 다시 CID로 검증합니다.
        </p>

        <h3>어디까지 실패를 막을 수 있나</h3>
        <ul>
          <li>
            Provider가 거짓 bytes를 보내면 CID 검증이 막지만, 아무도 block을
            제공하지 않는 상황은 막지 못합니다.
          </li>
          <li>
            IPNS private key가 탈취되면 공격자가 유효한 새 record에 서명할 수
            있으므로 rotation·recovery policy가 필요합니다.
          </li>
          <li>
            Resolver cache는 TTL 동안 이전 값을 보일 수 있으므로 배포 확인은
            name resolution과 content fetch를 나눠 측정합니다.
          </li>
        </ul>
      </div>
      <CitationBlock
        source="IPFS Standards — IPNS Record and Protocol"
        citeKey={3}
        href="https://specs.ipfs.tech/ipns/ipns-record/"
      >
        <p id="paper-ipns-spec" className="text-sm leading-6">
          2025-02-28 specification의 public-key name, signatureV2, sequence,
          validity, TTL, 10 KiB record limit과 routing/verification 경계를
          사용합니다. 특정 router가 항상 최신 record를 돌려준다고 가정하지
          않습니다.
        </p>
      </CitationBlock>
      <CitationBlock
        source="IPFS Standards — DNSLink Gateway Specification"
        citeKey={4}
        href="https://specs.ipfs.tech/http-gateways/dnslink-gateway/"
      >
        <p id="paper-dnslink-spec" className="text-sm leading-6">
          DNSLink name을 immutable content root까지 재귀적으로 해석할 때 path를
          보존하고 recursion limit을 두는 규칙을 적용합니다. DNS zone의 보안과
          content availability까지 이 규격이 자동 보장한다고 확대하지 않습니다.
        </p>
      </CitationBlock>
    </section>
  );
}
