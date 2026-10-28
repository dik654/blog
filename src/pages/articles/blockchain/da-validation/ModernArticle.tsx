import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation-block";
import DataAvailabilityLocator, { DataAvailabilityMapReturn } from "../da-theory/DataAvailabilityLocator";
import DataAvailabilityValidationViz from "./viz/DataAvailabilityValidationViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <DataAvailabilityLocator current="da-validation" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">데이터 가용성 변경이 숨김과 잘못된 조각을 구분하고 안전하게 되돌아오는지 어떻게 검증합니까?</h2>
        </div>
        <DataAvailabilityValidationViz />
        <p className="text-lg leading-8">
          <Label>A</Label>Base와 candidate에 같은 원본 D0~D3, 확장 조각, peer 응답, deadline과 fault schedule을 독립 재생합니다. 조각 진위, 인코딩, 가용성 판정과 실제 복원, restart와 rollback이 같을 때만 성능을 비교합니다.
        </p>
        <p>
          출발점은 <Link to="/cs/blockchain/da-theory#separation">진위·인코딩·가용성의 분리</Link>, <Link to="/cs/blockchain/da-theory#eip4844">EIP-4844의 전체 수신 경계</Link>, <Link to="/cs/blockchain/da-theory#peerdas">PeerDAS의 열 단위 표본</Link>, <Link to="/cs/blockchain/da-theory#celestia">Celestia의 2차원 확장</Link>과 <Link to="/cs/blockchain/da-theory#sampling">표본 확률의 전제</Link>입니다. 이 글은 메커니즘을 다시 설명하지 않고 변경 채택에 필요한 증거를 정합니다.
        </p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 입력</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[54rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">고정 영역</th><th className="px-3 py-3">기록할 값</th><th className="px-3 py-3">빠지면 생기는 혼동</th></tr></thead>
            <tbody>{[
              ["Protocol", "EIP·fork·chain ID·spec tag·client commit", "서로 다른 규칙 비교"],
              ["Encoding", "cell 수·행/열 layout·field·index order·threshold", "복원 결과 차이"],
              ["Commitment", "setup digest·proof scheme·versioned-hash rule", "진위 검사 차이"],
              ["Network", "custody·peer selection·deadline·retry·clock", "가용성과 재시도 혼동"],
              ["Corpus", "D0~D3·encoded pieces·commitment·proof·expected root", "입력 자료 차이"],
              ["Runtime", "OS·CPU·memory·NIC·seed·fault schedule", "순서·timeout·비용 차이"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          <Label>O</Label>Ethereum 기준선은 consensus-specs v1.6.1의 Fulu DAS 규격과 EIP-4844·EIP-7594를 사용합니다. Celestia 비교는 celestia-app v10.5.0에 고정합니다. 서로 다른 프로토콜을 한 candidate처럼 직접 성능 비교하지 않고, 같은 프로토콜의 구현·설정 변경만 paired run으로 대조합니다.
        </p>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">상태 소유권</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[52rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 writer</th><th className="px-3 py-3">검증기가 읽을 증거</th></tr></thead>
            <tbody>{[
              ["Blob·share 원문", "Publisher·block producer", "content digest·block/root reference"],
              ["Extended pieces", "Pinned encoder", "profile·index·encoded digest"],
              ["Commitment·proof", "Commitment producer", "setup/version·verify outcome"],
              ["Custody assignment", "Protocol rule·node identity", "assigned column/share set"],
              ["Peer response", "Network client", "peer·index·deadline·bytes·reason"],
              ["Availability outcome", "Availability verifier", "typed checks·reconstruction root"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          실험 collector는 이 상태를 읽어 run receipt를 만들 뿐 custody assignment나 availability outcome을 고치면 안 됩니다. 두 verifier가 같은 최종 상태를 쓰게 하면 어느 구현이 판정했는지 추적할 수 없습니다.
        </p>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정상 기준선</h2>
        <p>
          설명용 (8,4) fixture는 원본 D0~D3과 복원용 P4~P7을 만들고, 서로 다른 peer가 D1·P4·P6·P7을 마감 전에 돌려줍니다. 네 조각의 proof가 모두 통과하고, 복원한 D0~D3의 digest가 원본과 같아야 합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Piece receipt", "index · peer · proof PASS · deadline PASS"],
            ["Reconstruction receipt", "valid pieces 4 · decoded root = expected"],
            ["Outcome receipt", "authenticity PASS · encoding PASS · availability PASS"],
          ].map(([title, value]) => <div key={title} className="min-w-0 bg-background p-4"><strong className="text-xs">{title}</strong><code className="mt-2 block break-words text-[10px] leading-5 text-primary">{value}</code></div>)}
        </div>
        <p><Label>A</Label>이 receipt는 특정 client가 이미 제공한다고 주장하는 형식이 아닙니다. 실험 harness가 metric·event·log에서 같은 run ID로 묶어야 할 최소 증거입니다.</p>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">장애별 실험</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[60rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">경계</th><th className="px-3 py-3">한 번에 바꿀 입력</th><th className="px-3 py-3">기대 결과</th><th className="px-3 py-3">금지할 잔류 상태</th></tr></thead>
            <tbody>{[
              ["Withholding", "복원 임계값 아래 응답", "UNAVAILABLE·reconstruction 실패", "AVAILABLE receipt"],
              ["Deadline", "올바른 조각의 늦은 응답", "TIMEOUT·late 분리", "다음 run에 재사용"],
              ["Authenticity", "bad KZG/Merkle proof", "INVALID_PROOF", "decoder 입력"],
              ["Encoding", "wrong parity·profile", "ENCODING_FAILURE", "복원 성공 오판"],
              ["Identity", "wrong index·duplicate response", "INDEX/DUPLICATE rejection", "coverage 과다 계산"],
              ["Restart", "custody 저장·요청 중 process 중단", "재시작 뒤 clean replay", "중복 receipt·custody gap"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>한 run에서는 한 경계만 바꿉니다. 인코더, setup, peer topology와 deadline을 동시에 바꾸면 첫 divergence를 찾을 수 없습니다.</p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 판정</h2>
        <ul className="space-y-3 pl-5 text-sm leading-7">
          <li>Bad proof를 decoder에 넣거나 wrong parity를 network timeout으로 기록하면 correctness 실패입니다.</li>
          <li>Duplicate response를 새 coverage처럼 세거나 같은 peer 경로를 독립 표본처럼 세면 availability 실패입니다.</li>
          <li>종료 뒤 inflight request, buffer, timer와 custody lease가 기준선으로 돌아오지 않으면 cleanup 실패입니다.</li>
          <li>Collector가 없을 때만 통과하거나 근거 없는 합성 outcome을 만들면 observability 실패입니다.</li>
        </ul>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">격리·Rollback·재진입</h2>
        <ol className="not-prose grid gap-3 text-sm leading-6 sm:grid-cols-4">
          {[
            ["1 · 격리", "Candidate의 gossip·request serving과 availability writer를 중지하고 증거를 보존합니다."],
            ["2 · Rollback", "Binary·config·setup·layout·custody rule을 기준선 digest로 되돌립니다."],
            ["3 · 재생", "정상·숨김·bad proof·wrong parity·duplicate·restart fixture를 다시 실행합니다."],
            ["4 · 재진입", "판정·복원 root와 자원 counter가 기준선과 같을 때만 트래픽을 엽니다."],
          ].map(([title, body]) => <li key={title} className="border-l-2 border-primary/45 pl-3"><strong className="block text-xs">{title}</strong><span className="mt-2 block break-keep text-xs text-muted-foreground">{body}</span></li>)}
        </ol>
        <p>Process가 다시 떠 있다는 사실만으로 복구가 끝나지 않습니다. 실패 fixture가 다시 거절되고 이전 run의 표본·timer·custody 상태가 남지 않았다는 증거가 필요합니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">측정 순서</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1 · 정합성", "typed outcome·proof·decoded root"],
            ["2 · 자원 경계", "inflight·buffer·custody bytes·RSS"],
            ["3 · 복구", "restart·rollback·재진입 시간"],
            ["4 · 비용", "bandwidth·verify CPU·decode CPU·p95"],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-xs">{title}</strong><span className="mt-2 block break-keep text-[10px] leading-5 text-muted-foreground">{body}</span></div>)}
        </div>
        <p><Label>M</Label>현재 대상 환경에서는 위 수치를 측정하지 않았습니다. 따라서 candidate의 성능이나 복구 우위를 주장하지 않습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">결정</h2>
        <p>현재 상태는 <strong>proposed</strong>입니다. 모든 fixture의 typed outcome과 복원 root, cleanup, restart와 rollback이 같고 그 뒤의 비용이 운영 목표를 만족할 때만 accepted로 바꿉니다.</p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <div className="bg-background p-4"><strong className="text-xs text-primary">채택 조건</strong><p className="mt-2 text-xs leading-6 text-muted-foreground">모든 fixture parity, bounded resource, rollback 재통과, source가 있는 outcome과 운영자가 실행할 수 있는 runbook</p></div>
          <div className="bg-background p-4"><strong className="text-xs text-amber-700 dark:text-amber-300">결론을 뒤집는 조건</strong><p className="mt-2 text-xs leading-6 text-muted-foreground">잘못된 AVAILABLE 판정, duplicate coverage, 잔류 custody·timer, 안전한 rollback 부재 또는 지원하지 않는 protocol·setup 조합</p></div>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거와 미측정값</h2>
        <CitationBlock source="Ethereum consensus-specs v1.6.1 · Fulu DAS core" citeKey={1} type="code" href="https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/fulu/das-core.md">
          <p><Label>O</Label>Data column, custody, sampling과 reconstruction의 기준 규격입니다.</p>
          <p><b>범위:</b> 대상 client의 자원 사용량·복구 시간과 운영 결과는 제공하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock source="Celestia App v10.5.0 · Data square layout" citeKey={2} type="code" href="https://github.com/celestiaorg/celestia-app/blob/v10.5.0/specs/src/data_square_layout.md">
          <p><Label>O</Label>Celestia의 2차원 data-square layout을 비교할 때 사용하는 고정된 공식 자료입니다.</p>
          <p><b>범위:</b> PeerDAS와 같은 fixture로 직접 성능 비교할 근거가 아니며 대상 환경의 복구 결과도 제공하지 않습니다.</p>
        </CitationBlock>
        <p><Label>?</Label>실제 client commit, peer topology, NIC·CPU, production deadline, custody 저장 방식과 RTO는 아직 정해지지 않았습니다. 이 값이 없으므로 자동 채택이나 성능 우위를 결론 내리지 않습니다.</p>
      </section>

      <DataAvailabilityMapReturn current="da-validation" />
    </article>
  );
}
