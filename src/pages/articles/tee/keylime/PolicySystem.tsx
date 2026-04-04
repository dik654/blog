import PolicyViz from './viz/PolicyViz';

export default function PolicySystem() {
  return (
    <section id="policy-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">정책 시스템</h2>
      <p className="leading-7 mb-4">
        Keylime 정책 시스템 — TPM 정책 + 런타임 정책 두 축 구성<br />
        TPM 정책 — PCR 허용 값 정의<br />
        런타임 정책 — IMA 측정 로그의 파일 해시 허용 목록을 JSON 스키마로 관리<br />
        정책 위반 시 자동 철회(Revocation) 메커니즘 동작
      </p>

      <PolicyViz />

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">런타임 정책 구조</h3>
        <div className="rounded-xl border p-4">
          <ul className="space-y-1.5 text-sm">
            <li><strong className="font-mono">meta</strong>: 정책 버전(version)과 생성기 타입(generator)</li>
            <li><strong className="font-mono">digests</strong>: 파일 경로별 허용 해시 목록</li>
            <li><strong className="font-mono">excludes</strong>: 검증에서 제외할 파일 정규식 패턴</li>
            <li><strong className="font-mono">keyrings</strong>: IMA 키링 정보 (서명 검증용)</li>
            <li><strong className="font-mono">ima</strong>: IMA 관련 세부 설정 (log_hash_alg, dm_policy 등)</li>
            <li><strong className="font-mono">verification-keys</strong>: 검증용 공개키 (PEM/DER)</li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold mt-4">성능 최적화</h3>
        <p className="leading-7">
          GLOBAL_POLICY_CACHE — 에이전트별 정책 캐싱<br />
          체크섬 동일 시 재파싱 없이 캐시 재사용<br />
          증명 상태도 IMA PCR 평가 시에만 DB 저장 → 불필요한 I/O 최소화
        </p>
      </div>
    </section>
  );
}
