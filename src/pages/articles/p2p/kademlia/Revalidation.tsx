import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Revalidation({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="revalidation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2-tier 재검증 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          버킷에 한번 들어간 노드가 영원히 머무르면 죽은 노드가 쌓인다.
          <br />
          go-ethereum은 <code>table_reval.go</code>에서 <strong>fast/slow 2단계 재검증</strong>을 구현한다.
          <br />
          새 노드는 빠르게 검증하고, 검증된 노드는 느리게 주기적으로 확인한다.
        </p>

        <h3>Fast vs Slow 리스트</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {[
            { name: 'Fast List', interval: '~3초', desc: '새로 추가된 노드 / 엔드포인트가 변경된 노드.\n빠르게 생사 확인하여 죽은 노드를 일찍 걸러낸다.' },
            { name: 'Slow List', interval: '~9초', desc: '이미 검증된 노드.\n정상 응답 이력이 있으므로 느린 주기로 확인해도 충분.' },
          ].map(l => (
            <div key={l.name} className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
              <p className="font-mono font-bold text-sm text-indigo-400">{l.name}</p>
              <p className="text-xs text-foreground/60 mt-0.5">주기: {l.interval}</p>
              <p className="text-sm mt-2 whitespace-pre-line">{l.desc}</p>
            </div>
          ))}
        </div>

        <h3>재검증 응답 처리</h3>
        <p>
          PING을 보내고 응답을 기다린다. 결과에 따라 <code>livenessChecks</code> 카운터를 조정한다.
        </p>
        <CodePanel title="handleResponse 핵심 로직" lang="go" code={`func (tr *tableRevalidation) handleResponse(tab *Table, resp revalidationResponse) {
    n := resp.n
    b := tab.bucketAtDistance(enode.LogDist(tab.self().ID(), n.ID()))

    if resp.didRespond {
        // 성공: livenessChecks 증가, 검증됨 표시
        n.livenessChecks++
        n.isValidatedLive = true
        // ENR 시퀀스가 높으면 새 레코드 요청
        if resp.newRecord != nil {
            tab.bumpInBucket(b, resp.newRecord, false)
        }
        // 엔드포인트 변경 없으면 slow list로 이동
        tab.moveToList(&tr.slow, n)
    } else {
        // 실패: livenessChecks를 1/3로 감소
        n.livenessChecks /= 3
        if n.livenessChecks <= 0 {
            // 완전히 0이면 버킷에서 삭제
            tab.deleteInBucket(b, n.ID())
        } else {
            // 아직 여유 있으면 fast list에서 재시도
            tab.moveToList(&tr.fast, n)
        }
    }
}`} annotations={[
          { lines: [5, 8], color: 'emerald', note: '응답 성공: 카운터 증가, 검증 완료' },
          { lines: [9, 11], color: 'sky', note: 'ENR 시퀀스가 더 높으면 레코드 갱신' },
          { lines: [13, 14], color: 'sky', note: '검증 완료 → slow list로 이동' },
          { lines: [16, 17], color: 'amber', note: '실패: 카운터를 3으로 나눔 (급격한 감소)' },
          { lines: [18, 20], color: 'rose', note: '카운터 0 → 버킷에서 완전 삭제' },
          { lines: [21, 23], color: 'amber', note: '아직 여력 → fast list에서 빠르게 재시도' },
        ]} />

        <h3>왜 /3 감소인가?</h3>
        <p>
          단순히 -1이 아니라 <strong>/3</strong>으로 감소시키는 이유: 지수적 감쇠(exponential decay).
          <br />
          오래 검증된 노드(livenessChecks가 높음)는 한두 번 실패해도 바로 제거되지 않는다.
          <br />
          반면 새로 추가된 노드(checks=1)는 한 번만 실패해도 즉시 제거.
          <br />
          네트워크 순간 장애 시 안정적인 노드가 살아남는 구조다.
        </p>

        <h3>재검증 전체 흐름</h3>
        <div className="not-prose grid grid-cols-1 gap-2 my-4">
          {[
            { step: '1. 노드 추가', desc: '새 노드 → fast list에 배치', color: 'sky' },
            { step: '2. Fast 재검증', desc: '~3초 간격 PING. 성공 → slow list 이동', color: 'emerald' },
            { step: '3. Slow 재검증', desc: '~9초 간격 PING. 성공 → checks++, slow 유지', color: 'indigo' },
            { step: '4. 실패 처리', desc: 'checks /= 3. 0이면 삭제, 아니면 fast로 복귀', color: 'amber' },
            { step: '5. 삭제 → 승격', desc: '버킷에서 삭제 시 교체 목록에서 대체 노드 승격', color: 'rose' },
          ].map(s => (
            <div key={s.step} className={`rounded-lg border border-${s.color}-500/20 bg-${s.color}-500/5 p-3`}>
              <p className={`font-semibold text-sm text-${s.color}-400`}>{s.step}</p>
              <p className="text-sm text-foreground/75 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
