import TcbCompareViz from './viz/TcbCompareViz';

export default function TcbCompare() {
  return (
    <section id="tcb-compare" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TCB 크기 비교: SGX vs TDX vs SEV vs TrustZone</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TEE마다 <strong>어디까지를 신뢰 경계에 포함하는지</strong>가 다릅니다<br />
          TCB가 작을수록 검증해야 할 코드가 줄어들고, 공격 표면이 감소합니다
        </p>
        <TcbCompareViz />
        <p>
          <strong>SGX</strong>는 OS/하이퍼바이저를 완전히 제외하여 가장 작은 TCB를 달성합니다<br />
          <strong>TDX/SEV</strong>는 기존 VM을 수정 없이 보호(Lift & Shift)하는 대신 TCB가 커집니다<br />
          <strong>TrustZone</strong>은 하드웨어 레벨에서 두 세계를 물리적으로 분리하는 접근입니다
        </p>
      </div>
    </section>
  );
}
