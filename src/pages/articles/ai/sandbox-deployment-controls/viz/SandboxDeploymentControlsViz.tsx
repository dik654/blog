import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["Pod 시작", "API 허용", "API 거절", "외부 전송", "임시 저장", "Pod 삭제"] as const;
const NOTES = [
  "img-job-91 Pod는 agent-reader ServiceAccount를 쓰고, kubelet은 audience와 만료 시간이 있는 projected token을 마운트합니다. 토큰을 넣는 일과 API 권한을 주는 일은 별개입니다.",
  "프로세스가 자기 Job을 GET하면 API server가 토큰을 인증한 뒤 RBAC의 verb·resource·namespace를 확인합니다. 네 조건이 맞아서 200 응답이 돌아옵니다.",
  "같은 토큰으로 Secret을 GET해도 secrets.get 권한이 없으므로 403입니다. 인증 성공은 요청한 동작까지 허용됐다는 뜻이 아닙니다.",
  "결과 업로드는 Kubernetes API가 아니라 egress 정책을 지납니다. object gateway는 허용하지만 metadata IP는 차단합니다. 표준 NetworkPolicy와 FQDN 확장은 같은 기능이 아닙니다.",
  "root filesystem은 읽기 전용이고 /work만 크기가 제한된 emptyDir입니다. 컨테이너가 종료돼도 같은 Pod가 남아 있는 동안 emptyDir 데이터는 남습니다.",
  "Job 완료와 Pod 삭제를 구분합니다. Pod가 실제로 삭제될 때 kubelet이 Pod 수명에 묶인 emptyDir을 정리합니다. 외부 object storage의 결과는 별도 보존 정책을 따릅니다.",
] as const;

function Defs() {
  return <defs><marker id="deploy-control-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill="currentColor" /></marker></defs>;
}

function Arrow({ x1, y1, x2, y2, blocked = false }: { x1: number; y1: number; x2: number; y2: number; blocked?: boolean }) {
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} className={blocked ? "stroke-destructive" : "stroke-foreground"} strokeWidth="1.2" markerEnd="url(#deploy-control-arrow)" />{blocked ? <line x1={x2 - 4} y1={y2 - 7} x2={x2 + 4} y2={y2 + 7} className="stroke-destructive" strokeWidth="2" /> : null}</g>;
}

function Box({ x, y, w = 108, h = 54, title, detail, active = false }: { x: number; y: number; w?: number; h?: number; title: string; detail: string; active?: boolean }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="5" className={active ? "fill-primary/10 stroke-primary" : "fill-background stroke-border"} /><text x={x + w / 2} y={y + 21} textAnchor="middle" className="fill-foreground text-[10px] font-bold">{title}</text><text x={x + w / 2} y={y + 39} textAnchor="middle" className="fill-muted-foreground text-[8.5px]">{detail}</text></g>;
}

const svgClass = "mx-auto h-[15rem] w-auto max-w-full sm:h-[21rem]";

function StartScene() {
  return <svg viewBox="0 0 400 240" className={svgClass} role="img" aria-label="img-job-91 Pod에 ServiceAccount projected token이 주입되는 과정"><Defs /><text x="200" y="25" textAnchor="middle" className="fill-muted-foreground text-[9px]">ai namespace · img-job-91</text><Box x={18} y={72} title="ServiceAccount" detail="agent-reader" /><Arrow x1={126} y1={99} x2={153} y2={99} /><Box x={158} y={72} w={104} title="kubelet" detail="token projection" active /><Arrow x1={262} y1={99} x2={289} y2={99} /><Box x={294} y={72} w={88} title="Pod" detail="token mount" /><text x="200" y="159" textAnchor="middle" className="fill-foreground text-[9px] font-bold">audience: kube-apiserver · 만료: 1시간</text><text x="200" y="181" textAnchor="middle" className="fill-muted-foreground text-[8.5px]">신원 증명서를 넣었지만 아직 허용 동작은 결정되지 않음</text></svg>;
}

function ApiScene({ denied = false }: { denied?: boolean }) {
  return <svg viewBox="0 0 400 240" className={svgClass} role="img" aria-label={denied ? "유효한 토큰을 가진 Pod의 Secret 조회가 RBAC에서 거절되는 과정" : "Pod의 Job 조회가 인증과 RBAC을 거쳐 허용되는 과정"}><Defs /><Box x={8} y={71} w={90} title="Pod" detail={denied ? "GET Secret" : "GET Job"} /><Arrow x1={98} y1={98} x2={123} y2={98} /><Box x={128} y={71} w={105} title="인증" detail="서명·aud·만료" active /><Arrow x1={233} y1={98} x2={258} y2={98} /><Box x={263} y={71} w={129} title="RBAC" detail={denied ? "secrets.get 없음" : "jobs.get 있음"} active /><path d="M327 125V157H201" fill="none" className={denied ? "stroke-destructive" : "stroke-foreground"} markerEnd="url(#deploy-control-arrow)" /><Box x={142} y={161} w={118} h={48} title={denied ? "403 Forbidden" : "200 Job 상태"} detail={denied ? "인증 성공·권한 없음" : "네 조건 모두 일치"} active /><text x="200" y="31" textAnchor="middle" className="fill-muted-foreground text-[9px]">같은 token · 다른 verb와 resource</text></svg>;
}

