import { Link } from "react-router-dom";
import Overview from "./helios-types/Overview";
import CoreTypes from "./helios-types/CoreTypes";
import Encoding from "./helios-types/Encoding";
import SszInternal from "./helios-types/SszInternal";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefsReal } from "./helios-types/codeRefsReal";
import { heliosTypesRealTree } from "./helios-types/fileTreeReal";
import HeliosLocator from "./helios/HeliosLocator";

function TypeMapReturn() {
  return (
    <section id="return-map" className="scroll-mt-20 border-y border-border py-6">
      <p className="text-xs font-bold text-primary">부모 지도에 돌려줄 사실</p>
      <p className="mt-2 break-keep text-base font-bold leading-7">
        Helios 0.11.1은 Beacon API 응답을 JSON으로 읽고 구조에 맞는 Base·Electra
        타입을 고릅니다. 그 타입이 정한 SSZ tree와 branch 길이로 Merkle proof를
        확인하고, period·participant·domain에 결속한 BLS signature까지 통과한
        뒤 GenericUpdate 후보를 만듭니다. 이 단계에서는 LightClientStore를
        바꾸지 않습니다.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <Link to="/cs/blockchain/helios#evidence-boundary" className="font-bold text-primary hover:underline">
          직속 부모로 돌아가기 ↗
        </Link>
        <Link to="/cs/blockchain/helios-execution#return-map" className="text-muted-foreground hover:text-primary">
          ← Execution RPC
        </Link>
        <Link to="/cs/blockchain/helios-config#overview" className="text-muted-foreground hover:text-primary">
          설정과 운영 경계 →
        </Link>
      </div>
    </section>
  );
}

export default function HeliosTypes() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <HeliosLocator current="helios-types" />
      <Overview />
      <CoreTypes onCodeRef={sidebar.open} />
      <Encoding onCodeRef={sidebar.open} />
      <SszInternal onCodeRef={sidebar.open} />
      <TypeMapReturn />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefsReal}
        fileTrees={{ helios: heliosTypesRealTree }}
        projectMetas={{
          helios: {
            id: "helios",
            label: "a16z/helios · Rust",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
