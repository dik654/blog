import { Link } from "react-router-dom";

const PATH = [
  ["state", "상태", "현재 입력과 직전 요약을 합침", "/cs/ai/rnn"],
  ["language-model", "예측", "상태에서 다음 token을 채점", "/cs/ai/rnn-language-model"],
  ["bptt", "학습", "시간축을 거슬러 책임을 합침", "/cs/ai/bptt"],
  ["gates", "보존", "gate로 기억 경로를 다시 설계", "/cs/ai/lstm"],
  ["seq2seq", "변환", "source에서 target sequence를 생성", "/cs/ai/seq2seq"],
  ["attention", "조회", "필요한 source 위치를 다시 읽음", "/cs/ai/attention-theory"],
] as const;

type TrackId = (typeof PATH)[number][0];

export function RnnTrackLocator({
  current,
  question,
  fixture,
  parentHref,
  parentLabel,
  secondaryHref,
  secondaryLabel,
}: {
  current: TrackId;
  question: string;
  fixture: string;
  parentHref: string;
  parentLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <aside className="not-prose mb-8 border-y border-border py-5" aria-label="순환 신경망 학습 지도에서 현재 글의 위치">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground" aria-label="순환 신경망 글 위치">
        {PATH.map(([id, label, , href], index) => (
          <span key={id} className="contents">
            {id === current ? <strong className="text-foreground" aria-current="page">{label}</strong> : <Link to={href} className="hover:text-primary">{label}</Link>}
            {index < PATH.length - 1 ? <span aria-hidden>›</span> : null}
          </span>
        ))}
      </nav>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">{question}</p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">{fixture}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모</p>
          <Link to={parentHref} className="mt-1 block text-sm font-bold leading-6 hover:text-primary">{parentLabel} ↗</Link>
          {secondaryHref && secondaryLabel ? <Link to={secondaryHref} className="mt-2 block text-xs leading-5 text-muted-foreground hover:text-primary">{secondaryLabel} ↗</Link> : null}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-px bg-border p-px sm:grid-cols-6" aria-label="순환 신경망 학습 경로">
        {PATH.map(([id, label, description, href], index) => (
          <Link to={href} key={id} aria-current={id === current ? "step" : undefined} className={`min-w-0 bg-background px-2 py-3 ${id === current ? "text-primary" : "text-muted-foreground"}`}>
            <span className="font-mono text-[9px]">0{index + 1}</span>
            <strong className="mt-1 block break-keep text-xs">{label}</strong>
            <span className="mt-1 hidden text-[10px] leading-4 text-muted-foreground lg:block">{description}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default function RnnSeriesLocator() {
  return <RnnTrackLocator current="state" question="같은 계산을 반복하면서, 앞에서 본 입력이 어떻게 다음 시점까지 남을까요?" fixture="스칼라 RNN 하나에 입력 1→0→1을 넣어 state가 0→0.462→0.354→0.654로 바뀌는 과정을 추적합니다." parentHref="/cs/ai/neural-network" parentLabel="입력을 affine transform과 activation으로 바꾸는 신경망" secondaryHref="/cs/ai/activation-functions#tanh" secondaryLabel="tanh가 값을 −1과 1 사이로 바꾸는 과정" />;
}

export function RnnMapReturn() {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 순환 신경망 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">순환 신경망 지도에 되돌려 놓기</p>
      <p className="mt-2 break-keep text-base font-bold leading-7">RNN의 기억은 원문 보관함이 아니라, 같은 transition이 매 시점 덮어쓰는 고정 크기 상태입니다.</p>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">이제 이 상태에 vocabulary 출력층을 붙이면 다음 token을 예측할 수 있고, 학습할 때는 펼친 시간 graph를 반대로 따라갑니다.</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        <Link to="/cs/ai/rnn-language-model" className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">RNN 언어 모델로 이어가기 →</Link>
        <Link to="/cs/ai/bptt" className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">BPTT 학습 경로 보기 →</Link>
      </div>
    </aside>
  );
}
