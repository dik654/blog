# C-cloud 감사 원장
확인일: 2026-10-09. 글 16편. 열어 본 URL 153개(성공 153 / 실패 0 — 글에 적힌 고유 URL 120개는 전부 HTTP 200이나, 그중 7개는 다른 문서로 301/302 리다이렉트됨. 나머지 33개는 교차 확인용으로 추가로 연 공식 페이지·GitHub API·oEmbed).

전제: 호출자가 당일 이미 확인한 AI-200 존재·네 영역·비중과 NCA-AIIO 세부는 재검증하지 않았다. 그 외 모든 시험 수치·현행 여부·Kubernetes 의미론·링크·인용문을 1차 자료로 열어 대조했다.

## 요약
- 발견: WRONG 0 · OUTDATED 3 · MISLEADING 2 · CALC 0 · LINK 9 · MISSING 3 · UNVERIFIED 1
- 가장 중요한 발견
  1. **DVA-C02를 "현행"으로만 적었는데 AWS 공식 페이지는 후속 DVA-C03 등록이 2026-10-27 개시, DVA-C02 마지막 응시일 2026-11-30이라고 공지 중** — `awsData.ts:209,241,257,270`, `commonData.ts:32,84` (OUTDATED). 한국어 SOA 폐지는 `currentNotice`로 넣었으면서 DVA 전환 공지는 빠짐.
  2. **SOA-C03 평가 범위에 "cost/optimization"을 넣음** — `cloudEngineeringDepth.ts:392` (MISLEADING). 공식 가이드의 다섯 영역에 비용 영역은 없고, "Cost and Performance Optimization(12%)"은 SOA-C02에만 있던 Domain 6이며, SOA-C03은 "Analyze costs and total cost of ownership"을 명시적으로 범위 밖으로 둠.
  3. **DevOps Engineer Expert 선행 자격 조건이 글에 없음** — `azureData.ts:203,211,222` (MISSING). 공식 자격 페이지는 Azure Administrator Associate 또는 Azure Developer Associate 중 하나를 요구하는데, 후자(AZ-204)는 2026-07-31 폐지됐고 AI-200 대체 반영은 MS Q&A 답변으로만 확인됨. Solutions Architect Expert 선행 조건은 적으면서 DevOps 쪽은 빠져 경로 글로서 비대칭.
  4. **Cilium "1.20.1 stable"은 확인일(2026-10-08) 이전에 이미 1.20.2(2026-09-16 발행)로 바뀜** — `kubernetes-network-packet-path.tsx:409,488`, `article-evidence.ts` 13412 블록, `article-learning.ts` 체크리스트 (OUTDATED).
  5. **Gateway API "v1.6.1"도 확인일 기준 v1.6.2(2026-09-03)·v1.6.3(2026-10-06)이 나온 뒤** — `kubernetes-network-packet-path.tsx:431,488` (OUTDATED). 인용한 getting-started 페이지 자체가 v1.6.1 설치 manifest를 아직 가리키고 있어 글은 문서를 그대로 옮긴 것이나, "확인 기준"으로 적기엔 뒤처짐.
- 링크 결함 9건은 전부 "열리긴 하나 다른 문서로 리다이렉트되거나 `excerpt`가 원문 그대로가 아님"이다(404 없음). 특히 `cloudEngineeringDepth.ts:233`(Lambda Operator Guide → Lambda Developer Guide 첫 페이지), `:423`(CAF fundamental-concepts → "Set up identity in Azure"), `:268`(Reliability pillar backup 페이지 → 기둥 루트)는 인용한 내용이 도착 페이지에 없다.
- 시험 수치는 전부 일치: CLF-C02 50채점+15미채점·700점·24/30/34/12%·90분·100 USD, SAA-C03 30/26/24/20%·720점·130분·65문항·150 USD, DVA-C02 32/26/24/18%·720점·130분, SOA-C03 22/22/22/16/18%·720점·130분·CloudOps 개명·한국어/중국어 간체 2026-11-19 이후 폐지, AZ-900 2026-07-20·25–30/35–40/30–35%, AZ-104 2026-04-17·20–25/15–20/20–25/15–20/10–15%, AZ-305 2026-04-17·25–30/20–25/15–20/30–35%, AZ-400 2026-07-27·10–15/10–15/50–55/10–15/5–10%, AI-200 study guide Last updated 2026-05-05, CKA v1.35·2시간·30/25/20/15/10%·445 USD. SAA-C03·CLF-C02·SOA-C03은 2026-10-09 현재 후속 버전 공지 없음(이탈리아어·독일어판 2026-12-31 폐지 공지만 있음).

