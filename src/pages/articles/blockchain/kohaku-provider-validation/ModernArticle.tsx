import type { ReactNode } from "react";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import KohakuProviderLocator, { KohakuProviderMapReturn } from "../kohaku-provider/KohakuProviderLocator";
import { kohakuProviderCodeRefs } from "../kohaku-provider/codeRefsReal";
import KohakuValidationViz from "./viz/KohakuValidationViz";

const KOHAKU_SHA = "b4ad096ef738a06f3f7025aa2870875527f9e6c7";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

const MARK = ({ children }: { children: ReactNode }) => (
  <strong className="mr-1 font-mono text-xs text-primary">[{children}]</strong>
);

export default function KohakuProviderValidationArticle({ onCodeRef }: Props) {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6 scroll-mt-20">
        <KohakuProviderLocator current="kohaku-provider-validation" />
        <header className="space-y-3">
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="break-keep text-3xl font-bold tracking-tight">
            Provider bundle을 운영 후보로 올리려면 무엇을 실제로 검증해야 할까요?
          </h2>
        </header>
        <p className="max-w-3xl break-keep text-lg leading-8">
          공통 API가 컴파일되고 정상 요청 한 번이 성공했다는 사실만으로는 부족합니다. 같은 입력에서 값·오류·실제 backend 경로를 대조하고, receipt 대기와 signer 재시도가 만드는 실패까지 확인해야 합니다.
        </p>
        <KohakuValidationViz />
        <p>
          이 글의 기준선은 <strong>0.1.0-alpha.13 · commit b4ad096e</strong>입니다. <MARK>O</MARK>는 고정한 공식 source·README·CHANGELOG, <MARK>A</MARK>는 실험·운영 제안, <MARK>M</MARK>은 대상 환경 측정입니다. 아직 실행한 측정은 없으므로 모든 결과는 <strong>미측정</strong>이고 결정 상태는 <strong>proposed</strong>입니다.
        </p>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">무엇을 누가 기록하고 판정하는지 먼저 정합니다</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs leading-5">
            <thead>
              <tr>
                <th className="border border-border bg-muted/40 px-3 py-3">상태</th>
                <th className="border border-border bg-muted/40 px-3 py-3">권위 있는 기록</th>
                <th className="border border-border bg-muted/40 px-3 py-3">Writer</th>
                <th className="border border-border bg-muted/40 px-3 py-3">실패 증거</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["실험 입력", "Bundle manifest·fixture digest", "검증 harness", "version·chain·block 불일치"],
                ["호출 경로", "adapter·backend·bypass·endpoint receipt", "Provider wrapper", "누락·예상 밖 downgrade"],
                ["기대 결과", "고정 block의 독립 oracle", "reference runner", "value·typed error diff"],
                ["서명·전송", "user approval·nonce·tx hash", "wallet application", "중복 broadcast·승인 누락"],
                ["채택 상태", "ADR·bundle pointer", "서비스 소유 팀", "rollback receipt"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => <td key={cell} className="border border-border px-3 py-3">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <MARK>A</MARK>Provider package는 application의 배포 승인 기록을 소유하지 않습니다. Adapter가 실제 경로를 반환 타입에 넣지 않으므로, 호출 wrapper나 trace가 method별 경로를 기록해야 합니다. Signer approval과 transaction nonce는 wallet application이 별도로 소유합니다.
        </p>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">현재 bundle을 기준선으로 두고 한 축씩 바꿉니다</h2>
        <p>
          <MARK>A</MARK>Baseline은 현재 서비스가 쓰는 package·dependency·endpoint·bypass·signer 구성을 고정한 bundle입니다.
        </p>
        <p>
          Candidate가 alpha.13이라면 package만 바꾸지 않습니다. Node 22 이상 조건, Helios·Colibri·Ethers peer range와 실제 lockfile digest도 함께 고정해야 합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px md:grid-cols-3">
          <div className="bg-background p-4">
            <strong className="text-sm">API candidate</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Provider package와 dependency만 바꾸고 endpoint·policy를 유지합니다.</p>
          </div>
          <div className="bg-background p-4">
            <strong className="text-sm">경로 candidate</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">같은 package에서 bypassLogs 한 축만 바꿔 provenance 차이를 확인합니다.</p>
          </div>
          <div className="bg-background p-4">
            <strong className="text-sm">대기 candidate</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Polling interval·timeout만 바꾸고 inclusion·오류·timer 정리를 대조합니다.</p>
          </div>
        </div>
        <p>
          서로 다른 세 변경을 한 candidate에 넣으면 결과 차이의 원인을 분리하기 어렵습니다. Signer wiring까지 함께 바뀐다면 Provider 실험과 거래 권한 변경을 별도 승인 단위로 나눕니다.
        </p>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">같은 block과 요청을 경로별로 재생합니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">
          {[
            ["01 · 입력 고정", "Chain ID, exact block hash, address·filter, tx hash와 fixture digest를 manifest에 기록합니다."],
            ["02 · 경로 실행", "Raw RPC, Helios 기본, Helios getLogs 우회와 평가 대상 adapter를 각각 실행하고 실제 backend를 기록합니다."],
            ["03 · 값·오류 대조", "Canonical TxLog·receipt·balance·code와 unsupported·timeout·RPC error를 같은 분류로 비교합니다."],
            ["04 · 실패 주입", "Stalled receipt request, reverted receipt, endpoint 오류와 잘못된 bypass를 넣고 중단·timer·후속 poll을 확인합니다."],
          ].map(([title, body]) => (
            <li key={title} className="bg-background p-4">
              <strong>{title}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
        <p>
          <MARK>A</MARK>값이 같아도 요구한 provenance가 다르면 실패로 기록합니다. 반대로 trusted RPC가 정책상 허용된 method라면 “Helios가 아니므로 무조건 실패”로 판정하지 않습니다. 통과 기준은 method별 정책에 있어야 합니다.
        </p>
      </section>

      <section id="receipt-wait" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Receipt 대기는 포함 여부만 확인합니다</h2>
        <p>
          <MARK>O</MARK>alpha.13의 raw·Helios·Colibri 기본값은 100ms polling과 10초 timeout입니다. Shared loop는 한 RPC가 끝난 뒤 다음 interval을 기다리므로 poll이 겹치지 않습니다.
        </p>
        <p>
          전체 timeout에는 stalled RPC 시간이 들어갑니다. Timeout 뒤 helper timer와 후속 poll은 멈추지만, 이미 진행 중인 RPC 자체는 취소하지 못합니다.{" "}
          <CodeViewButton
            label="receipt polling source"
            onClick={() => onCodeRef("kohaku-receipt-wait", kohakuProviderCodeRefs["kohaku-receipt-wait"])}
          />
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          <div className="bg-background p-4">
            <strong className="text-sm">Receipt 있음</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Transaction이 block에 포함됐다는 응답입니다. status=0일 수도 있습니다.</p>
          </div>
          <div className="bg-background p-4">
            <strong className="text-sm">Timeout</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">정해진 시간 안에 receipt를 못 봤다는 뜻입니다. 거래 실패 증거가 아닙니다.</p>
          </div>
          <div className="bg-background p-4">
            <strong className="text-sm">보장하지 않음</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Execution success, confirmations와 finality는 별도 확인이 필요합니다.</p>
          </div>
        </div>
      </section>

      <section id="failure-recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">오류 발견부터 재진입까지 같은 transaction을 중복 전송하지 않습니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">
          {[
            ["발견", "value·error·provenance mismatch"],
            ["격리", "candidate traffic 중지"],
            ["우회", "승인된 이전 bundle 사용"],
            ["복구", "tx hash·nonce로 결과 조회"],
            ["재진입", "새 fixture·receipt 승인"],
          ].map(([title, body]) => (
            <div key={title} className="bg-background p-3">
              <strong className="text-xs">{title}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p>
          <MARK>A</MARK>Rollback은 package version만 내리는 작업이 아닙니다. Dependency lockfile, endpoint 역할, bypass flag, polling option과 signer wiring을 이전 bundle로 함께 돌립니다. 이미 transaction hash를 받은 요청은 다시 서명해 보내지 않고 같은 hash·nonce의 receipt와 chain 상태를 확인합니다.
        </p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">측정 전 결정은 proposed로 남깁니다</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6">
          <p><strong>Status:</strong> proposed</p>
          <p className="mt-2"><strong>현재 출발점:</strong> 현재 서비스 bundle을 baseline으로 기록하고 alpha.13 candidate를 격리된 환경에서 비교합니다.</p>
          <p className="mt-2"><strong>채택 조건:</strong> Critical method의 값·typed error·provenance policy와 receipt failure fixture, signer 중복 방지, rollback이 모두 통과합니다.</p>
          <p className="mt-2"><strong>기각 조건:</strong> Silent downgrade, wrong-block 결과, timeout을 실패로 오인, 중복 broadcast, in-flight RPC를 취소됐다고 기록, 안전한 rollback 부재 중 하나라도 나타납니다.</p>
          <p className="mt-2"><strong>결론이 뒤집히는 조건:</strong> Provider release·peer dependency·Helios capability·서비스의 method trust policy와 transaction finality 요구가 바뀝니다.</p>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 구현과 아직 없는 측정 결과를 분리합니다</h2>
        <CitationBlock
          source="ethereum/kohaku provider · 0.1.0-alpha.13"
          citeKey={1}
          type="code"
          href={"https://github.com/ethereum/kohaku/tree/" + KOHAKU_SHA + "/packages/provider"}
        >
          <p><MARK>O</MARK>Provider interface, Helios getLogs 우회, raw 정규화와 receipt waiting 구현을 고정했습니다.</p>
          <p><strong>범위:</strong> 이 source snapshot의 동작이며 target endpoint·chain·wallet의 운영 결과는 아닙니다.</p>
        </CitationBlock>
        <CitationBlock
          source="Kohaku provider CHANGELOG · alpha.13"
          citeKey={2}
          type="code"
          href={"https://github.com/ethereum/kohaku/blob/" + KOHAKU_SHA + "/packages/provider/CHANGELOG.md"}
        >
          <p><MARK>O</MARK>Configurable polling, stalled request를 포함한 deadline, timer 정리, in-flight RPC 취소 불가와 inclusion-only 경계를 확인했습니다.</p>
          <p><MARK>M</MARK>대상 환경에서 parity·latency·timeout·rollback을 실행한 결과는 아직 없습니다.</p>
        </CitationBlock>
      </section>

      <KohakuProviderMapReturn current="kohaku-provider-validation" />
    </article>
  );
}
