import MemoryEncryptViz from './viz/MemoryEncryptViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 메모리 암호화가 필요한가</h2>
      <div className="not-prose mb-8"><MemoryEncryptViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서버의 DRAM은 물리적으로 노출되어 있습니다.
          <br />
          세 가지 위협이 메모리 암호화를 필수로 만듭니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">위협 모델</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">DMA 공격</h4>
            <p className="text-sm text-muted-foreground">
              PCIe 장치(GPU, NIC)가 물리 메모리를 직접 읽습니다.<br />
              IOMMU 우회 시 전체 메모리 노출.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">콜드부트 공격</h4>
            <p className="text-sm text-muted-foreground">
              전원 차단 후 DRAM 잔류 데이터를 추출합니다.<br />
              액체 질소로 수 분간 데이터 유지 가능.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">악의적 하이퍼바이저</h4>
            <p className="text-sm text-muted-foreground">
              클라우드 관리자가 VM 메모리를 덤프합니다.<br />
              호스트 커널 권한으로 모든 게스트 메모리 접근 가능.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">핵심 원리</h3>
        <p>
          <strong>CPU 캐시 = 평문, DRAM = 암호문.</strong>
          <br />
          메모리 컨트롤러에 내장된 AES 엔진이 캐시 라인 퇴거 시 암호화, 적재 시 복호화합니다.
          <br />
          CPU 다이 바깥으로 나가는 데이터는 항상 암호화 상태입니다.
        </p>
      </div>
    </section>
  );
}
