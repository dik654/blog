import Overview from './filecoin-onchain-cloud/Overview';
import PdpIntegration from './filecoin-onchain-cloud/PdpIntegration';
import Settlement from './filecoin-onchain-cloud/Settlement';

export default function FilecoinOnchainCloudArticle() {
  const noop = () => {};

  return (
    <>
      <Overview onCodeRef={noop} />
      <PdpIntegration onCodeRef={noop} />
      <Settlement onCodeRef={noop} />
    </>
  );
}
