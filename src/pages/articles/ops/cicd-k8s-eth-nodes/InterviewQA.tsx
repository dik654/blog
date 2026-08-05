type QA = {
  q: string;
  a: string;
  followups?: string[];
};

const cicdQAs: QA[] = [
  {
    q: 'GitHub 의 git push RCE(CVE-2026-3854)에서 핵심 결함은 무엇이었나?',
    a: '사용자가 보낸 push option 값이 내부 서비스 간 메타데이터에 직렬화될 때 구분자 문자가 살균되지 않았다. 후행 서비스는 자기 입력을 사내 신뢰 값으로 해석했고, 추가 필드 인젝션으로 hook 샌드박스를 우회해 RCE 에 도달했다. 본질은 신뢰 영역이 다른 데이터(사용자 입력 vs 사내 메타)가 같은 채널에 평문으로 흘렀다는 것.',
    followups: [
      '구분자 기반 평문 포맷 대신 어떤 직렬화를 쓰면 이 부류 인젝션이 원천 봉쇄되나?',
      '내부 서비스 간 입력을 다시 검증해야 할까, 아니면 경계에서 한 번이면 되나?',
    ],
  },
  {
    q: 'GitHub 가 75 분 만에 패치할 수 있던 이유를 운영 관점에서 설명해 보라.',
    a: '비정상 경로에 미리 텔레메트리 카운터가 박혀 있어 익스플로잇 흔적을 즉시 쿼리할 수 있었고, 버그바운티 트리아지 → 재현 → 핫픽스 → 카나리 배포가 평시 운영으로 자동화돼 있었다. 사고 후에 만들면 반드시 늦는 인프라다.',
    followups: ['비정상 경로 텔레메트리는 어떤 메트릭 형태로 노출하는 게 좋은가?'],
  },
  {
    q: 'Self-hosted GitHub Actions 러너를 K8s 위에 운영할 때 어떤 격리를 적용하나?',
    a: '전용 노드 풀 + taint, gVisor/Kata 같은 샌드박스 런타임, default-deny NetworkPolicy + 명시 화이트리스트, actions-runner-controller 로 잡당 일회성 Pod, OIDC 단명 토큰으로 long-lived 클라우드 키 제거. 이 다섯이 기본이다.',
    followups: ['gVisor 와 Kata 의 트레이드오프? 왜 어떤 워크로드는 Kata 를 골라야 하나?'],
  },
  {
    q: 'CI 의 시크릿이 평소엔 어떻게 새는가? 가장 흔한 누설 경로는?',
    a: '워크플로의 <code>${{ ... }}</code> 가 <code>run:</code> 에 직접 박힌 인젝션, 외부 액션을 태그(<code>@v1</code>)로만 핀해 메인테이너 키 침해 시 다음 빌드에 악성 코드 실행, fork PR 에서 시크릿 노출, 빌드 산출물에 환경변수가 섞인 채로 업로드. SHA 핀 + OIDC + readonly fork 정책이 1차 방어.',
  },
  {
    q: '<code>pull_request_target</code> 트리거가 위험한 이유와 안전한 사용 패턴은?',
    a: '이 트리거는 base 브랜치 컨텍스트(secrets 접근 가능)에서 실행되는데, 같은 워크플로에서 PR 코드를 checkout 해 빌드하면 PR 작성자가 워크플로를 작성한 것과 동등한 권한을 갖는다. 안전한 패턴은 secrets 사용 작업과 PR 코드 빌드 워크플로를 분리하고, label 을 통해 메인테이너 승인된 PR 에만 secrets 가용 잡을 트리거하는 것.',
    followups: ['<code>workflow_run</code> 으로 우회하는 패턴은 어떻게 다른가?'],
  },
  {
    q: 'OIDC trust policy 의 흔한 실수와 안전한 작성법은?',
    a: '와일드카드(<code>repo:owner/*:*</code>)로 모든 repo·branch 에서 가정 가능하게 둠, ref 조건 없음(어떤 branch 든 production 권한), environment 미사용. 안전: 정확한 <code>repo:owner/repo:ref:refs/heads/main</code> 또는 <code>repo:owner/repo:environment:production</code>. environment + branch protection rule 조합으로 누가 어디서 배포 가능한지 한 곳에서 표현.',
  },
  {
    q: 'SLSA provenance 와 Cosign 서명을 결합한 배포 게이트를 설계하라.',
    a: '빌드 단계에서 <code>slsa-github-generator</code> 가 provenance.json 생성, <code>cosign</code>이 keyless 서명(Fulcio + Rekor). 배포 게이트(K8s 어드미션 Kyverno 또는 ArgoCD pre-sync)에서 (1) cosign verify 로 우리 OIDC 신원으로 서명 확인, (2) slsa-verifier 로 provenance 가 우리 워크플로에서 생성됐는지 확인. 둘 다 통과한 이미지만 배포.',
  },
  {
    q: 'shai-hulud 같은 npm worm 부류를 빌드 시스템에서 어떻게 봉쇄하나?',
    a: '<code>--ignore-scripts</code> 기본화로 postinstall 차단, install 은 격리 sandbox(컨테이너 또는 별 네임스페이스)에서, npm/yarn audit 자동 실행, 예측 외 npm publish 이벤트(우리 패키지 새 버전이 우리 CI 에서 출간되지 않은 경우) 즉시 알람. 더 나아가면 의존성 lock + dependabot review + 새 메이저 버전은 stage 빌드 격리.',
  },
];

