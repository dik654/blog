import MktmeViz from './viz/MktmeViz';
import SeptViz from './viz/SeptViz';
import KeyIdEncodingViz from './viz/KeyIdEncodingViz';
import AesXtsIntegrityViz from './viz/AesXtsIntegrityViz';
import GpaLayoutViz from './viz/GpaLayoutViz';
import SeptStructureViz from './viz/SeptStructureViz';
import PamtViz from './viz/PamtViz';

export default function Memory() {
  return (
    <section id="memory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 보호 — MKTME &amp; Secure EPT</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">MKTME — Multi-Key Total Memory Encryption</h3>

        <MktmeViz />

        <p>
          <strong>MKTME</strong>: TME의 확장 — 여러 키를 동시에 사용<br />
          <strong>TD마다 별도 AES-XTS 키</strong> — 물리적으로 분리된 암호화 도메인<br />
          메모리 컨트롤러(Memory Controller)가 각 캐시라인 쓰기/읽기 시 암/복호화 수행
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">KeyID 인코딩 — 물리 주소 상위 비트</h3>
        <KeyIdEncodingViz />
        <p>
          <strong>KeyID는 PA 최상위 비트</strong>: 메모리 컨트롤러가 그 값으로 키 선택<br />
          소프트웨어 입장에선 PA가 넓어진 것처럼 보임 (46b → 52b)<br />
          TD에는 KeyID 필드 투명 — TD Module이 PA 변환 시 자동 주입
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">AES-XTS 암호화 & 무결성</h3>
        <AesXtsIntegrityViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Private vs Shared — TD 메모리 모델</h3>

        <SeptViz />

        <GpaLayoutViz />
        <p>
          <strong>Shared bit</strong>: GPA 최상위 비트로 영역 구분<br />
          TD가 명시적으로 Shared로 매핑 → Host와 공유 가능<br />
          Private 메모리는 Host가 들여다봐도 암호문만 보임
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Secure EPT (S-EPT) — TD Module 관리</h3>
        <SeptStructureViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">PAMT — Physical Address Metadata Table</h3>
        <PamtViz />
        <p>
          <strong>PAMT</strong>: 페이지 상태 머신 — 혼동 방지 핵심<br />
          Host가 TD 페이지를 무단 재매핑 못함 — PAMT 상태 검사<br />
          모든 SEAMCALL이 PAMT 엔트리 원자적 갱신
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TDX 1.0 vs TDX 1.5</p>
          <p>
            <strong>TDX 1.0 (Sapphire Rapids 4th Gen Xeon)</strong>:<br />
            - 암호화만 (AES-XTS)<br />
            - 무결성 MAC 없음<br />
            - Replay 공격 취약
          </p>
          <p className="mt-2">
            <strong>TDX 1.5 (Emerald Rapids, Granite Rapids)</strong>:<br />
            - Cryptographic Integrity (28-bit MAC)<br />
            - TD Partitioning (L1 TD 안에 L2 TD)<br />
            - Live Migration 기본 지원<br />
            - Service TD 개념 (TDX Quote Enclave 등)
          </p>
          <p className="mt-2">
            <strong>실전 고려</strong>:<br />
            - 클라우드는 대부분 TDX 1.5 이상 도입 (Azure Confidential VMs)<br />
            - 무결성 미지원 시스템에선 민감 데이터 저장 주의<br />
            - TD 증명 시 TCB 버전으로 TDX 1.0/1.5 구분 가능
          </p>
        </div>

      </div>
    </section>
  );
}
