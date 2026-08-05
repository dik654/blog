import TCBSizeViz from './viz/TCBSizeViz';
import SgxVsVmTeeViz from './viz/SgxVsVmTeeViz';
import TCBStrategiesViz from './viz/TCBStrategiesViz';

export default function TCB() {
  return (
    <section id="tcb" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TCB (Trusted Computing Base)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">TCB의 정의</h3>
        <p>
          <strong>TCB</strong>: 시스템 보안을 책임지는 모든 하드웨어 + 소프트웨어의 합<br />
          TCB의 <strong>어느 한 부분이라도</strong> 침해되면 전체 보안 무너짐<br />
          <strong>TCB 최소화</strong>가 보안 공학의 핵심 원칙<br />
          <strong>TCB 바깥</strong>: untrusted로 가정, 아무리 많이 악용돼도 보안 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TCB 크기의 중요성</h3>
      </div>
      <div className="not-prose my-6"><TCBSizeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE별 TCB 구성 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">기술</th>
                <th className="border border-border px-3 py-2 text-left">TCB 포함</th>
                <th className="border border-border px-3 py-2 text-left">크기 추정</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Intel SGX</strong></td>
                <td className="border border-border px-3 py-2">CPU HW + Enclave 코드 + SDK</td>
                <td className="border border-border px-3 py-2">~50K LoC</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>ARM TrustZone (OP-TEE)</strong></td>
                <td className="border border-border px-3 py-2">TrustZone HW + OP-TEE OS + TAs</td>
                <td className="border border-border px-3 py-2">~200K LoC</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Intel TDX</strong></td>
                <td className="border border-border px-3 py-2">CPU HW + TD Module + Guest OS</td>
                <td className="border border-border px-3 py-2">30M+ LoC (kernel 포함)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>AMD SEV-SNP</strong></td>
                <td className="border border-border px-3 py-2">CPU HW + ASP firmware + Guest OS</td>
                <td className="border border-border px-3 py-2">30M+ LoC</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>ARM CCA</strong></td>
                <td className="border border-border px-3 py-2">ARM HW + TF-A + RMM + Realm OS</td>
                <td className="border border-border px-3 py-2">30M+ LoC</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">SGX vs VM-based TEE — TCB trade-off</h3>
      </div>
      <div className="not-prose my-6"><SgxVsVmTeeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">TCB 최소화 전략</h3>
      </div>
      <div className="not-prose my-6"><TCBStrategiesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TCB는 정량적 지표 이상</p>
          <p>
            <strong>LoC만으로 TCB 판단 불가</strong>:<br />
            - 100 LoC 하드코딩 어셈블리 vs 10K LoC 검증된 Rust<br />
            - 후자가 더 안전할 수 있음<br />
            - 언어·아키텍처·검증 레벨 모두 고려
          </p>
          <p className="mt-2">
            <strong>질적 요소</strong>:<br />
            1. 언어 안전성 (Rust &gt; C)<br />
            2. 검증 여부 (formal proof &gt; tests only)<br />
            3. 공개 여부 (open source &gt; closed)<br />
            4. 감사 받은 횟수<br />
            5. 업데이트 빈도 (패치 용이성)
          </p>
          <p className="mt-2">
            <strong>예시</strong>:<br />
            - Linux kernel 30M LoC, but 많이 검증됨<br />
            - Intel SGX SDK 50K LoC, but Intel 폐쇄<br />
            - seL4 ~10K LoC + 완전 formal verified<br />
            → 단순 LoC 비교는 misleading
          </p>
        </div>

      </div>
    </section>
  );
}
