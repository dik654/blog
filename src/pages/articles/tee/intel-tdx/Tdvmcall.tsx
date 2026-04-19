import TdvmcallViz from './viz/TdvmcallViz';
import TdvmcallRegsViz from './viz/TdvmcallRegsViz';
import TdxHypercallAsmViz from './viz/TdxHypercallAsmViz';
import MapGpaViz from './viz/MapGpaViz';
import GetQuoteViz from './viz/GetQuoteViz';

export default function Tdvmcall() {
  return (
    <section id="tdvmcall" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TDVMCALL — GHCI &amp; I/O 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">GHCI — Guest-Host Communication Interface</h3>

        <TdvmcallViz />

        <p>
          <strong>GHCI</strong>: TD Guest가 Host에 요청하는 표준 프로토콜<br />
          모든 Host 서비스는 <code>TDG.VP.VMCALL</code>(TDVMCALL)로 통과<br />
          Host는 TD 레지스터 직접 못 봄 → TD Module이 레지스터 중재
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TDVMCALL 레지스터 규약</h3>
        <TdvmcallRegsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Linux TDX Guest의 __tdx_hypercall</h3>
        <TdxHypercallAsmViz />
        <p>
          <strong>EXPOSE_REGS_MASK</strong>: 어떤 레지스터를 Host에 노출할지 비트마스크<br />
          TD 자체 비밀 레지스터(FLAGS, FS_BASE 등)는 자동 숨김<br />
          Host가 악의적으로 레지스터 읽어도 R10..R15만 공개
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 GHCI Sub-functions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">함수</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
                <th className="border border-border px-3 py-2 text-left">R11 값</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>CPUID</code></td>
                <td className="border border-border px-3 py-2">Host가 CPUID 중재 (가상화된 값 반환)</td>
                <td className="border border-border px-3 py-2">EXIT_REASON_CPUID</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>HLT</code></td>
                <td className="border border-border px-3 py-2">vCPU 유휴 → Host가 스케줄링</td>
                <td className="border border-border px-3 py-2">EXIT_REASON_HLT</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>IO</code></td>
                <td className="border border-border px-3 py-2">포트 I/O (virtio console, serial)</td>
                <td className="border border-border px-3 py-2">EXIT_REASON_IO_INSTRUCTION</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>MSR</code></td>
                <td className="border border-border px-3 py-2">RDMSR/WRMSR 가상화</td>
                <td className="border border-border px-3 py-2">EXIT_REASON_MSR_*</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>MMIO</code></td>
                <td className="border border-border px-3 py-2">Memory-Mapped I/O 에뮬레이션</td>
                <td className="border border-border px-3 py-2">EXIT_REASON_EPT_VIOLATION</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>MapGPA</code></td>
                <td className="border border-border px-3 py-2">Private ↔ Shared 페이지 전환</td>
                <td className="border border-border px-3 py-2">0x10001</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>GetQuote</code></td>
                <td className="border border-border px-3 py-2">Attestation quote 요청</td>
                <td className="border border-border px-3 py-2">0x10002</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>SetupEventNotify</code></td>
                <td className="border border-border px-3 py-2">비동기 이벤트 채널 설정</td>
                <td className="border border-border px-3 py-2">0x10004</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">MapGPA — 메모리 변환 (가장 중요)</h3>
        <MapGpaViz />
        <p>
          <strong>MapGPA</strong>: DMA 수행 전 버퍼를 Shared로 전환 필수<br />
          Private 메모리는 디바이스가 읽을 수 없음 (KeyID 다름)<br />
          swiotlb(bounce buffer)가 자동 처리 — 커널이 투명하게 전환
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GetQuote — 원격 증명 요청</h3>
        <GetQuoteViz />
        <p>
          <strong>2단계 증명</strong>: 로컬 TDREPORT → Host → Quote Service<br />
          비동기 — Host가 Quote 준비되면 이벤트 알림<br />
          TD는 Quote 내용 직접 검증 불가 — 관계 기관이 검증
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TDVMCALL의 보안 모델</p>
          <p>
            <strong>전제</strong>: Host는 untrusted — 악의적으로 응답할 수 있음<br />
            <strong>방어 원칙</strong>:
          </p>
          <p className="mt-2">
            1. <strong>검증 가능한 응답만 신뢰</strong><br />
            - CPUID 결과 중 보안 민감값은 TDX Module이 고정 (MAX_PA 등)<br />
            - MSR은 write-once/read-fixed 정책 사용 가능
          </p>
          <p className="mt-2">
            2. <strong>I/O 데이터는 신뢰 경계 밖</strong><br />
            - 디스크 데이터 → dm-crypt로 TD 내부 암호화<br />
            - 네트워크 → TLS로 end-to-end 보호<br />
            - virtio 응답은 항상 검증 필요
          </p>
          <p className="mt-2">
            3. <strong>DoS는 허용</strong><br />
            - Host가 응답 거부 → TD hang<br />
            - TDX는 기밀성·무결성만 보장, 가용성은 아님
          </p>
        </div>

      </div>
    </section>
  );
}