const k8sQAs: QA[] = [
  {
    q: 'Kubernetes 시크릿이 etcd 에 저장될 때의 약점과 강화 방법은?',
    a: '기본은 base64 인코딩일 뿐 평문에 가깝다. <code>EncryptionConfiguration</code> 의 <code>kms</code> provider 로 KMS envelope encryption 을 켜고, 더 나아가면 External Secrets Operator 로 Vault/Secrets Manager 와 동기화해 etcd 에 시크릿 자체를 두지 않는다. 종착지는 SPIFFE/SPIRE 같은 워크로드 ID 로 시크릿 자체를 없애는 것.',
  },
  {
    q: 'Pod 가 최소권한으로 돌게 하려면 어떤 컨트롤을 조합하나?',
    a: 'Pod Security Admission 의 <code>restricted</code> 프로파일을 네임스페이스 라벨로 강제, RBAC 으로 ServiceAccount 권한을 명시 zero 부터 쌓고, NetworkPolicy 로 default-deny ingress/egress 후 화이트리스트, seccomp/AppArmor 프로파일로 시스템 콜 제한. 마지막에 Falco/Tetragon 으로 런타임 이상 행동 감시.',
  },
  {
    q: 'CI/CD 가 클러스터 전체를 점유하는 위험을 어떻게 줄이나?',
    a: '러너는 신뢰 불가 코드 실행 환경이라 가정. 전용 노드 풀 + taint, 샌드박스 런타임으로 커널 격리, 일회성 Pod, 클러스터 내부 망과 격리, OIDC 로 클라우드 권한 단명화. CI 컨트롤 플레인을 별도 클러스터로 분리하면 가장 깔끔하다.',
  },
  {
    q: 'StatefulSet 과 Deployment 의 본질적 차이, 검증자 fleet 에 적합한 패턴은?',
    a: 'StatefulSet 은 안정 네트워크 ID(<code>pod-N</code>), volumeClaimTemplates 로 PVC 1:1 영속 바인딩, 순서 있는 시작/종료를 보장. 검증자처럼 키와 슬래싱 보호 DB 가 인스턴스에 묶이는 워크로드는 StatefulSet + <code>local-path</code> 또는 zone-aware CSI + PodDisruptionBudget(<code>maxUnavailable: 1</code>) 이 표준. terminationGracePeriodSeconds 를 충분히 길게(600s+) 줘서 graceful shutdown 보장.',
    followups: ['그러면 새 노드로 옮길 때 PV 가 따라가게 하는 메커니즘은?'],
  },
  {
    q: 'PodAntiAffinity 와 topologySpreadConstraints 를 클라이언트 다양성 강제에 쓰라.',
    a: 'PodAntiAffinity <code>requiredDuringScheduling</code> 으로 같은 클라이언트 라벨 Pod 가 같은 노드에 못 앉게, topologySpreadConstraints 로 zone 별 균등 분포. 추가로 노드 자체에 <code>el-client=reth</code> 같은 taint 를 박아 다른 클라이언트 워크로드 진입 차단. 주기적으로 <code>kubectl get pods -o wide</code> 로 실제 분포가 의도대로인지 검증하는 cron 도 운영 일부.',
  },
  {
    q: 'etcd 가 가득 찼다는 알람이 왔다. 무엇부터 하나?',
    a: '즉시: <code>etcdctl endpoint status</code> 로 dbsize 확인, 옛 revision 가비지 컬렉션 후 <code>etcdctl defrag</code>. 동시에 <code>etcdctl snapshot save</code> 로 백업 — 이 단계 건너뛰면 defrag 중 사고 시 복구 불가. 평소 defrag 자동화 + 8 GB 임계 알람이 이 사고를 예방. 매니지드 클러스터(EKS) 는 자동이지만 자가 운영은 수동 정책.',
  },
];

