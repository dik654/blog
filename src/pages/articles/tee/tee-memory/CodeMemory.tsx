export default function CodeMemory() {
  return (
    <section id="code-memory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">코드: EADD · LAUNCH_UPDATE</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-4">SGX EADD 흐름</h3>
        <p>
          PAGEINFO 구조체가 소스 페이지, SECINFO(권한), 대상 SECS를 지정합니다.
          <br />
          CPU가 EPCM 엔트리를 생성 — enclave ID, 페이지 타입, RWX를 기록합니다.
          <br />
          MEE(Memory Encryption Engine)가 페이지를 AES로 암호화하여 EPC DRAM에 저장합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">SEV LAUNCH_UPDATE 흐름</h3>
        <p>
          PSP(Platform Security Processor)가 게스트 핸들로부터 VEK를 파생합니다.
          <br />
          16바이트 블록 단위로 AES-128-XEX 암호화 — GPA가 tweak입니다.
          <br />
          암호화 결과가 launch digest에 반영되어 원격 증명의 기준이 됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">TDX SEAMCALL 흐름</h3>
        <p>
          TD 생성 시 SEAM이 MKTME KeyID를 할당합니다.
          <br />
          하드웨어 RNG가 AES-XTS-256 키를 생성 — 소프트웨어에 노출되지 않습니다.
          <br />
          TD 진입(TDCALL) 시 메모리 컨트롤러가 KeyID를 전환합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">세 방식의 공통 원칙</h3>
        <div className="rounded-lg border p-4">
          <ul className="space-y-2 text-sm">
            <li>
              <strong>CPU 내부에서만 평문.</strong>{' '}
              캐시, 레지스터, 실행 파이프라인은 평문 데이터를 처리합니다.
            </li>
            <li>
              <strong>CPU 외부는 항상 암호문.</strong>{' '}
              메모리 버스, DRAM 칩, 물리적 탐침(probe) 모두 암호문만 봅니다.
            </li>
            <li>
              <strong>키는 하드웨어가 관리.</strong>{' '}
              SGX MEE, SEV PSP, TDX SEAM — 소프트웨어가 키를 직접 읽을 수 없습니다.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
