import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation-block";
import RailgunLocator, { RailgunMapReturn } from "../railgun/RailgunLocator";
import RailgunValidationViz from "./viz/RailgunValidationViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RailgunLocator current="railgun-validation" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">계약·회로·키·wallet engine을 바꿔도 기존 note와 이중 지출 방지가 유지되는지 어떻게 검증합니까?</h2>
        </div>
        <RailgunValidationViz />
        <p className="text-lg leading-8">
          <Label>A</Label>같은 on-chain 시작 상태와 note fixture를 baseline과 candidate에 독립 재생합니다. 정상 송금뿐 아니라 사용한 nullifier, 잘못된 root, chain·암호문·proof 변조, event sync 중단과 client rollback에서 contract state와 wallet view가 같아야 합니다.
        </p>
        <p>
          출발점은 <Link to="/cs/blockchain/railgun#state">tree와 nullifier 상태</Link>, <Link to="/cs/blockchain/railgun#circuit">회로가 확인하는 관계</Link>, <Link to="/cs/blockchain/railgun#artifact">proof와 boundParams 결속</Link>, <Link to="/cs/blockchain/railgun#contract">계약의 원자적 상태 전이</Link>와 <Link to="/cs/blockchain/railgun#visibility">보이는 정보의 경계</Link>입니다. 여기서는 메커니즘을 반복하지 않고 변경 채택 증거를 정합니다.
        </p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 입력</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[58rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">고정 영역</th><th className="px-3 py-3">기록할 값</th><th className="px-3 py-3">빠지면 생기는 혼동</th></tr></thead>
            <tbody>{[
              ["Chain", "chain ID·fork·test block range·RPC digest", "서로 다른 state 비교"],
              ["Contract", "address·proxy implementation·source commit·deployment tx", "source와 실행 bytecode 불일치"],
              ["Circuit", "source commit·input/output 수·wasm/zkey/vkey digest", "proof relation·key 불일치"],
              ["Engine", "wallet SDK/engine version·config·start block", "event sync·note selection 차이"],
              ["Fixture", "note preimage·leaf index/path·root·expected N·outputs", "입력 note 차이"],
              ["Submission", "Broadcaster/self-sign·fee quote·expiry·gas regime", "proof와 제출 실패 혼동"],
              ["Runtime", "OS·CPU·memory·seed·clock·fault point", "proving·recovery 비용 차이"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p><Label>O</Label>계약 기준은 commit <code>30da515</code>, 회로 기준은 commit <code>0aa2d13</code>에 고정합니다. 실제 deployment가 이 source와 key를 사용한다는 사실은 explorer 설명이 아니라 runtime bytecode·implementation slot·verifying key와 artifact digest로 다시 확인해야 합니다.</p>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">상태 소유권</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[58rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 writer</th><th className="px-3 py-3">다른 구성요소의 역할</th></tr></thead>
            <tbody>{[
              ["Commitment tree·root history", "Railgun contract", "Wallet은 events에서 mirror·path를 재구성"],
              ["Used nullifier", "Railgun contract", "Circuit은 N의 식을 증명, Broadcaster는 제출만 수행"],
              ["Note secret·viewing data", "사용자 wallet", "Contract·Broadcaster가 원문을 소유하지 않음"],
              ["Proof relation", "Pinned circuit·zkey/vkey", "Engine은 witness와 proof 생성, contract는 verify"],
              ["Submission status", "EVM transaction receipt", "Broadcaster 응답은 final state가 아님"],
              ["Wallet balance view", "Pinned engine이 on-chain events에서 계산", "UI cache는 authoritative writer가 아님"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>Wallet DB와 contract state를 서로 양방향 수정하게 만들면 안 됩니다. Wallet은 on-chain events를 읽어 local tree와 note view를 다시 만들 수 있어야 하며, local cache를 기준으로 nullifier를 되살리면 이중 지출 판정이 깨집니다.</p>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">가장 작은 기준선</h2>
        <p>Tree 0의 leaf 23에 값 10인 note를 만들고 root R100을 고정합니다. Private transfer로 값 6인 수신 note와 값 4인 거스름 note를 만든 뒤 아래 세 receipt를 같은 run ID로 남깁니다.</p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Proof receipt", "R100 · H(boundParams) · N₂₃ · C₆ · C₄ · verify PASS"],
            ["Contract receipt", "tx hash · Nullified · Transact · new root · revert reason"],
            ["Wallet receipt", "spent C₁₀ · received/decrypted note · balance · sync cursor"],
          ].map(([title, value]) => <div key={title} className="min-w-0 bg-background p-4"><strong className="text-xs">{title}</strong><code className="mt-2 block break-words text-[10px] leading-5 text-primary">{value}</code></div>)}
        </div>
        <p><Label>A</Label>이 receipt는 upstream이 그대로 제공한다고 주장하는 형식이 아닙니다. Contract event, engine log, proof metadata와 independent expected vector를 실험 harness가 묶어야 합니다.</p>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">부정 입력과 중단 실험</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[64rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">경계</th><th className="px-3 py-3">한 번에 바꿀 입력</th><th className="px-3 py-3">기대 결과</th><th className="px-3 py-3">남으면 안 되는 상태</th></tr></thead>
            <tbody>{[
              ["Replay", "이미 사용한 N₂₃ 재제출", "contract revert·wallet spent 유지", "새 commitment·잔액 증가"],
              ["Root", "rootHistory에 없는 root", "Invalid Merkle Root", "nullifier used 표시"],
              ["Balance", "private 10→6+5 witness", "proof 생성 또는 verify 실패", "on-chain 호출 성공"],
              ["Domain", "chain ID·adapt sender 하나 변경", "validateTransaction 실패", "다른 chain replay"],
              ["Ciphertext", "ciphertext 내용 또는 개수 변경", "bound hash/proof 또는 length 실패", "수신자가 못 여는 accepted note"],
              ["Key", "다른 vkey·zkey·input/output shape", "Key not set·proof 실패", "부분 state update"],
              ["Sync restart", "Nullified와 Transact event 처리 사이 종료", "재시작 후 event 순서 재생", "phantom input·output 누락"],
              ["Submit restart", "proof 뒤 Broadcaster 전송 전 종료", "tx receipt 확인 후 한 번만 재시도", "같은 intent 중복 제출"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>한 run에서 source, key, engine과 fault point를 동시에 바꾸지 않습니다. 첫 divergence가 proof 생성인지 contract 검증인지 wallet 동기화인지 찾을 수 없기 때문입니다.</p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 판정</h2>
        <ul className="space-y-3 pl-5 text-sm leading-7">
          <li>Candidate가 on-chain root와 nullifier는 맞지만 wallet balance를 다르게 만들면 state mirror 실패입니다.</li>
          <li>잘못된 proof는 거절하지만 ciphertext 변경을 허용해 수신자가 note를 못 찾으면 artifact binding 실패입니다.</li>
          <li>Broadcaster timeout을 곧바로 transaction 실패로 처리해 같은 intent를 중복 제출하면 submission idempotency 실패입니다.</li>
          <li>Client rollback 뒤 현재 root·event cursor·spent note를 읽지 못하면 호환성 실패입니다.</li>
          <li>Proof 성공을 IP·timing·anonymity-set 안전성으로 기록하면 evidence scope 실패입니다.</li>
        </ul>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">격리·되돌리기·재진입</h2>
        <ol className="not-prose grid gap-3 text-sm leading-6 sm:grid-cols-4">
          {[
            ["1 · 격리", "Candidate proof 생성과 제출을 멈추고 manifest·calldata·events·local DB를 보존합니다."],
            ["2 · client rollback", "이전 호환 engine·circuit artifact로 되돌립니다. On-chain state는 되감지 않습니다."],
            ["3 · state rebuild", "고정한 start block부터 events를 재생해 tree·nullifier·note view와 cursor를 대조합니다."],
            ["4 · 재진입", "정상·replay·mutation·restart fixture가 다시 같을 때 제한된 test traffic부터 엽니다."],
          ].map(([title, body]) => <li key={title} className="border-l-2 border-primary/45 pl-3"><strong className="block text-xs">{title}</strong><span className="mt-2 block break-keep text-xs text-muted-foreground">{body}</span></li>)}
        </ol>
        <p>이미 실행된 contract upgrade나 기록된 nullifier·commitment를 일반 배포처럼 되돌릴 수 있다고 가정하면 안 됩니다. 이전 contract implementation으로 내리는 일이 현재 storage layout·verifying key·note schema와 호환되지 않으면 freeze, forward fix 또는 명시적 migration이 필요합니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">측정 순서</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1 · 정합성", "root·N·C·proof·events·wallet balance"],
            ["2 · 실패 격리", "typed reject·no partial state·idempotency"],
            ["3 · 복구", "resync·rollback·reentry time"],
            ["4 · 비용", "prove·sync·submit p95·RSS·gas·bytes"],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-xs">{title}</strong><span className="mt-2 block break-keep text-[10px] leading-5 text-muted-foreground">{body}</span></div>)}
        </div>
        <p><Label>M</Label>대상 장비와 실제 deployment에서는 아직 측정하지 않았습니다. 공식 문서의 “최대 30초” 안내를 이 환경의 proof latency로 사용하지 않습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">결정</h2>
        <p>현재 상태는 <strong>proposed</strong>입니다. 모든 정상·부정 fixture, wallet rebuild와 호환 rollback이 기준선과 같고 그 뒤의 비용이 운영 목표를 만족할 때만 accepted로 바꿉니다.</p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <div className="bg-background p-4"><strong className="text-xs text-primary">채택 조건</strong><p className="mt-2 text-xs leading-6 text-muted-foreground">Runtime bytecode와 source·key 일치, state/proof fixture parity, event rebuild, 중복 제출 방지, 호환 rollback과 실행 가능한 runbook</p></div>
          <div className="bg-background p-4"><strong className="text-xs text-amber-700 dark:text-amber-300">결론을 뒤집는 조건</strong><p className="mt-2 text-xs leading-6 text-muted-foreground">기존 note 지출 불가, replay 수용, ciphertext 치환, wallet balance divergence, unsafe storage migration 또는 되돌릴 artifact 부재</p></div>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거와 미확인값</h2>
        <CitationBlock source="Railgun-Privacy/contract · 30da515" citeKey={1} type="code" href="https://github.com/Railgun-Privacy/contract/tree/30da51509975013720529ec146c3cecc0f87088b">
          <p><Label>O</Label>Contract transaction 구조, historical root, boundParams, proof 검증, nullifier와 commitment 상태 전이의 고정 source입니다.</p>
          <p><strong>범위:</strong> 실제 chain deployment·proxy implementation·key가 이 source와 같다는 사실은 별도 runtime 검증 대상입니다.</p>
        </CitationBlock>
        <CitationBlock source="Railgun-Privacy/circuits-v2 · 0aa2d13" citeKey={2} type="code" href="https://github.com/Railgun-Privacy/circuits-v2/tree/0aa2d13763a9fcfbb7b7ea9c02e004e71f1394bb">
          <p><Label>O</Label>JoinSplit·Merkle proof·nullifier·input/output balance의 고정 circuit source입니다.</p>
          <p><strong>범위:</strong> 실제 wasm·zkey·vkey artifact가 이 source에서 생성됐다는 사실은 digest·build receipt로 확인해야 합니다.</p>
        </CitationBlock>
        <CitationBlock source="RAILGUN Developer Guide · UX Private Transactions" citeKey={3} href="https://docs.railgun.org/developer-guide/wallet/transactions/ux-private-transactions">
          <p><Label>O</Label>Gas estimate, Broadcaster fee, proof 생성, populate, submit의 권장 순서와 fee expiry 경계를 설명합니다.</p>
          <p><strong>범위:</strong> Current 문서의 UX 설명이며 대상 환경의 latency·성공률·복구 결과는 제공하지 않습니다.</p>
        </CitationBlock>
        <p><Label>?</Label>실제 deployment address·proxy implementation, circuit artifact digest, wallet engine version, start block, Broadcaster policy, 대상 장비의 proof·sync·submit latency와 recovery 목표는 아직 고정되지 않았습니다.</p>
      </section>

      <RailgunMapReturn current="railgun-validation" />
    </article>
  );
}
