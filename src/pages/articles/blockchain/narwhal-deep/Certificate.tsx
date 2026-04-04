import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const certCode = `Narwhal 증명서(Certificate) 구조 (Rust 의사코드):

struct Header {
    round: u64,
    author: ValidatorId,
    payload: Vec<BatchDigest>,
    parents: Vec<CertificateDigest>,  // r-1 라운드
}

struct Certificate {
    header: Header,
    signatures: Vec<(ValidatorId, Signature)>,
    // len(signatures) >= 2f+1
}

증명서 생성 과정:
  1. author가 Header 생성 후 브로드캐스트
  2. 수신자가 Header 검증 후 서명 반환
  3. 2f+1 서명 수집 → Certificate 완성
  4. Certificate를 DAG에 삽입

핵심 보장:
  - 증명서가 존재하면 2f+1 노드가 해당 데이터를 가짐
  - 이 중 최소 f+1은 정직 → 데이터 복구 가능`;

export default function Certificate() {
  return (
    <section id="certificate" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명서(Certificate) 메커니즘</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Danezis et al. — Narwhal §3.2" citeKey={2} type="paper">
          <p className="italic">
            "A certificate for a header is a collection of 2f+1 signatures on that header, proving that the data referenced by the header is available."
          </p>
        </CitationBlock>

        <CodePanel title="증명서 구조 (Rust 의사코드)" code={certCode}
          annotations={[
            { lines: [3, 8], color: 'sky', note: 'Header: 메타데이터 + 부모 참조' },
            { lines: [10, 14], color: 'emerald', note: 'Certificate: 2f+1 서명' },
            { lines: [16, 20], color: 'amber', note: '생성 과정' },
            { lines: [22, 24], color: 'violet', note: '가용성 보장 원리' },
          ]} />
      </div>
    </section>
  );
}
