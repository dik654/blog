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
  d("beacon-chain/sync", [
    f(
      "validate_beacon_blocks.go — validateBeaconBlockPubSub()",
      "beacon-chain/sync/validate_beacon_blocks.go",
      "validate-block-pubsub",
    ),
    f(
      "subscriber.go — subscribe()",
      "beacon-chain/sync/subscriber.go",
      "subscribe-topic",
    ),
    f(
      "subscriber.go — wrapAndReportValidation()",
      "beacon-chain/sync/subscriber.go",
      "validation-wrapper",
    ),
    f(
      "decode_pubsub.go — decodePubsubMessage()",
      "beacon-chain/sync/decode_pubsub.go",
      "decode-pubsub",
    ),
  ]),
  d("beacon-chain/p2p/encoder", [
    f(
      "ssz.go — DecodeGossip()",
      "beacon-chain/p2p/encoder/ssz.go",
      "decode-gossip",
    ),
  ]),
]);
