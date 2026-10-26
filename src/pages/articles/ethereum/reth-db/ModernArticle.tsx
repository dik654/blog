import { CitationBlock } from "@/components/ui/citation-block";
import StorageEngineLocator, { StorageEngineMapReturn } from "../lsm-tree/StorageEngineLocator";
import RethStorageV2Viz from "./viz/RethStorageV2Viz";

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <StorageEngineLocator current="reth-db" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">Reth는 서로 다른 세 저장소를 어떻게 한 시점의 체인처럼 보여 줄까요?</h2>
        </div>
        <RethStorageV2Viz />
        <p className="text-lg leading-8">실행이 끝난 블록 1,000에는 순서대로 읽기 좋은 영수증과 변경 이력, 과거 상태를 찾기 위한 색인, 현재 상태와 마지막 처리 지점이 함께 생깁니다. Storage V2는 이 값을 한 엔진에 모두 넣지 않고 static files, RocksDB, MDBX로 나눕니다.</p>
        <p>중요한 것은 세 저장소가 하나의 분산 트랜잭션으로 묶인다는 설명이 아닙니다. 정상 저장은 static files를 먼저 확정하고 RocksDB batch를 반영한 다음 MDBX transaction을 마지막에 commit합니다. 따라서 독자에게 공개할 체인의 가시 지점은 마지막 MDBX commit보다 앞설 수 없습니다.</p>
      </section>

      <section id="routing" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">StorageSettings가 값의 수명과 조회 방식에 따라 목적지를 고릅니다</h2>
        <div className="not-prose grid gap-px bg-border p-px md:grid-cols-3">
          {[
            ["Static files", "순차적이고 오래 유지되는 기록", "receipts · transaction senders · account/storage changesets"],
            ["RocksDB", "과거 값을 찾는 색인", "transaction hash numbers · account/storage history"],
            ["MDBX", "현재 상태와 공개 지점", "canonical state · headers/metadata · stage checkpoints"],
          ].map(([title, role, examples]) => (
            <div key={title} className="bg-background p-4">
              <strong className="text-sm">{title}</strong>
              <p className="mt-2 text-xs font-semibold leading-5">{role}</p>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{examples}</p>
            </div>
          ))}
        </div>
        <p>Reth v2.8.1의 기본 <code>StorageSettings::base()</code>는 V2입니다. V1은 모든 자료를 MDBX에 두지만, V2는 위의 여섯 종류를 static files와 RocksDB로 옮깁니다. 이것은 “큰 자료는 파일, 작은 자료는 DB” 같은 크기 규칙이 아니라 쓰기 방식, 순차 범위, 과거 조회와 복구 책임을 나눈 결과입니다.</p>
      </section>

      <section id="schema" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Typed table은 Rust 타입과 정렬된 disk bytes 사이의 계약입니다</h2>
        <div className="not-prose border-y border-border py-4">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.2fr)] sm:items-center">
            <div className="border border-border p-3"><span className="text-[9px] font-bold text-muted-foreground">LOGICAL RECORD</span><strong className="mt-2 block text-sm">BlockNumber(1000) → Header</strong></div>
            <span className="hidden font-black text-primary sm:block">Encode →</span>
            <div className="border border-primary p-3"><span className="text-[9px] font-bold text-muted-foreground">PERSISTED ORDER</span><strong className="mt-2 block font-mono text-sm">key bytes · value bytes</strong><p className="mt-1 text-[10px] text-muted-foreground">NAME · DUPSORT · Key · Value · codec</p></div>
          </div>
        </div>
        <p><code>Table</code>은 이름, 중복 정렬 여부, key와 value 타입을 선언하고 각 타입의 <code>Encode</code>와 <code>Decode</code>가 실제 bytes를 정합니다. Cursor가 lower bound와 range를 올바르게 걷으려면 byte 정렬이 논리적인 key 순서와 같아야 합니다.</p>
        <p>Compile-time 타입만으로 이미 디스크에 기록된 bytes의 호환성이 생기지는 않습니다. Codec이나 정렬을 바꾸면 기존 자료를 어떤 순서로 읽고 옮길지 별도의 migration과 검증이 필요합니다.</p>
      </section>

      <section id="commit" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정상 저장은 static files → RocksDB → MDBX 순서입니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3">
          <li className="bg-background p-4"><strong className="text-primary">01 · Static files</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Pending segment를 finalize하고 필요한 경우 file을 동기화합니다.</p></li>
          <li className="bg-background p-4"><strong className="text-primary">02 · RocksDB</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">History와 lookup index의 pending write batches를 commit합니다.</p></li>
          <li className="bg-background p-4"><strong className="text-primary">03 · MDBX</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Canonical state와 stage checkpoint가 든 transaction을 마지막에 commit합니다.</p></li>
        </ol>
        <p>이 순서는 앞선 저장소가 MDBX보다 잠시 앞서는 것을 허용하지만, MDBX만 앞서는 정상 경로는 만들지 않습니다. Unwind에서는 반대로 MDBX를 먼저 되돌리고 RocksDB와 static files를 뒤따르게 해 독자가 이전 canonical frontier보다 새로운 과거 자료를 보지 않게 합니다.</p>
        <p>따라서 “블록 1,000이 저장됐다”는 말은 저장소별 write가 시작됐다는 뜻이 아니라, 마지막 MDBX commit으로 그 지점이 독자에게 보이게 됐다는 뜻으로 구분해야 합니다. Stable-media 내구성은 각 backend의 sync 설정과 장치 계약을 별도로 확인합니다.</p>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">중간에 멈추면 앞서 간 자료를 MDBX의 보이는 tip에 맞춥니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Static files가 앞섬", "MDBX의 highest uninterrupted block까지 잘라냅니다."],
            ["RocksDB가 앞섬", "MDBX stage checkpoint를 기준으로 stale history/index를 지웁니다."],
            ["Static files가 뒤처짐", "필요한 immutable history가 없으므로 정상으로 가장하지 않고 오류로 중단합니다."],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{body}</p></div>)}
        </div>
        <p>예를 들어 static files와 RocksDB에 블록 1,000 자료가 반영된 뒤 MDBX commit 전에 process가 종료되면, 재시작 시 공개 지점은 여전히 999입니다. 1,000 자료는 새 canonical state로 공개되지 않고 ahead data로 판정되어 잘라 내거나 재구축합니다.</p>
        <p>반대로 RocksDB가 MDBX checkpoint보다 뒤라면 단순 prune으로 채울 수 없습니다. Pipeline unwind와 rebuild가 필요합니다. Ahead와 behind는 같은 “불일치”가 아니므로 복구 방향도 달라집니다.</p>
      </section>

      <section id="read" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">독자는 memory head를 먼저 고정한 뒤 disk snapshot을 엽니다</h2>
        <p>Reth의 consistent provider는 먼저 in-memory canonical head를 capture하고 그다음 database provider snapshot을 만듭니다. 순서를 바꾸면 DB snapshot을 연 직후 memory state가 flush되어 두 범위 사이에 빈 구간이 생길 수 있습니다.</p>
        <p>조회할 때는 겹치는 최신 범위를 memory가 우선하고, persistent 범위는 MDBX가 보이는 tip 안에서 static files와 RocksDB를 함께 사용합니다. Storage route가 세 갈래여도 한 query가 서로 다른 chain frontier를 섞지 않도록 snapshot 순서와 visible tip을 고정하는 이유입니다.</p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">설명은 Reth v2.8.1의 실제 source 순서에 고정했습니다</h2>
        <CitationBlock source="Reth v2.8.1 · StorageSettings" citeKey={1} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/storage/db-api/src/models/metadata.rs"><p><b>확인한 범위:</b> V1과 V2의 backend route, base 설정과 canonical hashed state입니다.</p><p><b>확대하지 않은 범위:</b> 이후 release나 custom build가 같은 route라고 가정하지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · DatabaseProvider commit" citeKey={2} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/storage/provider/src/providers/database/provider.rs"><p><b>확인한 범위:</b> 정상·unwind commit order, static-file finalize, RocksDB batch, MDBX commit과 startup static-file 조정입니다.</p><p><b>확대하지 않은 범위:</b> 세 저장소가 하나의 cross-store atomic transaction이라는 뜻으로 읽지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · RocksDB invariants" citeKey={3} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/storage/provider/src/providers/rocksdb/invariants.rs"><p><b>확인한 범위:</b> MDBX stage checkpoint와 RocksDB progress를 비교해 ahead를 prune하고 behind를 rebuild 대상으로 분류하는 규칙입니다.</p><p><b>확대하지 않은 범위:</b> 대상 장비의 복구 시간이나 성능은 아직 측정하지 않았습니다.</p></CitationBlock>
      </section>

      <section className="not-prose border-y border-border py-5" aria-labelledby="reth-storage-review">
        <p className="text-[10px] font-bold text-primary">그림 없이 다시 설명하기</p>
        <h2 id="reth-storage-review" className="mt-2 text-xl font-bold">블록 1,000의 저장과 중단을 세 문장으로 추적해 보세요</h2>
        <ol className="mt-4 grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3">
          <li className="bg-background p-4"><strong className="block text-xs text-primary">01 · 분류</strong><span className="mt-2 block">어떤 자료가 static files, RocksDB, MDBX로 가며 왜 나뉠까요?</span></li>
          <li className="bg-background p-4"><strong className="block text-xs text-primary">02 · 공개</strong><span className="mt-2 block">왜 MDBX가 마지막에 commit되고 독자의 visible tip이 될까요?</span></li>
          <li className="bg-background p-4"><strong className="block text-xs text-primary">03 · 복구</strong><span className="mt-2 block">RocksDB가 1,000, MDBX가 999일 때 무엇을 공개하고 어떻게 맞출까요?</span></li>
        </ol>
      </section>

      <StorageEngineMapReturn current="reth-db" />
    </article>
  );
}
