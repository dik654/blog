import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const cometbftMempoolTree: FileNode = d('cometbft', [
  d('mempool', [
    f('CListMempool struct', 'mempool/clist_mempool.go', 'clist-struct'),
    f('CheckTx()', 'mempool/clist_mempool.go', 'clist-checktx'),
    f('reqResCb + addTx()', 'mempool/clist_mempool.go', 'clist-addtx'),
    f('Update()', 'mempool/clist_mempool.go', 'clist-update'),
    f('recheckTxs()', 'mempool/clist_mempool.go', 'clist-recheck'),
  ]),
]);
