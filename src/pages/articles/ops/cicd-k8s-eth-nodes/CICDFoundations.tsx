import PipelineFlowViz from './viz/PipelineFlowViz';
import AttackChainViz from './viz/AttackChainViz';
import DeploymentStrategiesViz from './viz/DeploymentStrategiesViz';

export default function CICDFoundations() {
  return (
    <section id="cicd-foundations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">A. CI/CD 기초 — 면접 단골 개념</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CI/CD 면접에서 검사하는 건 도구 이름이 아니라 <strong>왜 이 단계가 있는가</strong>이다.
          <br />
          파이프라인의 6 단계와 각 단계가 막는 위험을 같이 외워야 답이 깊어진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">파이프라인 6 단계 — 시각화</h3>
        <p className="leading-7 mb-4">
          각 단계의 도구와 게이트, 실패 시 자동 롤백 흐름을 한 눈에.
        </p>
      </div>
      <PipelineFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">브랜칭 전략 — trunk-based 가 현재 표준</h3>
        <ul className="leading-7">
          <li><strong>Trunk-based development</strong> — 모든 개발자가 main 직접 commit (혹은 짧은 PR). feature flag 로 미완성 코드 숨김. 머지 갈등 최소, 배포 빈도 ↑.</li>
          <li><strong>GitHub Flow</strong> — main + 짧은 feature branch + PR. Trunk-based 의 절충안. 대부분 SaaS 가 이 패턴.</li>
          <li><strong>GitFlow</strong> — main · develop · release · hotfix · feature 의 5 종 브랜치. 복잡함, 분기당 책임 명확. 임베디드/엔터프라이즈 정기 릴리스 모델.</li>
          <li><strong>면접 관점</strong> — &quot;trunk-based 를 권장하지만 현재 팀 모델·릴리스 cadence 에 따라 다르다. 우리는 <em>X</em> 이유로 <em>Y</em> 를 쓴다&quot; 처럼 trade-off 명시.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">환경과 promotion — &quot;같은 아티팩트, 다른 설정&quot;</h3>
        <ul className="leading-7">
          <li><strong>dev → staging → prod</strong> — 환경별 빌드 금지. 한 번 빌드된 immutable image 가 환경 사이를 promote.</li>
          <li><strong>설정 분리</strong> — 코드와 설정 분리(12-factor). ConfigMap/Secret · 환경변수로 주입.</li>
          <li><strong>environment protection</strong> — prod 배포는 manual approval, wait timer, 분기 제한. 자동화돼 있어도 사람 게이트가 필요.</li>
          <li><strong>data plane vs control plane</strong> — DB 마이그레이션은 별 파이프라인. 데이터는 코드와 다른 lifecycle.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">배포 전략 — 다운타임 vs 위험 분산</h3>
        <ul className="leading-7">
          <li><strong>Recreate</strong> — 옛 거 다 끄고 새 거 시작. 다운 있음, 가장 단순.</li>
          <li><strong>Rolling update</strong> — 점진 교체 (K8s 기본). <code>maxSurge</code>/<code>maxUnavailable</code> 로 속도 조절. 짧은 동시 운영.</li>
          <li><strong>Blue/Green</strong> — 두 환경 동시 운영, traffic switch 로 즉시 전환. 즉시 롤백 가능, cost 2x.</li>
          <li><strong>Canary</strong> — 신 버전에 1% → 10% → 50% 점진 라우팅. 신호 기반 자동 진행/롤백. 가장 안전, 도구 복잡(Flagger, Argo Rollouts).</li>
          <li><strong>Shadow / Mirror</strong> — 신 버전이 prod 트래픽 복사를 받아 비교만, 응답은 안 보냄. 정확성 검증 단계.</li>
        </ul>
      </div>
      <DeploymentStrategiesViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">

        <h3 className="text-xl font-semibold mt-8 mb-3">GitOps — 선언적 + 자동 reconcile</h3>
        <ul className="leading-7">
          <li><strong>핵심 아이디어</strong> — git 저장소가 desired state 의 단일 진실. 컨트롤러(ArgoCD/Flux) 가 클러스터 상태와 비교해 자동 적용.</li>
          <li><strong>장점</strong> — 변경 audit (git log = 모든 변경), 롤백 = git revert, 다중 클러스터 일관성, 사람 manual kubectl 금지.</li>
          <li><strong>실수 패턴</strong> — &quot;cluster &gt; git&quot; 으로 누군가 직접 수정 → drift. ArgoCD <code>syncPolicy.automated.prune=true</code> 로 drift 자동 정리.</li>
          <li><strong>secrets in git</strong> — 평문 금지. <code>sealed-secrets</code> 또는 <code>SOPS</code> 로 암호화된 형태로만.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">아티팩트 관리 — 불변성과 추적성</h3>
        <ul className="leading-7">
          <li><strong>immutable tag</strong> — <code>v1.2.3</code>, <code>git-sha</code>, <code>build-N</code>. <code>latest</code> 같은 가변 태그는 prod 금지.</li>
          <li><strong>semver</strong> — major.minor.patch. breaking change → major, 기능 → minor, 버그픽스 → patch. lib 사용자가 자동 업데이트 결정.</li>
          <li><strong>retention</strong> — 옛 빌드는 자동 cleanup (e.g., 30 일). 다만 production 에 떠 있는 모든 버전은 보존.</li>
          <li><strong>private vs public</strong> — 사내 패키지는 private registry scope (<code>@company/...</code>). 의존성 confusion 방어.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">테스트 피라미드와 품질 게이트</h3>
        <ul className="leading-7">
          <li><strong>피라미드 모양</strong> — unit (많이) &gt; integration &gt; e2e (적게). 위로 갈수록 느리고 비싸고 깨지기 쉬움.</li>
          <li><strong>코드 커버리지</strong> — 80% 같은 절대 수치보다 &quot;변경된 파일의 변경된 라인&quot; 커버리지가 더 의미 있다 (delta coverage).</li>
          <li><strong>contract test</strong> — 마이크로서비스 사이 interface 검증 (Pact). 통합 테스트 없이도 호환성 보장.</li>
          <li><strong>fuzz · property test</strong> — 입력 자동 생성으로 edge case 잡음. Rust <code>cargo-fuzz</code>, Go <code>testing.F</code>.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">시크릿 관리 — 평문 금지, 단명 토큰</h3>
        <ul className="leading-7">
          <li><strong>금기</strong> — 코드 commit, 워크플로 평문, 컨테이너 이미지 빌드 시 박힘, 환경변수에 long-lived 토큰.</li>
          <li><strong>중간 단계</strong> — Vault / AWS Secrets Manager / GCP Secret Manager + External Secrets Operator. 시크릿 회전이 자동 이벤트.</li>
          <li><strong>최종 단계</strong> — OIDC / SPIFFE 로 시크릿 자체 제거. 워크로드가 ID 만 있고 단명 토큰을 그때그때 발급받음.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">GitHub RCE 공격 체인 — 시각화</h3>
        <p className="leading-7 mb-4">
          공격자 입력이 신뢰 경계를 넘어 RCE 에 도달하는 5 단계와 75 분 패치의 다층 방어.
        </p>
      </div>
      <AttackChainViz />
    </section>
  );
}
