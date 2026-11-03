import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import SeriesReadingMap from "@/components/articles/series-reading-map";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import { SERIES_READING_PATHS } from "@/content/series-reading-paths";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmArchitectureViz from "./viz/PrysmArchitectureViz";

const OWNERS = [
  {
    name: "Beacon node",
    owns: "받은 block·attestation을 검증하고 beacon state와 fork-choice 후보를 관리합니다.",
    doesNotOwn: "Validator의 비밀키와 EVM transaction 실행",
  },
  {
    name: "Validator client",
    owns: "배정된 duty를 확인하고 slashing protection을 거쳐 proposal·attestation에 서명합니다.",
    doesNotOwn: "어느 branch를 head로 고를지 결정하는 일",
  },
  {
    name: "Execution client",
    owns: "Execution payload의 transaction과 EVM state transition을 검증합니다.",
    doesNotOwn: "Beacon committee와 finality 규칙",
  },
] as const;

export default function Overview() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <div>
          <p className="text-xs font-bold text-primary">먼저 한 문장으로</p>
          <h2 className="mt-2 break-keep text-3xl font-bold leading-tight">
            Prysm은 받은 블록을 검증 증거로 바꾸는 합의 클라이언트입니다
          </h2>
        </div>
        <p className="text-lg leading-8">
          Peer에게서 블록을 받았다는 사실, 규칙에 맞는 상태를 계산했다는 사실,
          현재 head가 됐다는 사실, 되돌리기 어려운 finality를 얻었다는 사실은
          서로 다릅니다. Prysm은 이 차이를 보존하고, 거래 실행은 execution
          client에, 서명 권한은 validator client에 맡깁니다.
        </p>
        <p>
          그래서 이 글은 패키지 이름부터 외우지 않습니다. 설명용 block B352 한
          건이 들어온 뒤 어디에서 멈출 수 있고, 어느 결과가 다음 판단의 입력이
          되는지를 먼저 따라갑니다.
        </p>
        <ContentBoundary article="prysm" />
        <PrysmArchitectureViz />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">끝까지 따라갈 한 건</h2>
        <div
          className="not-prose grid gap-px bg-border p-px sm:grid-cols-4"
          aria-label="Prysm 아키텍처 설명용 block fixture"
        >
          {[
            ["Block", "B352", "slot 352 · parent는 slot 351"],
            ["Consensus", "통과", "post-state S352를 계산"],
            ["Execution", "SYNCING", "아직 EVM 판정이 끝나지 않음"],
            ["Validator", "index 17", "slot 352 attestation duty"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">
                {label}
              </span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">
                {detail}
              </p>
            </div>
          ))}
        </div>
        <p>
          숫자는 설명을 이어 붙이기 위한 가상 값입니다. 핵심은{" "}
          <strong>
            consensus 통과와 execution 확정이 동시에 끝나지 않을 수 있다
          </strong>
          는 점입니다. 이 사례의 B352는 버려지지 않고 “실행 판정이 남은 후보”로
          들어가지만, 그 사실만으로 head나 finalized block이 되지는 않습니다.
        </p>
      </section>

      <section id="owners" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          왜 세 프로그램으로 나눕니까?
        </h2>
        <p>
          한 프로세스가 모든 일을 할 수도 있어 보입니다. 하지만 장부 합의, 거래
          실행, 비밀키 서명은 실패했을 때 피해와 복구 방법이 다릅니다. 책임을
          나누면 execution client가 동기화 중이어도 consensus 후보 상태를 표시할
          수 있고, beacon node가 침해돼도 validator client의 slashing check가
          마지막 방어선으로 남습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px md:grid-cols-3">
          {OWNERS.map((owner) => (
            <article key={owner.name} className="min-w-0 bg-background p-4">
              <h3 className="break-keep text-sm font-bold">{owner.name}</h3>
              <p className="mt-3 break-keep text-xs leading-6">{owner.owns}</p>
              <p className="mt-3 border-l-2 border-primary/50 pl-3 break-keep text-[10px] leading-5 text-muted-foreground">
                맡지 않는 일 · {owner.doesNotOwn}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="receive" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          블록을 받았는데, 왜 바로 상태를 바꾸지 않습니까?
        </h2>
        <p>
          같은 root를 이미 처리했는지, 금지된 root인지, 다른 goroutine이 처리
          중인지부터 확인해야 합니다. 그다음 parent의 pre-state를 찾고 consensus
          transition과 execution payload 판정을 수행합니다. Blob·data column처럼
          별도로 받아야 하는 데이터도 사용할 수 있어야 합니다.
        </p>
        <p>
          이 순서를 건너뛰면 잘못된 블록이 중간 state와 cache를 남길 수
          있습니다. 반대로 모든 검사가 끝난 결과만 저장하면 재시작 뒤에도
          “어디까지 완료했는가”를 block root와 post-state root로 다시 확인할 수
          있습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() =>
              sidebar.open("block-lifecycle", codeRefs["block-lifecycle"])
            }
          />
          <span className="text-xs text-muted-foreground">
            v7.3.1의 실제 ReceiveBlock: 중복
            검사→pre-state→consensus·Engine→DA→후보·checkpoint
          </span>
        </div>
      </section>

      <section id="state-head-finality" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          상태 계산에 성공했는데, 왜 아직 head가 아닙니까?
        </h2>
        <p>
          State transition은 “이 parent 위에 B352를 적용하면 S352가 나온다”를
          답합니다. Fork choice는 여러 유효한 branch 가운데 attestation weight와
          ancestry를 보고 현재 따라갈 끝을 고릅니다. Finality는 epoch 단위의 더
          강한 증거가 쌓인 checkpoint를 가리킵니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Post-state", "이 후보를 계산할 수 있는가?", "B352 → S352"],
            [
              "Head",
              "지금 어느 branch를 따라갈 것인가?",
              "vote가 바뀌면 이동 가능",
            ],
            [
              "Finalized",
              "어디까지 되돌리기 어려운가?",
              "head보다 느리게 전진",
            ],
          ].map(([name, question, result]) => (
            <article key={name} className="min-w-0 bg-background p-4">
              <p className="font-mono text-[10px] font-black text-primary">
                {name}
              </p>
              <p className="mt-2 break-keep text-xs font-bold leading-5">
                {question}
              </p>
              <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">
                {result}
              </p>
            </article>
          ))}
        </div>
        <p>
          따라서 API나 로그에 “latest state”라고만 쓰면 어느 포인터인지 알 수
          없습니다. Block root·state root와 함께 head, justified, finalized 중
          무엇을 읽었는지 표시해야 짧은 reorg 뒤에도 같은 장면을 복원할 수
          있습니다.
        </p>
      </section>

      <section id="engine" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Engine이 SYNCING인데 후보를 남기는 이유는 무엇입니까?
        </h2>
        <p>
          SYNCING은 “유효하다”가 아니라 “execution client가 아직 판정을 끝내지
          못했다”는 뜻입니다. Consensus transition과 data availability가
          통과했다면 Prysm은 이 상태를 optimistic 표시가 붙은 후보로 보존할 수
          있습니다. 나중에 VALID가 오면 표시를 풀고, INVALID가 오면 관련
          branch를 제거합니다.
        </p>
        <p>
          이 구분 덕분에 execution client의 일시적인 동기화 지연과 실제 규칙
          위반을 같은 장애로 처리하지 않습니다. 다만 optimistic 후보를 finalized
          execution처럼 사용자에게 내보내서는 안 됩니다.
        </p>
      </section>

      <section id="validator" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Validator client는 왜 head만 보고 바로 서명하지 않습니까?
        </h2>
        <p>
          Validator 17에게 같은 slot의 서로 충돌하는 두 attestation을 보내면
          비밀키는 둘 다 정상적으로 서명할 수 있습니다. 문제는 암호가 아니라
          duty와 과거 서명 기록입니다. 그래서 validator client는 committee
          duty를 찾고 domain·signing root를 계산한 뒤, local slashing-protection
          DB가 충돌을 거절하게 합니다.
        </p>
        <p>
          Remote signer를 써도 이 경계는 사라지지 않습니다. 요청에는
          key·slot·duty type·fork domain·signing root를 넣고, timeout 뒤에는 새
          요청을 무작정 만들지 말고 같은 root의 receipt를 먼저 조회해야 합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() =>
              sidebar.open(
                "validator-attestation",
                codeRefs["validator-attestation"],
              )
            }
          />
          <span className="text-xs text-muted-foreground">
            v7.3.1의 실제 duty→signing root→slashing check→제출 경로
          </span>
        </div>
      </section>

      <section id="runtime" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Prysm이라는 한 실행 파일 안에서는 어떻게 나뉩니까?
        </h2>
        <p>
          BeaconNode는 P2P·sync·blockchain·database·API의 세부 로직을 직접 한
          함수에 쓰지 않습니다. 등록된 service를 함께 시작하고, 종료 신호가 오면
          service와 DB를 닫습니다. 즉 “한 binary”와 “한 책임”은 같은 말이
          아닙니다.
        </p>
        <p>
          운영에서는 이 구분이 재시작과 장애 분석의 기준이 됩니다. Peer는
          정상인데 block processing이 밀리는지, Engine 응답만 늦는지, DB close가
          끝나지 않는지 service별 지표와 trace로 나눠야 합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() =>
              sidebar.open("node-lifecycle", codeRefs["node-lifecycle"])
            }
          />
          <span className="text-xs text-muted-foreground">
            v7.3.1의 실제 BeaconNode service 시작·종료 경계
          </span>
        </div>
      </section>

      <section id="release-gate" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          새 버전은 무엇이 같아야 통과시킵니까?
        </h2>
        <p>
          Base와 candidate에는 같은 입력과 같은 장애 순서를 줍니다. 그래야 결과
          차이가 새 버전에서 생겼다고 말할 수 있습니다.
        </p>
        <div
          className="not-prose grid gap-px bg-border p-px sm:grid-cols-3"
          aria-label="Prysm 새 버전 비교 순서"
        >
          {[
            [
              "같은 입력",
              "Genesis·network·fork와 block·peer·Engine 응답을 고정합니다.",
            ],
            [
              "같은 장애",
              "잘못된 SSZ·서명·전이, reorg, Engine 지연·거절, signer timeout과 재시작을 반복합니다.",
            ],
            [
              "같은 결론",
              "수락·거절, state root, head·finality와 slashing 판단이 같은지 먼저 봅니다.",
            ],
          ].map(([label, detail]) => (
            <article key={label} className="min-w-0 bg-background p-4">
              <strong className="text-xs">{label}</strong>
              <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">
                {detail}
              </p>
            </article>
          ))}
        </div>
        <p>
          이 정확성 검사를 통과한 뒤에만 slot 처리 지연의 p95·p99, 놓친 duty 수,
          peer 상태와 자원 비용을 비교합니다.
        </p>
        <div className="not-prose border-l-2 border-primary pl-4 text-sm leading-7">
          <strong>버전 영수증</strong>
          <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <span>Prysm v7.3.1 · commit 96d418cd</span>
            <span>Network · genesis root · 활성 fork</span>
            <span>Feature flags · execution-client version</span>
            <span>Validator·slashing DB schema</span>
          </div>
        </div>
      </section>

      <section id="next" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          이 큰 그림에서 어디로 내려가야 합니까?
        </h2>
        <p>
          Wire 형식은 <Link to="/cs/blockchain/prysm-ssz#overview">SSZ</Link>,
          서명은 <Link to="/cs/blockchain/prysm-bls#overview">BLS</Link>, peer
          경계는{" "}
          <Link to="/cs/blockchain/prysm-p2p-libp2p#overview">P2P·libp2p</Link>
          에서 이어집니다. 상태 전이와 후보 등록은{" "}
          <Link to="/cs/blockchain/prysm-block-processing#overview">
            block processing
          </Link>
          , 후보 중 head 선택은{" "}
          <Link to="/cs/blockchain/prysm-forkchoice#overview">fork choice</Link>
          , signing authority는{" "}
          <Link to="/cs/blockchain/prysm-validator-client#overview">
            validator client
          </Link>
          에서 같은 B352 질문을 더 깊게 봅니다.
        </p>
        <SeriesReadingMap
          categorySlug="blockchain"
          path={SERIES_READING_PATHS.prysm}
        />
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거와 범위</h2>
        <div id="paper-prysm-repository" className="scroll-mt-24">
          <CitationBlock
            citeKey={1}
            type="code"
            source="OffchainLabs Prysm v7.3.1 @ 96d418cd"
            href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db"
          >
            <p>
              <code>BeaconNode.Start</code>, <code>Service.ReceiveBlock</code>,{" "}
              <code>validator.SubmitAttestation</code>의 실제 경계를
              확인했습니다.
            </p>
            <p>
              <strong>범위:</strong> 이 release의 구현 snapshot입니다. Moving
              master·develop이나 다른 client의 package 구조로 일반화하지
              않습니다.
            </p>
          </CitationBlock>
        </div>
        <div id="paper-ethereum-consensus-specs" className="scroll-mt-24">
          <CitationBlock
            citeKey={2}
            source="Ethereum Proof-of-Stake Consensus Specifications"
            href="https://ethereum.github.io/consensus-specs/"
          >
            <p>
              Fork별 state transition, fork choice, validator duty와 execution
              handoff의 protocol 책임을 확인했습니다.
            </p>
            <p>
              <strong>범위:</strong> Protocol의 정본입니다. Prysm의 service
              registry·DB·cache·성능 수치를 규정하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          설명할 수 있는지 확인합니다
        </h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>
            B352의 post-state가 계산됐는데도 head가 아닐 수 있는 이유는
            무엇입니까?{" "}
            <strong>
              State transition은 후보 하나의 결과를 만들고, fork choice가 여러
              후보 중 현재 head를 따로 고르기 때문입니다.
            </strong>
          </li>
          <li>
            Engine의 SYNCING과 INVALID를 왜 구분합니까?{" "}
            <strong>
              SYNCING은 판정이 남았다는 뜻이고, INVALID는 execution 규칙 위반이
              확인됐다는 뜻이기 때문입니다.
            </strong>
          </li>
          <li>
            Validator의 BLS 서명이 맞아도 왜 slashing check가 필요합니까?{" "}
            <strong>
              암호 서명은 key 소유만 보여 주며, 같은 duty의 충돌 서명 여부는
              과거 기록과 비교해야 알 수 있기 때문입니다.
            </strong>
          </li>
        </ol>
      </section>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree }}
        projectMetas={{
          prysm: {
            id: "prysm",
            label: "Prysm v7.3.1 · Go",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
