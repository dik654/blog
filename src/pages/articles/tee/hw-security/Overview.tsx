import ContextViz from './viz/ContextViz';
import TCBViz from './viz/TCBViz';
import HwTcbViz from './viz/HwTcbViz';
import RootOfTrustViz from './viz/RootOfTrustViz';
import ChainOfTrustViz from './viz/ChainOfTrustViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TCB &amp; 위협 모델</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 하드웨어 보안인가</h3>
        <p>
          <strong>소프트웨어 한계</strong>: OS·하이퍼바이저가 침해되면 모든 앱 보호 불가<br />
          <strong>해결</strong>: 신뢰의 기반(Root of Trust)을 하드웨어에 둠<br />
          <strong>원칙</strong>: "Never trust software alone" — 하드웨어가 software보다 안전<br />
          <strong>trade-off</strong>: 유연성 감소, 업데이트 어려움, 초기 비용 높음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TCB (Trusted Computing Base)</h3>
      </div>
      <div className="not-prose my-6"><HwTcbViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">위협 모델 3분류</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">카테고리</th>
                <th className="border border-border px-3 py-2 text-left">공격 유형</th>
                <th className="border border-border px-3 py-2 text-left">HW 방어</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><strong>물리적 공격</strong></td>
                <td className="border border-border px-3 py-2">메모리 덤프, 콜드부트, 버스 스니핑, DMA</td>
                <td className="border border-border px-3 py-2">메모리 암호화, IOMMU</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>소프트웨어 공격</strong></td>
                <td className="border border-border px-3 py-2">악성 OS, 루트킷, 하이퍼바이저 탈출</td>
                <td className="border border-border px-3 py-2">SGX/TDX/SEV 격리</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>부채널 공격</strong></td>
                <td className="border border-border px-3 py-2">캐시 타이밍, 전력 분석, EM 방사</td>
                <td className="border border-border px-3 py-2">Constant-time, 파티셔닝</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Root of Trust (RoT)</h3>
      </div>
      <div className="not-prose my-6"><RootOfTrustViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">신뢰 체인 (Chain of Trust)</h3>
      </div>
      <div className="not-prose my-6"><ChainOfTrustViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mt-8">
        <TCBViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: HW RoT의 궁극적 신뢰 문제</p>
          <p>
            <strong>최종 신뢰 필수 요소</strong>:<br />
            - CPU 제조사 (Intel, AMD, ARM)<br />
            - eFuse에 저장된 키의 true randomness<br />
            - Boot ROM이 백도어 없이 정직하게 검증
          </p>
          <p className="mt-2">
            <strong>실패 시나리오</strong>:<br />
            ✗ 제조사 내부 악성 직원이 backdoor 심음<br />
            ✗ 국가 압력으로 weakened cryptography<br />
            ✗ 공급망 공격 (supply chain)<br />
            ✗ Firmware에 zero-day 존재
          </p>
          <p className="mt-2">
            <strong>완화 전략</strong>:<br />
            - Open-source hardware (OpenTitan)<br />
            - Formal verification of firmware<br />
            - Multi-vendor attestation (N-out-of-M)<br />
            - Regular TCB update + rollback protection<br />
            - Reproducible builds<br />
            → "Zero trust"는 이론적 목표, 현실은 "minimal trust"
          </p>
        </div>

      </div>
    </section>
  );
}
