import SEVBasicsViz from './viz/SEVBasicsViz';
import EncryptionFlowViz from './viz/EncryptionFlowViz';
import PTECBitLayoutViz from './viz/PTECBitLayoutViz';
import AESXEXViz from './viz/AESXEXViz';
import ASIDKeyTableViz from './viz/ASIDKeyTableViz';
import SEVEnableSequenceViz from './viz/SEVEnableSequenceViz';

export default function SEVBasics() {
  return (
    <section id="sev-basics" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SEV 기본 메커니즘</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>AES-128 메모리 암호화</strong> — SEV의 핵심<br />
          <strong>SME/TME 엔진</strong>이 CPU-DRAM 간 모든 데이터 실시간 암호화/복호화<br />
          각 VM은 <strong>고유한 AES 키</strong> 보유 — ASP가 관리<br />
          <strong>C-bit</strong> — 페이지 테이블 비트로 페이지별 암호화 여부 제어
        </p>
      </div>

      <SEVBasicsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">하드웨어 레벨 암호화 흐름</h3>
        <p>
          소프트웨어 수정 없이 투명 동작 — 메모리 컨트롤러 통합<br />
          성능 오버헤드 ~2-5% (AES 엔진이 per-cycle inline)
        </p>
      </div>
      <EncryptionFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">C-bit (Encrypt bit) — Page Table 구조</h3>
      </div>
      <div className="not-prose mb-4"><PTECBitLayoutViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">AES-128 XEX (Xor-Encrypt-Xor) 모드</h3>
      </div>
      <div className="not-prose mb-4"><AESXEXViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">ASID & 키 관리</h3>
      </div>
      <div className="not-prose mb-4"><ASIDKeyTableViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">SEV 활성화 순서</h3>
      </div>
      <div className="not-prose mb-4"><SEVEnableSequenceViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 AES-128인가?</p>
          <p>
            <strong>선택 이유</strong>:<br />
            - 하드웨어 가속 성숙 (AES-NI 수십 년)<br />
            - 16B 블록 = 캐시라인(64B)의 정확한 1/4<br />
            - 메모리 컨트롤러 내장 쉬움
          </p>
          <p className="mt-2">
            <strong>AES-256이 아닌 이유</strong>:<br />
            - 128-bit로 post-quantum까지 충분 (Grover 고려 시 64-bit)<br />
            - 256-bit는 latency 2배<br />
            - Intel TME/MKTME도 AES-128 또는 AES-XTS
          </p>
          <p className="mt-2">
            <strong>SEV-SNP의 tweak 개선</strong>:<br />
            - 초기 SEV: AES-ECB-like → 블록 반복 패턴 누출<br />
            - SNP: XEX with address tweak → 위치 의존 암호문<br />
            - Ciphertext Hiding(Turin): 추가 masking
          </p>
        </div>

      </div>
    </section>
  );
}
