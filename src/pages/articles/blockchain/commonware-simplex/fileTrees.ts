import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({ name, type: "file", path, codeKey });
const d = (name: string, children: FileNode[]): FileNode => ({ name, type: "dir", children });

export const commonwareSimplexTree: FileNode = d("commonware-v2026.9.0", [
  d("consensus/src/simplex/actors/batcher", [
    f("quorum 계산", "round.rs · Round::new", "batcher-quorum"),
    f("certificate 조립", "verifier.rs · try_construct_certificate", "certificate-assembly"),
  ]),
  d("consensus/src/simplex/actors/voter", [
    f("certify 요청", "actor.rs · certification dispatch", "certification-request"),
    f("certify 오류 분기", "actor.rs · process_certified", "certification-error"),
    f("finalize 조건", "round.rs · construct_finalize", "finalize-gate"),
    f("journal 후 전파", "actor.rs · sync_journal → notify", "durable-broadcast"),
  ]),
]);
