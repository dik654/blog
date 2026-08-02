export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 — 이더리움 노드·검증자 운영의 실전</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 글은 이더리움 검증자 인프라 운영에 집중한다.
          <br />
          EL/CL/VC 의 책임 분리, 클라이언트 다양성, 슬래싱 방지, DR 까지 — Four Pillars 의 Rejamong 이 3 년간 글로벌 6~7 위 검증자를 운영하며 정리한 가이드를 한국어 시각으로 재구성한 것.
          <br />
          끝에 CI/CD · 쿠버네티스 · 이더리움 운영 면접에서 자주 나오는 24 개 Q&amp;A + 위기 시나리오 3 개로 마무리.
        </p>
        <p className="leading-7">
          CI/CD 파이프라인 보안과 쿠버네티스 노드 운영은 별도 글로 분리되어 있다 — 같은 카테고리의 다른 두 글에서 더 깊게 다룬다.
          <br />
          여기서는 이더리움 운영의 본질에만 집중하되, 면접 Q&amp;A 는 세 영역을 모두 커버한다.
        </p>
        <h3 className="text-xl font-semibold mt-8 mb-3">목차</h3>
        <ol className="leading-7">
          <li><strong>이더리움 노드 운영</strong> — EL/CL/Validator 분리, Engine API, 하드웨어, 동기화, MEV-Boost, 라이프사이클, 블롭, 실전 사고 시나리오</li>
          <li><strong>슬래싱 보호 &amp; DR</strong> — 다층 슬래싱 보호, DVT, 클라이언트 다양성, Web3Signer/Vouch, 사고 카탈로그, 한국 인프라 고려사항, 30 분 행동 플레이북</li>
          <li><strong>면접 Q&amp;A</strong> — CI/CD · K8s · 이더리움 24 문항 + 위기 시나리오 3</li>
        </ol>
        <h3 className="text-xl font-semibold mt-8 mb-3">함께 보면 좋은 글</h3>
        <ul className="leading-7">
          <li><a href="/blog/ops/cicd-pipeline-security" className="underline">CI/CD 파이프라인 보안</a> — GitHub RCE 사례 + 6 단계 파이프라인 + 공급망 게이트</li>
          <li><a href="/blog/ops/k8s-node-management" className="underline">쿠버네티스 노드 운영</a> — 클러스터 아키텍처 + StatefulSet + 격리 + etcd 운영</li>
        </ul>
      </div>
    </section>
  );
}
