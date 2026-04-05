import Overview from './aave-v3/Overview';
import AtokenDebt from './aave-v3/AtokenDebt';
import InterestRate from './aave-v3/InterestRate';
import Liquidation from './aave-v3/Liquidation';
import EfficiencyMode from './aave-v3/EfficiencyMode';

export default function AaveV3Article() {
  return (
    <>
      <Overview />
      <AtokenDebt />
      <InterestRate />
      <Liquidation />
      <EfficiencyMode />
    </>
  );
}
