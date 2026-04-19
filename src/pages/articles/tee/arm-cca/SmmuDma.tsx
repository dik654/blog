import SmmuViz from './viz/SmmuViz';
import SmmuSteFieldsViz from './viz/SmmuSteFieldsViz';
import RealmDmaSetupViz from './viz/RealmDmaSetupViz';
import ConfidentialPcieViz from './viz/ConfidentialPcieViz';
import CocoStackViz from './viz/CocoStackViz';

export default function SmmuDma() {
  return (
    <section id="smmu-dma" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SMMU &amp; Confidential DMA</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">DMA 공격과 SMMU의 역할</h3>

        <SmmuViz />

        <p>
          <strong>위협</strong>: Host가 악성 디바이스(또는 DMA-capable device 드라이버) 통해 Realm 메모리 탈취<br />
          <strong>방어</strong>: <strong>SMMU(IOMMU)</strong>가 DMA 경로에서도 GPT 검사<br />
          <strong>결과</strong>: CPU 경로·DMA 경로 모두 동일한 격리 보장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SMMU v3.2 — RME 통합</h3>
        <div className="not-prose mb-4"><SmmuSteFieldsViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Realm의 DMA 버퍼 할당</h3>
        <div className="not-prose mb-4"><RealmDmaSetupViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Secure NIC·GPU 트렌드</h3>
        <div className="not-prose mb-4"><ConfidentialPcieViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Confidential Containers 통합</h3>
        <div className="not-prose mb-4"><CocoStackViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CCA의 도입 현황 (2024~2025)</p>
          <p>
            <strong>실리콘 레벨</strong>:<br />
            - Arm Neoverse V3 (Grace, Axion 등) — RMEv1 지원<br />
            - Cortex-X925 클라이언트 칩 — 모바일 CCA 출발<br />
            - AWS Graviton 4 (2024) — CCA 포함
          </p>
          <p className="mt-2">
            <strong>소프트웨어 생태계</strong>:<br />
            - TF-RMM 1.0 릴리스 (2024)<br />
            - Linux 6.5+ KVM-CCA 패치 머지 진행 중<br />
            - Veraison 공식 Verifier
          </p>
          <p className="mt-2">
            <strong>한계</strong>:<br />
            - 메모리 암호화 플랫폼 의존 (MEC 도입 초기)<br />
            - Live Migration 표준화 미흡<br />
            - TDISP/PCIe 보안 연동 미완
          </p>
          <p className="mt-2">
            <strong>비교</strong>:<br />
            - TDX/SEV-SNP는 이미 프로덕션 (Azure, GCP)<br />
            - CCA는 2025~2026 본격 프로덕션 예상<br />
            - 장기적으로 엣지·모바일 기밀 컴퓨팅 주도 가능
          </p>
        </div>

      </div>
    </section>
  );
}
