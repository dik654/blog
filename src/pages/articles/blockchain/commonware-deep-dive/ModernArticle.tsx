import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { commonwareTree } from "./fileTrees";
import CommonwareOverviewLocator, { CommonwareOverviewMapReturn } from "./CommonwareOverviewLocator";
import CommonwareOverviewFlowViz from "./viz/ModernCommonwareOverviewViz";

const owners = [
  ["Runtime Context", "작업과 자원의 생애", "하위 context, 연결, 난수 공급원과 각 실행 주체의 범위를 만듭니다."],
  ["Application actor", "블록 원문과 유효성", "블록을 만들고 hash하며, indexer에서 원문을 읽어 true 또는 false를 반환합니다."],
  ["Indexer", "블록·인증서 조회", "PutBlock·GetBlock·PutFinalization 요청에 각각 응답합니다."],
  ["Simplex", "Digest 순서와 최종 확정", "Application이 건넨 digest를 proposal payload로 사용합니다."],
  ["Authenticated P2P", "합의 메시지 전달", "Vote·certificate·resolver 메시지를 인증된 peer 사이에 전달합니다."],
] as const;

const failures = [
  ["PutBlock → Success(false)", "Block 보관 확인 실패", "Digest를 Simplex proposal로 반환하지 않음"],
  ["GetBlock → Success(false)", "Digest에 해당하는 원문 없음", "Application이 verify=false 반환"],
  ["Indexer stream send·recv 실패", "외부 보관 서비스 연결", "예제는 expect로 중단하며 복구 정책을 제공하지 않음"],
  ["PutFinalization → Success(false)", "Certificate 기록 확인 실패", "예제는 false를 log하지만 retry·보상은 구현하지 않음"],
  ["Simplex finalization 생성", "Consensus 순서 확정", "별도 application state 실행·client success까지 증명하지 않음"],
] as const;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <CommonwareOverviewLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">블록 원문과 digest, finalization은 어디에서 만나는가</h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            분산 시스템의 모든 기능을 한 프레임워크가 소유하면 시작은 쉽지만, 합의·통신·저장 방식을 바꿀 때 경계가 흐려질 수 있습니다. Commonware는 여러 기본 부품을 조립하는 방식을 택합니다. 그렇다면 실제 프로그램에서는 누가 블록 원문을 보관하고, 누가 digest에 합의하며, 두 상태가 연결됐다는 사실을 무엇으로 확인합니까?
          </p>
        </div>
        <CommonwareOverviewFlowViz />
        <p className="text-lg leading-8">
          Commonware v2026.9.0의 bridge 예제에서는 <strong>Application이 블록 원문을 indexer에 먼저 보내고 Success(true)를 받은 뒤에만 digest를 Simplex에 넘깁니다.</strong> 검증할 때는 digest로 블록 원문을 다시 읽으며, finalization certificate도 별도 요청으로 indexer에 기록합니다. 합의 engine이 블록 원문과 저장 상태까지 자동으로 소유하는 구조가 아닙니다.
        </p>
        <p>
          이 글은 Commonware 전체 crate를 하나씩 소개하지 않습니다. Runtime·Application·Indexer·Simplex·인증 P2P가 만나는 bridge 예제 한 경로만 추적합니다. Simplex 내부의 vote와 certificate는 <Link to="/cs/blockchain/commonware-simplex#overview">다음 글</Link>에서 확대합니다.
        </p>
        <ContentBoundary article="commonware-primitives-simplex-storage" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">숫자 42가 든 블록 하나</h2>
        <p>
          Application이 임의 숫자를 담는 분기를 골랐고 그 값이 42였다고 가정하겠습니다. 이 값은 설명을 위한 가정이며, 실제 코드는 Runtime Context의 난수 공급원에서 값을 얻습니다. Application은 <code>Random(42)</code>를 encode한 뒤 그 byte 배열의 hash를 계산합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="설명용 Random 블록과 실제 코드 필드의 대응">
          <div className="min-w-0 bg-background p-4">
            <span className="font-mono text-[9px] font-black text-muted-foreground">블록 원문</span>
            <strong className="mt-2 block break-keep text-sm">Random(42)</strong>
            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">Indexer가 보관하고 GetBlock이 돌려주는 원문입니다.</p>
          </div>
          <div className="min-w-0 bg-background p-4 ring-2 ring-inset ring-primary">
            <span className="font-mono text-[9px] font-black text-primary">PAYLOAD</span>
            <strong className="mt-2 block break-keep text-sm">hash(encode(Random(42)))</strong>
            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">Simplex proposal에 들어가는 고정 길이 digest입니다.</p>
          </div>
          <div className="min-w-0 bg-background p-4">
            <span className="font-mono text-[9px] font-black text-muted-foreground">FINALIZATION</span>
            <strong className="mt-2 block break-keep text-sm">Digest를 가리키는 certificate</strong>
            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">Simplex가 만든 뒤 Application reporter가 받습니다.</p>
          </div>
        </div>
        <p>
          세 객체를 모두 “블록”이라고 부르면 완료 상태를 구분할 수 없습니다. 블록 원문이 있다는 사실, digest가 proposal에 들어갔다는 사실, certificate가 생겼다는 사실은 서로 다른 시점에 확인됩니다.
        </p>
      </section>

      <section id="owners" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">다섯 책임은 같은 상태를 쓰지 않는다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-3" aria-label="Commonware bridge 예제의 상태 소유권">
          {owners.map(([name, role, detail], index) => (
            <div key={name} className={`min-w-0 bg-background p-4 ${index === 1 ? "ring-2 ring-inset ring-primary" : ""}`}>
              <span className={`text-[9px] font-bold ${index === 1 ? "text-primary" : "text-muted-foreground"}`}>{name}</span>
              <strong className="mt-2 block break-keep text-sm leading-6">{role}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          여기서 “조립한다”는 말은 한 실행 주체가 모든 상태를 대신 관리한다는 뜻이 아닙니다. Runtime Context는 실행 자원을 제공하고, Application은 Simplex가 요구하는 propose·verify·report 인터페이스를 mailbox로 구현합니다. Indexer는 별도 stream 뒤에 있으며, 인증 P2P는 합의 메시지만 전달합니다.
        </p>
      </section>

      <section id="assembly" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Runtime Context 안에서 실행 주체를 조립한다</h2>
        <p>
          Validator는 먼저 indexer에 연결하고 인증 P2P network를 만듭니다. 이어서 channel 0에는 vote, 1에는 certificate, 2에는 resolver 메시지를 등록합니다. Application을 만들 때 받은 mailbox는 Simplex 설정의 <code>automaton</code>·<code>relay</code>·<code>reporter</code> 세 자리에 함께 들어갑니다.
        </p>
        <p>
          같은 mailbox를 쓴다고 세 역할이 같은 일은 아닙니다. Propose는 새 digest를 제공하고, verify는 digest에 대응하는 블록을 확인하며, report는 notarization·finalization 같은 합의 활동을 Application에 알립니다. Runtime의 하위 context는 각 실행 주체의 namespace와 생애를 나누는 경계입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Bridge 조립 코드" onClick={() => sidebar.open("bridge-wiring", codeRefs["bridge-wiring"])} />
        </div>
      </section>

      <section id="proposal" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">블록 원문을 먼저 보관하고 digest를 넘긴다</h2>
        <p>
          Application은 <code>Random(42)</code>를 encode해 digest를 계산합니다. 하지만 digest를 곧바로 Simplex에 반환하지 않습니다. 먼저 <code>PutBlock</code>에 network identity와 블록 원문을 담아 indexer로 보내고, 응답을 decode합니다.
        </p>
        <div className="not-prose grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-px bg-border p-px" aria-label="PutBlock 확인 뒤 digest가 consensus로 넘어가는 순서">
          <div className="min-w-0 bg-background p-3"><span className="text-[9px] font-bold text-muted-foreground">APPLICATION</span><strong className="mt-2 block break-keep text-xs leading-5">PutBlock(Random(42))</strong></div>
          <div className="flex items-center justify-center bg-background px-1 text-primary" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-3 ring-2 ring-inset ring-primary"><span className="text-[9px] font-bold text-primary">INDEXER</span><strong className="mt-2 block break-keep text-xs leading-5">Success(true)</strong></div>
          <div className="flex items-center justify-center bg-background px-1 text-primary" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-3"><span className="text-[9px] font-bold text-muted-foreground">SIMPLEX</span><strong className="mt-2 block break-keep text-xs leading-5">digest 수신</strong></div>
        </div>
        <p>
          응답이 <code>Success(false)</code>이면 코드는 <code>continue</code>로 현재 proposal을 끝냅니다. 따라서 이 예제에서 Simplex가 digest를 받았다는 사실은 적어도 Application이 PutBlock의 true 응답을 앞에서 관찰했다는 뜻입니다. 다만 그 응답이 디스크에 어느 수준으로 기록됐음을 보장하는지는 indexer 구현 계약을 더 확인해야 합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Propose·PutBlock 코드" onClick={() => sidebar.open("bridge-propose", codeRefs["bridge-propose"])} />
        </div>
      </section>

      <section id="verification" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">검증할 때 블록 원문을 다시 읽는다</h2>
        <p>
          다른 validator가 받은 proposal에는 digest만 있습니다. Application의 verify 경로는 <code>GetBlock(digest)</code>를 indexer에 보내 원문을 되찾습니다. 블록이 없으면 false를 반환하고, <code>Random</code> 블록이면 true를 반환합니다.
        </p>
        <p>
          Bridge 분기에서는 원문 안에 다른 network의 finalization certificate가 들어 있습니다. 이 경우 블록이 존재한다는 사실만으로 true가 되지 않으며, 다른 network의 scheme으로 certificate를 검증한 결과를 반환합니다. 즉 digest 조회와 Application의 유효성 판정은 한 단계가 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="GetBlock·검증 코드" onClick={() => sidebar.open("bridge-verify-report", codeRefs["bridge-verify-report"])} />
        </div>
      </section>

      <section id="finalization" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Finalization도 별도 기록이다</h2>
        <p>
          Simplex가 payload digest를 finalization하면 reporter로 연결된 Application mailbox에 <code>Activity::Finalization</code>이 도착합니다. Application은 certificate를 <code>PutFinalization</code>으로 indexer에 보내고 <code>Success</code> 응답을 decode합니다.
        </p>
        <p>
          이 certificate는 committee가 digest를 확정한 합의 근거입니다. Bridge 예제 코드에는 Alice와 Bob의 잔액을 실행하거나 Application state root를 commit하는 부분이 없습니다. 따라서 finalization을 일반 Application 상태 반영이나 client success로 확대하면 안 됩니다.
        </p>
        <p>
          더구나 예제는 <code>Success(false)</code>를 log할 뿐 retry·재조정·보상 절차를 구현하지 않습니다. “Finalization이 생김”과 “외부 indexer가 certificate를 보관했다고 확인함”도 분리해서 관찰해야 합니다.
        </p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패한 경계만 말한다</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">관찰값</th><th className="p-3">확인한 실패</th><th className="p-3">다음 동작 또는 한계</th></tr></thead>
            <tbody>
              {failures.map(([observation, boundary, consequence]) => (
                <tr key={observation} className="border-b border-border/70">
                  <td className="p-3 font-mono text-xs text-primary">{observation}</td>
                  <td className="p-3">{boundary}</td>
                  <td className="p-3 text-muted-foreground">{consequence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          이 글은 장애 복구 설계나 제품 채택을 결정하지 않습니다. 실제 운영 글에서는 indexer가 응답 전에 보장하는 저장 수준, stream 재연결, proposal 재시도, certificate 기록 재조정, key 보관과 version migration을 별도 실험으로 확인해야 합니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거와 적용 범위</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <a id="paper-commonware-runtime" href="https://github.com/commonwarexyz/monorepo/tree/d476a2361ce6840d2b9d0aa6fb30a924429046d4" target="_blank" rel="noreferrer" className="min-w-0 bg-background p-4 hover:bg-muted/30">
            <span className="font-mono text-[10px] font-black text-primary">O · 공식 코드</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Commonware v2026.9.0 · d476a236</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">공개된 기본 부품 목록, 안정성 단계, 플랫폼 지원 범위와 bridge 예제 코드를 고정했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 이 릴리스의 저장소와 코드 동작입니다. 조립한 Application의 안전성·성능을 보장하지 않습니다.</p>
          </a>
          <a id="paper-commonware-bridge" href="https://github.com/commonwarexyz/monorepo/tree/d476a2361ce6840d2b9d0aa6fb30a924429046d4/examples/bridge" target="_blank" rel="noreferrer" className="min-w-0 bg-background p-4 hover:bg-muted/30">
            <span className="font-mono text-[10px] font-black text-primary">O · ALPHA EXAMPLE</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Bridge validator·Application actor</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Runtime, 인증 P2P, Simplex, Application과 indexer가 실제로 연결되는 지점과 메시지 경계를 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 공식 README는 모든 예제를 ALPHA로 분류하고 운영 환경에 직접 쓰지 말라고 밝힙니다.</p>
          </a>
        </div>
        <p>
          Commonware는 actor·broadcast·codec·consensus·cryptography·P2P·runtime·storage 등 여러 기본 부품을 제공합니다. 하지만 이 목록이 한 Application의 필수 배치도는 아닙니다. 각 부품의 안정성 단계와 실제 연결을 릴리스별로 확인해야 합니다. v2026.9.0에서 ALPHA는 호환성을 깨는 변경과 migration 경로 부재를 허용하며, 모든 예제도 ALPHA로 분류됩니다.
        </p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>왜 <code>hash(encode(Random(42)))</code>를 계산한 직후 Simplex에 보내지 않습니까? <strong>(답: PutBlock의 Success(true)를 먼저 받아 블록 원문을 조회할 경로가 있다는 사실을 확인하기 위해서입니다.)</strong></li>
          <li><code>GetBlock</code>이 블록을 돌려주면 모든 블록이 곧바로 유효합니까? <strong>(답: Random 블록은 true지만 Bridge 블록은 포함한 외부 finalization certificate를 별도로 검증합니다.)</strong></li>
          <li>Simplex finalization이 생겼는데도 Application 상태 반영을 주장할 수 없는 이유는 무엇입니까? <strong>(답: 이 예제는 digest certificate와 indexer 기록을 다루며 별도 state transition·state root·client success를 구현하지 않기 때문입니다.)</strong></li>
        </ol>
      </section>

      <CommonwareOverviewMapReturn />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ commonware: commonwareTree }}
        projectMetas={{
          commonware: {
            id: "commonware",
            label: "Commonware v2026.9.0 · Rust",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
