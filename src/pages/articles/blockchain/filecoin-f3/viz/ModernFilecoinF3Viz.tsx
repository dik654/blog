import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const TRACE_LABELS = ["EC 후보", "입력 결속", "79 실패", "80 통과", "인증서", "검증·저장", "fence"] as const;
const TRACE_SCENES = [
  { owner: "Expected Consensus", title: "현재 EC head T101은 유효하지만 아직 바뀔 수 있습니다", detail: "Alice의 송금 M5가 T101에 들어 있어도 더 무거운 유효 분기가 오면 EC head는 reorg될 수 있습니다.", proposal: "T98 → T100 → T101", base: "T98 · 이전 F3 확정", committee: "아직 instance 밖", certificate: "없음", evidence: "EC validation + chain weight" },
  { owner: "F3 input builder", title: "Instance 42에 base·proposal·PT42를 함께 결속합니다", detail: "Proposal은 T98을 연장해야 합니다. Network name, instance, commitments와 다음 power-table CID도 서명 payload에 들어갑니다.", proposal: "T98 → T100 → T101", base: "T98 · 되돌리지 않음", committee: "PT42 · total 120", certificate: "instance 42 진행 중", evidence: "input + supplemental data" },
  { owner: "GPBFT · DECIDE 수집", title: "PT42 기준 79의 유효 서명 power는 strong quorum이 아닙니다", detail: "문턱은 ceil(2×120÷3)=80입니다. 79는 후보가 좋아 보여도 인증서를 만들 근거가 부족합니다.", proposal: "T101 결정 후보", base: "T98", committee: "79 / 120 · 실패", certificate: "생성 금지", evidence: "validated signer bitfield" },
  { owner: "GPBFT · DECIDE 수집", title: "PT42 기준 80의 유효 서명 power가 문턱을 통과합니다", detail: "중복 signer를 제거하고 PT42의 scaled power로 다시 계산합니다. 현재 power table을 대신 쓰면 안 됩니다.", proposal: "T101 결정", base: "T98", committee: "80 / 120 · 통과", certificate: "DECIDE justification 확보", evidence: "aggregate signature + quorum" },
  { owner: "go-f3 · certificate builder", title: "결정 근거를 instance 42 finality certificate로 묶습니다", detail: "Certificate에는 ECChain, supplemental data, signer bitfield, aggregate signature와 다음 committee를 만드는 power-table delta가 들어갑니다.", proposal: "ECChain · T98…T101", base: "ECChain.Base = T98", committee: "PT42 signers", certificate: "C42 생성", evidence: "FinalityCertificate C42" },
  { owner: "certificate validator / store", title: "C42를 PT42로 검증한 뒤 delta로 PT43을 만듭니다", detail: "Instance·base·chain·signature를 확인하고 power delta를 적용합니다. 계산한 PT43 CID가 certificate의 commitment와 같아야 저장합니다.", proposal: "T101 검증 완료", base: "T98 link 확인", committee: "PT42 → Δ42 → PT43", certificate: "C42 저장", evidence: "validated cert + PT43 CID" },
  { owner: "Lotus EC adapter", title: "T101을 확정 prefix로 표시하고 이후 fork choice의 울타리로 씁니다", detail: "EC는 T101을 잇는 분기 안에서 계속 weight를 비교합니다. T101과 충돌하는 분기는 더 무거워도 후보가 아닙니다.", proposal: "새 EC head · T104", base: "F3 prefix · T101", committee: "다음 instance · PT43", certificate: "latest = C42", evidence: "finalized prefix fence" },
] as const;
const TRACE_NOTES = TRACE_SCENES.map((scene, index) => `${TRACE_LABELS[index]}. ${scene.title} ${scene.detail} 이 단계의 증거는 ${scene.evidence}입니다.`);

