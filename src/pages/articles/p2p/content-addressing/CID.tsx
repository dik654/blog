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

        <h3 className="text-xl font-semibold mt-6 mb-3">CID 구조 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CID (Content Identifier) 구조
//
// CIDv0 (legacy):
//   Qm + base58btc(sha2-256(content))
//   예: QmWmyoMoctfbAaiEs2G46gpeUmhqFR3vCRuQxr...
//   - 항상 sha2-256 + base58btc
//   - 46 characters
//
// CIDv1 (current):
//   multibase || version || multicodec || multihash
//
//   example: bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
//            ^^ multibase prefix (b = base32)
//              ^^ version (01 = v1)
//                ^^ multicodec (70 = dag-pb)
//                  ^^ multihash prefix (1220 = sha2-256, 32 bytes)
//                      ^^^^^^^ actual hash

// Multibase (인코딩):
//   b - base32 (lowercase, 기본)
//   z - base58btc
//   f - base16 (hex)
//   B - BASE32UPPER
//   k - base36

// Multicodec (데이터 형식):
//   0x55 - raw
//   0x70 - dag-pb (IPLD protobuf)
//   0x71 - dag-cbor (IPLD CBOR)
//   0x0129 - dag-json
//   0x01 - car (Content Archive)

// Multihash:
//   code + length + digest
//   0x12 20 [32 bytes] = sha2-256
//   0x1b 20 [32 bytes] = keccak-256
//   0x1e 20 [32 bytes] = blake2b-256
//   0x1d 20 [32 bytes] = blake2s-256
//   0x14 20 [32 bytes] = blake3

// CID 생성 예 (JavaScript):
//   import { CID } from 'multiformats/cid'
//   import { sha256 } from 'multiformats/hashes/sha2'
//   import * as dagPb from '@ipld/dag-pb'
//
//   const bytes = dagPb.encode(node)
//   const hash = await sha256.digest(bytes)
//   const cid = CID.create(1, dagPb.code, hash)
//   console.log(cid.toString())

// CID v0 → v1 변환:
//   v0: QmXxx...
//   v1: bafkxxx... (같은 해시, 다른 표현)
//
// 자주 쓰이는 조합:
//   Raw data: raw + sha2-256
//   UnixFS: dag-pb + sha2-256
//   Structured data: dag-cbor + sha2-256
//   Modern: raw + blake3 (iroh)`}
        </pre>
      </div>
    </section>
  );
}
