import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const kohakuProviderTree: FileNode = d("kohaku · provider alpha.13 · b4ad096e", [
  d("packages/provider/src", [
    f("provider.ts · 공통 API와 TxSigner", "kohaku@provider-0.1.0-alpha.13/packages/provider/src/provider.ts", "kohaku-provider-interface"),
    d("helios", [
      f("index.ts · sync와 getLogs 우회", "kohaku@provider-0.1.0-alpha.13/packages/provider/src/helios/index.ts", "kohaku-helios-route"),
    ]),
    d("raw", [
      f("index.ts · 결과 정규화", "kohaku@provider-0.1.0-alpha.13/packages/provider/src/raw/index.ts", "kohaku-raw-normalize"),
      f("wait.ts · receipt polling", "kohaku@provider-0.1.0-alpha.13/packages/provider/src/raw/wait.ts", "kohaku-receipt-wait"),
    ]),
  ]),
]);
