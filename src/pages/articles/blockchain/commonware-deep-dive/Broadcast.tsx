import BroadcastViz from './viz/BroadcastViz';

export default function Broadcast() {
  return (
    <section id="broadcast" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">브로드캐스트 & DSMR</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          기존 블록체인 데이터 전파: 리더가 전체 블록을 모든 검증자에게 전송
          <br />
          문제 — 대역폭 낭비(중복 전송), 리더 병목(단일 노드 의존), 리더 비응답 시 성능 저하
        </p>
        <p className="leading-7">
          <strong>ordered_broadcast</strong> — Commonware의 데이터 전파 프리미티브
          <br />
          합의와 분리: 브로드캐스트는 합의 없이 독립적으로 동작
          <br />
          다중 시퀀서: 리더 병목 없이 병렬 데이터 전파
          <br />
          연결된 인증서: 각 메시지가 이전 메시지의 임계 서명을 포함 — Pre-Consensus Receipt
        </p>
        <p className="leading-7">
          <strong>DSMR</strong>(Decoupled State Machine Replication) — Replicate → Sequence → Execute를 독립 단계로 분리
          <br />
          <strong>ZODA</strong>(Zero-Overhead Data Availability) — Reed-Solomon 인코딩으로 샤드 분할, 신뢰 설정 불필요
        </p>
      </div>
      <div className="not-prose mb-8"><BroadcastViz /></div>
    </section>
  );
}
