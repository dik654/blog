import Overview from "./reth-alloy-primitives/Overview";
import Rlp from "./reth-alloy-primitives/Rlp";
import Primitives from "./reth-alloy-primitives/Primitives";
import FixedBytesInternal from "./reth-alloy-primitives/FixedBytesInternal";
import U256Arithmetic from "./reth-alloy-primitives/U256Arithmetic";
import Keccak256Address from "./reth-alloy-primitives/Keccak256Address";
import BytesAndBloom from "./reth-alloy-primitives/BytesAndBloom";
import RlpDecoding from "./reth-alloy-primitives/RlpDecoding";
import { RethAlloyPrimitivesMapReturn } from "./reth-alloy-primitives/RethAlloyPrimitivesLocator";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./reth-alloy-primitives/codeRefs";
import {
  alloyPrimitivesTree,
  alloyRlpTree,
  ruintTree,
} from "./reth-alloy-primitives/fileTrees";

export default function RethAlloyPrimitives() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <Primitives onCodeRef={sidebar.open} />
      <FixedBytesInternal onCodeRef={sidebar.open} />
      <Rlp onCodeRef={sidebar.open} />
      <RlpDecoding onCodeRef={sidebar.open} />
      <Keccak256Address onCodeRef={sidebar.open} />
      <U256Arithmetic onCodeRef={sidebar.open} />
      <BytesAndBloom onCodeRef={sidebar.open} />
      <RethAlloyPrimitivesMapReturn />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{
          "alloy-primitives": alloyPrimitivesTree,
          "alloy-rlp": alloyRlpTree,
          ruint: ruintTree,
        }}
        projectMetas={{
          "alloy-primitives": {
            id: "alloy-primitives",
            label: "alloy-primitives 1.6.1 · ae40cc4",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
          "alloy-rlp": {
            id: "alloy-rlp",
            label: "alloy-rlp 0.3.16 · 87cd1b7",
            badgeClass: "bg-sky-500/10 border-sky-500 text-sky-700",
          },
          ruint: {
            id: "ruint",
            label: "ruint 1.18.0 · 95594bd",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
        }}
      />
    </>
  );
}