const ethQAs: QA[] = [
  {
    q: 'EL · CL · VC 의 책임 분리를 설명하라. 셋이 같은 머신에 있어도 되나?',
    a: 'EL 은 EVM 실행과 상태 DB, CL 은 비콘 체인 합의와 포크 선택, VC 는 BLS 서명과 슬래싱 보호 DB 를 책임진다. 같은 머신에 둬도 동작은 하지만, VC 만큼은 별 머신 + Web3Signer 같은 원격 서명자로 분리하는 게 운영 안전. 머신 한 대가 죽었을 때 키가 순식간에 다른 곳에서 시작 가능해야 슬래싱 없이 페일오버된다.',
    followups: ['Engine API 의 JWT 인증이 풀리면 무슨 일이 생기나?'],
  },
  {
    q: '검증자 페일오버 중에 가장 흔한 슬래싱 사고는?',
    a: 'double vote — 같은 키가 옛 노드와 새 노드에서 동시에 attestation 을 만들 때. 그래서 액티브-액티브는 절대 금지, 항상 액티브-스탠바이 + 수동 승격 + 슬래싱 보호 DB 동기화 후 시작. 클라이언트 내장 doppelganger detection(2~3 epoch 청취)이 마지막 방어선이다.',
    followups: ['DVT 가 이 문제를 어떻게 다르게 푸는가?'],
  },
  {
    q: '클라이언트 다양성이 왜 슬래싱 위험과 직결되나?',
    a: '한 클라이언트가 점유율 2/3 을 넘긴 상태에서 합의 버그가 터지면, 그 클라이언트가 만든 잘못된 체인이 일시적으로 캐논으로 보일 수 있다. 그 클라이언트 쓰는 검증자는 모두 거기 vote → 다른 체인이 캐논으로 굳을 때 surround vote 또는 wrong target 으로 대규모 슬래싱. 그래서 EL/CL 둘 다 마이너 페어 권장.',
  },
  {
    q: 'Archive node 와 Full node 디스크 차이는 어디서 오나?',
    a: 'Archive 는 모든 과거 블록의 상태 트라이를 보존. Full 은 최근 ~128 블록 외엔 헤더 + 트랜잭션만 두고 과거 상태는 폐기. Geth archive 가 15 TB 대인 이유는 복제된 트라이 노드가 많아서고, Erigon 은 staged sync + flat state 로 4 TB 대로 압축한다. 미래엔 EIP-4444 로 history expiry 가 들어가 full node 부담도 더 줄어든다.',
  },
  {
    q: 'MEV-Boost 를 쓰는 검증자는 어떤 운영 결정을 추가로 해야 하나?',
    a: '여러 릴레이 동시 연결로 단일 릴레이 실패에 대비, <code>min_bid</code> 를 너무 높게 두면 missed proposal 위험이 있어 미세 튜닝 필요. OFAC 필터링 릴레이만 쓰면 검열 검증자가 되니 정책에 따라 censorship-resistant 릴레이 포함 검토. 마지막에 모든 릴레이가 죽어도 로컬 페이로드로 떨어지는 fallback 이 항상 살아 있어야 한다.',
  },
  {
    q: 'Web3Signer 를 HA 로 띄울 때 가장 흔한 슬래싱 함정은?',
    a: '각 인스턴스가 자기 로컬 슬래싱 보호 DB 를 보면 같은 키로 두 번 서명할 수 있다. HA Web3Signer 는 반드시 <strong>같은 PostgreSQL</strong> 을 공유해야 하고, VC 의 로컬 보호 DB 는 비활성화해 진실의 출처를 한 곳으로. 두 번째 함정은 PostgreSQL 자체의 HA — 비동기 복제는 split-brain 시 슬래싱 위험, 동기 복제(quorum) 권장.',
    followups: ['VC 의 로컬 보호 DB 를 비활성화하는 명령은?'],
  },
  {
    q: 'EIP-4844 블롭이 검증자 운영에 어떤 영향을 줬나?',
    a: '비콘 노드 디스크 부담이 ~50 GB 정도 증가(블롭 ~18 일 보관 후 폐기). 블록 제안 시 blob sidecar 까지 함께 배달하지 않으면 missed proposal — MEV-Boost 가 blob-aware relay 만 쓰는지 확인. 인덱서·스테이트 분석 운영자라면 blob retention 을 길게 잡거나 별도 archive 로 빠르게 옮겨야 함. 디스크 알람 임계도 70% 로 보수적으로.',
  },
  {
    q: 'EL 의 디스크가 80% 도달했다. 옵션과 그 trade-off 는?',
    a: '(a) 디스크 확장 — EBS 면 <code>modify-volume</code> + 파일시스템 resize, 다운타임 거의 0. (b) 노드 교체 — 새 디스크에 fresh sync 후 cutover. (c) 프루닝 토글 — 일부 클라이언트는 한 번 archive 였다 prune 으로 돌리면 corrupt. 절대 금지: <code>rm -rf chaindata</code>. 정답은 보통 (a). standby 노드가 있다면 (b) 도 깔끔.',
    followups: ['Geth 와 Reth 의 path-based DB 차이는 디스크 운영에 어떻게 반영되나?'],
  },
  {
    q: '한국에서 글로벌 mesh 까지 latency 가 attestation 효율에 미치는 영향은?',
    a: 'attestation inclusion delay 는 슬롯 12 초 안에 BN 까지 도달해야 보상 최대. 한국→유럽 RTT ~200ms 라 BN 다중 연결, peer 다양화(KR/JP/SG 우선), MEV-Boost relay 도 지역 가까운 것 포함. 100ms 단위 차이가 inclusion delay 에 직접 반영되어 효율 1~3% 가 갈린다.',
  },
  {
    q: '슬래싱 사고가 났다. 30 분 안에 어떤 의사결정을 하나?',
    a: '먼저 절대 손대지 않을 것: 노드 재시작·키 이동. 0~5 분 — 영향 범위 식별(검증자 수, 행위 유형). 5~15 분 — 사고 유형별 분기: double vote 의심이면 모든 인스턴스 즉시 정지, 단 한 개만 슬래싱 보호 DB 검증 후 재개. 15~30 분 — 회복 검증, postmortem 시작. 사고 후 같은 사고가 못 생기게 시스템 변경(예: doppelganger detection 의무화, HA 정책 변경).',
  },
  {
    q: 'inactivity leak 와 슬래싱은 어떻게 다른가?',
    a: 'inactivity leak 는 finality 가 4 epoch 이상 안 나면 발동, 비활성 검증자 잔고를 quadratic 으로 감소 — burn 이 아니라 보상 미수령으로 누적 손실. 25% 가 동시 다운된 시나리오 회복 메커니즘. 슬래싱은 명시적 위반 행위(double propose · double vote · surround vote) 의 즉시 burn + correlation penalty. 둘 다 작동 가능: 다운된 검증자가 inactivity leak 으로 줄어들 때 동시에 슬래싱 위반 시 더 큰 손실.',
  },
  {
    q: '0x00 자격증명이 남아 있는 검증자에 대해 운영자는 무엇을 해야 하나?',
    a: 'Capella 이후 출금 가능하려면 0x01 (EL 주소형) 로 변환 필수. <code>staking-deposit-cli generate-bls-to-execution-change</code> 로 변환 메시지 생성, 비콘 체인에 broadcast. 받을 EL 주소가 우리 통제 하에 있는지(특히 멀티시그면 같은 체인에 배포됐는지) 먼저 검증. 한 번 변환되면 되돌릴 수 없음.',
  },
];

