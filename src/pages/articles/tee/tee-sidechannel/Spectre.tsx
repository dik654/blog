import SpectreV1Viz from './viz/SpectreV1Viz';
import MeltdownViz from './viz/MeltdownViz';
import ForeshadowViz from './viz/ForeshadowViz';
import SevTransientViz from './viz/SevTransientViz';
import MitigationLayersViz from './viz/MitigationLayersViz';

export default function Spectre() {
  return (
    <section id="spectre" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Spectre &amp; Meltdown</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Transient Execution Attacks 개요</h3>
        <p>
          <strong>투기적 실행</strong>(Speculative Execution)이 보안 취약점으로 돌변<br />
          <strong>원리</strong>: CPU가 분기 결과 예측 → 잘못 예측해도 투기적 실행 결과가 마이크로아키텍처 상태에 잔재<br />
          <strong>핵심</strong>: 비밀 데이터에 의존하는 메모리 접근이 <strong>캐시에 흔적</strong><br />
          <strong>탐지</strong>: Flush+Reload로 어떤 캐시 라인이 로드됐는지 측정 → 비밀 복원
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Spectre v1 (Bounds Check Bypass)</h3>
        <div className="not-prose mb-6"><SpectreV1Viz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Meltdown (Rogue Data Cache Load)</h3>
        <div className="not-prose mb-6"><MeltdownViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Foreshadow — SGX L1TF</h3>
        <div className="not-prose mb-6"><ForeshadowViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">SEV-ES/SNP의 Transient 공격</h3>
        <div className="not-prose mb-6"><SevTransientViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">완화 계층</h3>
        <div className="not-prose mb-6"><MitigationLayersViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Transient 공격의 근본 해결 불가능성</p>
          <p>
            <strong>구조적 문제</strong>:<br />
            - 투기 실행은 CPU 성능의 근간<br />
            - 완전 제거 시 성능 50%+ 하락<br />
            - 완전한 isolation은 현대 CPU 아키텍처에서 불가능
          </p>
          <p className="mt-2">
            <strong>현재 접근</strong>:<br />
            - Best-effort mitigation (new attack → new fix)<br />
            - 공격별 TCB 업데이트<br />
            - Attestation이 TCB 버전 강제
          </p>
          <p className="mt-2">
            <strong>장기 방향</strong>:<br />
            - Secure speculation 아키텍처 연구 (MIT, Google)<br />
            - 하드웨어 분리된 투기 실행 unit<br />
            - 현재로선 formal verification 어려움
          </p>
        </div>

      </div>
    </section>
  );
}
