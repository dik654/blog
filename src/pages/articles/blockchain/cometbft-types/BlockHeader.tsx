import BlockStructViz from './viz/BlockStructViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function BlockHeader({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="block-header" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Block & Header 구조체</h2>
      <div className="not-prose mb-8">
        <BlockStructViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Block 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Block 구조 — 4개 섹션</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3"><code>Block</code> struct — cometbft/types/block.go</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs">Header</p>
                <p className="text-xs text-muted-foreground">메타데이터 14 필드</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs">Data</p>
                <p className="text-xs text-muted-foreground">transactions</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs">Evidence</p>
                <p className="text-xs text-muted-foreground">비잔틴 증거</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs">LastCommit</p>
                <p className="text-xs text-muted-foreground">이전 높이 투표 집계</p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3"><code>Header</code> 14 필드</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">Version</code>
                <span className="text-xs text-muted-foreground"><code>version.Consensus</code> — block.version, app.version</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">ChainID</code>
                <span className="text-xs text-muted-foreground"><code>string</code> — 체인 식별자</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">Height</code>
                <span className="text-xs text-muted-foreground"><code>int64</code> — 블록 높이</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">Time</code>
                <span className="text-xs text-muted-foreground"><code>time.Time</code> — 블록 타임스탬프</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">LastBlockID</code>
                <span className="text-xs text-muted-foreground"><code>BlockID</code> — 이전 블록 ID</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">LastCommitHash</code>
                <span className="text-xs text-muted-foreground"><code>[]byte</code> — 이전 LastCommit hash</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">DataHash</code>
                <span className="text-xs text-muted-foreground"><code>[]byte</code> — transactions Merkle root</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">ValidatorsHash</code>
                <span className="text-xs text-muted-foreground"><code>[]byte</code> — 현재 validators hash</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">NextValidatorsHash</code>
                <span className="text-xs text-muted-foreground"><code>[]byte</code> — 다음 블록 validators hash</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">ConsensusHash</code>
                <span className="text-xs text-muted-foreground"><code>[]byte</code> — ConsensusParams hash</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">AppHash</code>
                <span className="text-xs text-muted-foreground"><code>[]byte</code> — ABCI app state root</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">LastResultsHash</code>
                <span className="text-xs text-muted-foreground"><code>[]byte</code> — 이전 블록 TX results hash</span>
              </div>
              <div className="flex justify-between border-b border-border/30 py-1">
                <code className="text-xs">EvidenceHash</code>
                <span className="text-xs text-muted-foreground"><code>[]byte</code> — Evidence merkle root</span>
              </div>
              <div className="flex justify-between py-1">
                <code className="text-xs">ProposerAddress</code>
                <span className="text-xs text-muted-foreground"><code>Address</code> — 이 블록의 proposer</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">필드 순서 중요: <code>Header.Hash()</code> 계산 시 순서대로 merkle tree 구성 — 순서 변경 → 다른 hash → consensus split</p>
          </div>
        </div>
        <p className="leading-7">
          Block은 <strong>4개 섹션</strong> (Header/Data/Evidence/LastCommit).<br />
          Header는 14 필드 — 메타데이터 + 각종 merkle root.<br />
          필드 순서가 hash 결정 → 변경 시 consensus split.
        </p>

        {/* ── Hash 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Header.Hash() — 14 필드 merkle 트리</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3"><code>Header.Hash()</code> — 14 필드 protobuf encode 후 merkle tree</p>
            <p className="text-xs text-muted-foreground mb-2"><code>h == nil || len(h.ValidatorsHash) == 0</code> → <code>nil</code> 반환 (유효하지 않은 Header)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-xs text-center">
              <div className="bg-background rounded px-2 py-1.5"><code>Version</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>ChainID</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>Height</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>Time</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>LastBlockID</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>LastCommitHash</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>DataHash</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>ValidatorsHash</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>NextValidatorsHash</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>ConsensusHash</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>AppHash</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>LastResultsHash</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>EvidenceHash</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>ProposerAddress</code></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">→ <code>merkle.HashFromByteSlices(fields)</code> — Tendermint binary merkle tree</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">왜 Merkle tree?</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>단순 concat + hash → 14 필드 전체 재해시 필요</li>
                <li>Merkle tree → 변경 필드 path만 재해시 O(log n)</li>
                <li>특정 필드 존재 증명 (light client 검증)</li>
                <li>부분 정보만 공유 가능 (privacy)</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">사용 예</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><strong className="text-foreground/80">AppHash 증명</strong> — ABCI state root가 이 block에 포함됨</li>
                <li><strong className="text-foreground/80">TX 포함 증명</strong> — DataHash merkle proof</li>
                <li><strong className="text-foreground/80">ValidatorsHash 증명</strong> — current validators 검증</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>Header.Hash()</code>는 <strong>14 필드 merkle tree</strong>.<br />
          특정 필드 증명 O(log n) 가능 → light client 지원.<br />
          AppHash, DataHash, ValidatorsHash 등 모든 merkle root가 여기 포함.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Header.Hash()가 Merkle 트리인 이유</strong> — 14개 필드를 단순 concat 후 SHA256하면 어떤 필드가 변경됐는지 증명 불가.<br />
          Merkle 트리를 쓰면 변경된 필드만 O(log n) 증명이 가능하다.
        </p>
      </div>
    </section>
  );
}
