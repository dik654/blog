import { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  CloudOff,
  Fingerprint,
  KeyRound,
  Laptop,
  LockKeyhole,
  Radio,
  RotateCcw,
  Server,
  ShieldCheck,
  Smartphone,
  Users,
} from 'lucide-react';

type ArchitectureId = 'custodial' | 'device' | 'threshold' | 'smart';

const ARCHITECTURES: Record<ArchitectureId, {
  label: string;
  signing: string;
  recovery: string;
  policy: string;
  dependency: string;
  warning: string;
}> = {
  custodial: {
    label: '서비스 단독 키',
    signing: '서비스 HSM·키 시스템이 단독 서명 가능',
    recovery: '서비스 계정 복구 절차가 곧 자산 복구 절차',
    policy: '서비스가 출금 정책과 예외 처리를 변경',
    dependency: '서비스 가용성·내부자 통제에 강하게 의존',
    warning: '편리하지만 운영자 침해가 서명 권한 침해로 바로 이어질 수 있다.',
  },
  device: {
    label: '사용자 단독 키',
    signing: '사용자 장치의 개인키 하나로 서명',
    recovery: 'seed phrase·백업 키를 가진 사람이 복구',
    policy: '앱 정책보다 키 소유가 최종 권한',
    dependency: '서비스 장애에는 강하지만 장치·백업 손실에 민감',
    warning: 'self-custody이지만 한 장치와 백업이 새로운 단일 실패점이 된다.',
  },
  threshold: {
    label: 'Threshold 서명',
    signing: '정해진 수의 key share가 공동 프로토콜 실행',
    recovery: '별도 recovery quorum·resharing 절차로 복구',
    policy: '누가 quorum에 들어가는지와 coordinator 정책이 중요',
    dependency: '한 party 장애는 견딜 수 있지만 프로토콜·서비스 의존성이 남음',
    warning: '원본 키를 복원하지 않는다는 사실만으로 피싱·오승인·공급망 공격이 사라지지 않는다.',
  },
  smart: {
    label: 'Smart account',
    signing: '온체인 계정 코드가 허용한 signer·session key·quorum을 검증',
    recovery: 'guardian·timelock·업그레이드 규칙으로 복구 가능',
    policy: '계정 contract와 업그레이드 권한이 정책의 일부',
    dependency: 'bundler·paymaster·contract 구현과 체인 가용성에 의존 가능',
    warning: '키 관리와 계정 권한을 분리할 수 있지만 contract bug와 관리자 권한을 새로 검토해야 한다.',
  },
};

const AXES = [
  ['서명 권한', 'signing', KeyRound],
  ['복구 권한', 'recovery', RotateCcw],
  ['정책 변경', 'policy', ShieldCheck],
  ['서비스 의존', 'dependency', Radio],
] as const;

