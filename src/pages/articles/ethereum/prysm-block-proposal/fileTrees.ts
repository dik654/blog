import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const prysmTree: FileNode = d("prysm-v7.3.1", [
  d("beacon-chain/core/helpers", [
    f("validators.go · Fulu lookahead", "beacon-chain/core/helpers/validators.go", "fulu-proposer-lookahead"),
  ]),
  d("validator/client", [
    f("propose.go · request/sign/protect", "validator/client/propose.go", "validator-propose-request"),
    f("beacon-api/get_beacon_block.go · v3", "validator/client/beacon-api/get_beacon_block.go", "beacon-api-v3"),
  ]),
  d("beacon-chain/rpc/.../validator", [
    f("proposer.go · parent", "beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go", "beacon-parent"),
    f("proposer.go · Fulu assembly", "beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go", "fulu-assembly"),
    f("proposer.go · state root", "beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go", "proposal-state-root"),
    f("proposer.go · publish", "beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go", "beacon-publish"),
  ]),
]);
