import type { ReactNode } from "react";
import { CitationBlock } from "@/components/ui/citation-block";
import StorageEngineLocator, { StorageEngineMapReturn } from "../lsm-tree/StorageEngineLocator";
import RethStorageMigrationViz from "./viz/RethStorageMigrationViz";

const LABEL = ({ children }: { children: ReactNode }) => <span className="mr-2 inline-block border border-primary/40 px-1.5 py-0.5 align-middle text-[9px] font-black text-primary">{children}</span>;

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <StorageEngineLocator current="reth-db-validation" />
        <div><p className="text-xs font-bold text-primary">실무 글 · 개념을 운영 판단으로 연결하기</p><h2 className="mt-2 break-keep text-3xl font-bold">Storage V2 전환은 세 저장소의 정합성과 되돌릴 자료를 함께 검증합니다</h2></div>
        <RethStorageMigrationViz />
        <p className="text-lg leading-8"><LABEL>A</LABEL>이 글은 v2.8.1을 운영에 바로 채택하라는 승인안이 아닙니다. 격리된 복제 자료에서 V1→V2 migration과 정상 commit의 중단 지점을 재생하고, 재시작 뒤 logical chain이 같다는 증거를 모으는 실험 계획입니다. 대상 환경에서 얻은 복구 시간과 성능 수치는 아직 없습니다.</p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Release와 네 종류의 저장 자료를 한 run manifest에 고정합니다</h2>
        <p><LABEL>O</LABEL>기준 구현은 2026년 10월 23일 공개된 Reth v2.8.1입니다. Release note는 v2.8.0과 데이터베이스 변경이 없다고 명시하지만, 실제 route와 migration phase는 v2.8.1 source로 고정합니다.</p>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5"><thead className="text-muted-foreground"><tr><th className="px-3 py-3">묶음</th><th className="px-3 py-3">고정할 값</th><th className="px-3 py-3">되돌릴 자료</th></tr></thead><tbody>{[
          ["Binary", "v2.8.1 · source SHA · build · CLI flags", "이전 검증 binary"],
          ["MDBX", "datafile · lockfile · stage checkpoints · settings", "일관된 전체 snapshot"],
          ["Static files", "segment ranges · headers · checksums", "directory snapshot"],
          ["RocksDB", "column families · sequence · options", "database snapshot 또는 재구축 입력"],
          ["Chain", "network · tip/hash · prune mode · genesis", "동일 chain fixture"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Migration command만 저장 경로와 StorageSettings를 바꿉니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5"><thead className="text-muted-foreground"><tr><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 기록</th><th className="px-3 py-3">유일한 writer</th><th className="px-3 py-3">검증자</th></tr></thead><tbody>{[
          ["Migration phase", "run manifest · command receipt", "migration harness", "collector"],
          ["Static coverage", "segment headers와 file ranges", "static-file provider", "range/checksum verifier"],
          ["History index", "RocksDB column families", "RocksDB provider", "invariant checker"],
          ["Canonical frontier", "MDBX stage checkpoints", "Reth DB transaction", "read-only provider"],
          ["Storage version", "MDBX StorageSettings", "migrate-to-v2 command", "startup preflight"],
          ["채택 상태", "ADR와 artifact digest", "서비스 소유 팀", "배포 파이프라인"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><LABEL>A</LABEL>외부 스크립트가 table을 지우거나 <code>StorageSettings</code>를 먼저 바꾸면 Reth의 phase 순서와 복구 판단을 우회합니다. Harness는 command를 시작·중단하고 사본을 보존할 수 있지만 세 backend의 내부 상태를 임의로 고쳐 쓰지 않습니다.</p>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">같은 chain에서 V1과 정상 완료된 V2의 논리 결과를 먼저 맞춥니다</h2>
        <p><LABEL>A</LABEL>원본 V1 snapshot을 읽기 전용으로 보존하고 사본 하나에서 migration을 끝까지 완료합니다. 둘의 canonical tip/hash, state root, receipts, senders, changesets, transaction lookup, account/storage history와 provider query 결과를 대조합니다.</p>
        <div className="not-prose grid gap-px bg-border p-px md:grid-cols-3"><div className="bg-background p-4"><strong className="text-sm">V1 oracle</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">모든 자료가 MDBX에 있는 보존 snapshot</p></div><div className="bg-background p-4"><strong className="text-sm">V2 candidate</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Static·RocksDB·MDBX로 이동한 사본</p></div><div className="bg-background p-4"><strong className="text-sm">Query receipt</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">같은 block/hash와 같은 logical answer</p></div></div>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 migration 순서의 각 경계에서 중단하고 처음부터 다시 판정합니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">{[
          ["01 · Preflight", "V1 확인, 여유 공간, snapshots와 chain digest를 기록합니다."],
          ["02 · Changesets", "Account와 storage changesets를 static files로 옮기는 중간 지점에서 종료합니다."],
          ["03 · Receipts", "Receipt segment copy·finalize 전후에서 종료하고 coverage를 검사합니다."],
          ["04 · Indices", "Transaction hash와 account/storage history를 RocksDB로 옮기는 중간 batch에서 종료합니다."],
          ["05 · Version flip", "StorageSettings를 V2로 바꾸기 직전·직후에 종료해 재시작 판단을 비교합니다."],
          ["06 · Cleanup·rebuild", "MDBX old tables clear·compact와 pipeline rebuild 전후를 검사합니다."],
        ].map(([title, body]) => <li key={title} className="bg-background p-4"><strong>{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></li>)}</ol>
        <p><LABEL>?</LABEL>Kill instrumentation, 반복 횟수, 최대 허용 migration 시간과 disk 여유 한도는 대상 test node에서 정해야 합니다. Process 종료 시험을 정전 내구성 결과로 확대하지 않습니다.</p>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">불명확하면 쓰기를 멈추고 세 저장소를 같은 snapshot으로 되돌립니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">{[
          ["발견", "version·range·checkpoint 불일치"], ["격리", "node write·serving 중지"], ["보존", "세 backend와 logs 복사"], ["복구", "동일 snapshot 복원 또는 rebuild"], ["재진입", "전체 parity 뒤 승인"],
        ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>A</LABEL>Rollback은 binary만 낮추는 작업이 아닙니다. V2 route가 이미 일부 자료를 static files와 RocksDB로 옮기고 MDBX table을 지웠다면, migration 전 MDBX snapshot과 해당 시점의 static/RocksDB directories를 함께 복원하거나 검증된 chain source에서 재구축해야 합니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Logical parity와 restart를 통과한 run에서만 비용을 비교합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["정합성", "tip/hash·state root·rows·query parity"], ["복구", "restart result·ahead prune·behind rebuild·RTO"], ["자료 이동", "bytes read/written·space peak·compaction"], ["서비스", "startup·query p95/p99·unavailable time"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>M</LABEL>현재 대상 장비에서 얻은 수치는 없습니다. Storage V2가 더 빠르거나 migration이 정해진 시간 안에 끝난다는 결론은 아직 내리지 않습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 전 상태는 proposed이며 정합성 실패 한 번으로 기각합니다</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6"><p><strong>Status:</strong> proposed</p><p className="mt-2"><strong>출발점:</strong> v2.8.1과 보존한 V1 snapshot으로 정상 migration 기준선을 만듭니다.</p><p className="mt-2"><strong>채택 조건:</strong> 모든 phase 중단 뒤 같은 logical chain으로 재개·복구되고 용량·시간·query SLO를 만족합니다.</p><p className="mt-2"><strong>기각 조건:</strong> Mixed frontier, 빠진 range, index/row 차이, 불명확한 version state, 안전한 rollback 부재가 하나라도 나타납니다.</p><p className="mt-2"><strong>다시 검토할 조건:</strong> Reth release, storage settings, prune mode, chain size, filesystem, 장치 또는 RPO/RTO가 바뀝니다.</p></div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 구현과 아직 없는 측정값을 분리합니다</h2>
        <CitationBlock source="Reth v2.8.1 release" citeKey={1} href="https://github.com/paradigmxyz/reth/releases/tag/v2.8.1"><p><LABEL>O</LABEL>시험 대상으로 고정한 release와 v2.8.0 대비 database 변경 없음이라는 범위입니다.</p><p><LABEL>M</LABEL>대상 환경의 migration·복구·성능 결과는 아닙니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · migrate_to_v2" citeKey={2} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/cli/commands/src/db/migrate_v2.rs"><p><LABEL>O</LABEL>Changesets, receipts, indices, settings flip, MDBX cleanup·compaction, pipeline rebuild의 실제 순서를 확인했습니다.</p><p><b>범위:</b> 선택 release의 command 구현이며 모든 중단 지점의 안전성을 측정했다는 뜻은 아닙니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · provider invariants" citeKey={3} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/storage/provider/src/providers/rocksdb/invariants.rs"><p><LABEL>O</LABEL>RocksDB progress와 MDBX checkpoint의 ahead·behind 판정과 복구 방향을 확인했습니다.</p><p><LABEL>?</LABEL>대상 자료량에서 prune·rebuild가 걸리는 시간과 필요한 임시 공간은 실험으로 정해야 합니다.</p></CitationBlock>
      </section>

      <StorageEngineMapReturn current="reth-db-validation" />
    </article>
  );
}
