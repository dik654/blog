import ContextViz from "./viz/ContextViz";
import BeaconDBSchemaViz from "./viz/BeaconDBSchemaViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Beacon DB는 block·state·checkpoint를 서로 다른 조회 축으로 저장한다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 BoltDB 초기화, 버킷 구조, 상태 저장 전략을 코드
          수준으로 추적한다.
        </p>

        {/* ── BoltDB 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          BoltDB — 왜 이 엔진을 선택했나
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">BoltDB (bbolt) 특징</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>B+tree, embedded, single-file / ACID transactions (MVCC)</li>
              <li>Pure Go 구현 (CGo 없음) / LMDB 영감 설계</li>
              <li>
                mmap 기반 read-only 접근 / single writer, multiple readers
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">대안 비교</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded border p-3">
                <p className="font-medium mb-1">
                  LevelDB{" "}
                  <span className="text-xs text-muted-foreground">
                    (Geth EL)
                  </span>
                </p>
                <p className="text-muted-foreground text-xs">
                  + 순차 write와 compaction을 활용하는 LSM-tree
                </p>
                <p className="text-muted-foreground text-xs">
                  - read amplification과 background compaction을 함께 운영
                </p>
              </div>
              <div className="rounded border p-3">
                <p className="font-medium mb-1">
                  MDBX{" "}
                  <span className="text-xs text-muted-foreground">
                    (Reth, Erigon)
                  </span>
                </p>
                <p className="text-muted-foreground text-xs">+ memory-mapped B+tree 계열</p>
                <p className="text-muted-foreground text-xs">
                  - native library binding과 배포·운영 조건 확인 필요
                </p>
              </div>
              <div className="rounded border p-3 border-blue-500/30 bg-blue-500/5">
                <p className="font-medium mb-1">
                  BoltDB{" "}
                  <span className="text-xs text-muted-foreground">(Prysm)</span>
                </p>
                <p className="text-muted-foreground text-xs">
                  + Pure Go / 단일 파일 / transaction snapshot
                </p>
                <p className="text-muted-foreground text-xs">
                  - single writer와 file growth·free page 관리 필요
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">CL 워크로드 특성</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>canonical block과 state checkpoint를 지속적으로 저장</li>
              <li>
                state 조회: 매우 빈번 (fork choice, RPC) / historical 조회:
                간헐적
              </li>
              <li>fork choice·RPC의 hot read와 commit write가 함께 발생</li>
              <li>DB file 크기와 free page, write latency를 함께 관찰</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Prysm의 BeaconDB는 <strong>bbolt</strong>의 단일 파일 transaction과
          bucket 구조를 사용한다. Pure Go 구현이라 배포 경로가 단순하고,
          snapshot 기반 read transaction과 일관된 write transaction을 제공한다.
          이를 고정된 read 비율이나 다른 DB보다 항상 빠르다는 주장으로
          일반화해서는 안 된다.
        </p>

        {/* ── DB 레이아웃 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DB 파일 레이아웃</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">파일 경로</h4>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">
                ~/.eth2/beaconchaindata/beaconchain.db
              </code>{" "}
              (single file)
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Meta 버킷</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-muted px-2 py-1">schemaVersion</span>
              <span className="rounded bg-muted px-2 py-1">
                config (ChainSpec)
              </span>
              <span className="rounded bg-muted px-2 py-1">genesisBlock</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Data 버킷</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>
                <code>blocksBucket</code> — root → SSZ block
              </span>
              <span>
                <code>stateBucket</code> — root → SSZ state
              </span>
              <span>
                <code>stateSummaryBucket</code> — slot → root
              </span>
              <span>
                <code>blockParentRootIndices</code> — root → parent_root
              </span>
              <span>
                <code>blockSlotIndicesBucket</code> — slot → root
              </span>
              <span>
                <code>finalizedBlockRootsIndex</code> — epoch → root
              </span>
              <span>
                <code>validatorsBucket</code> — pubkey → index
              </span>
              <span>
                <code>proposerSlashingsBucket</code>
              </span>
              <span>
                <code>attesterSlashingsBucket</code>
              </span>
              <span>
                <code>voluntaryExitsBucket</code>
              </span>
              <span>
                <code>blsToExecChangesBucket</code> — BLS → ETH1 주소 변경
              </span>
              <span>
                <code>depositContractBucket</code> /{" "}
                <code>powChainDataBucket</code>
              </span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              용량 계획에서 기록할 값
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <span>canonical·orphan block 증가량</span>
              <span>state checkpoint 보존 간격</span>
              <span>summary·index 증가량</span>
              <span>bbolt free page 비율</span>
              <span>pruning 전후 file size</span>
              <span className="font-medium text-foreground">release별 실측 추세</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          BeaconDB는 하나의 bbolt 파일 안에서 block, state, checkpoint, index를
          bucket으로 분리한다. 데이터 bucket과 slot·epoch index를 함께 두기
          때문에 root 기반 원본 조회와 시간축 조회를 모두 지원할 수 있다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <BeaconDBSchemaViz />
      </div>
    </section>
  );
}
