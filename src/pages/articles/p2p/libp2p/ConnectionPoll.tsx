import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

const pollSteps = [
  { n: 1, label: 'requested_substreams 타임아웃', desc: '대기 중인 아웃바운드 요청이 타임아웃되면 DialUpgradeError를 Handler에 전달한다.' },
  { n: 2, label: 'handler.poll()', desc: 'OutboundSubstreamRequest면 대기열에 추가. NotifyBehaviour면 이벤트를 즉시 반환한다.' },
  { n: 3, label: 'negotiating_out 폴링', desc: '아웃바운드 multistream-select 협상 완료를 대기. 성공 시 FullyNegotiatedOutbound 전달.' },
  { n: 4, label: 'negotiating_in 폴링', desc: '인바운드 업그레이드 완료를 대기. 실패 시 IO/NegotiationFailed/Timeout으로 분기.' },
  { n: 5, label: 'Shutdown 조건 확인', desc: '활성 스트림·협상 중 스트림이 모두 0이고 keep_alive가 false면 종료 타이머를 시작한다.' },
  { n: 6, label: 'muxer.poll() — 주소 변경', desc: 'StreamMuxerEvent::AddressChange 수신 시 Handler에 알리고 Event::AddressChange를 반환한다.' },
  { n: 7, label: 'muxer.poll_outbound()', desc: 'requested_substreams에 대기 항목이 있으면 새 아웃바운드 서브스트림을 할당한다.' },
  { n: 8, label: 'muxer.poll_inbound()', desc: '동시 협상 수가 max_negotiating_inbound_streams 미만이면 새 인바운드 서브스트림을 수락한다.' },
];

export default function ConnectionPoll({ onCodeRef }: {
  title?: string; onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="connection-poll" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Connection::poll() 상태 머신</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Connection</strong>은 단일 피어 연결의 내부 상태 머신입니다.<br />
          Swarm의 Pool이 각 Connection을 tokio task로 spawn합니다.
          <code>Connection::poll()</code>이 그 task의 메인 루프입니다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('poll-next-event', codeRefs['poll-next-event'])} />
            <CodeViewButton onClick={() => onCodeRef('connection-handler', codeRefs['connection-handler'])} />
          </div>
        )}

        <h3>poll() 내부 우선순위 — 8단계</h3>
        <p>
          모든 단계는 <code>loop</code> 안에서 순차 실행됩니다.<br />
          어느 단계든 진행이 있으면 <code>continue</code>로 루프 처음으로 돌아갑니다.<br />
          전부 <code>Pending</code>이면 비로소 <code>Poll::Pending</code>을 반환합니다.
        </p>
      </div>

      <div className="not-prose space-y-2 my-6">
        {pollSteps.map(s => (
          <div key={s.n} className="flex items-start gap-3 rounded-lg border border-border/40 bg-card/50 px-4 py-3">
            <span className="flex-none w-6 h-6 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-bold">
              {s.n}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground/90">{s.label}</p>
              <p className="text-xs text-foreground/60 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>설계 판단: 왜 Handler를 먼저 폴링하나?</h3>
        <p>
          Handler가 새 서브스트림을 요청해야 muxer에서 할당할 수 있습니다.<br />
          순서가 바뀌면 muxer가 아직 요청이 없어 아무것도 하지 못하고,
          다음 wake에서야 비로소 할당합니다. 불필요한 wake 한 사이클 낭비입니다.
        </p>

        <h3>서브스트림 업그레이드 흐름</h3>
        <p>
          muxer가 raw 서브스트림을 열면 <strong>multistream-select</strong>로 프로토콜을 협상합니다.<br />
          협상 성공 시 <code>InboundUpgradeSend</code> 또는 <code>OutboundUpgradeSend</code>를 실행합니다.<br />
          최종적으로 <strong>FullyNegotiatedInbound/Outbound</strong> 이벤트가 Handler에 전달됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">poll() 루프 설계 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Connection::poll() 설계 원칙
//
// Goal:
//   "가능한 한 많은 진행을 하나의 wake에서 수행"
//
// 8-step priority loop:
//
//   loop {
//       // 1. Timeouts first
//       if let Some(expired) = check_timeouts() {
//           notify_handler(expired);
//           continue;
//       }
//
//       // 2. Handler drives outbound
//       if let Ready(event) = handler.poll(cx) {
//           match event {
//               OutboundSubstreamRequest => {
//                   queue_for_muxer();
//                   continue;
//               }
//               NotifyBehaviour(e) => return Ready(e);
//           }
//       }
//
//       // 3-4. Active negotiations
//       if progress_negotiating_out(cx) { continue; }
//       if progress_negotiating_in(cx) { continue; }
//
//       // 5. Shutdown check
//       if idle && !keep_alive {
//           start_shutdown();
//       }
//
//       // 6-8. Muxer events
//       if let Ready(event) = muxer.poll(cx) {
//           notify_handler(event);
//           continue;
//       }
//
//       if has_pending_outbound() {
//           if let Ready(s) = muxer.poll_outbound(cx) {
//               start_negotiation(s);
//               continue;
//           }
//       }
//
//       if can_accept_inbound() {
//           if let Ready(s) = muxer.poll_inbound(cx) {
//               start_negotiation(s);
//               continue;
//           }
//       }
//
//       return Pending;
//   }

// 왜 loop?
//   - 한 progress가 다음 progress 유발 가능
//   - 예: Handler 응답 → 새 stream 요청 → muxer 할당
//   - 단일 wake에서 연쇄 처리

// 왜 continue?
//   - 전체 loop 재실행
//   - 우선순위 높은 것 먼저
//   - Starvation 방지
//   - Fair scheduling

// 왜 Handler → Muxer 순서?
//   - Handler가 새 stream 필요 여부 결정
//   - Muxer는 stream 할당만
//   - 반대 순서면 빈 할당 가능성

// async_trait 없이 Pin/Future 직접 사용:
//   - Zero-cost abstraction
//   - 컴파일 타임 최적화
//   - 런타임 오버헤드 없음`}
        </pre>
      </div>
    </section>
  );
}
