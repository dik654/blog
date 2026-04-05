import Overview from './uniswap-v2/Overview';
import PairContract from './uniswap-v2/PairContract';
import RouterSwap from './uniswap-v2/RouterSwap';
import FlashSwap from './uniswap-v2/FlashSwap';

export default function UniswapV2Article() {
  return (
    <>
      <Overview />
      <PairContract />
      <RouterSwap />
      <FlashSwap />
    </>
  );
}
