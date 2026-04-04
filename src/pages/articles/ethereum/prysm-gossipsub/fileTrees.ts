import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/sync', [
    f('validate_beacon_blocks.go — validateBeaconBlockPubSub()', 'beacon-chain/sync/validate_beacon_blocks.go', 'validate-block-pubsub'),
    f('subscriber.go — subscribeStaticTopics()', 'beacon-chain/sync/subscriber.go', 'subscribe-topics'),
    f('subscriber.go — subscribe()', 'beacon-chain/sync/subscriber.go', 'message-handler'),
  ]),
]);
