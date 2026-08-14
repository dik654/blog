import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ModernAaveViz from "./viz/ModernAaveViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Aave V3 reserve는 liquidity·debt·risk configuration을 한 실행 경계로 묶는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">공급자는 underlying을 reserve에 넣고 scaled aToken balance를 받습니다. 차입자는 담보 가치와 LTV·cap·mode 검사를 통과한 뒤 variable debt를 만듭니다. 이후 utilization이 rate를, reserve indexes가 모든 계정의 현재 잔고를, oracle과 liquidation threshold가 account health를 갱신합니다.</p>
        <p>“Aave V3”라는 이름만으로 수치 parameter를 고정할 수는 없습니다. Network·Pool implementation·reserve asset·governance configuration·oracle snapshot을 함께 기록해야 합니다. 이 글의 예제 rate와 threshold는 수학을 읽기 위한 가상 값이며 배포 조언이 아닙니다.</p>
      </div>
      <ContentBoundary article="aave-v3" />
      <ModernAaveViz mode="pool" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <thead><tr className="border-b"><th className="p-3 text-left">층</th><th className="p-3 text-left">상태</th><th className="p-3 text-left">실패 경계</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-3 font-semibold">Reserve</td><td className="p-3">available liquidity·total variable debt·indexes·rates</td><td className="p-3">cap·pause/freeze·insufficient liquidity</td></tr>
            <tr className="border-b"><td className="p-3 font-semibold">Account</td><td className="p-3">scaled balances·collateral flags·mode</td><td className="p-3">LTV·HF·debt ceiling·asset compatibility</td></tr>
            <tr><td className="p-3 font-semibold">Evidence</td><td className="p-3">implementation SHA·addresses·config·oracle</td><td className="p-3">다른 release/network parameter 혼합</td></tr>
          </tbody>
        </table>
      </div>
      <div id="paper-aave-v3-origin-source" className="scroll-mt-24">
        <CitationBlock source="Aave DAO · aave-v3-origin source snapshot" href="https://github.com/aave-dao/aave-v3-origin/tree/cff15de6d1271b0c800fc001f4aea4c263e8a597" citeKey={1}>
          문제: V3.1–3.x Pool의 supply·borrow·index·rate·liquidation·mode를 실행합니다. 기여: Pool interfaces와 ReserveLogic, GenericLogic, LiquidationLogic, MathUtils, rate strategy의 정확한 source seam을 제공합니다. 전제: inspected main snapshot cff15de6d127과 선택 deployment configuration을 고정합니다. 근거 범위: 이 source snapshot의 protocol logic입니다. 비주장: moving main의 미래 동작이나 모든 network의 주소·risk parameter가 같다고 일반화하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