function EgressScene() {
  return <svg viewBox="0 0 400 240" className={svgClass} role="img" aria-label="Pod의 결과 업로드는 허용하고 metadata IP 연결은 차단하는 egress 경로"><Defs /><Box x={11} y={82} w={86} title="Pod" detail="HTTPS 요청" /><Arrow x1={97} y1={109} x2={126} y2={109} /><Box x={131} y={82} w={111} title="egress 정책" detail="CNI·gateway" active /><path d="M242 96H272V59H299" fill="none" className="stroke-foreground" markerEnd="url(#deploy-control-arrow)" /><path d="M242 122H272V171H299" fill="none" className="stroke-destructive" markerEnd="url(#deploy-control-arrow)" /><Box x={304} y={34} w={88} title="Object" detail="10.40.8.20:443" /><Box x={304} y={146} w={88} title="Metadata" detail="169.254.169.254" /><text x="275" y="52" textAnchor="middle" className="fill-primary text-[8px] font-bold">허용</text><text x="273" y="165" textAnchor="middle" className="fill-destructive text-[8px] font-bold">차단</text><text x="200" y="220" textAnchor="middle" className="fill-muted-foreground text-[8.5px]">표준 NetworkPolicy는 L3/L4 · FQDN은 CNI 확장 여부를 확인</text></svg>;
}

function StorageScene() {
  return <svg viewBox="0 0 400 240" className={svgClass} role="img" aria-label="Pod의 읽기 전용 루트 파일시스템과 크기가 제한된 emptyDir"><Defs /><Box x={11} y={76} w={92} title="프로세스" detail="파일 쓰기" /><path d="M103 91H139V58H170" fill="none" className="stroke-destructive" markerEnd="url(#deploy-control-arrow)" /><path d="M103 115H139V159H170" fill="none" className="stroke-foreground" markerEnd="url(#deploy-control-arrow)" /><Box x={175} y={32} w={116} title="/etc · /app" detail="read-only root" /><Box x={175} y={133} w={116} title="/work" detail="emptyDir · 5 GiB" active /><Arrow x1={291} y1={160} x2={319} y2={160} /><Box x={324} y={133} w={68} title="Pod" detail="수명 공유" /><text x="200" y="218" textAnchor="middle" className="fill-muted-foreground text-[8.5px]">컨테이너 재시작 뒤에도 유지 · Pod 삭제 때 정리</text></svg>;
}

function DeleteScene() {
  return <svg viewBox="0 0 400 240" className={svgClass} role="img" aria-label="컨테이너 종료와 Pod 삭제 사이에 emptyDir이 남고 Pod 삭제 뒤 정리되는 과정"><Defs /><Box x={7} y={72} w={91} title="Container" detail="exit 0" /><Arrow x1={98} y1={99} x2={123} y2={99} /><Box x={128} y={72} w={116} title="완료된 Pod" detail="/work 남아 있음" /><Arrow x1={244} y1={99} x2={269} y2={99} /><Box x={274} y={72} w={119} title="Pod 삭제" detail="volume cleanup" active /><path d="M334 126V159H204" fill="none" className="stroke-foreground" markerEnd="url(#deploy-control-arrow)" /><Box x={142} y={163} w={124} h={46} title="정리 확인" detail="Pod·emptyDir 없음" active /><text x="200" y="29" textAnchor="middle" className="fill-muted-foreground text-[9px]">Job 완료 ≠ Pod 삭제</text></svg>;
}

const DRAWINGS = [StartScene, () => <ApiScene />, () => <ApiScene denied />, EgressScene, StorageScene, DeleteScene] as const;

export default function SandboxDeploymentControlsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  const Drawing = DRAWINGS[scenes.active];

  return <VizFrame eyebrow="한 Pod · 네 통제 경계" title="허용된 효과만 남기고 Pod 수명과 함께 닫습니다" description="img-job-91이 API를 읽고 결과를 업로드하고 임시 파일을 남긴 뒤 삭제되는 경로를 따라갑니다." note="그림은 Kubernetes v1.37 메커니즘과 CNI 확장 경계를 설명합니다. 실제 권한·주소·보존 시간은 대상 클러스터에서 별도로 고정해야 합니다." canvasClassName="p-3 sm:p-7">
    <div id={scenes.playbackId} data-viz-canvas data-viz-scene="sandbox-deployment-effects-viz" data-story-index={scenes.active} tabIndex={0} role="group" aria-label="한 이미지 생성 Pod가 신원과 권한, 외부 통신, 임시 저장, 삭제 통제를 지나는 과정" onKeyDown={scenes.onKeyDown} className="flex h-auto min-h-0 min-w-0 flex-col overflow-visible outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(39rem,calc(100svh-8rem))] sm:min-h-[33rem] sm:overflow-y-auto">
      <div data-viz-live-only className="flex flex-none flex-col justify-center"><p className="text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</p><h4 className="mt-2 break-keep text-lg font-bold">{SCENES[scenes.active]}</h4><div className="mt-3 border-y border-border py-3"><Drawing /></div><p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[scenes.active]}</p></div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
      <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">{SCENES.map((label, index) => <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>)}</ol>
    </div>
  </VizFrame>;
}
