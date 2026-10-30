import type { FileNode } from "@/components/code/types";

const file = (name: string, path: string, codeKey: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});

const dir = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const dydxTree: FileNode = dir("v4-chain · protocol/v9.7.1", [
  dir("protocol", [
    dir("app", [
      dir("prepare", [
        file("prepare_proposal.go", "protocol/app/prepare/prepare_proposal.go", "dydx-prepare-proposal"),
      ]),
      dir("process", [
        file("process_proposal.go", "protocol/app/process/process_proposal.go", "dydx-process-proposal"),
      ]),
    ]),
    dir("x/clob", [
      dir("types", [
        file("order_id.go", "protocol/x/clob/types/order_id.go", "dydx-order-flags"),
      ]),
      dir("keeper", [
        file("msg_server_proposed_operations.go", "protocol/x/clob/keeper/msg_server_proposed_operations.go", "dydx-proposed-operations"),
      ]),
    ]),
    dir("indexer/indexer_manager", [
      file("event_manager.go", "protocol/indexer/indexer_manager/event_manager.go", "dydx-indexer-event"),
    ]),
  ]),
]);
