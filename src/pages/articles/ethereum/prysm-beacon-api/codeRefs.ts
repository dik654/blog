import type { CodeRef } from "@/components/code/types";
import serviceRaw from "./codebase/prysm/beacon-chain/rpc/service.go?raw";
import endpointsRaw from "./codebase/prysm/beacon-chain/rpc/endpoints.go?raw";
import handlerRaw from "./codebase/prysm/beacon-chain/rpc/eth/beacon/handlers_state.go?raw";
import staterRaw from "./codebase/prysm/beacon-chain/rpc/lookup/stater.go?raw";
import metadataRaw from "./codebase/prysm/beacon-chain/rpc/eth/helpers/metadata.go?raw";
import errorsRaw from "./codebase/prysm/beacon-chain/rpc/eth/shared/errors.go?raw";
import specRaw from "./codebase/beacon-apis/apis/beacon/states/root.yaml?raw";

export const codeRefs: Record<string, CodeRef> = {
  "service-wiring": {
    path: "beacon-chain/rpc/service.go — REST·gRPC registration",
    lang: "go",
    code: serviceRaw,
    highlight: [2, 29],
    desc: "REST endpoint는 Go ServeMux에, gRPC service는 grpc.Server에 서로 따로 등록됩니다.",
    annotations: [
      { lines: [2, 20], color: "sky", note: "REST route는 method와 path를 함께 등록합니다." },
      { lines: [22, 28], color: "amber", note: "gRPC service registration은 같은 process의 별도 transport surface입니다." },
    ],
  },
  "rest-route": {
    path: "beacon-chain/rpc/endpoints.go — GetStateRoot route·middleware",
    lang: "go",
    code: endpointsRaw,
    highlight: [2, 44],
    desc: "State-root GET route와 JSON Accept, 압축, 요청 수·지연·오류 계측을 보여줍니다.",
    annotations: [
      { lines: [3, 14], color: "sky", note: "이 endpoint는 GET과 JSON response만 등록합니다." },
      { lines: [17, 29], color: "emerald", note: "Middleware 뒤에 Prometheus duration·count wrapper가 붙습니다." },
      { lines: [34, 41], color: "amber", note: "Status code가 400 이상이면 error counter를 올립니다." },
    ],
  },
  "state-root-handler": {
    path: "beacon-chain/rpc/eth/beacon/handlers_state.go — GetStateRoot()",
    lang: "go",
    code: handlerRaw,
    highlight: [2, 59],
    desc: "하나의 state ID로 root·state·optimistic·finalized를 순서대로 조합합니다.",
    annotations: [
      { lines: [7, 17], color: "sky", note: "Path value를 확인하고 state root를 먼저 조회합니다." },
      { lines: [21, 38], color: "emerald", note: "BeaconState와 optimistic mode는 별도 호출입니다." },
      { lines: [40, 49], color: "amber", note: "Finality는 state에서 계산한 block root를 기준으로 판정합니다." },
      { lines: [51, 58], color: "rose", note: "세 결과가 하나의 JSON response에 합쳐집니다." },
    ],
  },
  "state-id-resolution": {
    path: "beacon-chain/rpc/lookup/stater.go — State()·StateRoot()",
    lang: "go",
    code: staterRaw,
    highlight: [3, 46],
    desc: "같은 head 문자열도 StateRoot는 HeadBlock, State는 HeadState에서 읽습니다.",
    annotations: [
      { lines: [3, 21], color: "sky", note: "State(head)는 현재 chain view의 HeadState를 읽습니다." },
      { lines: [23, 34], color: "emerald", note: "StateRoot(head)는 같은 ID를 별도 root lookup으로 해석합니다." },
      { lines: [36, 46], color: "amber", note: "head state root는 HeadBlock의 state_root field입니다." },
    ],
  },
  metadata: {
    path: "beacon-chain/rpc/eth/helpers — IsOptimistic()·BlockRootFromState()",
    lang: "go",
    code: metadataRaw,
    highlight: [2, 44],
    desc: "Optimistic 여부는 state ID로, finalized 여부에 필요한 root는 BeaconState의 block header로 계산합니다.",
    annotations: [
      { lines: [2, 20], color: "sky", note: "head는 현재 node의 optimistic mode를 다시 조회합니다." },
      { lines: [22, 44], color: "amber", note: "Finality lookup용 block root는 latest block header HashTreeRoot입니다." },
    ],
  },
  "error-mapping": {
    path: "beacon-chain/rpc/eth/shared/errors.go — state ID errors",
    lang: "go",
    code: errorsRaw,
    highlight: [2, 37],
    desc: "조회 실패를 400·404·500 HTTP status로 나누는 실제 mapping입니다.",
    annotations: [
      { lines: [8, 24], color: "sky", note: "State root·BeaconState·slot coverage가 없으면 404입니다." },
      { lines: [26, 32], color: "emerald", note: "State ID parse 실패는 400입니다." },
      { lines: [34, 37], color: "amber", note: "나머지 내부 오류는 500입니다." },
    ],
  },
  "openapi-contract": {
    path: "beacon-APIs v4.0.0 — apis/beacon/states/root.yaml",
    lang: "yaml",
    code: specRaw,
    highlight: [2, 34],
    desc: "표준 endpoint의 required response field와 JSON media type, 오류 status를 고정합니다.",
    annotations: [
      { lines: [2, 8], color: "sky", note: "State ID는 필수 path parameter입니다." },
      { lines: [10, 26], color: "emerald", note: "200 JSON에는 data.root와 두 boolean이 모두 필요합니다." },
      { lines: [27, 34], color: "amber", note: "Invalid ID·not found·internal error를 구분합니다." },
    ],
  },
};