export function CustodyAuthorityExplorer() {
  const [selected, setSelected] = useState<ArchitectureId>('threshold');
  const architecture = ARCHITECTURES[selected];

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 px-4 py-5 sm:px-6">
        <p className="text-[10px] font-black uppercase text-muted-foreground">Authority map</p>
        <p className="mt-2 text-base font-bold">지갑 이름 대신 네 가지 권한을 추적한다</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">`embedded`, `non-custodial`, `serverless`라는 이름만으로는 누가 실제 서명할 수 있는지 알 수 없다.</p>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4" role="group" aria-label="지갑 권한 구조 선택">
          {(Object.keys(ARCHITECTURES) as ArchitectureId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              aria-pressed={selected === id}
              className={`min-h-11 rounded-md border px-3 text-xs font-bold transition-colors ${selected === id ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted/40'}`}
            >
              {ARCHITECTURES[id].label}
            </button>
          ))}
        </div>
        <div className="mt-6 divide-y divide-border border-y border-border">
          {AXES.map(([label, key, Icon], index) => (
            <div key={key} className="grid min-w-0 gap-3 py-4 sm:grid-cols-[2.5rem_7rem_minmax(0,1fr)] sm:items-start">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted/20"><Icon className="h-4 w-4" aria-hidden="true" /></span>
              <div><code className="text-[10px] font-black text-muted-foreground">0{index + 1}</code><p className="mt-1 text-xs font-bold">{label}</p></div>
              <p className="text-sm leading-relaxed text-muted-foreground">{architecture[key]}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-3 border-l-2 border-amber-500/60 bg-amber-500/[0.05] px-4 py-3">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
          <p className="text-sm leading-relaxed">{architecture.warning}</p>
        </div>
      </div>
    </div>
  );
}

const PIPELINE = [
  { label: 'Identity', icon: Fingerprint, question: '누가 로그인했는가?', control: 'OIDC issuer·nonce·session을 검증한다.', failure: '로그인 토큰만으로 거래 승인을 대신한다.' },
  { label: 'Policy', icon: ShieldCheck, question: '이 사용자가 이 거래를 해도 되는가?', control: '금액·대상·시간·위험 신호로 정책을 평가한다.', failure: '계정 소유만 확인하고 권한 범위를 생략한다.' },
  { label: 'Intent', icon: BadgeCheck, question: '사용자가 바로 이 거래를 승인했는가?', control: 'chain, contract, method, amount, nonce를 화면과 서명 대상에 묶는다.', failure: '불투명한 payload나 오래된 승인을 재사용한다.' },
  { label: 'Quorum', icon: Users, question: '필요한 key share가 동의했는가?', control: '독립 party와 장치가 동일 digest에 참여한다.', failure: '모든 share가 같은 세션·같은 공급망에 종속된다.' },
  { label: 'Broadcast', icon: Radio, question: '서명한 바로 그 거래가 전송되는가?', control: '서명 전후 digest와 chain nonce를 다시 확인한다.', failure: '전송 단계에서 대상 거래가 바뀌거나 중복 전송된다.' },
] as const;

export function AuthorizationPipelineExplorer() {
  const [step, setStep] = useState(0);
  const current = PIPELINE[step];
  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase text-muted-foreground">Signing authorization pipeline</p>
          <p className="mt-2 text-base font-bold">로그인 성공에서 서명까지는 다섯 개의 다른 질문이다</p>
          <div className="mt-5 grid grid-cols-5 gap-1.5">
            {PIPELINE.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setStep(index)}
                  aria-label={`${index + 1}단계 ${item.label}`}
                  aria-pressed={step === index}
                  className={`flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-md border px-1 transition-colors ${step === index ? 'border-blue-500/60 bg-blue-500/[0.08]' : 'border-border'}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="max-w-full truncate text-[9px] font-black sm:text-[10px]">{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-5 border-y border-border py-4">
            <p className="text-sm font-bold">{current.question}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.control}</p>
          </div>
        </div>
        <div className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="font-mono text-3xl font-black">0{step + 1}</p>
          <p className="mt-1 text-xs font-bold text-muted-foreground">{current.label}</p>
          <p className="mt-5 text-[10px] font-black uppercase text-rose-700 dark:text-rose-300">이 단계를 생략하면</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.failure}</p>
        </div>
      </div>
    </div>
  );
}

type ShareMode = 'reconstruct' | 'threshold';

export function ShareSigningExplorer() {
  const [mode, setMode] = useState<ShareMode>('threshold');
  const reconstruct = mode === 'reconstruct';
  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div><p className="text-[10px] font-black uppercase text-muted-foreground">2-of-3 key flow</p><p className="mt-2 text-base font-bold">같은 share 세 개라도 서명 경로는 다르다</p></div>
        <div className="grid grid-cols-2 rounded-md border border-border bg-background p-1">
          <button type="button" onClick={() => setMode('reconstruct')} aria-pressed={reconstruct} className={`min-h-10 rounded-sm px-2 text-xs font-bold ${reconstruct ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>복원 후 서명</button>
          <button type="button" onClick={() => setMode('threshold')} aria-pressed={!reconstruct} className={`min-h-10 rounded-sm px-2 text-xs font-bold ${!reconstruct ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>공동 서명</button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-3 gap-2">
          {[
            [Laptop, 'Browser', 'share A'],
            [Server, 'Service', 'share B'],
            [Smartphone, 'Backup', 'share C'],
          ].map(([Icon, label, share]) => {
            const ShareIcon = Icon as typeof Laptop;
            return <div key={label as string} className="min-w-0 rounded-md border border-border px-2 py-4 text-center"><ShareIcon className="mx-auto h-4 w-4" aria-hidden="true" /><p className="mt-2 truncate text-[10px] font-black">{label as string}</p><code className="mt-1 block truncate text-[9px] text-muted-foreground">{share as string}</code></div>;
          })}
        </div>
        <div className="my-4 flex items-center justify-center"><ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground" aria-hidden="true" /></div>
        {reconstruct ? (
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="rounded-md border border-rose-500/40 bg-rose-500/[0.05] p-4"><LockKeyhole className="h-5 w-5" aria-hidden="true" /><p className="mt-3 text-sm font-bold">개인키 k를 메모리에 복원</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">이 순간의 process·memory·log가 새로운 보호 대상이다.</p></div>
            <ArrowRight className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
            <div className="rounded-md border border-border p-4"><KeyRound className="h-5 w-5" aria-hidden="true" /><p className="mt-3 text-sm font-bold">일반 단일키 서명</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">SSS 복구를 썼지만 threshold signature는 아니다.</p></div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="rounded-md border border-blue-500/40 bg-blue-500/[0.05] p-4"><Users className="h-5 w-5" aria-hidden="true" /><p className="mt-3 text-sm font-bold">share를 유지한 채 protocol 실행</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">각 party는 nonce·commitment·message를 교환한다.</p></div>
            <ArrowRight className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
            <div className="rounded-md border border-emerald-500/40 bg-emerald-500/[0.04] p-4"><BadgeCheck className="h-5 w-5" aria-hidden="true" /><p className="mt-3 text-sm font-bold">검증 가능한 signature 하나</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">원본 개인키 k는 signing 과정에 나타나지 않는다.</p></div>
          </div>
        )}
      </div>
    </div>
  );
}

type ThreatId = 'xss' | 'device-loss' | 'provider' | 'oauth';

const THREATS: Record<ThreatId, { label: string; icon: typeof CircleAlert; compromised: string[]; survives: string[]; verdict: string }> = {
  xss: { label: 'XSS·공급망', icon: CircleAlert, compromised: ['브라우저 입력·화면', 'WASM memory', '서명 요청 내용'], survives: ['OS secure hardware의 non-exportable key'], verdict: 'WASM은 메모리 안전성을 주지만 같은 origin의 악성 script로부터 거래 의도를 숨겨 주는 enclave가 아니다.' },
  'device-loss': { label: '장치 분실', icon: Smartphone, compromised: ['device share 가용성', '로컬 IndexedDB'], survives: ['독립 backup share', '복구 quorum과 timelock'], verdict: '복구가 없으면 self-custody가 영구 손실이 되고, 복구가 너무 쉬우면 복구 채널이 주 서명 채널보다 약해진다.' },
  provider: { label: '서비스 장애', icon: CloudOff, compromised: ['coordinator', '정책 API', 'provider-held share'], survives: ['독립 signer quorum', 'export·migration 절차'], verdict: '서버가 raw key를 저장하지 않아도 availability와 policy가 한 공급자에 묶이면 실질적인 서비스 의존성은 남는다.' },
  oauth: { label: 'OAuth 탈취', icon: Fingerprint, compromised: ['로그인 session', 'identity assertion'], survives: ['device-bound approval', '거래 digest 확인', '독립 signing quorum'], verdict: '로그인은 사용자의 identity를 주장할 뿐, 특정 chain·amount·recipient에 대한 서명 의도를 자동으로 증명하지 않는다.' },
};

export function BrowserThreatLab() {
  const [threat, setThreat] = useState<ThreatId>('xss');
  const selected = THREATS[threat];
  const Icon = selected.icon;
  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6"><p className="text-[10px] font-black uppercase text-muted-foreground">Browser wallet threat lab</p><p className="mt-2 text-base font-bold">어떤 경계가 깨졌는지 바꾸면 필요한 복구가 달라진다</p></div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {(Object.keys(THREATS) as ThreatId[]).map((id) => (
            <button key={id} type="button" onClick={() => setThreat(id)} aria-pressed={threat === id} className={`min-h-11 rounded-md border px-2 text-xs font-bold ${threat === id ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>{THREATS[id].label}</button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="border-l-2 border-rose-500/60 pl-4"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-rose-600" aria-hidden="true" /><p className="text-xs font-black">깨진 경계</p></div><ul className="mt-3 space-y-2">{selected.compromised.map((item) => <li key={item} className="text-sm text-muted-foreground">{item}</li>)}</ul></div>
          <div className="border-l-2 border-emerald-500/60 pl-4"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" /><p className="text-xs font-black">독립적이면 남는 방어</p></div><ul className="mt-3 space-y-2">{selected.survives.map((item) => <li key={item} className="text-sm text-muted-foreground">{item}</li>)}</ul></div>
        </div>
        <p className="mt-6 border-y border-border py-4 text-sm font-bold leading-relaxed">{selected.verdict}</p>
      </div>
    </div>
  );
}