function QABlock({ qas, idPrefix }: { qas: QA[]; idPrefix: string }) {
  return (
    <div className="space-y-6">
      {qas.map((qa, i) => (
        <div key={i} id={`${idPrefix}-${i + 1}`} className="border-l-4 border-neutral-300 dark:border-neutral-700 pl-4">
          <p className="font-semibold leading-7"><span className="text-blue-600 dark:text-blue-400">Q.</span> {qa.q}</p>
          <p className="leading-7 mt-2" dangerouslySetInnerHTML={{ __html: `<span class="text-emerald-700 dark:text-emerald-400 font-semibold">A.</span> ${qa.a}` }} />
          {qa.followups && (
            <ul className="leading-7 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {qa.followups.map((f, j) => <li key={j}>↳ 후속: {f}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default function InterviewQA() {
  return (
    <section id="interview-qa" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">5. 면접 Q&amp;A</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          블록체인 코어 / 인프라 / 스테이블코인 운영 포지션에서 자주 나오는 질문을 세 묶음으로 정리.
          <br />
          답안은 이 글의 본문을 압축한 형태고, 후속 질문은 면접관이 깊이를 잴 때 자주 따라 나오는 방향이다.
        </p>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-3">CI/CD 보안 (4)</h3>
      <QABlock qas={cicdQAs} idPrefix="qa-cicd" />

      <h3 className="text-xl font-semibold mt-10 mb-3">Kubernetes & 격리 (3)</h3>
      <QABlock qas={k8sQAs} idPrefix="qa-k8s" />

      <h3 className="text-xl font-semibold mt-10 mb-3">Ethereum 노드 & 검증자 (5)</h3>
      <QABlock qas={ethQAs} idPrefix="qa-eth" />

      <h3 className="text-xl font-semibold mt-10 mb-3">위기 시나리오 — 페이지 받았을 때 (3)</h3>
      <div className="space-y-6">
        <div className="border-l-4 border-red-300 dark:border-red-700 pl-4">
          <p className="font-semibold leading-7"><span className="text-red-600 dark:text-red-400">Scenario.</span> 새벽 2시, 검증자 50개 중 12개가 missed attestation 5분째. on-call 본인.</p>
          <p className="leading-7 mt-2">
            먼저 외부 검증 — beaconcha.in 에서 영향 검증자 status, 글로벌 사고인지 확인.
            글로벌이면 대기(네트워크 회복). 로컬이면: 12 개의 공통점(같은 노드? 같은 zone? 같은 클라이언트?). 같은 노드면 노드 헬스(disk · CPU · peers · syslog). 같은 zone 이면 ISP/클라우드 알람.
            <br />
            절대 안 할 것: 키 옮김, 노드 재시작 — 슬래싱 위험. 우선은 진단, 페일오버는 standby 가 준비된 경우에만 절차서대로.
          </p>
        </div>
        <div className="border-l-4 border-red-300 dark:border-red-700 pl-4">
          <p className="font-semibold leading-7"><span className="text-red-600 dark:text-red-400">Scenario.</span> CI 빌드가 평소의 5x 시간이 걸린다. cache 미스 같은데 동시에 새 npm 의존성이 추가됐다.</p>
          <p className="leading-7 mt-2">
            의심: 의존성 confusion 또는 typosquatting. <code>package-lock.json</code> diff 로 새 의존성 출처 확인 (private vs public registry, 패키지 작성자). audit 로그에서 이전 빌드의 의존성과 비교.
            <br />
            동시에: CI 환경에서의 outbound network 모니터링 — 새 의존성이 의외 endpoint 와 통신하는지. 의심되면 빌드 차단, 의존성 격리 환경에서 별도 분석.
          </p>
        </div>
        <div className="border-l-4 border-red-300 dark:border-red-700 pl-4">
          <p className="font-semibold leading-7"><span className="text-red-600 dark:text-red-400">Scenario.</span> 쿠버네티스 클러스터의 etcd 가 quota error 를 반환하기 시작. 모든 새 Pod 가 Pending.</p>
          <p className="leading-7 mt-2">
            즉시: <code>etcdctl endpoint status</code> → dbsize 확인 (8 GB 임계 초과 가능성). <code>etcdctl snapshot save</code> 백업 먼저, 그 후 <code>etcdctl alarm disarm</code> + <code>defrag</code>.
            <br />
            파급: 이미 떠 있는 워크로드는 영향 없지만 새 배포·스케일·업데이트 모두 차단. 회복 후 문서화: defrag 자동화 cron + dbsize 알람 임계 5 GB 로 강화.
          </p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mb-3">면접 답변 팁</h3>
        <ul className="leading-7">
          <li>운영 질문은 항상 <strong>장애 시나리오 → 방어선 → 사고 시 조치</strong> 3 단으로 답한다.</li>
          <li>&quot;왜 이렇게 안 하면 안 되는가&quot; 를 한 줄 더 붙이면 깊이가 묻어남(예: 액티브-액티브 금지의 이유 = double vote).</li>
          <li>모르면 추측 대신 &quot;직접 운영해 보지 않았지만 이런 trade-off 가 있을 것 같다&quot; 로 솔직하게.</li>
          <li>본인 프로젝트 경험(Reth, Prysm 분석, RAG, fm-go-rpc)을 사례로 끌어와 답을 구체화하면 점수가 올라감.</li>
          <li>위기 시나리오 질문엔 항상 <strong>먼저 안 하는 것</strong>(키 이동·재시작 같은 슬래싱 위험 행동)을 명시하면 운영 감각이 묻어남.</li>
        </ul>
      </div>
    </section>
  );
}