export function FilecoinF3TraceViz() {
  const scenes = useAnimatedScenes(TRACE_SCENES.length, 8200, { loop: false });
  const scene = TRACE_SCENES[scenes.active];
  return <VizFrame eyebrow="Alice의 송금 M5 · EC head T101 · GPBFT instance 42" title="F3는 현재 head를 그대로 믿지 않고, 과거 committee의 결정 증거를 검증 가능한 인증서로 바꿉니다" description="EC 후보가 instance 입력에 결속되고, 79는 실패·80은 통과한 뒤, 인증서와 다음 power table을 검증해 finalized-prefix fence가 되는 과정을 따라갑니다." note="T98·T101·T104와 instance 42는 경계를 설명하기 위한 예시입니다. Strong quorum 계산은 FIP-0086과 go-f3 v0.8.15의 ceil(2W/3) 규칙을 따릅니다." documentFlow canvasClassName="p-3 sm:p-6">
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Filecoin F3 인증서 생성 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="min-h-[38rem] space-y-4 sm:min-h-[27rem] xl:min-h-[24rem]">
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">{TRACE_LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}</div>
          <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.35fr)_minmax(14rem,0.65fr)]">
            <div className="bg-background p-4 sm:p-5"><p className="text-[10px] font-black text-primary">현재 상태 소유자 · {scene.owner}</p><h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.title}</h4><p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p><div className="mt-5 h-1.5 bg-border/70" aria-label={`전체 진행 ${scenes.active + 1}/${TRACE_SCENES.length}`}><div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${((scenes.active + 1) / TRACE_SCENES.length) * 100}%` }} /></div></div>
            <div className="bg-background p-4 sm:p-5"><p className="text-[9px] font-bold text-muted-foreground">이 단계에서 새로 생긴 근거</p><p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">{scene.evidence}</p><p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">앞 단계의 근거만으로 뒤 단계의 완료를 주장할 수 없습니다.</p></div>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">{[["EC proposal", scene.proposal], ["확정 base", scene.base], ["검증 committee", scene.committee], ["certificate", scene.certificate]].map(([label, value], index) => <div key={label} className={`relative min-w-0 border bg-background p-3 ${index <= Math.min(3, Math.floor((scenes.active + 1) / 2)) ? "border-primary/60" : "border-border"}`}><span className={`absolute -left-1 top-4 size-2 ${index <= Math.floor((scenes.active + 1) / 2) ? "bg-primary" : "bg-border"}`} /><p className="text-[9px] font-bold text-muted-foreground">{label}</p><p className="mt-2 break-keep font-mono text-[10px] font-bold leading-5">{value}</p></div>)}</div>
        </div>
        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="F3 인증서 경로 재생" compact />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </div>
  </VizFrame>;
}

const CATCHUP_LABELS = ["신뢰 시작점", "다음 인증서", "연결 검사", "서명·정족수", "다음 PT", "저장·반복"] as const;
const CATCHUP_SCENES = [
  { line: 1, title: "검증된 C42와 PT43에서 시작합니다", detail: "처음부터 신뢰할 수 없는 최신 인증서를 받는 것이 아니라, 이미 검증한 certificate와 다음 instance용 power table을 시작점으로 고정합니다.", instance: "next = 43", base: "C42.Head = T101", table: "PT43 · trusted", result: "C43 대기" },
  { line: 2, title: "Peer에서 instance 43 인증서를 받습니다", detail: "Certificate exchange는 연속 범위를 요청합니다. 받은 순서와 개수는 아직 신뢰 근거가 아니며 다음 단계에서 모두 검증합니다.", instance: "received = 43", base: "claimed base = T101", table: "PT43 유지", result: "untrusted C43" },
  { line: 3, title: "Instance·network·base와 ECChain 구조를 먼저 확인합니다", detail: "43이 아니라 44가 왔거나 base가 T101이 아니면 중간을 건너뛴 것입니다. 마지막 trusted 상태에서 멈춥니다.", instance: "43 = next · 통과", base: "T101 = expected · 통과", table: "PT43 아직 사용 전", result: "domain/link 통과" },
  { line: 4, title: "PT43으로 signer power와 aggregate signature를 검증합니다", detail: "현재 PT44가 아니라 instance 43용 PT43을 사용합니다. Signer power가 ceil(2W/3)에 못 미치거나 signature가 틀리면 거절합니다.", instance: "C43 payload", base: "T101 → T104", table: "PT43 · signer 84/120", result: "signature/quorum 통과" },
  { line: 5, title: "C43의 delta를 PT43에 적용해 PT44를 계산합니다", detail: "참여자의 power와 signing key 변경을 적용한 뒤 계산한 CID가 C43의 supplemental commitment와 같은지 확인합니다.", instance: "next = 44 예정", base: "new head = T104", table: "PT43 + Δ43 = PT44", result: "PT44 CID 일치" },
  { line: 6, title: "C43과 PT44를 저장한 뒤 같은 검증을 반복합니다", detail: "최신 한 장으로 점프하지 않습니다. 실패하면 C42·PT43을 마지막 trusted 상태로 유지하고 다른 peer에서 다시 받습니다.", instance: "latest = 43 · next = 44", base: "finalized = T104", table: "PT44 · trusted", result: "C44 대기" },
] as const;
const CATCHUP_CODE = ["trusted = (cert[i], powerTable[i+1])", "next = receiveCertificate(i + 1)", "require next.instance, network, base, chain are valid", "require verifySignatureAndQuorum(next, powerTable[i+1])", "powerTable[i+2] = applyAndCheckCID(next.delta)", "store(next, powerTable[i+2]); repeat"] as const;
const CATCHUP_NOTES = CATCHUP_SCENES.map((scene, index) => `${CATCHUP_LABELS[index]}. ${scene.title} ${scene.detail}`);

export function CertificateCatchupViz() {
  const scenes = useAnimatedScenes(CATCHUP_SCENES.length, 8600, { loop: false });
  const scene = CATCHUP_SCENES[scenes.active];
  return <VizFrame eyebrow="Cold start · C42/PT43 → C43/PT44" title="Catch-up은 최신 인증서 한 장을 믿는 일이 아니라, 신뢰 상태를 한 칸씩 앞으로 옮기는 검증 반복문입니다" description="장면 왼쪽의 의사코드와 오른쪽 상태를 함께 보면 어느 검사에서 멈추고 무엇을 trusted로 남기는지 알 수 있습니다." note="인증서를 받는 certexchange와 인증서·power table을 검증하고 저장하는 certstore/certs의 책임을 합쳐 설명한 실행 흐름입니다." documentFlow canvasClassName="p-3 sm:p-6">
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Filecoin F3 인증서 따라잡기 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="min-h-[46rem] space-y-4 sm:min-h-[35rem] xl:min-h-[31rem]">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="border border-border bg-background p-3 sm:p-4"><p className="mb-3 text-[9px] font-black text-primary">검증 반복문의 현재 줄</p><ol className="space-y-1 font-mono text-[9px] leading-5 sm:text-[10px]">{CATCHUP_CODE.map((code, index) => <li key={code} className={`grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2 border-l-2 px-2 py-1.5 ${index + 1 === scene.line ? "border-primary bg-primary/10 text-foreground" : index + 1 < scene.line ? "border-foreground/30 text-muted-foreground" : "border-border text-muted-foreground"}`}><span>{index + 1}</span><span className="break-words">{code}</span></li>)}</ol></div>
            <div className="border border-primary/50 bg-background p-4 sm:p-5"><p className="text-[10px] font-black text-primary">{scenes.active + 1}. {CATCHUP_LABELS[scenes.active]}</p><h4 className="mt-2 break-keep text-base font-black leading-6">{scene.title}</h4><p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p><div className="mt-4 h-1.5 bg-border/70"><div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${((scenes.active + 1) / CATCHUP_SCENES.length) * 100}%` }} /></div></div>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">{[["instance", scene.instance], ["base link", scene.base], ["power table", scene.table], ["판정", scene.result]].map(([label, value]) => <div key={label} className="min-w-0 border border-border bg-background p-3"><p className="text-[9px] font-bold text-muted-foreground">{label}</p><p className="mt-2 break-keep font-mono text-[10px] font-bold leading-5">{value}</p></div>)}</div>
        </div>
        <AnimatedSceneControls {...scenes} labels={CATCHUP_LABELS} controlLabels={CATCHUP_LABELS} playLabel="인증서 따라잡기 재생" compact />
      </div>
      <StaticSceneList labels={CATCHUP_LABELS} notes={CATCHUP_NOTES} />
    </div>
  </VizFrame>;
}
