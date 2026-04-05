import Overview from './uniswap-v4/Overview';
import Hooks from './uniswap-v4/Hooks';
import FlashAccounting from './uniswap-v4/FlashAccounting';
import PoolManagerSection from './uniswap-v4/PoolManager';

export default function UniswapV4Article() {
  return (
    <>
      <Overview />
      <Hooks />
      <FlashAccounting />
      <PoolManagerSection />
    </>
  );
}
