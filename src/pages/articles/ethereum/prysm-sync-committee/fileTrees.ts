import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});
const d = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const prysmTree: FileNode = d("prysm-v7.3.1", [
  d("validator/client", [
    f("SubmitSyncCommitteeMessage", "validator/client/sync_committee.go", "submit-sync-msg"),
  ]),
  d("beacon-chain/core/altair", [
    f("NextSyncCommitteeIndices", "beacon-chain/core/altair/sync_committee.go", "next-sync-committee"),
    f("IsSyncCommitteeAggregator", "beacon-chain/core/altair/sync_committee.go", "sync-aggregator-selection"),
    f("ProcessSyncAggregate", "beacon-chain/core/altair/block.go", "process-sync-aggregate"),
  ]),
  d("beacon-chain/rpc/prysm/v1alpha1/validator", [
    f("getSyncAggregate", "beacon-chain/rpc/prysm/v1alpha1/validator/proposer_altair.go", "proposer-sync-aggregate"),
  ]),
]);

export const consensusTree: FileNode = d("consensus-specs-aa16bb4c", [
  d("specs/altair/light-client", [
    f("initialize_light_client_store", "specs/altair/light-client/sync-protocol.md", "light-client-bootstrap"),
    f("validate_light_client_update", "specs/altair/light-client/sync-protocol.md", "validate-light-client-update"),
    f("process_light_client_update", "specs/altair/light-client/sync-protocol.md", "process-light-client-update"),
  ]),
]);
