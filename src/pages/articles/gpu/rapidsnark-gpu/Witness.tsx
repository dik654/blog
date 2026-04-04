import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const wtnsCode = `// .wtns 파일 로딩 (Binary Witness Format)
//
// 헤더 구조:
//   magic: "wtns" (4 bytes)
//   version: 2 (4 bytes)
//   num_sections: 2
//
// Section 1: Field Info
//   field_size: 32 bytes (BN128 Fr)
//
// Section 2: Witness Values
//   n_witness: 제약 변수 개수
//   values[0..n]: 각 32 bytes, little-endian Fr 원소
//
// 대형 회로 (2^20+) 전략:
//   - mmap()으로 파일을 메모리 매핑
//   - 필요한 영역만 페이지 폴트로 로드
//   - 메모리 사용량: 파일 크기와 거의 동일`;

const r1csCode = `// .r1cs → 희소 행렬 A, B, C 파싱
//
// R1CS: A * witness . B * witness = C * witness
//
// 파일 내부 (compressed sparse format):
//   for each constraint i:
//     A[i]: [(idx, coeff), (idx, coeff), ...]  // 희소 행
//     B[i]: [(idx, coeff), (idx, coeff), ...]
//     C[i]: [(idx, coeff), (idx, coeff), ...]
//
// rapidsnark 메모리 레이아웃:
//   struct Constraint {
//     vector<pair<u32, Fr>> a, b, c;
//   };
//   // 전체 제약을 하나의 벡터에 연속 배치
//   // → 캐시 히트율 향상
//
// .zkey 파일: proving key (CRS 포인트들)
//   - vk_alpha, vk_beta, vk_delta
//   - 각 witness 변수별 G1/G2 포인트
//   - coeff 배열 (A, B, C 다항식 계수)`;

export default function Witness() {
  return (
    <section id="witness" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Witness 로딩 & 메모리 매핑</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          rapidsnark의 첫 단계는 <code>.wtns</code> 파일에서 witness 값을 읽고,
          <code>.zkey</code>에서 proving key(CRS)를 로드하는 것이다.<br />
          대형 회로는 수 GB에 달하므로 <code>mmap</code>을 활용한다.
        </p>
        <CodePanel title=".wtns 파일 구조 & mmap 전략" code={wtnsCode} annotations={[
          { lines: [3, 7], color: 'sky', note: '헤더: magic, version, sections' },
          { lines: [9, 13], color: 'emerald', note: 'witness 값: Fr 원소 배열' },
          { lines: [15, 19], color: 'amber', note: '대형 회로: mmap으로 메모리 절약' },
        ]} />
        <p>
          <code>.r1cs</code> 파일은 제약 행렬 A, B, C를 압축 희소 형식으로 저장한다.
          rapidsnark은 이를 파싱하여 연속 메모리에 배치하고,
          NTT/MSM 단계에서 캐시 친화적으로 접근한다.
        </p>
        <CodePanel title=".r1cs 파싱 & 메모리 레이아웃" code={r1csCode} annotations={[
          { lines: [3, 3], color: 'sky', note: 'R1CS 기본 등식: A.w * B.w = C.w' },
          { lines: [5, 9], color: 'emerald', note: '희소 형식: (인덱스, 계수) 쌍' },
          { lines: [11, 16], color: 'amber', note: '연속 배치로 캐시 히트율 확보' },
          { lines: [18, 21], color: 'violet', note: '.zkey: CRS 포인트 + 계수 배열' },
        ]} />
        <CitationBlock source="circom / snarkjs — Binary File Formats" citeKey={2} type="code"
          href="https://github.com/iden3/snarkjs">
          <p className="text-xs">
            .wtns, .r1cs, .zkey는 iden3가 정의한 바이너리 형식이다.
            snarkjs와 rapidsnark이 동일 형식을 사용하므로 상호 호환된다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
