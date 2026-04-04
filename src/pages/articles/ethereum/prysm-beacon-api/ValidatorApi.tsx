import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ValidatorApi(_props: Props) {
  return (
    <section id="validator-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Validator API</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">의무 조회</h3>
        <p>
          <code>GetDuties(epoch)</code> — 해당 에폭의 어테스테이션·제안·싱크위원회 의무를 반환한다.<br />
          검증자 클라이언트는 에폭 시작 시 의무를 가져와 슬롯별 스케줄링.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 제안</h3>
        <p>
          <code>GetBeaconBlock(slot)</code> — 비콘 블록 템플릿을 요청한다.<br />
          비콘 노드가 어테스테이션 풀, 실행 페이로드, RANDAO reveal을 조립하여 반환.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">어테스테이션 제출</h3>
        <p>
          <code>ProposeAttestation(att)</code> — 서명된 어테스테이션을 제출한다.<br />
          비콘 노드는 유효성 검증 후 서브넷에 gossip 전파.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 검증자 워크플로우</strong> — 에폭 시작 → GetDuties → 슬롯별 스케줄<br />
          제안 슬롯: GetBeaconBlock → 서명 → ProposeBlock<br />
          어테스테이션 슬롯: GetAttestationData → 서명 → ProposeAttestation
        </p>
      </div>
    </section>
  );
}
