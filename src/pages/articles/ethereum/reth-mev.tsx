import Overview from "./reth-mev/Overview";
import BuilderApi from "./reth-mev/BuilderApi";
import Flashbots from "./reth-mev/Flashbots";

const noopCodeRef = () => undefined;

export default function RethMev() {
  return (
    <>
      <Overview onCodeRef={noopCodeRef} />
      <BuilderApi onCodeRef={noopCodeRef} />
      <Flashbots onCodeRef={noopCodeRef} />
    </>
  );
}
