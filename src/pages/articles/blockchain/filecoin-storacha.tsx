import Overview from './filecoin-storacha/Overview';
import Architecture from './filecoin-storacha/Architecture';
import UCAN from './filecoin-storacha/UCAN';
import Forge from './filecoin-storacha/Forge';

export default function FilecoinStorachaArticle() {
  const noop = () => {};

  return (
    <>
      <Overview onCodeRef={noop} />
      <Architecture onCodeRef={noop} />
      <UCAN onCodeRef={noop} />
      <Forge onCodeRef={noop} />
    </>
  );
}
