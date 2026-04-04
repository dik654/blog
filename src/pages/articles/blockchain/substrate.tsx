import Overview from './substrate/Overview';
import FramePallet from './substrate/FramePallet';
import RuntimeConfig from './substrate/RuntimeConfig';
import RelayChain from './substrate/RelayChain';
import XCMCrossChain from './substrate/XCMCrossChain';

export default function SubstrateArticle() {
  return (
    <>
      <Overview />
      <FramePallet />
      <RuntimeConfig />
      <RelayChain />
      <XCMCrossChain />
    </>
  );
}