## 발견 (심각도 순)
| # | route | 위치(file:line) | 주장(원문 인용) | 판정 | 근거(URL + 인용문) | 제안 수정 |
|---|---|---|---|---|---|---|
| 1 | cloud/aws-developer-cloudops-paths (+ cloud/cloud-certification-roadmap-2026) | `src/pages/articles/cloud/awsData.ts:209` "DVA-C02는 AWS 서비스를 이용한 개발, 보안, 배포, 문제 해결과 최적화를 다룹니다", `:241` "choose: DVA-C02", `:257` asOf "AWS 공식 DVA-C02·SOA-C03 Exam Guide, 2026년 10월 확인", `:263-268` currentNotice(한국어 SOA만), `commonData.ts:32` "개발은 Developer – Associate(DVA-C02)", `:84` "코드와 배포는 DVA-C02" | OUTDATED | https://aws.amazon.com/certification/certified-developer-associate/ — "This exam is being updated. Registration for the updated version (DVA-C03) opens October 27, 2026. The last day to take the current exam (DVA-C02) is November 30, 2026. Check back here on October 27 for more information about the DVA-C03 exam and exam preparation resources." (확인일 2026-10-09 기준 DVA-C02 자체는 아직 응시 가능) | DVA 글 `currentNotice`에 DVA-C03 전환 일정(10-27 등록 개시 / 11-30 C02 마지막)을 추가하고, 로드맵 글 6·8절과 examScope에 "11월 30일 이후 응시면 DVA-C03 가이드로 재확인" 문장을 넣는다. DVA-C03 가이드는 10-27 공개 예정이므로 영역 비중은 그때 갱신. |
| 2 | cloud/aws-developer-cloudops-paths | `src/pages/articles/cloud/cloudEngineeringDepth.ts:392` "AWS CloudOps Engineer exam guide … monitoring·reliability·deployment·security·networking·cost/optimization 평가 범위를 확인했습니다." | MISLEADING | https://docs.aws.amazon.com/pdfs/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.pdf — 영역은 "Content Domain 1: Monitoring, Logging, Analysis, Remediation, and Performance Optimization (22% of scored content) · Domain 2: Reliability and Business Continuity (22%) · Domain 3: Deployment, Provisioning, and Automation (22%) · Domain 4: Security and Compliance (16%) · Domain 5: Networking and Content Delivery (18%)" 다섯 개뿐. 비교표에는 "SOA-C02 Domain 6: Cost and Performance Optimization (12%)"만 있고 C03 대응 영역이 비어 있음. 범위 밖 목록: "Analyze costs and total cost of ownership. · Manage billing and invoicing for AWS services." | "monitoring/performance·reliability·deployment·security·networking 다섯 영역"으로 고치고, 비용 분석이 범위 밖으로 명시됐음을 적는다(같은 글 9절의 다섯 영역 서술과 일치시킴). |
| 3 | cloud/azure-architect-devops-paths | `src/pages/articles/cloud/azureData.ts:203` "AZ-400은 Azure 관리나 개발 중 한쪽의 강한 경험과 다른 쪽의 이해, GitHub와 Azure DevOps 사용 경험을 요구합니다", `:211` "AZ-400은 … 시험으로 프로세스·소스 관리·빌드와 릴리스·보안·관측을 다룹니다", `:222` "AZ-400은 프로세스와 소통 10~15% …" (선행 자격 언급 없음) | MISSING | https://learn.microsoft.com/en-us/credentials/certifications/devops-engineer/ — "To become a Microsoft Certified: DevOps Engineer Expert, you must earn at least one of the following: Microsoft Certified: Azure Administrator Associate, Microsoft Certified: Azure Developer Associate certification." · https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/ — "This certification and the renewal assessment are retired." · https://learn.microsoft.com/answers/a/12779227 (MS Learn Q&A) — "passing AZ-204 before it retires on July 31, 2026, permanently fulfills the prerequisite requirement for AZ-400" / "AI-200 will be added as one of the prerequisites for DevOps Engineer Expert once the exam becomes generally available." / 2026-09-03 댓글 "Still the official document says AZ-204 is prerequisite for AZ-400." | 4·6절에 "DevOps Engineer Expert 자격은 AZ-400 합격 외에 Azure Administrator Associate(또는 폐지 전 취득한 Azure Developer Associate)가 필요하다. AI-200 인정 여부는 공식 자격 페이지가 아직 갱신되지 않았으니 접수 전 확인"을 추가. decision 표의 "AZ-400" 선택지에도 선행 자격 조건을 붙인다. |
| 4 | cloud/kubernetes-network-packet-path | `src/pages/articles/cloud/kubernetes-network-packet-path.tsx:409` "Cilium 1.20.1 · Kubernetes Without kube-proxy", `:488` "확인 기준은 2026-10-08의 Kubernetes v1.37, Calico 3.33, Cilium 1.20.1 stable 문서와 Gateway API v1.6.1 Standard channel입니다", `src/content/article-evidence.ts` "cloud/kubernetes-network-packet-path" 블록 "Cilium 1.20.1 · Kubernetes Without kube-proxy", `src/content/article-learning.ts` 같은 route 체크리스트 "Cilium 1.20.1" | OUTDATED | https://docs.cilium.io/en/stable/network/kubernetes/kubeproxy-free/ — stable 문서의 예제 manifest가 전부 "https://raw.githubusercontent.com/cilium/cilium/1.20.2/examples/…"(1.20.2 참조 35회, 1.20.1 참조 0회). https://api.github.com/repos/cilium/cilium/releases/tags/v1.20.2 — "v1.20.2 2026-09-16T01:53:22Z"(확인일 2026-10-08보다 3주 전 발행) | "Cilium 1.20.x(확인일 stable 1.20.2)"로 고치거나 패치 버전을 빼고 minor만 적는다. evidence·learning 체크리스트도 동일하게. |
| 5 | cloud/kubernetes-network-packet-path | `kubernetes-network-packet-path.tsx:431` "Gateway API v1.6.1 · Getting started", `:488` "Gateway API v1.6.1 Standard channel", `article-evidence.ts` 같은 블록 "Gateway API v1.6.1 · Getting started", `article-learning.ts` 체크리스트 "Gateway API v1.6.1" | OUTDATED | https://gateway-api.sigs.k8s.io/guides/getting-started/introduction/ — 페이지는 여전히 "kubectl apply --server-side -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.6.1/standard-install.yaml"을 안내. 그러나 https://api.github.com/repos/kubernetes-sigs/gateway-api/releases/latest — "v1.6.3 2026-10-06T20:35:29Z", v1.6.2는 "2026-09-03T18:49:15Z". Standard channel 정의는 "The standard release channel includes all resources that have graduated to GA or beta, including GatewayClass, Gateway, HTTPRoute, and ReferenceGrant." | "Gateway API v1.6.x(getting-started 문서는 v1.6.1 manifest, 최신 release는 v1.6.3)"처럼 문서 버전과 release 버전을 분리해 적는다. |
| 6 | cloud/cloud-compute-selection | `src/pages/articles/cloud/cloudEngineeringDepth.ts:233` "AWS Lambda · Operator guide … https://docs.aws.amazon.com/lambda/latest/operatorguide/intro.html … serverless workload의 scaling·concurrency·failure 운영 경계를 확인했습니다." | LINK | `curl -I` 결과 "301 https://docs.aws.amazon.com/lambda/latest/dg/welcome.html". 도착 페이지 제목 "What is AWS Lambda? - AWS Lambda / Documentation AWS Lambda Developer Guide" — Operator Guide가 아니라 Developer Guide 첫 장이며 scaling·concurrency 운영 경계 서술이 없음. | Lambda Developer Guide의 scaling/concurrency 장(`lambda/latest/dg/lambda-concurrency.html` 등)으로 href를 바꾸고 label을 고친다. |
| 7 | cloud/azure-az900-fast-study | `cloudEngineeringDepth.ts:423` "Azure resource hierarchy … https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts … management group·subscription·resource group·resource의 hierarchy를 확인했습니다." | LINK | "301 https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-setup-guide/" → 최종 도착 페이지 제목 "Set up identity in Azure - Cloud Adoption Framework". 계층 설명 페이지가 아님. | Azure Resource Manager 개요(`azure-resource-manager/management/overview`)나 CAF "Resource organization" 문서로 교체. |
| 8 | cloud/cloud-storage-database-selection (reliabilitySources 공유: foundations·networking·reliability·SAA·DVA/SOA·architect-devops 글에도 전파) | `cloudEngineeringDepth.ts:268` "AWS Well-Architected · Back up data … rel_planning_for_recovery_backup.html … 정기 restore test 원칙을 확인했습니다." | LINK | "302 https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/" — 개별 페이지가 사라져 기둥 루트("Reliability Pillar")로 떨어짐. | 현행 Reliability pillar의 "REL09 Back up data" 페이지 URL로 교체(현재 문서 트리에서 다시 찾아 링크). |
| 9 | cloud/cloud-storage-database-selection | `src/pages/articles/cloud/systemsData.ts:248` source "Azure Architecture Center · Data store models", excerpt "different types of data stores", href `…/guide/technology-choices/data-store-overview`; `article-evidence.ts` 13488 블록 동일 href | LINK | "301 https://learn.microsoft.com/en-us/azure/architecture/data-guide/technology-choices/understand-data-store-models". 도착 페이지 전문에 "different types of data stores" 문구 없음(가장 가까운 문장: "Modern solutions handle diverse data, such as transactions, events, documents, telemetry, binary assets, and analytical facts. A single data store rarely satisfies all access patterns efficiently. Most production systems adopt polyglot persistence"). | href를 새 URL로, excerpt를 "A single data store rarely satisfies all access patterns efficiently"로 교체. |
| 10 | cloud/cloud-networking-request-path | `systemsData.ts:81` excerpt "control where network traffic is directed" (AWS VPC User Guide) | LINK | https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html — 원문: "A route table serves as the traffic controller for your virtual private cloud (VPC). Each route table contains a set of rules, called routes, that determine where network traffic from your subnet or gateway is directed." "control where network traffic is directed"는 없음. | excerpt를 "determine where network traffic from your subnet or gateway is directed"로 교체. |
| 11 | cloud/cloud-compute-selection | `systemsData.ts:164` excerpt "choose the right compute service", href `…/compute-on-aws-how-to-choose/compute-on-aws-how-to-choose.html`; `article-evidence.ts` 13474 블록 동일 | LINK | "301 https://docs.aws.amazon.com/decision-guides/latest/decision-guides/choosing-aws-compute-service.html". 도착 페이지 원문: "Choosing the right compute service entails matching these workload …" — 명사형 "choose the right compute service"는 없음. | href를 새 URL로, excerpt를 "Choosing the right compute service entails matching these workload"로. |
| 12 | cloud/azure-az104-fast-study | `src/pages/articles/cloud/azureData.ts:177` excerpt "expire annually" (Microsoft Learn · Azure Administrator Associate) | LINK | https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/ — 원문: "Renewal Frequency 12 months" / "Do you know that Microsoft role-based and specialty certifications expire unless they are renewed? Learn the latest updates to the technology for your job role and renew your certification at no cost by passing an online assessment on Microsoft Learn." "expire annually"라는 문구는 없음(본문 `:137`의 "매년 만료되며 무료 온라인 평가로 갱신" 자체는 사실). | excerpt를 "expire unless they are renewed" 또는 "Renewal Frequency 12 months"로. |
| 13 | cloud/cloud-certification-roadmap-2026 | `src/pages/articles/cloud/commonData.ts:90` source "AWS Certification · Exam Guides", excerpt "validate a candidate’s ability", href `…/examguides/` | LINK | https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html — 색인 본문에는 "AWS Certification validates cloud expertise…", "validates the ability to design solutions based on the AWS Well-Architected Framework" 등은 있으나 "validate a candidate's ability"는 없음. 그 문구는 SAA-C03 가이드 PDF("The exam validates a candidate's ability to design solutions")에 있음. (색인 루트 URL은 toc 하나짜리 껍데기이고 실제 본문은 `aws-certification-exam-guides.html`) | excerpt를 색인에 실제 있는 "validates the ability to design solutions based on the AWS Well-Architected Framework"로 바꾸거나, href를 SAA 가이드로 옮긴다. |
| 14 | cloud/azure-ai200-fast-study | `cloudEngineeringDepth.ts:522` "Microsoft Foundry · GenAI observability … /azure/ai-foundry/concepts/evaluation-approach-gen-ai" (+ `:457` Network Watcher URL) | LINK | "301 https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability" → 도착 제목 "Observability in Generative AI - Microsoft Foundry". 내용·label은 맞으나 URL이 바뀜. `:457`도 "301 …/network-watcher/network-watcher-overview"로 이동(내용 동일). | 두 href를 새 URL로 갱신(낮은 심각도). |
| 15 | cloud/kubernetes-network-packet-path | `kubernetes-network-packet-path.tsx:80` "Kubernetes v1.35부터 IPVS mode는 deprecated입니다. nftables 또는 개선된 iptables…", `:384` "현재 Kubernetes v1.37 문서에서 IPVS mode는 v1.35부터 deprecated이며, nftables가 후속 경로로 제시됩니다." | MISSING | https://kubernetes.io/docs/reference/networking/virtual-ips/ — "Deprecated since Kubernetes v1.35 … Support for ipvs mode will be disabled by default from Kubernetes v1.40 (you can re-enable it with the KubeProxyIPVS …) … ipvs mode will be fully removed in Kubernetes v1.43." / "In Kubernetes 1.37, this is iptables, but a future version of Kubernetes will change the default to nftables." | deprecation 서술에 "1.40 기본 비활성, 1.43 제거, 1.37 기본값은 여전히 iptables"를 넣어야 독자가 upgrade 판단을 할 수 있다. |
| 16 | cloud/kubernetes-request-path-and-cka | `src/pages/articles/cloud/kubernetesData.ts:230` currentNotice "공식 페이지는 시험 환경이 Kubernetes 새 minor release 뒤 약 4~8주 안에 맞춰질 수 있다고 밝힙니다. 이 글의 v1.35와 영역 비중은 확인일의 snapshot입니다." | MISLEADING | https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/ — "The exam is based on Kubernetes v1.35." / "The CKA exam environment will be aligned with the most recent K8s minor version within approximately 4 to 8 weeks of the K8s release date." 그러나 https://kubernetes.io/releases/ — 1.37.1 "2026-09-15", 1.36.5 "2026-09-15"(1.36·1.37이 이미 나온 지 수개월). LF 문장을 그대로 옮기면 독자가 "곧 1.37로 바뀐다"고 읽기 쉬움. | "LF는 4~8주 정렬을 밝히지만 2026-10-09 현재 Kubernetes 1.37이 나온 뒤에도 시험은 v1.35다. 응시 직전 실제 표기 버전을 다시 본다"로 보강. |
| 17 | cloud/aws-clf-c02-fast-study | `src/pages/articles/cloud/awsData.ts:20` "공식 안내상 … 90분이라고 놓으면", `:59` "시간 90분" (sources에는 PDF와 기술 목록만) | MISSING | https://docs.aws.amazon.com/pdfs/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.pdf — 50/15문항·700점은 있으나 시험 시간 문구 없음(DVA 가이드와 달리 "Exam duration" 절이 없음). 90분·100 USD는 https://aws.amazon.com/certification/certified-cloud-practitioner/ — "90 minutes", "65 questions; either multiple choice or multiple response", "100 USD"에만 있음. | sources에 AWS 자격 페이지를 추가해 90분·100 USD 출처를 명시. |
| 18 | cloud/kubernetes-request-path-and-cka | `kubernetesData.ts:144-145` freeCodeCamp 두 강의의 범위 주장("resource 목록 discovery map", "kubeadm·HA·network·storage·troubleshooting lab 범위") | UNVERIFIED | https://www.youtube.com/oembed — 제목만 확인: "Learn Kubernetes in 6 Hours – Full Course with Real-World Project", "Kubernetes Course – Certified Kubernetes Administrator Exam Preparation (2026 Update)"(둘 다 freeCodeCamp.org). 영상 본문은 열지 않음. | 영상 챕터 목록을 확인해 범위 주장을 챕터 제목으로 대체. |

