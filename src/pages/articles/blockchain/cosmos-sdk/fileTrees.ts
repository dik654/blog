import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const cosmosTree: FileNode = d('cosmos-sdk', [
  d('baseapp', [
    f('baseapp.go — BaseApp struct', 'baseapp/baseapp.go', 'baseapp-struct'),
    f('baseapp.go — NewBaseApp()', 'baseapp/baseapp.go', 'baseapp-new'),
    f('baseapp.go — RunTx()', 'baseapp/baseapp.go', 'runtx'),
    f('baseapp.go — runMsgs()', 'baseapp/baseapp.go', 'runmsgs'),
    f('abci.go — FinalizeBlock()', 'baseapp/abci.go', 'abci-finalizeblock'),
    f('abci.go — internalFinalizeBlock()', 'baseapp/abci.go', 'internal-finalizeblock'),
    f('abci.go — PrepareProposal()', 'baseapp/abci.go', 'prepare-proposal'),
    f('abci.go — Commit()', 'baseapp/abci.go', 'commit'),
    f('abci.go — InitChain()', 'baseapp/abci.go', 'abci-initchain'),
    f('msg_service_router.go', 'baseapp/msg_service_router.go', 'msg-router-struct'),
  ]),
  d('types/module', [
    f('module.go — AppModule interface', 'types/module/module.go', 'appmodule-interface'),
  ]),
  d('store/rootmulti', [
    f('store.go — Store struct', 'store/rootmulti/store.go', 'rootmulti-struct'),
    f('store.go — Commit()', 'store/rootmulti/store.go', 'rootmulti-commit'),
  ]),
  d('x/bank/keeper', [
    f('keeper.go — BaseKeeper', 'x/bank/keeper/keeper.go', 'bank-keeper'),
    f('send.go — SendCoins()', 'x/bank/keeper/send.go', 'bank-sendcoins'),
    f('msg_server.go — Send()', 'x/bank/keeper/msg_server.go', 'bank-send'),
    f('keeper.go — MintCoins()', 'x/bank/keeper/keeper.go', 'bank-mintcoins'),
  ]),
]);
