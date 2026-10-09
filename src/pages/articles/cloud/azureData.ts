import type { CloudCertificationArticleData } from "./CloudCertificationArticle";
import {
  azureAi200Depth,
  azureArchitectDevopsDepth,
  azureAz104Depth,
  azureAz900Depth,
} from "./cloudEngineeringDepth";

export const azureAz900Data: CloudCertificationArticleData = {
  engineeringDepth: azureAz900Depth,
  sections: [
    { id: "overview", level: "S", title: "1. 자원은 만들었지만 잘못된 구독의 비용이 계속 늘었습니다", bridge: "기술 서비스만 보고 계층과 통제를 놓쳤습니다. 한 자원이 놓이는 위치부터 정책·비용까지 따라갑니다.", paragraphs: [
      "(가정) 실습용 자원을 만들었는데 팀이 보던 구독이 아니라 개인 구독에 놓였습니다. 기능은 정상이라 며칠 동안 눈치채지 못했고, 예산 경보와 삭제 잠금도 다른 범위에 있어 비용이 계속 늘었습니다.",
      "Azure 이름을 외우는 것만으로는 이 문제를 막지 못합니다. 자원이 어느 위치와 계층에 속하고, 어떤 실행·망·저장 역할을 맡으며, 신원·정책·비용·관측이 어느 범위에서 적용되는지 한 장면에서 이어야 합니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 자원은 위치·계층·정책·관측 안에서 움직입니다", bridge: "Azure 자원을 둘러싼 네 경계를 봤습니다. 작은 팀의 자원 수와 예산으로 내려갑니다.", paragraphs: [
      "자원은 리전과 가용 영역에 놓이고, 리소스 그룹·구독·관리 그룹의 계층 안에서 관리됩니다. 신원과 역할이 접근을 정하고 Policy와 잠금, 태그가 배치와 운영 규칙을 돕습니다.",
      "배포 뒤에는 비용과 사용량, 상태와 성능을 봐야 합니다. Advisor의 권고, Service Health의 공급자 사건, Monitor의 워크로드 지표와 로그는 답하는 질문이 다릅니다.",
    ] },
    { id: "case", level: "0", title: "3. 두 팀의 자원 20개와 월 예산 100만원을 나눕니다", bridge: "작은 조직의 숫자를 잡았습니다. 자원을 어느 상자에 넣고 규칙을 어디에 붙일지 봅니다.", paragraphs: [
      "(가정) 개발팀과 운영팀이 각각 자원 10개를 쓰고 전체 월 예산은 100만원입니다. 두 팀을 별도 리소스 그룹으로 묶고 team·environment 태그를 붙이면 비용과 권한을 팀별로 볼 수 있습니다.",
      "태그만 붙였다고 접근이 막히는 것은 아닙니다. 역할 할당이 권한을 정하고, Policy는 허용할 구성 규칙을 평가하며, 잠금은 뜻하지 않은 삭제나 변경을 막는 별도 장치입니다.",
    ] },
    { id: "picture", level: "1", title: "4. 테넌트에서 자원까지 내려가는 상자를 그립니다", bridge: "태그·권한·정책을 구분했습니다. 관리 범위가 상위에서 아래로 닿는 구조를 봅니다.", paragraphs: [
      "신원은 Microsoft Entra 테넌트에 있고, 여러 구독을 관리 그룹으로 묶을 수 있습니다. 구독은 청구와 할당량의 경계이며 그 안에 리소스 그룹과 개별 자원이 놓입니다.",
      "상위 범위에 역할이나 Policy를 붙이면 아래 여러 자원에 영향을 줄 수 있습니다. 편리한 만큼 실수 범위도 넓으므로 개발·운영과 민감도에 맞춰 경계를 나눕니다.",
    ] },
    { id: "need", level: "2", title: "5. 비슷한 관리 도구는 권고·강제·보호·관측으로 나눕니다", bridge: "자원 계층을 봤습니다. 이름이 가까운 관리 서비스를 답하는 질문으로 가릅니다.", paragraphs: [
      "Advisor는 비용·보안·안정성·성능 등을 살펴 개선점을 알려 줍니다. Policy는 자원이 규칙을 따르는지 평가하거나 설정에 따라 막고 고칠 수 있습니다. Resource Lock은 우발적 삭제나 변경을 막습니다.",
      "Service Health는 Azure 서비스·리전의 문제와 계획된 유지 관리를, Azure Monitor는 내 자원의 지표·로그·경보를 다룹니다. 상태라는 말만 보고 섞지 않습니다.",
    ] },
    { id: "names", level: "3", title: "6. 세 공식 영역과 대표 서비스에 이름을 붙입니다", bridge: "역할을 먼저 분리했습니다. 공식 영역 이름과 Azure 서비스 이름을 붙입니다.", paragraphs: [
      "공식 영역은 클라우드 개념 25~30%, Azure 아키텍처와 서비스 35~40%, Azure 관리와 거버넌스 30~35%입니다. 어느 영역도 4분의 1보다 작지 않아 한 축을 버리는 전략은 위험합니다.",
      "실행은 Virtual Machines·App Service·Functions·컨테이너, 망은 VNet·VPN Gateway·ExpressRoute·DNS, 저장은 Blob·Files·Disks, 신원은 Entra ID, 권한은 Azure RBAC, 배포는 ARM·Bicep, 관측은 Azure Monitor로 역할을 묶습니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. AZ-900 문장에서 역할과 범위를 먼저 찾습니다", bridge: "시험 지도를 만들었습니다. 잘못된 리전 배포를 막는 문제의 판단 과정을 따라갑니다.", paragraphs: [
      "문제의 동사는 ‘배포를 막는다’이고 범위는 여러 구독입니다. 비용 권고나 삭제 보호가 아니라 구성 규칙을 상위 범위에 적용하는 도구가 필요합니다.",
      "따라서 관리 그룹에 적용할 수 있는 Azure Policy를 남깁니다. Advisor는 권고, Lock은 삭제·변경 보호, RBAC는 누가 무엇을 할지 정한다는 탈락 이유를 함께 적습니다.",
    ] },
    { id: "source", level: "5", title: "8. 공식 가이드는 2026년 7월 기준 세 영역을 밝힙니다", bridge: "문제 풀이 절차를 만들었습니다. Microsoft가 공개한 실제 범위와 학습표를 맞춥니다.", paragraphs: [
      "공식 가이드는 공유 책임, 클라우드 모델·서비스 유형, 리전·가용 영역과 자원 계층, 실행·망·저장·신원, 비용·Policy·ARM·관측을 구체적으로 나열합니다.",
      "영문 시험이 먼저 바뀌고 번역판은 약 8주 뒤 갱신될 수 있다고 안내합니다. 한국어로 응시할 때도 영어 최신 가이드의 변경표를 확인합니다.",
    ] },
    { id: "comparison", level: "6", title: "9. 시험 직전에는 가까운 개념을 한 축에서 비교합니다", bridge: "공식 범위의 갱신 방식까지 확인했습니다. 자주 헷갈리는 쌍을 선택 규칙으로 묶습니다.", paragraphs: [
      "리소스 그룹은 자원의 수명과 관리를 묶고, 구독은 청구·할당량·권한 범위의 큰 경계이며, 관리 그룹은 여러 구독에 거버넌스를 적용합니다. Availability Set과 Availability Zone도 같은 말이 아닙니다.",
      "Public Endpoint는 인터넷 주소에서 서비스에 닿게 합니다. Private Endpoint는 VNet 안에 사설 주소를 만듭니다. VPN Gateway는 암호화된 터널, ExpressRoute는 통신사 기반 사설 연결입니다.",
    ] },
    { id: "limits", level: "7", title: "10. AZ-900 합격 뒤에는 AZ-104 실습으로 넘어갑니다", bridge: "기초 비교 규칙을 닫았습니다. 취업용 증거로 바꾸는 다음 단계를 정합니다.", paragraphs: [
      "AZ-900은 설명 능력을 확인하는 기초 시험이므로 포털에서 한 번 눌러 본 경험만으로 운영 역량을 증명하기 어렵습니다. 가상망·사설 서브넷·관리 ID·저장소·경보를 Bicep이나 CLI로 만들고 삭제·복구를 기록합니다.",
      "관리자 직무라면 다음 글의 AZ-104로 이어갑니다. 설계자가 목표여도 AZ-104 수준의 실제 구성 능력이 AZ-305와 Solutions Architect Expert 경로의 바탕입니다.",
    ] },
  ],
  overviewFlow: { title: "Azure 자원 한 묶음의 생애", steps: [
    { actor: "위치와 계층", movement: "리전·영역과 관리 그룹·구독·리소스 그룹을 정합니다.", receives: "배치와 관리 범위" },
    { actor: "서비스와 보호", movement: "실행·망·저장에 신원·RBAC·Policy를 붙입니다.", receives: "허용된 자원 상태" },
    { actor: "운영과 비용", movement: "Monitor·Service Health·Cost Management로 상태를 봅니다.", receives: "경보·권고·예산 판단" },
  ] },
  numericCase: { title: "두 팀의 자원 관리", steps: [
    { label: "개발팀", value: "10개", detail: "dev 리소스 그룹" },
    { label: "운영팀", value: "10개", detail: "prod 리소스 그룹" },
    { label: "전체 예산", value: "100만원", detail: "태그·예산·경보로 추적" },
  ] },
  decision: { title: "Azure 관리 도구 가르기", question: "원하는 결과가 권고, 규칙 강제, 삭제 보호 중 무엇인가요?", options: [
    { signal: "비용과 안정성 개선 항목을 추천받고 싶습니다.", choose: "Azure Advisor", why: "현재 구성과 사용을 분석해 개선점을 알려 줍니다." },
    { signal: "허용하지 않은 리전의 새 배포를 막고 싶습니다.", choose: "Azure Policy", why: "자원 구성 규칙을 범위에 적용하고 준수를 평가합니다." },
    { signal: "운영 데이터베이스를 실수로 삭제하지 못하게 합니다.", choose: "Resource Lock", why: "권한이 있는 사용자에게도 삭제·변경 보호를 추가합니다." },
  ] },
  terms: { title: "AZ-900의 세 핵심 이름", items: [
    { term: "구독", description: "Azure 자원의 청구·할당량과 접근 범위를 나누는 관리 경계입니다.", example: "개발과 운영 비용을 별도 구독으로 나눕니다.", boundary: "사용자 신원의 디렉터리인 Entra 테넌트와 같은 말이 아닙니다." },
    { term: "Azure Policy", description: "자원이 조직이 정한 구성 규칙을 따르는지 평가하고 설정에 따라 거부·수정하는 거버넌스 도구입니다.", example: "허용 리전 밖의 새 자원 배포를 거절합니다.", boundary: "사용자에게 작업 권한을 주는 RBAC 역할은 아닙니다." },
    { term: "Azure Monitor", description: "Azure와 애플리케이션의 지표·로그·추적을 모아 분석하고 경보하는 서비스입니다.", example: "VM CPU와 웹 오류율이 기준을 넘으면 알립니다.", boundary: "Azure 공급자 사건만 알려 주는 Service Health와 범위가 다릅니다." },
  ] },
  algorithm: { title: "AZ-900 보기 좁히기", input: ["문제 동사", "적용 범위", "현재 또는 미래 시점", "책임 주체"], steps: [
    { code: "역할 = 배포 | 보호 | 권고 | 관측 | 비용 중_하나로_분류", note: "제품명보다 문제의 동사를 먼저 봅니다." },
    { code: "범위 = 자원 | 리소스_그룹 | 구독 | 관리_그룹", note: "몇 자원에 영향을 줄지 확인합니다." },
    { code: "비슷한_보기의_출력을_비교한다()", note: "권고·거부·잠금·경보를 구분합니다." },
    { code: "공유_책임과_서비스_유형을_대입한다()", note: "고객과 Microsoft의 책임을 확인합니다." },
    { code: "나머지_보기의_탈락_이유를_한_문장으로_쓴다()", note: "오답 노트가 비교 규칙이 됩니다." },
  ], output: "정답 + 범위 + 탈락 규칙", repeatUntil: "공식 Practice Assessment의 오답을 역할로 설명할 수 있을 때까지 반복합니다." },
  examScope: { title: "AZ-900 공식 영역", asOf: "Skills measured as of July 20, 2026", domains: [
    { name: "Describe cloud concepts", weight: "25–30%", focus: "공유 책임, 클라우드 모델, 이점과 IaaS·PaaS·SaaS를 설명합니다." },
    { name: "Describe Azure architecture and services", weight: "35–40%", focus: "위치·자원 계층, 실행·망·저장·신원과 보안을 설명합니다." },
    { name: "Describe Azure management and governance", weight: "30–35%", focus: "비용, 태그, Policy·Lock, ARM·Bicep와 관측 도구를 설명합니다." },
  ] },
  sources: [
    { source: "Microsoft Learn · AZ-900 Study Guide", excerpt: "Skills measured as of July 20, 2026", application: "세 영역 비중과 최신 변경일을 고정해 오래된 강의의 범위를 그대로 따르지 않는 기준으로 씁니다.", citation: "Microsoft Learn, Study guide for Exam AZ-900", href: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900", note: "AZ-900의 대상, 합격 기준, 최신 영역 비중과 세부 과제를 밝힌 공식 가이드입니다." },
    { source: "Microsoft Learn · Shared responsibility", excerpt: "you own your data and identities", application: "서비스 층이 바뀌어도 고객에게 남는 데이터·계정·접근 책임을 문제에 적용합니다.", citation: "Microsoft Learn, Shared responsibility in the cloud", href: "https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility", note: "IaaS·PaaS·SaaS별 고객과 Microsoft의 책임을 비교한 공식 문서입니다." },
  ],
  review: [
    "Advisor·Policy·Resource Lock의 출력은 어떻게 다른가요? (답: 5·7절)",
    "구독과 Entra 테넌트를 같은 상자로 볼 수 없는 이유는 무엇인가요? (답: 4·9절)",
    "AZ-900 뒤 관리자 취업 준비에 추가할 실습은 무엇인가요? (답: 10절)",
  ],
};

export const azureAz104Data: CloudCertificationArticleData = {
  engineeringDepth: azureAz104Depth,
  sections: [
    { id: "overview", level: "S", title: "1. VM은 실행 중인데 사설 저장소에 닿지 못했습니다", bridge: "포털의 초록 상태만으로는 첫 실패 지점을 알 수 없습니다. 범위부터 복구까지 한 요청을 따라갑니다.", paragraphs: [
      "(가정) VM은 `running`이고 저장소의 사설 연결도 만들어져 있습니다. 그런데 애플리케이션은 공개 주소를 해석한 뒤 timeout이 났고, 관리자는 역할·DNS·경로·방화벽 중 무엇을 먼저 봐야 할지 몰라 규칙만 넓혔습니다.",
      "AZ-104의 핵심은 메뉴 위치가 아니라 이 사건을 재현하고 좁히는 능력입니다. 현재 신원과 범위, 저장 접근, 실행 상태, 가상망 경로, 지표와 복구 증거를 순서대로 모아 첫 번째 불일치를 찾습니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 관리자 작업은 범위·배치·연결·상태를 한꺼번에 맞춥니다", bridge: "다섯 영역이 한 환경에서 만난다는 점을 봤습니다. 자원 12개와 장애 시간으로 수를 넣습니다.", paragraphs: [
      "먼저 관리 그룹·구독·리소스 그룹에 사용자와 정책을 붙입니다. 저장소와 실행 자원을 배치하고 VNet·서브넷·NSG·DNS·부하 분산으로 경로를 만듭니다. 배포 뒤에는 지표·로그·경보와 백업을 구성합니다.",
      "문제가 생기면 원하는 설정만 보지 않고 실제 적용된 역할, 유효 보안 규칙과 경로, 상태 검사와 최근 제어 작업을 봅니다. 선언과 실행 상태의 차이가 자주 원인입니다.",
    ] },
    { id: "case", level: "0", title: "3. 두 리소스 그룹의 12개 자원을 30분 안에 복구합니다", bridge: "관리할 규모와 복구 목표를 정했습니다. 자원 수명과 권한 범위를 어떻게 묶을지 봅니다.", paragraphs: [
      "(가정) web 리소스 그룹에 자원 8개, data 그룹에 4개가 있고 전체 12개입니다. 웹 앱은 두 영역에 배치하며 VM 백업 뒤 30분 안에 복원하는 연습을 합니다. 개발자는 web만 변경하고 data는 읽기만 합니다.",
      "구독 전체 Contributor를 주면 요구보다 넓습니다. web 범위에는 필요한 변경 역할, data 범위에는 읽기 역할을 붙이고 운영 비상 권한은 별도로 둡니다. 실제 역할 할당을 해석해 예상과 같은지 확인합니다.",
    ] },
    { id: "picture", level: "1", title: "4. 자원 생성 순서가 문제 해결 순서가 됩니다", bridge: "권한 범위를 숫자 사례에 붙였습니다. 구축 순서를 진단 지도와 연결합니다.", paragraphs: [
      "리소스 그룹과 신원 경계를 만든 뒤 주소 공간과 서브넷, 보안 규칙을 둡니다. 저장소와 실행 자원을 연결하고 이름 해석·부하 분산을 붙입니다. 마지막으로 진단 설정과 경보, 백업을 켭니다.",
      "접속이 안 되면 이 순서를 거꾸로 무작정 지우지 않습니다. DNS → 유효 경로 → 유효 NSG → 대상 상태 → 앱 설정과 로그 순서로 첫 실패 지점을 찾습니다.",
    ] },
    { id: "need", level: "2", title: "5. 포털·CLI·Bicep은 같은 자원을 다른 방식으로 다룹니다", bridge: "구축과 진단 순서를 만들었습니다. 시험과 실무에서 도구를 나눠 쓰는 이유를 봅니다.", paragraphs: [
      "포털은 현재 상태와 선택지를 살피기 쉽고, CLI·PowerShell은 반복 작업과 조회를 자동화합니다. Bicep·ARM 템플릿은 원하는 자원 상태를 선언해 검토하고 다시 배포하게 합니다.",
      "한 방식만 익히면 문제를 풀 때 막힙니다. 포털 화면에서 만든 자원을 내보내 구조를 읽고, Bicep을 수정해 배포하며, CLI로 실제 속성과 유효 경로를 확인하는 연습을 합니다.",
    ] },
    { id: "names", level: "3", title: "6. AZ-104의 다섯 공식 영역에 이름을 붙입니다", bridge: "도구의 역할을 봤습니다. 공식 영역과 대표 작업을 학습 순서에 붙입니다.", paragraphs: [
      "신원과 거버넌스 20~25%, 저장소 15~20%, 컴퓨팅 자원 20~25%, 가상 네트워크 15~20%, 관측과 유지 관리 10~15%입니다. 신원·컴퓨팅이 최대 비중이지만 네트워크와 저장을 빼면 실제 환경이 이어지지 않습니다.",
      "Entra 사용자·그룹과 Azure RBAC·Policy, Blob·Files와 SAS·방화벽, VM·VMSS·Container Apps·App Service·Bicep, VNet·NSG·Bastion·Private Endpoint·DNS·Load Balancer, Monitor·Network Watcher·Backup·Site Recovery를 실습 축으로 묶습니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. 한 장애를 유효 상태에서 좁힙니다", bridge: "공식 범위를 붙였습니다. 웹 앱이 저장소에 닿지 않는 상황을 한 줄씩 진단합니다.", paragraphs: [
      "먼저 앱이 쓰는 관리 ID와 역할 할당 범위를 확인합니다. 저장소 방화벽과 사설 끝점, DNS가 같은 경로를 가리키는지 봅니다. 그다음 NSG와 유효 경로, 저장소 로그를 확인합니다.",
      "문제를 고칠 때 전체 네트워크를 공개하지 않습니다. 실패한 첫 관문의 최소 설정만 바꾸고 같은 요청으로 재검증합니다. 변경은 Bicep과 운영 기록에도 반영합니다.",
    ] },
    { id: "source", level: "5", title: "8. 공식 가이드는 구성뿐 아니라 해석·문제 해결을 요구합니다", bridge: "진단 절차를 만들었습니다. Microsoft의 실제 과제 문장과 실습표를 맞춥니다.", paragraphs: [
      "AZ-104 공식 가이드는 역할 할당 해석, ARM·Bicep 수정·배포, 네트워크 연결 문제 해결, 지표·로그 해석과 백업·장애 조치를 포함합니다. 생성 버튼 위치만 외워서는 범위를 덮지 못합니다.",
      "후보는 운영체제, 네트워크, 서버와 가상화에 익숙하고 PowerShell·CLI·포털·Bicep·Entra ID 경험이 있어야 한다고 설명합니다. 부족한 기초는 네트워크와 운영체제 실습으로 보완합니다.",
    ] },
    { id: "comparison", level: "6", title: "9. 시험 직전에는 설정 쌍을 실제 결과로 비교합니다", bridge: "공식 과제가 요구하는 깊이를 확인했습니다. 오답이 많은 설정 쌍을 결과로 묶습니다.", paragraphs: [
      "SAS는 저장소 데이터에 제한된 위임 접근을 주고, 액세스 키는 저장소 계정 전체에 강한 비밀입니다. Service Endpoint는 서비스에 가는 경로를 Azure 백본으로 최적화하면서 공개 끝점을 쓰고, Private Endpoint는 VNet 안의 사설 IP를 만듭니다.",
      "Availability Set은 한 데이터센터 안의 장애·업데이트 도메인 분산이고 Availability Zone은 리전 안의 물리적으로 분리된 위치입니다. Azure Backup은 복원 사본, Site Recovery는 워크로드 복제와 장애 조치에 무게가 있습니다.",
    ] },
    { id: "limits", level: "7", title: "10. 4주 압축 학습은 구축·파괴·복구를 한 묶음으로 돌립니다", bridge: "비교 규칙까지 잡았습니다. 시험 직전 반복할 최소 실습을 정합니다.", paragraphs: [
      "1주에는 신원·구독·Policy와 저장소, 2주에는 VM·App Service·Bicep, 3주에는 VNet·NSG·사설 끝점·DNS, 4주에는 Monitor·Backup·Site Recovery와 모의 문제를 돌립니다. 매주 일부 설정을 끊고 복구합니다.",
      "Microsoft role-based 자격은 매년 만료되며 무료 온라인 평가로 갱신할 수 있습니다. 취득 뒤에도 변경된 공식 가이드와 실제 관리 작업을 따라가야 합니다.",
    ] },
  ],
  overviewFlow: { title: "Azure 환경 한 묶음을 운영하는 순서", steps: [
    { actor: "범위와 자원", movement: "신원·RBAC·Policy 뒤 저장소와 컴퓨팅을 배치합니다.", receives: "관리 가능한 환경" },
    { actor: "연결과 보호", movement: "VNet·NSG·DNS·사설 끝점으로 요청 경로를 만듭니다.", receives: "허용된 통신" },
    { actor: "관측과 복구", movement: "지표·로그·백업·장애 조치로 결과를 검증합니다.", receives: "운영 증거" },
  ] },
  numericCase: { title: "12개 자원의 관리 범위", steps: [
    { label: "web 그룹", value: "8개", detail: "개발자 변경 허용" },
    { label: "data 그룹", value: "4개", detail: "개발자 읽기만 허용" },
    { label: "복구", value: "30분", detail: "VM 복원 연습 목표" },
  ] },
  decision: { title: "AZ-104에서 가까운 기능 가르기", question: "접근을 위임할지, 경로를 사설화할지, 복구를 자동 전환할지 구분했나요?", options: [
    { signal: "외부 업체에 Blob 하나를 1시간만 읽게 합니다.", choose: "범위와 만료를 좁힌 SAS", why: "계정 키 전체를 공유하지 않고 제한된 데이터 접근을 위임합니다." },
    { signal: "웹 앱이 저장소의 VNet 사설 주소로만 접근합니다.", choose: "Private Endpoint + 사설 DNS", why: "서비스 접점을 사설 IP로 만들고 이름도 같은 주소를 가리킵니다." },
    { signal: "지역 장애 때 VM 워크로드를 보조 지역으로 넘깁니다.", choose: "Azure Site Recovery", why: "복제와 장애 조치 계획을 운영합니다." },
  ] },
  terms: { title: "AZ-104 운영의 세 핵심 이름", items: [
    { term: "유효 권한", description: "여러 범위의 역할 할당과 거부 조건이 합쳐진 뒤 주체에게 실제 적용되는 접근 결과입니다.", example: "web Contributor와 data Reader가 개발자에게 함께 적용됩니다.", boundary: "포털에 보이는 한 역할 이름만으로 전체 결과를 판단할 수 없습니다." },
    { term: "유효 경로", description: "시스템 경로·사용자 정의 경로·게이트웨이 전파가 합쳐져 인터페이스에 실제 적용되는 경로입니다.", example: "저장소 사설 주소의 다음 홉이 VNet 안인지 확인합니다.", boundary: "경로가 있어도 NSG·DNS·서비스 권한이 막을 수 있습니다." },
    { term: "관리 ID", description: "Azure 자원에 Entra ID 신원을 주어 비밀 키 파일 없이 다른 자원에 접근하게 하는 기능입니다.", example: "App Service가 관리 ID로 Blob Storage 역할을 사용합니다.", boundary: "신원을 만들기만 해서는 권한이 생기지 않아 역할 할당이 필요합니다." },
  ] },
  algorithm: { title: "App Service에서 Storage 접속 실패 진단", input: ["앱 관리 ID", "Storage 역할", "Private Endpoint", "사설 DNS", "NSG·경로"], steps: [
    { code: "주체 = 앱의_관리_ID가_활성인지_확인한다()", note: "코드가 실제로 쓰는 신원을 확인합니다." },
    { code: "권한 = 대상_범위의_역할_할당을_해석한다()", note: "읽기·쓰기 같은 데이터 작업 권한을 봅니다." },
    { code: "주소 = 앱에서_저장소_DNS를_조회한다()", note: "사설 끝점 IP가 나오는지 확인합니다." },
    { code: "경로와_NSG의_유효_상태를_확인한다()", note: "선언한 규칙보다 실제 인터페이스 결과를 봅니다." },
    { code: "저장소_방화벽과_로그에서_첫_거절을_찾는다()", note: "서비스 측 경계까지 확인합니다." },
    { code: "최소_수정_뒤_Bicep과_기록을_맞춘다()", note: "임시 공개 설정을 남기지 않습니다." },
  ], output: "첫 실패 관문 + 최소 수정 + 재현 가능한 구성", repeatUntil: "같은 요청이 통과하고 공개 경로 없이 유지될 때까지 반복합니다." },
  examScope: { title: "AZ-104 공식 영역", asOf: "Skills measured as of April 17, 2026", domains: [
    { name: "Manage identities and governance", weight: "20–25%", focus: "Entra 사용자·그룹, RBAC, 구독·Policy·Lock·태그·비용을 관리합니다." },
    { name: "Implement and manage storage", weight: "15–20%", focus: "접근, 중복·암호화, Blob·Files, 수명과 복구 설정을 관리합니다." },
    { name: "Deploy and manage compute", weight: "20–25%", focus: "Bicep·ARM, VM·VMSS, 컨테이너와 App Service를 배포합니다." },
    { name: "Implement virtual networking", weight: "15–20%", focus: "VNet·경로·NSG·Bastion·끝점·DNS·부하 분산을 구성하고 진단합니다." },
    { name: "Monitor and maintain resources", weight: "10–15%", focus: "Monitor·Network Watcher, Backup과 Site Recovery를 운영합니다." },
  ] },
  sources: [
    { source: "Microsoft Learn · AZ-104 Study Guide", excerpt: "implementing, managing, and monitoring", application: "서비스 설명보다 구성·해석·진단·복구를 실습 중심으로 준비하는 기준으로 씁니다.", citation: "Microsoft Learn, Study guide for Exam AZ-104", href: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104", note: "AZ-104의 대상 역할, 최신 영역 비중과 세부 과제를 밝힌 공식 가이드입니다." },
    { source: "Microsoft Learn · Azure Administrator Associate", excerpt: "expire unless they are renewed", application: "합격을 끝으로 보지 않고 무료 갱신 평가와 최신 기술 학습을 일정에 포함합니다.", citation: "Microsoft Learn, Azure Administrator Associate", href: "https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/", note: "자격 취득 조건과 갱신 주기를 안내하는 Microsoft 공식 자격 페이지입니다." },
  ],
  review: [
    "AZ-104를 포털 메뉴 암기만으로 준비하기 어려운 이유는 무엇인가요? (답: 1·8절)",
    "Private Endpoint를 만들고도 저장소 연결이 실패할 수 있는 이유는 무엇인가요? (답: 7절)",
    "Backup과 Site Recovery의 중심 목적은 어떻게 다른가요? (답: 9절)",
  ],
};

export const azureArchitectDevopsData: CloudCertificationArticleData = {
  engineeringDepth: azureArchitectDevopsDepth,
  sections: [
    { id: "overview", level: "S", title: "1. 복구 구조는 맞았지만 배포 한 번이 두 지역을 함께 망가뜨렸습니다", bridge: "구조 설계와 변경 전달의 빈칸이 달랐습니다. 같은 사건에서 두 역할의 결정을 나눕니다.", paragraphs: [
      "(가정) 두 지역에 복구 가능한 구조를 만들었지만 같은 pipeline이 잘못된 설정을 두 지역에 동시에 배포했습니다. 구조를 고른 사람은 배포 ring과 승인 단계를 정하지 않았고, 전달을 맡은 사람은 지역별 복구 목표를 몰랐습니다.",
      "상위 자격 경로는 난도 순서만으로 고르면 안 됩니다. 요구를 신원·데이터·복구와 인프라 구조로 바꾸는 판단과, 변경을 빌드·시험·승인·배포·관측·rollback하는 판단 중 어느 쪽을 맡을지 먼저 정해야 합니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 설계는 무엇을 만들지, DevOps는 변경이 어떻게 흐를지 정합니다", bridge: "두 역할의 경계를 잡았습니다. 한 서비스의 복구와 배포 목표를 숫자로 정합니다.", paragraphs: [
      "설계자는 사업 요구를 신원·거버넌스·관측, 저장, 연속성과 인프라 선택으로 바꿉니다. DevOps 엔지니어는 작업 추적, 소스 관리, 빌드·릴리스 파이프라인, 보안과 관측 피드백을 연결합니다.",
      "설계가 좋아도 변경 경로가 불안하면 배포 때 장애가 납니다. 파이프라인이 빨라도 잘못된 데이터·복구 구조를 자동화하면 실패를 빠르게 퍼뜨립니다. 두 역할은 결과를 공유하지만 시험의 중심 질문이 다릅니다.",
    ] },
    { id: "case", level: "0", title: "3. 30분 복구와 하루 20회 배포를 함께 둡니다", bridge: "설계와 전달의 목표를 수치로 잡았습니다. 어느 문제를 누가 먼저 풀지 봅니다.", paragraphs: [
      "(가정) 주문 서비스는 지역 장애 뒤 30분 안에 돌아와야 하고 하루 20회 배포합니다. 새 버전은 먼저 10% 트래픽에서 5분 동안 오류율을 본 뒤 전체로 넓힙니다.",
      "30분 복구를 맞출 데이터 복제와 네트워크 전환은 설계 판단입니다. 10% 단계 배포와 자동 중단, 산출물 추적은 전달 체계 판단입니다. 실제 팀에서는 같은 지표와 운영 절차에서 만납니다.",
    ] },
    { id: "picture", level: "1", title: "4. 현재 경험이 상위 시험의 입구를 정합니다", bridge: "같은 사례에서 두 책임을 나눴습니다. 선행 능력 없이 상위 시험부터 외울 때 생기는 빈칸을 봅니다.", paragraphs: [
      "AZ-305는 네트워크·가상화·신원·보안·연속성·데이터와 Azure 관리 경험을 전제로 합니다. Solutions Architect Expert 자격을 얻으려면 Azure Administrator Associate 자격도 필요합니다.",
      "AZ-400은 Azure 관리나 개발 중 한쪽의 강한 경험과 다른 쪽의 이해, GitHub와 Azure DevOps 사용 경험을 요구합니다. YAML 구문만 외우면 프로세스·보안·관측 판단을 놓칩니다.",
    ] },
    { id: "need", level: "2", title: "5. 상위 시험은 제품보다 교환 관계를 더 많이 묻습니다", bridge: "선행 능력을 확인했습니다. 왜 하나의 최선 서비스보다 조건에 따른 선택이 중요한지 봅니다.", paragraphs: [
      "지역 복제를 늘리면 복구는 빨라질 수 있지만 비용·데이터 주권·일관성 관리가 늘어납니다. 중앙 정책을 강하게 걸면 준수는 쉬워지지만 팀의 배포 속도와 예외 처리 비용이 늘 수 있습니다.",
      "파이프라인의 승인 단계를 늘리면 위험을 줄일 수 있지만 리드 타임이 길어집니다. 자동 시험·작은 배포·관측으로 필요한 통제를 앞당기고, 위험도에 따라 승인 범위를 다르게 둡니다.",
    ] },
    { id: "names", level: "3", title: "6. AZ-305·AZ-400과 폐지된 AZ-204의 경계를 정합니다", bridge: "역할과 교환을 먼저 봤습니다. 현행 시험과 폐지된 시험의 경계를 공식 이름으로 정리합니다.", paragraphs: [
      "AZ-305는 Designing Microsoft Azure Infrastructure Solutions 시험입니다. 신원·거버넌스·관측, 데이터 저장, 비즈니스 연속성, 인프라 솔루션 설계를 다룹니다. Azure Administrator Associate와 함께 Solutions Architect Expert 자격으로 이어집니다.",
      "AZ-400은 Designing and Implementing Microsoft DevOps Solutions 시험으로 프로세스·소스 관리·빌드와 릴리스·보안·관측을 다룹니다. DevOps Engineer Expert 자격은 AZ-400 합격만으로 나오지 않고 Azure Administrator Associate 또는 Azure Developer Associate 중 하나가 선행 자격입니다. Developing Solutions for Microsoft Azure였던 AZ-204는 2026년 7월 31일 폐지됐으므로 지금 새로 준비한다면 AZ-104가 현실적인 선행 경로이고, AI-200이 선행 자격으로 인정되는지는 공식 자격 페이지가 아직 갱신되지 않았으니 접수 전에 확인합니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. 목표 공고에서 상위 경로를 고릅니다", bridge: "시험의 현행 상태를 정리했습니다. 공고의 책임 문장을 선택 절차로 바꿉니다.", paragraphs: [
      "공고에서 recommend·design·business continuity·governance가 반복되면 AZ-305 경로 점수를 올립니다. pipeline·source control·release·security scanning·instrumentation이 반복되면 AZ-400 쪽 점수를 올립니다.",
      "선행 경험과 자격 조건을 빼고 남은 격차를 확인합니다. 설계 경로는 AZ-104 실습과 자격을 먼저 닫고, DevOps 경로는 작은 애플리케이션을 GitHub·Azure DevOps 파이프라인으로 실제 전달합니다.",
    ] },
    { id: "source", level: "5", title: "8. AZ-305는 인프라 설계가 30~35%로 가장 큽니다", bridge: "경로 선택 절차를 만들었습니다. AZ-305 공식 비중에 설계 사례를 맞춥니다.", paragraphs: [
      "AZ-305는 신원·거버넌스·관측 25~30%, 데이터 저장 20~25%, 비즈니스 연속성 15~20%, 인프라 30~35%입니다. 컴퓨팅·애플리케이션·마이그레이션·네트워크 설계가 인프라 영역에 들어갑니다.",
      "서비스 기능만 외우지 않고 요구 조건과 제약, 선택한 구조, 포기한 대안과 교환을 설계 기록으로 남깁니다. 복구 목표와 데이터 요구를 숫자로 넣습니다.",
    ] },
    { id: "comparison", level: "6", title: "9. AZ-400은 빌드·릴리스 파이프라인이 50~55%입니다", bridge: "AZ-305의 무게 중심을 봤습니다. AZ-400의 공식 비중과 실습 우선순위를 비교합니다.", paragraphs: [
      "AZ-400은 프로세스와 소통 10~15%, 소스 관리 10~15%, 빌드·릴리스 파이프라인 50~55%, 보안·규정 10~15%, 관측 전략 5~10%입니다. 파이프라인이 절반이 넘지만 나머지 영역이 전달의 조건을 정합니다.",
      "한 저장소에서 브랜치 보호, 빌드 캐시, 시험, 산출물 서명, 환경 승인, 비밀 관리, 단계 배포와 관측 피드백을 연결합니다. 성공한 실행 한 번보다 실패·중단·되돌리기를 보여 줍니다.",
    ] },
    { id: "limits", level: "7", title: "10. AZ-204 자료는 기술 참고로만 쓰고 현행 자격처럼 표시하지 않습니다", bridge: "두 현행 상위 시험을 비교했습니다. 오래된 자료를 안전하게 재사용하는 경계를 정합니다.", paragraphs: [
      "AZ-204의 Functions·App Service·Cosmos DB·Blob·Entra ID·Key Vault·메시징 범위는 애플리케이션 실습에 도움이 됩니다. 하지만 시험 예약과 자격 경로 정보는 폐지 전 자료이므로 최신 로드맵으로 쓰지 않습니다. AI 백엔드가 목표라면 별도 AI-200 글의 현행 범위를 따릅니다.",
      "시험과 자격은 계속 바뀝니다. 접수 직전 Microsoft Learn의 공식 study guide와 자격 prerequisites를 다시 확인하고, 날짜를 학습 노트에 남깁니다.",
    ] },
  ],
  overviewFlow: { title: "같은 변경을 보는 두 상위 경로", steps: [
    { actor: "설계 결정", movement: "요구를 신원·데이터·복구·인프라 구조와 교환으로 바꿉니다.", receives: "AZ-305 경로" },
    { actor: "전달 결정", movement: "소스에서 안전한 빌드·시험·배포·되돌리기 흐름을 만듭니다.", receives: "AZ-400 경로" },
    { actor: "운영 피드백", movement: "복구 시간·오류율·리드 타임으로 두 결정을 다시 고칩니다.", receives: "실제 직무 증거" },
  ] },
  numericCase: { title: "주문 서비스의 설계·전달 목표", steps: [
    { label: "복구 목표", value: "30분", detail: "지역 장애 뒤 RTO" },
    { label: "배포 빈도", value: "20회/일", detail: "작은 변경의 흐름" },
    { label: "첫 노출", value: "10%", detail: "5분 오류율 관찰" },
    { label: "확대", value: "100%", detail: "기준 통과 뒤 승격" },
  ] },
  decision: { title: "Azure 상위 시험 고르기", question: "지원 직무가 구조를 추천하나요, 변경 흐름을 설계하나요?", options: [
    { signal: "신원·데이터·복구·네트워크 구조를 추천하고 교환을 설명합니다.", choose: "AZ-104 → AZ-305", why: "관리 실무를 바탕으로 인프라 설계와 Expert 자격 조건을 맞춥니다." },
    { signal: "소스·빌드·릴리스·보안 검사·관측 피드백을 설계합니다.", choose: "AZ-400", why: "Azure 관리 또는 개발의 강한 경험 위에서 전달 체계를 다룹니다. Expert 자격에는 AZ-104 등 선행 Associate 자격이 필요합니다." },
    { signal: "오래된 공고나 강의가 AZ-204를 요구합니다.", choose: "현행 여부부터 재확인", why: "AZ-204는 폐지됐으므로 기술 요구와 자격 요구를 분리합니다." },
  ] },
  terms: { title: "상위 경로의 세 핵심 이름", items: [
    { term: "비즈니스 연속성", description: "장애 중에도 중요한 업무를 허용 범위 안에서 계속하거나 정해진 시간에 복구하는 능력입니다.", example: "지역 장애 뒤 주문 서비스를 30분 안에 보조 지역에서 엽니다.", boundary: "기술 복제만으로 사람·절차·외부 의존성까지 자동 복구되지는 않습니다." },
    { term: "지속적 전달", description: "검증된 변경을 반복 가능하고 안전한 절차로 운영 환경에 보낼 수 있게 유지하는 방식입니다.", example: "하루 20회 빌드하고 10% 단계 배포 뒤 자동 승격합니다.", boundary: "모든 변경을 승인 없이 즉시 운영에 내보낸다는 뜻은 아닙니다." },
    { term: "계측 전략", description: "배포와 운영 판단에 필요한 지표·로그·추적과 피드백 경로를 미리 설계하는 일입니다.", example: "5분 오류율로 새 버전 승격을 중단합니다.", boundary: "자료를 많이 모으는 것보다 결정에 쓰이는 신호와 보관 경계가 중요합니다." },
  ] },
  algorithm: { title: "AZ-305와 AZ-400 중 경로 고르기", input: ["지원 공고", "현재 Azure 관리 경험", "현재 개발·파이프라인 경험", "자격 선행 조건"], steps: [
    { code: "책임_동사 = 공고에서_설계와_전달_동사를_센다()", note: "recommend·design과 pipeline·release를 구분합니다." },
    { code: "if 설계_동사_우세: AZ_104_준비도를_확인한다()", note: "Expert 자격의 선행 자격과 관리 실무를 봅니다." },
    { code: "if 전달_동사_우세: 관리_또는_개발_강점을_확인한다()", note: "GitHub와 Azure DevOps 실습 빈칸도 봅니다." },
    { code: "폐지_시험은_현행_후보에서_제외한다()", note: "AZ-204 기술 자료는 참고로만 남깁니다." },
    { code: "대표_실습에_복구·단계_배포·관측을_함께_넣는다()", note: "두 역할이 만나는 결과를 보여 줍니다." },
  ], output: "현행 시험 경로 + 선행 조건 + 포트폴리오 실습", repeatUntil: "공식 가이드 변경일이나 목표 직무가 바뀔 때 다시 확인합니다." },
  examScope: { title: "AZ-305와 AZ-400 공식 영역", asOf: "AZ-305: April 17, 2026 · AZ-400: July 27, 2026", domains: [
    { name: "AZ-305 · Identity/Governance/Monitoring", weight: "25–30%", focus: "인증·권한·비밀, 거버넌스와 관측 구조를 추천합니다." },
    { name: "AZ-305 · Data/Continuity/Infrastructure", weight: "70–75%", focus: "저장 20~25%, 연속성 15~20%, 인프라 30~35%를 설계합니다." },
    { name: "AZ-400 · Build and release pipelines", weight: "50–55%", focus: "패키지·시험·배포·환경·릴리스 자동화를 설계하고 구현합니다." },
    { name: "AZ-400 · Process/Source/Security/Instrumentation", weight: "45–50%", focus: "흐름·소통, 소스 전략, 보안·규정과 관측 피드백을 연결합니다." },
  ] },
  sources: [
    { source: "Microsoft Learn · AZ-305 Study Guide", excerpt: "Design infrastructure solutions", application: "서비스 구현보다 요구를 신원·데이터·연속성·인프라 권고로 바꾸는 설계 경로의 근거로 씁니다.", citation: "Microsoft Learn, Study guide for Exam AZ-305", href: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-305", note: "AZ-305의 대상 역할, 최신 영역 비중과 설계 과제를 밝힌 공식 가이드입니다." },
    { source: "Microsoft Learn · AZ-400 Study Guide", excerpt: "build and release pipelines", application: "파이프라인을 절반 이상 우선하되 프로세스·소스·보안·관측을 함께 준비하는 근거로 씁니다.", citation: "Microsoft Learn, Study guide for Exam AZ-400", href: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-400", note: "AZ-400의 대상 역할과 2026년 7월 기준 영역 비중을 밝힌 공식 가이드입니다." },
  ],
  review: [
    "AZ-305와 AZ-400이 같은 서비스 변경을 다르게 보는 지점은 무엇인가요? (답: 2절)",
    "Solutions Architect Expert에 AZ-104 계열 자격이 필요한 이유와 공식 조건은 무엇인가요? (답: 4·6절)",
    "AZ-204 강의를 기술 참고로는 쓸 수 있지만 현행 자격 경로로 쓸 수 없는 이유는 무엇인가요? (답: 1·10절)",
  ],
};

export const azureAi200Data: CloudCertificationArticleData = {
  engineeringDepth: azureAi200Depth,
  sections: [
    { id: "overview", level: "S", title: "1. 모델 응답은 왔지만 사용자는 40초 동안 빈 화면을 봤습니다", bridge: "AI 호출 한 번은 성공했지만 백엔드 전체는 실패했습니다. 요청이 실행·자료·비동기 작업·운영 신호를 지나는 길을 엽니다.", paragraphs: [
      "(가정) 모델 API는 3초 만에 답했지만 애플리케이션은 벡터 검색 재시도와 긴 후처리를 같은 요청 안에서 기다려 40초 뒤 timeout이 났습니다. 비밀은 이미지에 들어 있었고, 어느 구간이 느렸는지 보여 줄 trace도 없었습니다.",
      "이 사건을 고치려면 모델 호출법보다 넓은 경로가 필요합니다. 컨테이너가 요청을 받고 자료를 찾고, 오래 걸리는 일은 메시지로 넘기며, 비밀·설정·권한과 분산 추적을 붙여 끝까지 운영해야 합니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 한 요청은 실행·자료·비동기 작업·운영 신호를 차례로 지납니다", bridge: "시험의 네 영역을 한 요청으로 묶었습니다. 요청 100건을 넣어 각 부품이 맡는 양을 봅니다.", paragraphs: [
      "사용자 요청은 App Service·Container Apps·AKS 같은 실행 환경에 들어옵니다. 애플리케이션은 Cosmos DB나 PostgreSQL에서 자료와 벡터를 찾고, Redis 캐시를 확인하며, 오래 걸리는 일은 Service Bus나 Event Grid로 넘깁니다.",
      "Functions는 사건에 반응합니다. Key Vault와 App Configuration은 비밀과 설정을 나눠 관리합니다. OpenTelemetry 추적과 로그·지표를 함께 남겨 어느 경계에서 늦거나 실패했는지 찾습니다.",
    ] },
    { id: "case", level: "0", title: "3. 분당 요청 100건을 캐시·검색·작업 큐로 나눕니다", bridge: "한 요청의 전체 길을 봤습니다. 작은 숫자로 병목과 운영 판단을 고정합니다.", paragraphs: [
      "(가정) 문서 검색 API에 분당 100건이 들어옵니다. Redis에서 60건을 바로 찾고, 나머지 40건은 PostgreSQL의 pgvector나 Cosmos DB 벡터 검색으로 보냅니다. 이 가운데 문서 갱신 5건은 큐에 넣어 응답 경로와 분리합니다.",
      "캐시 적중 60건만 보고 성공이라 말할 수는 없습니다. 벡터 검색 40건의 지연, 큐 5건의 재시도와 실패 보관, 전체 요청의 추적 연결, 비밀 노출 여부까지 같은 실행 기록에서 확인합니다.",
    ] },
    { id: "picture", level: "1", title: "4. 시험 보기는 제품명이 아니라 요청의 막힌 칸으로 줄입니다", bridge: "숫자 사례의 네 갈래를 정했습니다. 비슷한 서비스를 어느 신호로 구분하는지 봅니다.", paragraphs: [
      "HTTP 요청을 오래 붙잡지 않은 채 작업을 확실히 보관해야 하면 메시지 큐를 봅니다. 사건을 여러 구독자에게 알린 뒤 필터링·재시도하려면 이벤트 전달을 봅니다. 짧은 계산을 사건에 반응시킬 때는 Functions가 후보가 됩니다.",
      "벡터 검색도 제품명만으로 고르지 않습니다. 기존 거래 자료·질의·일관성 요구, 인덱스와 비용 단위, 연결 수와 지연을 먼저 적습니다. 그 조건으로 Cosmos DB·PostgreSQL·Redis의 역할을 좁힙니다.",
    ] },
    { id: "need", level: "2", title: "5. 기능이 맞아도 운영 경계가 끊기면 실제 서비스는 실패합니다", bridge: "서비스 선택 기준을 만들었습니다. 자격 범위가 보안·관측·문제 해결까지 이어지는 이유를 봅니다.", paragraphs: [
      "컨테이너가 떠 있어도 환경 변수와 비밀이 섞이면 교체와 권한 관리가 어렵습니다. 큐가 있어도 중복 처리와 배달 못 한 메시지의 보관 규칙이 없으면 주문 같은 작업이 사라지거나 두 번 실행될 수 있습니다.",
      "로그만 많이 모아도 한 요청의 실행·검색·큐 처리를 이어 보지 못하면 첫 실패를 찾기 어렵습니다. 관리 ID·Key Vault, 재시도·죽은 편지 큐, OpenTelemetry trace ID와 KQL 조회를 한 경로에 붙입니다.",
    ] },
    { id: "names", level: "3", title: "6. 네 공식 영역과 현재 자격 이름을 역할에 붙입니다", bridge: "이름 없는 요청 경로를 만들었습니다. Microsoft가 쓰는 시험 영역과 서비스 이름을 연결합니다.", paragraphs: [
      "현행 자격 이름은 Microsoft Certified: Azure AI Cloud Developer Associate이고 시험은 AI-200입니다. 컨테이너 솔루션 20~25%, Azure 데이터 서비스를 쓴 AI 솔루션 25~30%, Azure 서비스 연결·사용 20~25%, 보안·관측·문제 해결 20~25%입니다.",
      "컨테이너에는 ACR·App Service·Container Apps·AKS, 데이터에는 Cosmos DB·PostgreSQL·Azure Managed Redis, 연결에는 Service Bus·Event Grid·Functions, 운영에는 Key Vault·App Configuration·OpenTelemetry·KQL이 들어갑니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. 검색 요청 한 건에서 첫 실패 관문을 찾습니다", bridge: "공식 이름을 요청 경로에 붙였습니다. 시험 보기와 실무 장애에 같은 진단 순서를 적용합니다.", paragraphs: [
      "먼저 배포된 컨테이너 revision과 환경 설정을 확인합니다. 관리 ID에는 비밀과 데이터에 필요한 권한만 남깁니다. 캐시 miss 뒤에는 벡터 질의의 지연과 비용 단위를 확인합니다.",
      "오래 걸리는 작업은 큐에 넣습니다. 메시지 ID로 중복을 막은 뒤 trace ID로 입구부터 데이터·큐까지 이어 살핍니다. 실패 메시지는 죽은 편지 큐와 로그에서 원인을 바로잡은 뒤 다시 처리합니다.",
    ] },
    { id: "source", level: "5", title: "8. 공식 가이드는 Python·벡터 자료·컨테이너 운영을 함께 전제합니다", bridge: "진단 절차를 만들었습니다. 현재 가이드가 실제로 요구하는 선수 능력과 세부 과제를 맞춥니다.", paragraphs: [
      "공식 가이드는 Azure 및 외부 SDK, 데이터 관리, 관측과 문제 해결, 메시징과 이벤트, 벡터 데이터베이스, Python, 컨테이너 애플리케이션 경험을 요구합니다. 단일 모델 API 튜토리얼만으로는 범위를 덮지 못합니다.",
      "Cosmos DB의 RU·인덱스·일관성·change feed, PostgreSQL의 스키마·pgvector·연결 최적화, Redis의 만료·무효화와 벡터 인덱스까지 구현 항목으로 밝힙니다.",
    ] },
    { id: "comparison", level: "6", title: "9. AI-200은 폐지된 AZ-204의 이름만 바꾼 시험이 아닙니다", bridge: "현재 시험의 깊이를 확인했습니다. 오래된 개발 강의와 현행 경로의 겹침과 차이를 나눕니다.", paragraphs: [
      "AZ-204 자료의 Functions·App Service·Cosmos DB·Key Vault·메시징은 여전히 기초 기술로 쓸 수 있습니다. 그러나 AI-200은 컨테이너 운영과 벡터 검색, AI 자료 경로를 더 분명하게 중심에 둡니다.",
      "따라서 AZ-204 강의를 끝냈다는 이유만으로 AI-200 준비가 끝난 것은 아닙니다. 공식 가이드의 네 영역별로 직접 만든 산출물과 실패 복구 기록이 있는지 다시 확인합니다.",
    ] },
    { id: "limits", level: "7", title: "10. 자격 준비는 작은 AI 백엔드의 실패 기록으로 완성합니다", bridge: "현행 경로와 오래된 자료의 경계를 정했습니다. 취업 포트폴리오로 남길 최소 증거를 고릅니다.", paragraphs: [
      "분당 100건 사례를 Container Apps나 AKS에 배포합니다. Redis 캐시·벡터 검색·Service Bus·Key Vault·OpenTelemetry를 한 요청에 연결합니다. 비밀 권한 제거, 잘못된 인덱스, 죽은 편지 메시지 같은 장애를 주입해 복구 전후 지연과 로그를 남깁니다.",
      "시험 범위는 바뀔 수 있습니다. Preview 기능도 널리 쓰이면 나올 수 있습니다. 접수 직전 공식 가이드의 변경일과 언어별 갱신 차이를 확인합니다. 실습 비용과 자원 삭제 절차도 기록합니다.",
    ] },
  ],
  overviewFlow: { title: "AI 요청 한 건의 Azure 백엔드 경로", steps: [
    { actor: "실행", movement: "컨테이너가 요청을 받습니다. 관리 ID로 설정과 비밀을 읽습니다.", receives: "인증된 요청" },
    { actor: "자료와 사건", movement: "캐시·벡터 저장소를 조회한 뒤 느린 일은 큐로 넘깁니다.", receives: "검색 결과와 작업 ID" },
    { actor: "운영", movement: "추적·로그·지표로 첫 실패를 찾은 뒤 안전하게 다시 처리합니다.", receives: "복구 가능한 실행 기록" },
  ] },
  numericCase: { title: "분당 요청 100건의 처리 장부", steps: [
    { label: "전체 요청", value: "100건/분", detail: "컨테이너 입구" },
    { label: "캐시 적중", value: "60건", detail: "Redis에서 바로 응답" },
    { label: "벡터 조회", value: "40건", detail: "Cosmos DB 또는 PostgreSQL" },
    { label: "비동기 갱신", value: "5건", detail: "Service Bus로 분리" },
  ] },
  decision: { title: "AI-200 서비스 선택 신호", question: "현재 요청에서 보관·배포·검색 중 무엇이 병목인가요?", options: [
    { signal: "오래 걸리는 갱신을 응답에서 분리해 실패 메시지를 보관합니다.", choose: "Service Bus", why: "작업을 큐에 저장합니다. 재시도·죽은 편지 처리도 운영합니다." },
    { signal: "새 container image를 10% 요청에 먼저 내보낸 뒤 관찰합니다.", choose: "Container Apps revision", why: "revision별 트래픽과 환경 설정을 나눠 단계 배포합니다." },
    { signal: "거래 자료와 embedding을 함께 질의하고 메타데이터로 거릅니다.", choose: "PostgreSQL + pgvector", why: "관계형 조건과 벡터 유사도 검색을 같은 자료 모델에서 다룹니다." },
  ] },
  terms: { title: "AI-200 백엔드의 세 핵심 이름", items: [
    { term: "컨테이너 revision", description: "코드와 설정이 고정된 배포 버전을 따로 실행하고 트래픽을 나눌 수 있는 단위입니다.", example: "새 버전에 요청 10%만 보내 오류율을 확인합니다.", boundary: "데이터 스키마와 외부 서비스까지 자동으로 이전하는 단위는 아닙니다." },
    { term: "벡터 검색 경로", description: "질문을 embedding으로 바꾸고 인덱스에서 가까운 자료를 찾아 메타데이터 조건과 함께 반환하는 흐름입니다.", example: "40건의 cache miss를 문서 종류로 거른 뒤 유사도 순으로 찾습니다.", boundary: "가까운 벡터가 사실에 맞는 답이나 접근 권한을 자동 보장하지 않습니다." },
    { term: "운영 가능성 고리", description: "추적·로그·지표로 실패를 찾습니다. 구성·코드·메시지를 고친 뒤 같은 요청으로 다시 확인하는 과정입니다.", example: "trace ID로 늦은 벡터 질의를 찾습니다. 인덱스 수정 뒤 지연을 비교합니다.", boundary: "관측 자료를 모으기만 해서는 경보 기준과 복구 절차가 생기지 않습니다." },
  ] },
  algorithm: { title: "AI 검색 요청 한 건의 진단", input: ["배포 revision", "관리 ID", "요청 100건/분", "캐시·벡터 저장소", "작업 큐", "trace ID"], steps: [
    { code: "revision과_환경_설정을_확인한다()", note: "어느 코드와 설정이 요청을 받았는지 고정합니다." },
    { code: "관리_ID의_비밀·데이터_권한을_확인한다()", note: "키 파일보다 실제 주체와 최소 권한을 봅니다." },
    { code: "if 캐시_miss: 벡터_질의의_인덱스·RU·지연을_기록한다()", note: "40건의 자료 경로를 별도로 측정합니다." },
    { code: "if 긴_작업: Service_Bus에_작업_ID와_함께_넣는다()", note: "응답과 갱신 시간을 분리하고 중복을 막습니다." },
    { code: "trace_ID로_실행·자료·큐_구간을_잇는다()", note: "첫 실패와 가장 긴 구간을 찾습니다." },
    { code: "최소_수정_뒤_같은_100건을_다시_보낸다()", note: "복구 전후의 지연·실패·비용을 비교합니다." },
  ], output: "첫 실패 관문 + 최소 수정 + 복구 전후 운영 기록", repeatUntil: "오류·지연·죽은 편지 메시지가 목표 안에 들고 비밀 노출이 없을 때까지 반복합니다." },
  examScope: { title: "AI-200 공식 영역", asOf: "Study guide updated May 5, 2026", domains: [
    { name: "Develop containerized solutions", weight: "20–25%", focus: "ACR image와 App Service·Container Apps·AKS 배포, 확장과 문제 해결을 다룹니다." },
    { name: "Develop AI solutions using data services", weight: "25–30%", focus: "Cosmos DB·PostgreSQL·Redis의 질의·인덱스·벡터 검색과 성능을 다룹니다." },
    { name: "Connect to and consume Azure services", weight: "20–25%", focus: "Service Bus·Event Grid의 사건 흐름과 Azure Functions를 구현합니다." },
    { name: "Secure, monitor, troubleshoot", weight: "20–25%", focus: "Key Vault·App Configuration, OpenTelemetry와 KQL로 보호하고 진단합니다." },
  ] },
  sources: [
    { source: "Microsoft Learn · AI-200 Study Guide", excerpt: "Develop AI solutions by using Azure data management services", application: "네 영역의 비중과 컨테이너·벡터 자료·메시징·보안·관측 세부 항목을 학습표에 그대로 대응합니다.", citation: "Microsoft Learn, Study guide for Exam AI-200", href: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200", note: "AI-200의 대상 역할, 합격 기준과 2026년 5월 기준 기술 범위를 밝힌 공식 가이드입니다." },
    { source: "Microsoft Learn · Azure AI Cloud Developer Associate", excerpt: "back-end services, scalable architectures, and the full development lifecycle", application: "모델 호출 한 부분보다 요구·개발·배포·보안·관측까지 이어지는 포트폴리오를 만드는 근거로 씁니다.", citation: "Microsoft Learn, Azure AI Cloud Developer Associate", href: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/", note: "현행 자격 이름, 역할, 시험 시간·언어와 공식 AI-200 연결을 안내하는 자격 페이지입니다." },
  ],
  review: [
    "AI-200을 모델 API 사용법만으로 준비할 수 없는 이유는 무엇인가요? (답: 1·8절)",
    "분당 100건 중 캐시 miss 40건과 갱신 5건은 어떤 다른 경로를 지나나요? (답: 3·7절)",
    "AZ-204 자료를 재사용해도 AI-200 범위를 다시 확인해야 하는 이유는 무엇인가요? (답: 9절)",
  ],
};
