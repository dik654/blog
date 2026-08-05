import ContextViz from './viz/ContextViz';
import TEEDefinitionViz from './viz/TEEDefinitionViz';
import UseCasesViz from './viz/UseCasesViz';
import AltTechViz from './viz/AltTechViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 TEE가 필요한가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">클라우드의 근본적 신뢰 문제</h3>
        <p>
          <strong>전통 클라우드 모델</strong>: 사용자가 클라우드 사업자를 <strong>전적으로 신뢰</strong>해야 함<br />
          Host OS, Hypervisor, 클라우드 관리자 모두가 VM 메모리 접근 가능<br />
          민감 데이터(금융, 의료, 개인정보) 처리 시 <strong>규제·계약 의존</strong><br />
          <strong>근본 질문</strong>: 사업자를 신뢰할 수 없다면?
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE란 무엇인가</h3>
      </div>
      <div className="not-prose my-6"><TEEDefinitionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE 기술 스펙트럼</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">기술</th>
                <th className="border border-border px-3 py-2 text-left">벤더</th>
                <th className="border border-border px-3 py-2 text-left">격리 단위</th>
                <th className="border border-border px-3 py-2 text-left">도입</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Intel SGX</strong></td>
                <td className="border border-border px-3 py-2">Intel</td>
                <td className="border border-border px-3 py-2">Enclave (앱 내부)</td>
                <td className="border border-border px-3 py-2">2015 (Skylake)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>ARM TrustZone</strong></td>
                <td className="border border-border px-3 py-2">ARM</td>
                <td className="border border-border px-3 py-2">Secure World</td>
                <td className="border border-border px-3 py-2">2003</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>AMD SEV</strong></td>
                <td className="border border-border px-3 py-2">AMD</td>
                <td className="border border-border px-3 py-2">VM</td>
                <td className="border border-border px-3 py-2">2016 (EPYC Naples)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Intel TDX</strong></td>
                <td className="border border-border px-3 py-2">Intel</td>
                <td className="border border-border px-3 py-2">VM (TD)</td>
                <td className="border border-border px-3 py-2">2022 (SPR)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>ARM CCA</strong></td>
                <td className="border border-border px-3 py-2">ARM</td>
                <td className="border border-border px-3 py-2">Realm (VM)</td>
                <td className="border border-border px-3 py-2">2024 (Neoverse V3)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">IBM PEF</td>
                <td className="border border-border px-3 py-2">IBM</td>
                <td className="border border-border px-3 py-2">Secure VM</td>
                <td className="border border-border px-3 py-2">2020 (Power10)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">NVIDIA H100 CC</td>
                <td className="border border-border px-3 py-2">NVIDIA</td>
                <td className="border border-border px-3 py-2">GPU context</td>
                <td className="border border-border px-3 py-2">2022 (Hopper)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 사용 사례</h3>
      </div>
      <div className="not-prose my-6"><UseCasesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE vs 대안 기술</h3>
      </div>
      <div className="not-prose my-6"><AltTechViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TEE 신뢰 패러독스</p>
          <p>
            <strong>TEE의 역설</strong>:<br />
            - "클라우드 사업자 불신" 때문에 TEE 사용<br />
            - 하지만 TEE = "CPU 벤더(Intel/AMD/ARM) 신뢰"<br />
            - 신뢰 대상만 바뀜, 신뢰 자체는 여전
          </p>
          <p className="mt-2">
            <strong>왜 트레이드오프 수용</strong>:<br />
            1. CPU 벤더 TCB가 더 작음 (특화 기능)<br />
            2. Attestation으로 검증 가능<br />
            3. 공격 표면 축소 (커널·하이퍼바이저 제거)<br />
            4. 전 세계적 규제·표준 준수
          </p>
          <p className="mt-2">
            <strong>근본 한계</strong>:<br />
            - CPU 벤더가 백도어 심으면 탐지 불가<br />
            - Firmware 업데이트가 TCB의 약점<br />
            - 사이드채널 공격 지속적 발견<br />
            - "완벽 보안" 달성 불가 → defense in depth
          </p>
        </div>

      </div>
    </section>
  );
}
