import ExplainedFormula from "@/components/ui/explained-formula";

export default function CollateralBorrow() {
  return (
    <section id="collateral-borrow" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Borrow collateral factor와 liquidation factor는 의도적으로 다르다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>새 base borrow·collateral withdrawal은 <code>borrowCollateralFactor</code>로 계산한 capacity를 넘을 수 없습니다. Liquidation은 더 높은 <code>liquidateCollateralFactor</code>로 별도 liquidity sum을 계산합니다. 이 사이 buffer 덕분에 governance가 borrow factor를 낮춰도 기존 account가 즉시 liquidatable이 되지 않을 수 있습니다.</p>
      </div>
      <ExplainedFormula
        question="같은 collateral에서 borrow gate와 liquidation gate는 어떻게 다른 결과를 낼까요?"
        idea="Base debt를 음수 liquidity로 두고 collateral value에 gate별 factor를 곱해 더합니다. Borrow gate는 새 risk를 막고 liquidation gate는 protocol intervention 시점을 정합니다."
        formula={String.raw`L_{borrow}=-D+\sum_iV_iCF_{b,i},\qquad L_{liq}=-D+\sum_iV_iCF_{l,i}`}
        terms={[
          { symbol: "D", name: "base debt value", description: "Borrow index와 base price가 반영된 debt입니다." },
          { symbol: "CF_b", name: "borrow collateral factor", description: "새 borrow/withdraw 뒤 0 이상이어야 하는 보수적 factor입니다." },
          { symbol: "CF_l", name: "liquidate collateral factor", description: "isLiquidatable 판정에 쓰며 source config는 CF_b보다 크게 제한합니다." },
        ]}
        assumptions={["Oracle price·asset scale·asset membership bitmap을 같은 snapshot에서 읽습니다.", "Supply cap, baseBorrowMin, pause와 manager permission은 별도 validation입니다."]}
        interpretation="Collateral $1,000, CF_b=75%, CF_l=85%면 새 borrow capacity는 $750입니다. Debt $800은 추가 borrow는 못 하지만 L_liq=$50라 아직 liquidatable이 아닙니다. Debt $900이면 L_liq=−$50라 liquidatable입니다. 두 factor를 하나로 합치면 이 buffer를 잃습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Collateral은 base 공급처럼 이자를 얻지 않는다</h3>
        <p>Collateral token balance는 risk support로 저장되며 supply index를 곱하지 않습니다. Base asset을 supply하면 positive principal로 이자를 얻고, base를 withdraw해 0 아래로 내려가면 borrow가 됩니다. 따라서 “모든 supplied asset이 yield를 얻는다”는 V2식 mental model은 Comet에 맞지 않습니다.</p>
      </div>
    </section>
  );
}
