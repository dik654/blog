import TfRmmViz from './viz/TfRmmViz';
import RmiDispatcherViz from './viz/RmiDispatcherViz';
import GranuleLockOrderViz from './viz/GranuleLockOrderViz';
import RecEnterViz from './viz/RecEnterViz';
import TfRmmBuildViz from './viz/TfRmmBuildViz';

export default function TfRmm() {
  return (
    <section id="tf-rmm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TF-RMM — Arm 레퍼런스 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">TF-RMM 구조</h3>

        <TfRmmViz />

        <p>
          <strong>TF-RMM</strong>: Arm이 유지하는 RMM 레퍼런스 구현 (BSD-3)<br />
          C로 작성 — 아키텍처 독립 레이어 + plat/ 하위 플랫폼 코드<br />
          QEMU + FVP 에뮬레이터에서 개발·테스트 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RMI Dispatcher</h3>
        <div className="not-prose mb-4"><RmiDispatcherViz /></div>
        <p>
          대형 switch 기반 dispatcher — 각 RMI 호출은 별도 함수<br />
          인자 검증·권한 검사·granule lock은 개별 핸들러에서 수행
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Granule Locking — Deadlock 방지</h3>
        <div className="not-prose mb-4"><GranuleLockOrderViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">REC (Realm Execution Context)</h3>
        <div className="not-prose mb-4"><RecEnterViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">빌드 & 실행 (FVP)</h3>
        <div className="not-prose mb-4"><TfRmmBuildViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">RMM과 TF-A 역할 분담</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">컴포넌트</th>
                <th className="border border-border px-3 py-2 text-left">권한</th>
                <th className="border border-border px-3 py-2 text-left">책임</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>TF-A BL31</code></td>
                <td className="border border-border px-3 py-2">EL3 (Monitor)</td>
                <td className="border border-border px-3 py-2">GPT 갱신, World 전환, PSCI</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TF-RMM</code></td>
                <td className="border border-border px-3 py-2">EL2 (Realm)</td>
                <td className="border border-border px-3 py-2">RMI/RSI, Realm 라이프사이클</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Hafnium/SPM</code></td>
                <td className="border border-border px-3 py-2">EL2 (Secure)</td>
                <td className="border border-border px-3 py-2">Secure partition 관리 (옵션)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TF-RMM의 설계 철학</p>
          <p>
            <strong>1. Formal Verification 지향</strong><br />
            - 핵심 상태 머신을 모델체킹 가능한 형태로 작성<br />
            - CBMC로 granule transition 검증<br />
            - 장기 목표: 주요 RMI 호출 증명
          </p>
          <p className="mt-2">
            <strong>2. 최소 TCB</strong><br />
            - libc 의존성 없음 — 자체 stdlib<br />
            - 동적 할당 금지 — 정적 풀만 사용<br />
            - 이진 크기 ~200KB (debug 빌드)
          </p>
          <p className="mt-2">
            <strong>3. 플랫폼 독립</strong><br />
            - plat/ 디렉토리 분리 — FVP, Arm CCA, QEMU<br />
            - SiP-specific 기능은 vendor별 구현<br />
            - 커뮤니티가 레퍼런스 유지
          </p>
        </div>

      </div>
    </section>
  );
}
