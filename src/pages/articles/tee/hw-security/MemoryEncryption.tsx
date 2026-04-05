import MemEncViz from './viz/MemEncViz';
import MemEncStepViz from './viz/MemEncStepViz';

export default function MemoryEncryption() {
  return (
    <section id="memory-encryption" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 암호화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">메모리 암호화 원리</h3>
        <p>
          <strong>메모리 암호화</strong>: DRAM에 저장된 데이터를 HW 레벨 암호화<br />
          <strong>목적</strong>: 물리적 접근(콜드부트, 버스 스니핑, DRAM probe) 방어<br />
          <strong>위치</strong>: 메모리 컨트롤러 내장 AES 엔진<br />
          <strong>오버헤드</strong>: ~2-5% (최신 HW에서 거의 무시 가능)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">AES-XTS 모드 — 주소 기반 암호화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// AES-XTS (XEX Tweakable block cipher with ciphertext Stealing)
// IEEE 1619 표준 (원래는 full-disk encryption 용)

// 공식
// C = AES_K1(P ⊕ T) ⊕ T
// 여기서 T = AES_K2(tweak)
// tweak = 물리 주소 또는 블록 인덱스

// 이중 키 (K1 = 암호화, K2 = tweak 암호화)

// 블록별 독립 암호화
// - 메모리 주소 A1, A2 서로 다름
// - P 같아도 T 다름 → C 다름
// - Rainbow table / dictionary 공격 무력화

// 병렬 처리 가능
// - 각 블록 독립 연산
// - 멀티코어·파이프라인 최적화
// - 하드웨어 구현 친화

// XTS vs CTR vs GCM
// - XTS: 동일 길이 (block=ciphertext), 무결성 없음
// - CTR: 동일 길이, 무결성 없음 (stream cipher-like)
// - GCM: 추가 MAC (확장 크기), 무결성 있음

// 메모리 암호화는 주로 XTS 또는 CTR
// GCM은 메타데이터 오버헤드 커서 사용 드묾`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">벤더별 메모리 암호화 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">기술</th>
                <th className="border border-border px-3 py-2 text-left">키 관리</th>
                <th className="border border-border px-3 py-2 text-left">알고리즘</th>
                <th className="border border-border px-3 py-2 text-left">격리 단위</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Intel TME</td>
                <td className="border border-border px-3 py-2">시스템 1개</td>
                <td className="border border-border px-3 py-2">AES-128-XTS</td>
                <td className="border border-border px-3 py-2">전체 DRAM</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Intel MKTME</td>
                <td className="border border-border px-3 py-2">KeyID 기반 (최대 1024)</td>
                <td className="border border-border px-3 py-2">AES-128-XTS</td>
                <td className="border border-border px-3 py-2">Per-page</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">AMD SME</td>
                <td className="border border-border px-3 py-2">시스템 1개</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">C-bit per page</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">AMD SEV/SNP</td>
                <td className="border border-border px-3 py-2">ASID 기반 (per-VM)</td>
                <td className="border border-border px-3 py-2">AES-128-XEX (SNP)</td>
                <td className="border border-border px-3 py-2">Per-VM</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Intel SGX MEE</td>
                <td className="border border-border px-3 py-2">EPC 전용</td>
                <td className="border border-border px-3 py-2">AES-CTR + Merkle tree</td>
                <td className="border border-border px-3 py-2">EPC 영역</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">ARM MEC</td>
                <td className="border border-border px-3 py-2">MECID 기반</td>
                <td className="border border-border px-3 py-2">AES-XTS</td>
                <td className="border border-border px-3 py-2">Per-Realm</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 암호화 파이프라인</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// CPU → DRAM 쓰기 시

CPU Core
   │ (cache에 write, 평문)
   ▼
L1/L2/L3 Cache  (평문)
   │ (write back)
   ▼
Memory Controller
   │
   ├─ Key selection (KeyID, ASID, or C-bit)
   ├─ Tweak calculation (based on PA)
   ├─ AES-XTS encryption
   │
   ▼
DRAM (암호문 저장)

// DRAM → CPU 읽기 시 (역순)

DRAM (암호문)
   │
   ▼
Memory Controller
   │
   ├─ Key selection
   ├─ Tweak calculation
   ├─ AES-XTS decryption
   │
   ▼
L1/L2/L3 Cache  (평문)
   │
   ▼
CPU Core (평문 사용)

// Key는 CPU 내부 레지스터에만 존재
// DRAM에는 absolutely never
// Cache 라인은 평문 (캐시 없으면 성능 90% 하락)`}</pre>

      </div>
      <div className="not-prose mt-6">
        <MemEncStepViz />
      </div>
      <div className="not-prose mt-8">
        <MemEncViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">방어 vs 방어 불가</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 메모리 암호화가 방어하는 것

// ✓ Cold Boot Attack
// - DRAM을 동결 후 다른 컴퓨터에 이식
// - 키는 CPU 전원 OFF 시 사라짐 → 복호화 불가

// ✓ Bus Snooping
// - CPU-DRAM 버스에 logic analyzer 부착
// - 관찰되는 것은 암호문만

// ✓ DRAM Probe
// - 물리적으로 칩에 프로브 대기
// - 하드웨어 공격자 (nation-state)
// - 여전히 암호문만 추출

// ✓ Rowhammer (부분)
// - DRAM 셀 비트 플립 공격
// - 암호화 시 flip된 바이트가 random으로 복호화
// - 무결성(MAC) 있으면 탐지 가능

// 방어 못 하는 것

// ✗ Cache Side Channel
// - CPU 캐시는 평문
// - Prime+Probe, Flush+Reload 가능

// ✗ Transient Execution (Spectre)
// - 투기 실행이 메모리 접근 패턴 유도
// - 캐시 기반 누출

// ✗ Electromagnetic Analysis
// - CPU 전력·EM 방사로 키 추출
// - 물리 접근 + 고가 장비

// ✗ Software Vulnerabilities
// - Guest OS의 버그
// - Kernel exploit → 프로세스 메모리 접근
// - 메모리 암호화는 SW 공격 방어 아님`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 무결성 포함 여부의 중요성</p>
          <p>
            <strong>무결성 없음 (SEV legacy, TDX 1.0)</strong>:<br />
            - 공격자가 ciphertext 변조 가능<br />
            - 복호화 시 random bytes 반환<br />
            - Deterministic 예측 가능한 변조 → 취약
          </p>
          <p className="mt-2">
            <strong>무결성 있음 (SGX MEE, SEV-SNP RMP, TDX 1.5)</strong>:<br />
            - MAC/hash tree로 변조 탐지<br />
            - Fault 발생 → 공격 중단<br />
            - Replay 방어도 포함 가능
          </p>
          <p className="mt-2">
            <strong>비용 비교</strong>:<br />
            - 무결성 없는 암호화: ~2% 오버헤드<br />
            - 무결성 추가: ~5-30% (구현 방식에 따라)<br />
            - SGX MEE Merkle tree: 가장 강력 but 가장 느림<br />
            - SEV-SNP RMP: 적절한 균형<br />
            - TDX 1.5 28-bit MAC: 최소 오버헤드
          </p>
        </div>

      </div>
    </section>
  );
}
