import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const optCode = `// rapidsnark 최적화 기법
//
// 1. ffiasm 어셈블리 필드 연산
//   - x86-64 ADX/MULX 명령어로 256비트 Montgomery 곱셈
//   - GMP 대비 4~5x 빠른 Fp 연산
//   - 컴파일 타임에 커브별 코드 생성 (BN128 특화)
//
// 2. 멀티스레드 NTT (OpenMP)
//   - Cooley-Tukey butterfly, 스레드별 독립 구간 분할
//   - 캐시 블로킹: L2에 맞는 단위로 NTT 분할
//   - 2^20 NTT: 단일 스레드 ~800ms → 16스레드 ~60ms
//
// 3. GPU MSM 메모리 풀
//   - 증명 시작 시 cudaMalloc 1회, 이후 재사용
//   - cudaMalloc/cudaFree 오버헤드 제거 (~5ms/회)
//   - 연속 증명 시 GPU 메모리 재할당 없음
//
// 4. CRS 사전 변환
//   - .zkey 로드 시 affine → Montgomery 좌표 변환 1회
//   - 증명마다 반복 변환 방지 (서버 모드에서 효과적)
//   - G2 포인트도 동일하게 사전 변환`;

const compareCode = `// Groth16 프로버 성능 비교 (BN254, 2^20 제약, 서버급)
//
// 프레임워크       증명 시간   GPU 지원   언어        비고
// ───────────   ─────────  ────────  ─────────  ──────────
// snarkjs         ~120s      없음      JS         브라우저 호환
// rapidsnark       ~3s       실험적    C++/asm    circom 전용
// rapidsnark+GPU   ~1.5s     CUDA     C++/CUDA   MSM 오프로드
// bellperson       ~4s       CUDA     Rust       Filecoin 생태계
// gnark            ~2.5s     없음      Go         범용 프레임워크
// arkworks         ~5s       없음      Rust       라이브러리 형태
//
// rapidsnark은 circom 생태계에서 가장 빠른 CPU 증명자다.
// GPU 모드에서는 bellperson과 유사하거나 소폭 빠르다.
// gnark은 GPU 없이도 Go 최적화로 경쟁력 있는 속도를 낸다.`;

export default function Optimization() {
  return (
    <section id="optimization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">최적화: 메모리 풀, 스트림 겹침</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          rapidsnark의 성능은 네 가지 최적화에서 나온다.
          ffiasm 어셈블리 필드 연산, 멀티스레드 NTT, GPU 메모리 풀, CRS 사전 변환이다.
        </p>
        <CodePanel title="4가지 핵심 최적화" code={optCode} annotations={[
          { lines: [3, 6], color: 'sky', note: 'ffiasm: x86 ADX/MULX 어셈블리' },
          { lines: [8, 11], color: 'emerald', note: '멀티스레드 NTT: 13x 병렬화' },
          { lines: [13, 16], color: 'amber', note: 'GPU 메모리 풀: 재할당 제거' },
          { lines: [18, 21], color: 'violet', note: 'CRS 사전 변환: 서버 모드 최적화' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">프레임워크 비교</h3>
        <p>
          circom 생태계에서 rapidsnark은 CPU 최고 속도를 제공한다.<br />
          GPU 모드를 활성화하면 MSM 병목이 해소되어 bellperson 수준에 도달한다.
        </p>
        <CodePanel title="Groth16 프로버 성능 비교표" code={compareCode} annotations={[
          { lines: [5, 5], color: 'sky', note: 'snarkjs: JS 기반, 가장 느림' },
          { lines: [6, 7], color: 'emerald', note: 'rapidsnark: CPU 3s, GPU 1.5s' },
          { lines: [8, 10], color: 'amber', note: 'bellperson, gnark, arkworks' },
          { lines: [12, 14], color: 'violet', note: '정리: circom 최적 = rapidsnark' },
        ]} />
        <CitationBlock source="iden3/rapidsnark — Build & Benchmark" citeKey={4} type="code"
          href="https://github.com/iden3/rapidsnark">
          <p className="text-xs">
            rapidsnark 서버 모드(prover_server)는 .zkey를 메모리에 상주시켜
            연속 증명 요청에서 로딩 오버헤드를 제거한다.<br />
            Polygon ID는 이 모드로 모바일 인증 증명을 초 단위로 생성한다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
