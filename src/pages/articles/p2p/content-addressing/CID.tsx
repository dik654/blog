import CIDStructViz from './viz/CIDStructViz';
import CodePanel from '@/components/ui/code-panel';

const cidCode = `// CID (Content Identifier) 구조 — IPFS/IPLD 명세
// CIDv1 = <multibase><version><multicodec><multihash>

// Multibase: 인코딩 방식
//   b = base32,  z = base58btc,  f = base16

// Version: CID 버전
//   0x01 = CIDv1 (다중 코덱 지원)

// Multicodec: 데이터 직렬화 형식
//   0x70 = dag-pb    (IPFS 기본)
//   0x71 = dag-cbor  (IPLD 구조화 데이터)
//   0x55 = raw       (원본 바이트)

// Multihash: <hash-fn-code><digest-size><digest>
//   0x12 = sha2-256, 0x20 = 32바이트
//   0x1b = keccak-256 (Ethereum 사용)
//   0x14 = blake2b-256`;

const cidAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [1, 6], color: 'sky', note: 'Multibase + Version — 인코딩과 버전' },
  { lines: [8, 12], color: 'emerald', note: 'Multicodec — 데이터 형식 지정' },
  { lines: [14, 17], color: 'amber', note: 'Multihash — 해시 알고리즘 독립적' },
];

export default function CID() {
  return (
    <section id="cid" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CID: Content Identifier</h2>
      <div className="not-prose mb-8"><CIDStructViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CID는 IPFS에서 사용하는 자기 설명적(self-describing) 내용 식별자입니다.<br />
          해시 알고리즘, 인코딩, 데이터 형식이 모두 CID 안에 포함됩니다.<br />
          미래에 해시 알고리즘이 바뀌어도 하위 호환성을 유지합니다.
        </p>
        <CodePanel title="CID 구조 (CIDv1)" code={cidCode}
          annotations={cidAnnotations} />
        <p className="leading-7">
          iroh에서는 BLAKE3 해시 기반의 자체 내용 식별자를 사용합니다.<br />
          IPFS Kubo는 CIDv0(base58btc + sha2-256)과 CIDv1을 모두 지원합니다.
        </p>
      </div>
    </section>
  );
}
