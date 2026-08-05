export default function CICDSecurity() {
  return (
    <section id="cicd-security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1. CI/CD 파이프라인 보안 — GitHub RCE 사례</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">사고 타임라인</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">시각 (UTC)</th>
              <th className="text-left py-2">이벤트</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2">3/4 17:45</td><td>버그바운티(Wiz)로 제보 도착</td></tr>
            <tr className="border-b"><td className="py-2">~18:25</td><td>사내 재현 · 영향도 확정 (40 분)</td></tr>
            <tr className="border-b"><td className="py-2">19:00</td><td>github.com 패치 배포 (제보부터 75 분)</td></tr>
            <tr className="border-b"><td className="py-2">+α</td><td>GHES 6 라인(3.14~3.20) 패치 릴리스</td></tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold mt-8 mb-3">취약점의 본질 — 신뢰 경계 침범</h3>
        <p className="leading-7">
          git push 는 <code>push options</code> 라는 키-값 문자열을 서버로 보낸다.
          <br />
          GitHub 의 푸시 처리기는 이 값을 내부 서비스 간 메타데이터에 끼워 넣었는데, 사용자가 메타데이터의 <strong>구분자 문자</strong>를 그대로 박을 수 있었다.
          <br />
          후행 서비스는 자기 입력이 사내에서 만들어진 신뢰 가능한 값으로 해석해, 추가 필드를 인젝션해 환경변수를 갈아끼고 hook 샌드박스를 우회 — 임의 명령 실행에 도달한다.
        </p>
        <p className="leading-7">
          공격에 필요한 권한은 단 하나, <strong>해당 저장소에 push 가능한 사용자</strong>.
          <br />
          명령은 그저 <code>git push</code> + 가공된 push option 한 줄.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 빨리 잡았나 — 비정상 코드 경로의 관측가능성</h3>
        <p className="leading-7">
          익스플로잇이 강제로 타고 가는 분기는 정상 운영에서 절대 실행되지 않는 경로였다.
          <br />
          이 사실 자체가 검출 신호다 — 텔레메트리에 그 분기 진입 카운터가 박혀 있고, 쿼리 가능했다.
          <br />
          포렌식은 모든 진입을 Wiz 연구원의 테스트로 매핑했고, 고객 데이터 유출이 없음을 증명했다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">다층 방어 — 패치 너머의 정리</h3>
        <p className="leading-7">
          1 차 픽스는 push option 값의 살균(sanitization)이다 — 구분자 문자가 메타데이터 인젝션으로 흐르지 않게 차단.
          <br />
          그러나 조사 도중 <strong>도커 이미지에 다른 제품 라인에서만 쓰는 코드가 같이 들어 있었다</strong>는 사실이 드러났다.
          <br />
          GitHub 는 그 코드를 production 이미지에서 제거 — 공격면을 영구히 줄이는 2 차 방어를 함께 적용했다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CI/CD 보안에 적용할 5 가지 원칙</h3>
        <ol className="leading-7">
          <li><strong>경계에서 살균</strong> — 사용자 입력은 내부 서비스로 넘기기 전에 직렬화 안전 형태(JSON, length-prefixed)로 변환. 구분자 기반 평문 포맷은 절대 금물.</li>
          <li><strong>내부 메타데이터를 사용자 평면과 섞지 말 것</strong> — 동일 채널에 신뢰 영역이 다른 데이터가 흐르면 인젝션은 시간 문제. 별도 헤더, 별도 채널, 별도 키.</li>
          <li><strong>이미지 미니마이제이션</strong> — 한 이미지에 여러 제품 라인 코드를 같이 굽지 말 것. distroless, 멀티스테이지 빌드로 런타임에 필요한 바이너리만 남긴다.</li>
          <li><strong>비정상 경로 텔레메트리</strong> — &quot;정상이면 절대 안 타는 분기&quot;를 명시 카운터로 노출하고 알람을 건다. 익스플로잇은 거의 항상 평소에 안 가는 길로 간다.</li>
          <li><strong>버그바운티의 평소 운영</strong> — 75 분 패치는 트리아지 · 재현 · 핫픽스 · 카나리 배포 라인이 평시에 살아 있어야 가능하다. 사고 후 만들면 늦다.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">CI/CD 공격면 — push 외에도 봐야 할 곳</h3>
        <ul className="leading-7">
          <li><strong>러너(runner) 토큰 · OIDC</strong> — self-hosted 러너의 등록 토큰, GitHub Actions 의 OIDC 토큰은 secrets 가 아닌 ID 토큰이지만 잘못된 trust policy 면 클라우드 권한 상승.</li>
          <li><strong>워크플로 인젝션</strong> — <code>${'${{ github.event.issue.title }}'}</code> 를 <code>run:</code> 에 직접 박는 패턴은 PR 제목/이슈 본문으로 RCE.</li>
          <li><strong>composite/외부 액션 핀</strong> — <code>uses: foo/bar@main</code> 은 메인테이너 키만 털리면 끝. SHA 핀(<code>@&lt;commit&gt;</code>) + dependabot 으로만 갱신.</li>
          <li><strong>아티팩트 무결성</strong> — 빌드 산출물에 <code>cosign</code>/<code>SLSA provenance</code> 서명. 배포 단계에서 검증해야 빌드 노드 침해가 다음 단계로 안 번진다.</li>
          <li><strong>시크릿 스코프</strong> — 환경별 시크릿 분리, OIDC 로 키 자체를 없앤다. 하드코딩된 long-lived 토큰은 1 순위 제거 대상.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 공급망 사고 카탈로그 — 패턴이 반복된다</h3>
        <ul className="leading-7">
          <li><strong>Codecov bash uploader 침해 (2021.04)</strong> — Codecov 의 업로드 스크립트가 침해되어 CI 환경변수를 외부로 유출. 침해 발견까지 ~2 개월. 영향: HashiCorp, Twilio, Atlassian 등의 secrets 노출. 교훈: 외부 스크립트를 <code>curl ... | bash</code> 로 실행하지 말 것 — 서명 검증된 binary 또는 SHA-pinned 버전으로.</li>
          <li><strong>SolarWinds Orion (2020)</strong> — 빌드 시스템 침해로 정상 서명된 악성 업데이트 배포. 배포 채널의 신뢰가 붕괴. 교훈: SLSA 빌드 출처(provenance)와 reproducible build 가 빌드 시스템 침해의 마지막 방어선.</li>
          <li><strong>ua-parser-js npm hijack (2021)</strong> — 메인테이너 npm 계정 탈취 → 악성 버전 게시 → 수십만 다운로드. 교훈: npm <code>--ignore-scripts</code> 기본화, 의존성 lock 파일 + dependabot 자동 검증, 새 메이저 버전은 stage 빌드에서 격리 테스트.</li>
          <li><strong>Travis CI 환경변수 유출 (2021)</strong> — fork PR 빌드에서 secrets 가 노출되는 설정 버그. 교훈: <code>pull_request_target</code> 류 트리거에서 secrets 노출 정책을 명시, fork 의 워크플로 변경은 옛 정책으로 실행.</li>
          <li><strong>Drupal-style 의존성 confusion (2021)</strong> — 사내 패키지명을 public registry 에 먼저 점령 → 사내 빌드가 외부 악성 버전을 가져옴. 교훈: private registry scope 명시(<code>@company/...</code>), public-private 동명 패키지 금지 정책.</li>
          <li><strong>shai-hulud npm worm (2025.09)</strong> — npm 패키지의 <code>postinstall</code> 훅이 환경변수와 깃 자격증명 수집 → 같은 작성자 다른 패키지 자동 게시. 교훈: <code>--ignore-scripts</code> 기본, 격리 sandbox 에서 install, 의심 활동 알림(예측 외 npm publish) 즉시 차단.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">OIDC + SLSA + Cosign — 실제 워크플로 예시</h3>
        <p className="leading-7">
          공급망 보안의 현재 표준 — long-lived 토큰 제거(OIDC), 빌드 출처 증명(SLSA), 아티팩트 서명(Cosign).
        </p>
        <ul className="leading-7">
          <li><strong>OIDC 클라우드 자격증명</strong> — GitHub Actions 의 <code>id-token: write</code> 권한 → AWS STS <code>AssumeRoleWithWebIdentity</code>. trust policy 에서 <code>repo:owner/repo:ref:refs/heads/main</code> 같이 정확한 ref 와 환경 매칭. 와일드카드(<code>repo:owner/*:*</code>) 는 절대 금지.</li>
          <li><strong>SLSA 빌드 출처</strong> — <code>slsa-github-generator</code> 액션이 빌드 후 <code>provenance.json</code> 생성: 어느 commit, 어느 워크플로, 어느 빌더가 만들었는지 증명. 배포 게이트에서 <code>slsa-verifier</code> 로 검증 — provenance 없으면 거부.</li>
          <li><strong>Cosign keyless 서명</strong> — Sigstore Fulcio 가 OIDC 토큰을 받아 단명 X.509 인증서 발급, 서명 후 Rekor 투명성 로그에 등록. 검증: <code>cosign verify --certificate-identity=... --certificate-oidc-issuer=https://token.actions.githubusercontent.com</code>. 키 관리 부담 0.</li>
          <li><strong>Kubernetes 어드미션 검증</strong> — Kyverno / Connaisseur policy 에 &quot;반드시 우리 OIDC 신원으로 서명된 이미지만 허용&quot; 규칙. 미서명·외부 이미지는 클러스터 진입 자체를 차단.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">워크플로 위험 패턴 — 깊이 있는 사례</h3>
        <ul className="leading-7">
          <li><strong>pull_request_target 의 함정</strong> — 이 트리거는 base 브랜치 컨텍스트로 실행되므로 <strong>secrets 사용 가능</strong>. 그런데 같은 워크플로에서 PR 의 코드를 checkout 해 빌드하면 PR 작성자가 워크플로를 작성한 것과 동일한 효과 — 임의 코드로 secrets 탈취. 안전한 패턴: secrets 가 필요한 작업과 PR 코드 빌드를 별 워크플로로 분리.</li>
          <li><strong>environment protection rules</strong> — 프로덕션 배포 워크플로는 <code>environment: production</code> 으로 보호 rule(승인자, wait timer, 분기 제한) 적용. 누가 언제 어디서 배포했는지가 자동 감사.</li>
          <li><strong>concurrency + cancel-in-progress</strong> — 빌드 race condition 방지. 같은 ref 의 이전 빌드 자동 취소. 잘못 쓰면 hot fix 가 옛 빌드에 의해 cancel 되니 분기별 정책 신중.</li>
          <li><strong>permissions 명시</strong> — 워크플로 최상단에 <code>permissions:</code> 명시로 default token scope 제거. 필요한 권한만 부여(보통 <code>contents: read</code>). <code>permissions: write-all</code> 은 즉시 제거 대상.</li>
          <li><strong>required reviewers 우회 패턴</strong> — branch protection 의 &quot;require review&quot; 는 PR review 만 막을 뿐, repository admin 의 직접 push 는 다른 정책이 필요(&quot;include administrators&quot; 옵션). 종종 잊는 설정.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">시크릿 회전 플레이북 — 침해 의심 시 30 분 행동</h3>
        <ol className="leading-7">
          <li><strong>0~5 분</strong> — 영향 토큰 식별 (CI 시크릿 ID, OIDC trust policy, 외부 서비스 API key). audit log 에서 마지막 사용 시간 확인.</li>
          <li><strong>5~15 분</strong> — long-lived 자격증명은 즉시 무효화 → 새 자격증명 발급. OIDC 자격증명은 무효화 의미 없으니 trust policy 에서 영향 ref/repo 를 제외. 외부 서비스의 webhook secret 도 회전.</li>
          <li><strong>15~25 분</strong> — 새 자격증명을 vault/secrets manager 에 등록 → 영향 워크플로 재실행으로 정상 동작 확인.</li>
          <li><strong>25~30 분</strong> — 회전 결과 게시 (사고 채널, postmortem 시작). 영향 평가: 침해 시점부터 회전까지 사이의 모든 외부 호출 audit. 의심 동작이 있으면 별도 사고로 escalate.</li>
        </ol>
      </div>
    </section>
  );
}
