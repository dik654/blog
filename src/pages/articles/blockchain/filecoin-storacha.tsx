import Overview from "./filecoin-storacha/Overview";
import Architecture from "./filecoin-storacha/Architecture";
import UCAN from "./filecoin-storacha/UCAN";
import StorageLifecycle from "./filecoin-storacha/StorageLifecycle";

export default function FilecoinStorachaArticle() {
  const noop = () => {};

  return (
    <>
      <Overview onCodeRef={noop} />
      <Architecture onCodeRef={noop} />
      <UCAN onCodeRef={noop} />
      <StorageLifecycle onCodeRef={noop} />
    </>
  );
}
