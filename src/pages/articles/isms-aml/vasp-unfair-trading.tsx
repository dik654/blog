import Overview from './vasp-unfair-trading/Overview';
import InsiderTrading from './vasp-unfair-trading/InsiderTrading';
import MarketManipulation from './vasp-unfair-trading/MarketManipulation';
import PreventionFramework from './vasp-unfair-trading/PreventionFramework';

export default function VaspUnfairTrading() {
  return (
    <div className="space-y-12">
      <Overview />
      <InsiderTrading />
      <MarketManipulation />
      <PreventionFramework />
    </div>
  );
}