## 글별 검증 기록

### cloud/aws-clf-c02-fast-study
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0
- 연 자료:
  - https://docs.aws.amazon.com/pdfs/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.pdf — 200 — "The exam includes 50 questions that affect your score." / "The exam includes 15 unscored questions that do not affect your score." / "The minimum passing score is 700." / "compensatory scoring model … You need to pass only the overall exam." / "Cloud Concepts (24% of scored content) · Security and Compliance (30%) · Cloud Technology and Services (34%) · Billing, Pricing, and Support (12%)" / "The order and placement of the items in this list is no indication of their relative weight or importance on the exam" / "up to 6 months of exposure". 시험 시간 문구 없음(발견 #17).
  - https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-technologies-concepts.html — 200 — "This list is non-exhaustive and is subject to change." excerpt 원문 일치.
  - https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html — 200 — HTML판 가이드.
  - https://aws.amazon.com/certification/certified-cloud-practitioner/ — 200 — "90 minutes" / "65 questions" / "100 USD" / 후속 버전 공지 없음, "The AWS Certified Cloud Practitioner exam in Italian and German will be retired after December 31, 2026."
  - https://aws.amazon.com/compliance/shared-responsibility-model/, https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_GetCostAndUsage.html, IAM 3건 — 200.
- 계산: 5,400 ÷ 65 = 83.08 → "약 83초" OK. 24+30+34+12 = 100 OK. "기술과 보안이 합쳐 64%" OK.
- 빠진 내용: 90분·100 USD의 출처(발견 #17). CLF-C02 현행 여부는 OK(후속 공지 없음).
- OK 확인: 50+15 문항·700점·영역별 통과 불필요·네 영역 비중·목록 순서 무의미·Security Group/NACL 상태성(AWS VPC 문서 일반 사실)·Pricing Calculator/Cost Explorer/Budgets 역할.

### cloud/aws-saa-c03-fast-study
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료:
  - https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03.html — 200 — 메타 리프레시로 `solutions-architect-associate-03/solutions-architect-associate-03.html`로 이동(정상, 기록만).
  - https://docs.aws.amazon.com/pdfs/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.pdf — 200 — "Design architectures that are secure, resilient, high-performing, and cost-optimized"(excerpt 일치) / "at least 1 year of hands-on experience designing cloud solutions" / "Design Secure Architectures (30%) · Resilient (26%) · High-Performing (24%) · Cost-Optimized (20%)" / "minimum passing score is 720" / 50 scored + 15 unscored.
  - https://aws.amazon.com/certification/certified-solutions-architect-associate/ — 200 — "130 minutes", "65 questions", "150 USD", 후속 버전 공지 없음("exam in Italian will be retired after December 31, 2026"만). 웹 검색에 뜨는 "SAA-C04가 2024년 3월 출시" 류 블로그 주장은 AWS 공식 페이지·docs 경로(latest = …-03)와 모순되어 채택하지 않음.
  - https://docs.aws.amazon.com/wellarchitected/2025-02-25/framework/the-pillars-of-the-framework.html — 200 — "if you neglect the six pillars of operational excellence, …" / "pillars into your architecture will help you produce stable and efficient systems"(excerpt 일치).
  - Reachability Analyzer·Flow Logs·Route 53 concepts·reliability pillar welcome·CloudFormation drift·Bicep what-if·Azure BCDR — 200.
- 계산: 30+26+24+20 = 100 OK. 1,000/100 = 10배 피크 OK.
- 빠진 내용: 없음(SAA-C03 현행, 합격 720점은 본문 미언급이지만 주장도 없음).
- OK 확인: 네 영역 비중·1년 경험·SAA-C03 현행·Well-Architected 인용.

### cloud/aws-developer-cloudops-paths
- 추출한 고유 사실 주장 수: 13, 검증 13, 미검증 0
- 연 자료:
  - https://docs.aws.amazon.com/pdfs/aws-certification/latest/developer-associate-02/developer-associate-02.pdf — 200 — "Development with AWS Services (32%) · Security (26%) · Deployment (24%) · Troubleshooting and Optimization (18%)" / "You will have 130 minutes" / "minimum passing score is 720" / Version 2.1 변경 이력.
  - https://docs.aws.amazon.com/pdfs/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.pdf — 200 — 제목 "AWS Certified CloudOps Engineer - Associate: Exam Guide (SOA-C03)" / 다섯 영역 22/22/22/16/18% / "Analyze costs and total cost of ownership"은 범위 밖 / SOA-C02 Domain 6 "Cost and Performance Optimization (12%)"은 C03 대응 없음(발견 #2).
  - https://aws.amazon.com/ko/certification/certified-cloudops-engineer-associate/ — 200 — "중국어 간체와 한국어로 제공되는 AWS Certified CloudOps Engineer - Associate 시험은 2026년 11월 19일 이후 폐지됩니다." / "시험 시간 130분 · 65개 문항 · 150 USD". currentNotice의 한국어 폐지 일정 일치(중국어 간체도 함께 폐지되나 한국어 독자 대상이라 오류 아님).
  - https://aws.amazon.com/certification/certified-cloudops-engineer-associate/ — 200 — "As part of the latest exam update, we've renamed this certification as AWS Certified CloudOps Engineer - Associate … The name change … will only apply to those who pass the latest exam version (SOA-C03)."
  - https://aws.amazon.com/certification/certified-developer-associate/ — 200 — DVA-C03 전환 공지(발견 #1).
  - https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html, …/sysops-administrator-associate-03/sysops-administrator-associate-03.html, CloudFormation stack events — 200.
- 계산: 32+26+24+18 = 100, 26+24+18 = 68 OK. 22×3 = 66, 16+18 = 34 OK.
- 빠진 내용: DVA-C03 전환 일정(발견 #1).
- OK 확인: CloudOps 개명·SOA 다섯 영역·DVA 네 영역·한국어 폐지일.

### cloud/azure-az900-fast-study
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료:
  - https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900 — 200 — "Skills measured as of July 20, 2026"(excerpt 일치) / "Describe cloud concepts (25–30%) · Describe Azure architecture and services (35–40%) · Describe Azure management and governance (30–35%)" / "exams are localized into other languages, and those are updated approximately eight weeks after the English version is updated" / Last updated 2026-06-22.
  - https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility — 200 — "For all cloud deployment types, you own your data and identities."(excerpt 일치) / "In PaaS and SaaS, Microsoft manages operating systems, runtime environments, and middleware."
  - Azure RBAC role assignments·deny assignments("You can't directly create your own deny assignments. Deny assignments are created and managed by Azure.")·managed identities·resource-name-rules — 200. CAF fundamental-concepts — 301로 다른 문서(발견 #7).
- 빠진 내용: 없음.
- OK 확인: 세 영역 비중과 날짜, 8주 번역 지연, 어느 영역도 25% 미만 아님.

### cloud/azure-az104-fast-study
- 추출한 고유 사실 주장 수: 11, 검증 11, 미검증 0
- 연 자료:
  - https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104 — 200 — "Skills measured as of April 17, 2026" / "Manage Azure identities and governance (20–25%) · Implement and manage storage (15–20%) · Deploy and manage Azure compute resources (20–25%) · Implement and manage virtual networking (15–20%) · Monitor and maintain Azure resources (10–15%)" / "in implementing, managing, and monitoring an organization's Microsoft Azure environment"(excerpt 일치) / "Provision a container by using Azure Container Apps" / 후보 요건에 "Operating systems · Virtualization · PowerShell".
  - https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/ — 200 — "Renewal Frequency 12 months" / "certifications expire unless they are renewed … renew your certification at no cost by passing an online assessment" (excerpt "expire annually"는 비원문, 발견 #12) / "You will have 100 minutes to complete this assessment."
  - Private endpoint overview/DNS·UDR 개요·Network Watcher(301, 내용 동일) — 200.
- 계산: 8+4 = 12 OK.
- 빠진 내용: 없음.
- OK 확인: 다섯 영역·날짜·Container Apps 포함·연 1회 무료 갱신·후보 요건.

### cloud/azure-architect-devops-paths
- 추출한 고유 사실 주장 수: 12, 검증 12, 미검증 0
- 연 자료:
  - https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-305 — 200 — "Skills measured as of April 17, 2026" / "Design identity, governance, and monitoring solutions (25–30%) · Design data storage solutions (20–25%) · Design business continuity solutions (15–20%) · Design infrastructure solutions (30–35%)"(excerpt 일치).
  - https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-400 — 200 — "Skills measured as of July 27, 2026" / "processes and communications (10–15%) · source control strategy (10–15%) · build and release pipelines (50–55%) · security and compliance plan (10–15%) · instrumentation strategy (5–10%)" / "You must have experience both administering and developing in Azure, … experience implementing both GitHub and Azure DevOps solutions."
  - https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/ — 200 — "Certification prerequisites · Microsoft Certified: Azure Administrator Associate" / "The English language version of this certification was updated on April 17, 2026."
  - https://learn.microsoft.com/en-us/credentials/certifications/devops-engineer/ — 200 — 선행 자격 2개 중 택1(발견 #3).
  - https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/ — 200 — "This certification and the renewal assessment are retired."(폐지 날짜 자체는 페이지에 없음)
  - https://learn.microsoft.com/answers/a/12779227 — 200 — "AZ-204 is retiring on July 31, 2026" (MS Learn Q&A, 2026-07-31 폐지일 1차 확인).
  - https://vladtalkstech.com/…/microsoft-certification-retirements-2026/ — 200 — 2차 확인: "The AZ-204 exam and Azure Developer Associate certification will retire on July 31, 2026. The suggested replacement is exam AI-200".
  - Azure Architecture Center·Azure DevOps docs·Well-Architected 루트·"Advancing safe deployment practices" 블로그·Bicep what-if·BCDR — 200.
- 계산: 100 − (25–30) = 70–75%, 100 − (50–55) = 45–50% — 총합 제약으로 유도한 값이라 OK.
- 빠진 내용: DevOps Engineer Expert 선행 자격(발견 #3).
- OK 확인: AZ-305/AZ-400 영역·날짜·AZ-305 선행 자격·AZ-204 2026-07-31 폐지·AZ-400 후보 요건.

### cloud/azure-ai200-fast-study
- 추출한 고유 사실 주장 수: 8(네 영역·비중은 호출자 기확인분 제외), 검증 8, 미검증 0
- 연 자료:
  - https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200 — 200 — "Develop AI solutions by using Azure data management services (25–30%)"(excerpt 일치) / "Last updated on 2026-05-05"(asOf "Study guide updated May 5, 2026" 일치) / 후보 요건 "Vector databases. · Python programming. · Implementing containerized applications on Azure." / "The exam may contain questions on Preview features if those features are commonly used."
  - https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/ — 200 — "with a focus on back‑end services, scalable architectures, and the full development lifecycle"(excerpt 일치) / "You will have 120 minutes to complete this assessment."
  - Foundry evaluation-approach-gen-ai — 301(발견 #14) / cloud-evaluation-deployed-interactions·evaluation-permissions·App Insights overview — 200.
- 계산: 60+40 = 100, 5 ⊂ 40 OK.
- 빠진 내용: 없음.

### cloud/cloud-certification-roadmap-2026
- 추출한 고유 사실 주장 수: 10, 검증 10, 미검증 0
- 연 자료:
  - https://docs.aws.amazon.com/aws-certification/latest/examguides/ — 200(toc 껍데기) → https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html — 200 — 현행 목록 "AWS Certified Cloud Practitioner (CLF-C02) · AWS Certified CloudOps Engineer - Associate (SOA-C03) · AWS Certified Developer - Associate (DVA-C02) · AWS Certified Solutions Architect - Associate (SAA-C03)". excerpt "validate a candidate's ability" 없음(발견 #13).
  - https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200 — 200.
  - https://learn.microsoft.com/en-us/credentials/ — 200. IAM·RBAC 소스 — 200.
- 계산: 10+14+10+6 = 40 OK.
- 빠진 내용: DVA-C03 전환(발견 #1 공유).
- OK 확인: 시험 이름·코드 매핑, AZ-204 폐지, Solutions Architect Expert 선행 자격, "2026년 10월 7일" 기준 현행 목록.

### cloud/cloud-foundations-responsibility-regions
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료:
  - https://docs.aws.amazon.com/whitepapers/latest/navigating-gdpr-compliance/shared-security-responsibility-model.html — 200 — "AWS is responsible for the "Security OF the Cloud". This includes protecting the infrastructure that runs AWS services, such as data centers, networks, hardware, and the foundational software" / "Customers are responsible for "Security IN the Cloud"."(excerpt 일치)
  - https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility — 200 — 위와 동일, "IaaS: You manage virtual machines, operating systems, and applications" / "PaaS: You deploy applications without managing VMs or operating systems".
  - AWS regions/AZ·Azure regions overview·reliability sources — 200(발견 #8의 backup 페이지만 302).
- 계산: ceil(80/50)=2, ceil(260/50)=6, 6×50−260 = 40 OK.
- 빠진 내용: 없음.

### cloud/cloud-identity-access-hierarchy
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료:
  - https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html — 200 — "When you set permissions with IAM policies, grant only the permissions required to perform a task"(excerpt 일치).
  - https://learn.microsoft.com/en-us/azure/role-based-access-control/overview — 200 — "Azure RBAC helps you manage who has access to Azure resources, what they can do with those resources, and what areas they have access to."(excerpt 일치)
  - IAM policy evaluation logic·access denied troubleshooting·STS get-caller-identity·role assignments·deny assignments·managed identities — 200.
- 계산: 2×6 = 12, 3×12 = 36 OK.
- 빠진 내용: 없음.
- OK 확인: SCP는 권한을 주지 않음(evaluation-logic 문서), deny assignment는 Azure가 생성·관리.

### cloud/cloud-networking-request-path
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료:
  - https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html — 200 — excerpt 비원문(발견 #10).
  - https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview — 200 — "Azure automatically creates system routes and assigns the routes to each subnet in a virtual network."(excerpt 일치)
  - Reachability Analyzer·Flow Logs·Route 53·Private endpoint overview/DNS·private endpoint DNS troubleshooting — 200.
- 계산: /24 = 256 = 128+128 OK.
- 빠진 내용: 없음.
- OK 확인: Security Group 상태 기반/NACL 비상태, NSG 상태 기반, NAT 출구와 공개 입구 분리.

### cloud/cloud-compute-selection
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료:
  - AWS compute decision guide — 301 + excerpt 비원문(발견 #11).
  - https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree — 200 — "Use the following flowchart to select a candidate compute service."(excerpt 일치)
  - https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html — 200 — 목차에 "VPC Lattice · Amazon EBS · Custom health checks that you define"(depth 주장 일치).
  - Lambda operator guide — 301로 다른 문서(발견 #6). ECS task lifecycle·Azure LB probes — 200.
- 계산: 86,400 × 0.2 s = 17,280 s = 4.8 h OK.
- 빠진 내용: 없음.

### cloud/cloud-storage-database-selection
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료:
  - https://docs.aws.amazon.com/decision-guides/latest/decision-guides/databases-on-aws-how-to-choose.html — 200 — "establish the criteria for making your database choice"(excerpt 일치).
  - Azure data store models — 301 + excerpt 비원문(발견 #9).
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel — 200 — "Amazon S3 provides strong read-after-write consistency for PUT and DELETE requests of objects"(depth 주장 일치).
  - https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html — 200 — "DB instance is fully operational, but performance might not be at its fullest until initialization completes"(depth 주장 일치).
  - Azure storage redundancy·replication-vs-backup·reliability backup(302, 발견 #8) — 200/302.
- 계산: 100×2 KB = 200 KB, 1,000×2 MB = 2 GB OK.
- 빠진 내용: 없음.

### cloud/cloud-reliability-observability-iac
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료:
  - AWS Well-Architected pillars — 200 — "six pillars"(excerpt 일치; 운영 우수성·보안·안정성·성능 효율·비용 최적화·지속 가능성).
  - https://learn.microsoft.com/en-us/azure/well-architected/what-is-well-architected-framework — 200 — "The framework is founded on the five pillars of architectural excellence … Reliability, Security, Cost Optimization, Operational Excellence, and Performance Efficiency."(excerpt 일치)
  - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html — 200 — "Resources that don't support drift detection are assigned a drift status of NOT_CHECKED."(depth 주장 일치)
  - Terraform plan·Terraform state 가이드·Azure chaos engineering 블로그·Bicep what-if·BCDR — 200.
- 계산: 12:00 − 15분 = 11:45, +60분 = 13:00 OK.
- 빠진 내용: 없음.

### cloud/kubernetes-network-packet-path
- 추출한 고유 사실 주장 수: 24, 검증 23, 미검증 1(hackjsp 각 글의 실습 내용은 목록만 확인)
- 연 자료:
  - https://kubernetes.io/docs/reference/networking/virtual-ips/ — 200 — 문서 버전 v1.37 / "Deprecated since Kubernetes v1.35 … The ipvs proxy mode is deprecated. Support for ipvs mode will be disabled by default from Kubernetes v1.40 … fully removed in Kubernetes v1.43." / "In Kubernetes 1.37, this is iptables, but a future version of Kubernetes will change the default to nftables." / "The nftables proxy mode (described below) is essentially a replacement for both the iptables and ipvs modes" (발견 #15).
  - https://kubernetes.io/docs/concepts/services-networking/ingress/ — 200 — "The Ingress API has been frozen."(SourceApplication excerpt 원문 일치)
  - https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/ — 200 — "Kubernetes (version 1.3 through to the latest 1.37, and likely onwards) lets you use Container Network Interface (CNI) plugins" / "the Container Runtime must be configured to load the CNI plugins required to implement the Kubernetes network model."
  - https://kubernetes.io/docs/concepts/services-networking/network-policies/ — 200 — "Your cluster must use a network plugin that supports NetworkPolicy enforcement." / "Network policies are implemented by the network plugin." / "By default, a pod is non-isolated for ingress … A pod is isolated for ingress if there is any NetworkPolicy that both selects the pod and has "Ingress" in its policyTypes".
  - https://gateway-api.sigs.k8s.io/guides/getting-started/introduction/ — 200 — v1.6.1 manifest·Standard channel 정의(발견 #5).
  - https://docs.cilium.io/en/stable/network/kubernetes/kubeproxy-free/ — 200 — "Cilium's kube-proxy replacement depends on the socket-LB feature." / cgroup v2 mount 요건 / 1.20.2 참조(발견 #4).
  - https://docs.tigera.io/calico/latest/reference/installation/api/ — 200 — "Calico Open Source 3.33 (latest)" / "Note that BIRD programming of IPIP routes, which the BIRD mode selects, is deprecated as of Calico v3.33 and is intended for removal in v3.35." / "as of Calico v3.33 those defaults are equivalent to FelixIPIPOnly" / encapsulation enum "IPIP, VXLAN, IPIPCrossSubnet, VXLANCrossSubnet, None" / natOutgoing "NATOutgoingType".
  - https://docs.tigera.io/calico/latest/networking/configuring/vxlan-ipip — 200 — "By default, Felix programs cluster routes for VXLAN IP pools, while BGP distributes cluster routes for IP-in-IP pools and for pools with no encapsulation." / "When Felix is programming cluster routes, BGP is not required for internal cluster routing. However, BGP is still required if cluster routes need to be advertised to external BGP peers." / "VXLAN has a slightly higher per-packet overhead because the header is larger" / "encapsulation: VXLANCrossSubnet".
  - https://docs.tigera.io/calico/latest/networking/configuring/mtu — 200 — 표 "1500 / 1500 / 1480 / 1450"(plain·IPv4 IP-in-IP·IPv4 VXLAN), "When using AKS, the underlying network has an MTU of 1400".
  - https://docs.tigera.io/calico/latest/networking/configuring/workloads-outside-cluster — 200 — "When a pod with an IP address in the pool initiates a network connection to an IP address to outside of Calico's IP pools, the outgoing packets will have their source IP address changed from the pod IP address to the node IP address using SNAT … Any return packets on the connection automatically get this change reversed" / "traffic is NATed from pods in that pool to any destination outside of all other Calico IP pools."
  - https://docs.tigera.io/calico/latest/reference/architecture/overview — 200 — "Felix · Main task: Programs routes and ACLs, and anything else required on the host" / "BIRD · Main task: Gets routes from Felix and distributes to BGP peers".
  - https://docs.tigera.io/calico/latest/operations/troubleshoot/troubleshooting — 200 — BGP peer status·TCP 179 확인 절.
  - https://istio.io/latest/docs/ambient/architecture/data-plane/ — 200 — "Istio's data plane uses node-level ztunnel proxies deployed as a DaemonSet" / "Waypoints typically run on a per-namespace basis".
  - https://hackjsp.tistory.com/category/Kubernetes — 200 — "Kubernetes (33) · Network (10) · Security (2) · Database Operator (8) · Istio (13)"(글 서술과 정확히 일치).
  - https://kubernetes.io/docs/concepts/extend-kubernetes/operator/ — 200.
- 계산: 1500−20 = 1480, 1500−50 = 1450(Ethernet 14+IP 20+UDP 8+VXLAN 8 = 50) OK. `ping -s 1422` → 1422+8+20 = 1450 OK.
- 빠진 내용: IPVS 1.40/1.43 일정과 1.37 기본값(발견 #15).
- OK 확인: VXLAN UDP 4789·CrossSubnet 의미·Felix/BIRD 역할·BIRD IP-in-IP deprecation v3.33→v3.35·natOutgoing 조건부 SNAT·Ingress 동결·NetworkPolicy 집행 주체·Cilium socket-LB·Istio ambient 구조·Calico 3.33 latest·Kubernetes v1.37 문서.

### cloud/kubernetes-request-path-and-cka
- 추출한 고유 사실 주장 수: 18, 검증 17, 미검증 1(발견 #18)
- 연 자료:
  - https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/ — 200 — "This exam is an online, proctored, performance-based test that requires solving multiple tasks from a command line running Kubernetes. Candidates have 2 hours to complete the tasks." / "The exam is based on Kubernetes v1.35." / "Troubleshooting 30% · Cluster Architecture, Installation & Configuration 25% · Services & Networking 20% · Workloads & Scheduling 15% · Storage 10%" / "Certification exam only – $445" / "aligned with the most recent K8s minor version within approximately 4 to 8 weeks"(발견 #16).
  - https://kubernetes.io/releases/ — 200 — 1.37.1 2026-09-15, 1.36.5 2026-09-15, 1.35.9 2026-09-15.
  - https://github.com/cncf/curriculum — 200 — 루트에 "CKA_Curriculum_v1.35.pdf"(CKAD는 v1.37 PDF까지 존재).
  - https://kubernetes.io/docs/concepts/overview/components/ — 200 — "A Kubernetes cluster consists of a control plane and one or more worker nodes."(excerpt 일치)
  - kube-scheduler·api-concepts·kubeadm create-cluster·ha-topology·debug-cluster·debug-pods·configure-upgrade-etcd — 200.
  - https://github.com/kodekloudhub/certified-kubernetes-administrator-course — 200 — GitHub API `license: null`, 루트 목록 ".gitignore, README.md, apple-silicon, docs, images, kubeadm-clusters, managed-clusters, metrics-staging-scripts, resources"(LICENSE 없음 → 글의 "명시적 license 파일을 확인하지 못해" 일치). `docs/` 하위 "02-Core-Concepts, 03-Scheduling, 06-Cluster-Maintenance, 07-Security, 08-Storage, 09-Networking, 10-Design-and-Install-Kubernetes-Cluster, 12-Troubleshooting" 전부 존재(CkaResourceMap.tsx의 8개 링크 유효). `images/` 존재.
  - CKA lab 저장소 8개 — 200; GitHub API license: xooooooooox/cka-exercises MIT(글 표기 일치), simonbbbb/CKA-Hand-on-lab MIT(일치), stephrobert/kubernetes-dsoxlab-training CC-BY-4.0(일치), sailor-sh/CK-X NOASSERTION, 나머지 4개 license 없음(글은 표기 안 함 — OK).
  - YouTube oEmbed — 200 — 두 영상 제목·채널(freeCodeCamp.org) 확인, 본문 미열람(발견 #18).
- 계산: 3×35 = 105, 2×35 = 70, 90−70 = 20 OK. 12+10+8+6+4 = 40 OK.
- 빠진 내용: LF "4~8주" 문구와 실제 v1.35 유지의 괴리(발견 #16).
- OK 확인: CKA v1.35·2시간·다섯 영역 비중·performance-based·Components 인용·KodeKloud 폴더·라이선스 표기.

## 열지 못한 자료
| URL | 상태 | 대체 확인 |
|---|---|---|
| (없음 — 120개 전부 HTTP 200) | — | 다른 문서로 리다이렉트된 7건은 발견 #6·#7·#8·#9·#11·#14(2건)에 기록 |
| https://docs.aws.amazon.com/aws-certification/latest/examguides/ | 200이나 본문 없는 toc 껍데기 | `…/examguides/aws-certification-exam-guides.html`에서 본문 확인(발견 #13) |
| https://www.youtube.com/watch?v=_4uQI4ihGVU, …?v=l57xKN6OBhY | 200(영상 본문 미열람) | oEmbed로 제목·채널만 확인(발견 #18) |
