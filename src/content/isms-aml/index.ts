import type { Article, Category } from "../types";

const ismsAmlArticles: Article[] = [
  {
    slug: "isms-overview",
    title: "ISMS-P 관리체계 — 범위·위험·통제·심사",
    subcategory: "isms-management",
    sections: [
      { id: "overview", title: "인증범위와 관리체계 loop" },
      { id: "asset-risk", title: "자산·위험 시나리오·잔여위험" },
      { id: "protection-measures", title: "보호대책과 운영 증거" },
      { id: "audit-remediation", title: "표본심사·보완·사후관리" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-overview"),
  },
  {
    slug: "isms-audit-checklist",
    title: "ISMS 현장심사 실무 — 심사원이 실제로 확인하는 것들",
    subcategory: "isms-management",
    sections: [
      { id: "overview", title: "현장심사 흐름과 준비" },
      { id: "server-network-audit", title: "서버·네트워크 점검" },
      { id: "account-access-audit", title: "계정·접근통제 점검" },
      { id: "log-backup-audit", title: "로그·백업 점검" },
      { id: "privacy-web-audit", title: "개인정보·웹사이트 점검" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-audit-checklist"),
  },
  {
    slug: "isms-practical-guide",
    title: "VASP ISMS 실전 — 통제에서 재현 가능한 증적까지",
    subcategory: "isms-management",
    sections: [
      { id: "overview", title: "서비스 trace와 control owner" },
      { id: "crypto-auth", title: "암호화·인증의 운영 계약" },
      { id: "access-db", title: "DB session과 query trace" },
      { id: "webapp-security", title: "웹 보안과 배포 gate" },
      { id: "wallet-ops", title: "Wallet key·승인·출금 trace" },
      { id: "audit-evidence", title: "모집단·표본·재현 가능한 증적" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-practical-guide"),
  },
  {
    slug: "aml-compliance",
    title: "AML/CFT 컴플라이언스 — VASP 자금세탁방지 체계",
    subcategory: "aml-cft",
    sections: [
      { id: "overview", title: "AML/CFT 컴플라이언스란" },
      { id: "cdd-process", title: "고객확인제도 (CDD/EDD)" },
      { id: "risk-based-approach", title: "위험기반 접근법 (RBA)" },
      { id: "fds-and-str", title: "이상거래 탐지와 의심거래 보고" },
    ],
    component: () => import("@/pages/articles/isms-aml/aml-compliance"),
  },
  {
    slug: "vasp-wallet-security",
    title: "VASP 지갑 보안과 내부통제",
    subcategory: "vasp-internal",
    sections: [
      { id: "overview", title: "VASP 내부통제 체계" },
      { id: "wallet-architecture", title: "지갑 구조와 보관 정책" },
      { id: "access-control", title: "접근통제와 DB 보안" },
      { id: "incident-response", title: "사고 대응과 백업/복구" },
    ],
    component: () => import("@/pages/articles/isms-aml/vasp-wallet-security"),
  },
  {
    slug: "isms-incident-response",
    title: "사고 예방 및 대응 — 탐지부터 재발방지까지",
    subcategory: "isms-incident",
    sections: [
      { id: "overview", title: "Alert에서 검증된 정상화까지" },
      { id: "triage-containment", title: "Triage·containment·증거" },
      { id: "evidence-recovery", title: "Eradication과 복구 승인" },
      { id: "incident-release", title: "실패 주입과 release gate" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-incident-response"),
  },
  {
    slug: "isms-backup-recovery",
    title: "백업 및 재해복구 — 정책 수립부터 복구 테스트까지",
    subcategory: "isms-backup",
    sections: [
      { id: "overview", title: "사본에서 서비스 승인까지" },
      { id: "bia-rpo-rto", title: "BIA·RPO·RTO" },
      { id: "backup-restore", title: "Consistency와 restore" },
      { id: "recovery-release", title: "복구 훈련과 release gate" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-backup-recovery"),
  },
  {
    slug: "isms-encryption",
    title: "암호화 적용 — 데이터·비밀번호·키 수명주기",
    subcategory: "isms-crypto",
    sections: [
      { id: "overview", title: "복호화 허가에서 시작" },
      { id: "data-password-boundary", title: "데이터와 비밀번호 경계" },
      { id: "key-lifecycle", title: "DEK·KEK 수명주기" },
      { id: "release-gate", title: "Rotation·Recovery gate" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-encryption"),
  },
  {
    slug: "isms-dev-security",
    title: "개발 보안 — 시큐어코딩·배포·취약점 관리",
    subcategory: "isms-dev-sec",
    sections: [
      { id: "overview", title: "Threat에서 production까지" },
      { id: "secure-development", title: "요구사항과 layered verification" },
      { id: "build-deploy-gate", title: "Artifact provenance와 배포" },
      { id: "change-release", title: "Canary·rollback release gate" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-dev-security"),
  },
  {
    slug: "isms-auth-management",
    title: "인증·계정관리 — MFA·비밀번호·identity lifecycle",
    subcategory: "isms-auth",
    sections: [
      { id: "overview", title: "인증과 권한의 경계" },
      { id: "password-policy", title: "Online·offline password 방어" },
      { id: "account-lifecycle", title: "Joiner·mover·leaver" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-auth-management"),
  },
  {
    slug: "isms-access-control",
    title: "접근통제 — 권한결정·망분리·DB audit",
    subcategory: "isms-access",
    sections: [
      { id: "overview", title: "Identity에서 enforcement까지" },
      { id: "network-segmentation", title: "Network flow와 rule lifecycle" },
      { id: "db-access-control", title: "DB 권한·session·감사" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-access-control"),
  },
  {
    slug: "aml-fds-deep",
    title: "이상거래 탐지 — FDS 설계·탐지 패턴·AI 고도화",
    subcategory: "aml-fds",
    sections: [
      { id: "overview", title: "이상거래 탐지 시스템(FDS)이란" },
      { id: "detection-patterns", title: "주요 탐지 패턴" },
      { id: "blockchain-analysis", title: "블록체인 분석 도구와 기법" },
      { id: "ai-fds", title: "AI 기반 FDS 고도화" },
    ],
    component: () => import("@/pages/articles/isms-aml/aml-fds-deep"),
  },
  {
    slug: "aml-str-reporting",
    title: "의심거래 보고 — SAR 작성·FIU 보고·Tipping-off 금지",
    subcategory: "aml-str",
    sections: [
      { id: "overview", title: "의심거래 보고 의무" },
      { id: "sar-process", title: "SAR 작성과 제출 프로세스" },
      { id: "tipping-off", title: "Tipping-off 금지와 내부 통제" },
      { id: "record-keeping", title: "기록 보관과 교육" },
    ],
    component: () => import("@/pages/articles/isms-aml/aml-str-reporting"),
  },
  {
    slug: "aml-cdd-deep",
    title: "고객확인제도 심층 — CDD·EDD·실제소유자·Travel Rule",
    subcategory: "aml-cdd",
    sections: [
      { id: "overview", title: "고객확인의무의 법적 근거" },
      { id: "identity-verification", title: "신원확인과 검증 절차" },
      { id: "enhanced-due-diligence", title: "강화된 고객확인 (EDD)" },
      { id: "travel-rule", title: "가상자산 이전 시 정보제공 (Travel Rule)" },
    ],
    component: () => import("@/pages/articles/isms-aml/aml-cdd-deep"),
  },
  {
    slug: "aml-rba-deep",
    title: "위험기반 접근법 — FATF 프레임워크와 전사 위험평가",
    subcategory: "aml-rba",
    sections: [
      { id: "overview", title: "위험기반 접근법(RBA)이란" },
      { id: "risk-assessment-process", title: "전사 위험평가 4단계" },
      { id: "three-lines", title: "3선 방어 모델과 조직" },
      { id: "documentation-review", title: "문서화와 정기 점검" },
    ],
    component: () => import("@/pages/articles/isms-aml/aml-rba-deep"),
  },
  {
    slug: "vasp-custody-management",
    title: "가상자산 보관 관리 — 콜드월렛 80%·Proof of Reserves·수탁",
    subcategory: "vasp-custody",
    sections: [
      { id: "overview", title: "가상자산 보관 의무" },
      { id: "cold-wallet-policy", title: "콜드월렛 80% 보관 규정" },
      { id: "proof-of-reserves", title: "준비금 증명(PoR)과 온체인 검증" },
      { id: "external-custody", title: "외부 수탁과 취약점 점검" },
    ],
    component: () =>
      import("@/pages/articles/isms-aml/vasp-custody-management"),
  },
  {
    slug: "vasp-unfair-trading",
    title: "불공정거래 방지 — 미공개정보·시세조종·내부자거래",
    subcategory: "vasp-unfair",
    sections: [
      { id: "overview", title: "가상자산 불공정거래란" },
      { id: "insider-trading", title: "미공개중요정보 이용 금지" },
      { id: "market-manipulation", title: "시세조종과 부정거래" },
      { id: "prevention-framework", title: "예방 체계와 준법감시" },
    ],
    component: () => import("@/pages/articles/isms-aml/vasp-unfair-trading"),
  },
  {
    slug: "isms-security-infra",
    title: "보안 인프라 — UTM·방화벽·IDS/IPS·SIEM 구축",
    subcategory: "isms-infra",
    sections: [
      { id: "overview", title: "Zone에서 evidence까지" },
      { id: "zone-flow-policy", title: "Zone·flow·rule lifecycle" },
      { id: "detect-enforce-observe", title: "탐지·차단·관측 분리" },
      { id: "infra-release", title: "Paired traffic release gate" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-security-infra"),
  },
  {
    slug: "isms-privacy-policy",
    title: "개인정보 처리방침과 동의 — 웹 공시·수집·이용·제3자 제공",
    subcategory: "isms-privacy-policy",
    sections: [
      { id: "overview", title: "개인정보 처리방침이란" },
      { id: "consent-management", title: "수집/이용 동의 체계" },
      { id: "third-party-sharing", title: "제3자 제공과 위탁" },
      { id: "cookie-policy", title: "쿠키 정책과 기술적 조치" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-privacy-policy"),
  },
  {
    slug: "isms-privacy-lifecycle",
    title: "개인정보 보유와 파기 — 보유기간·안전한 파기·분리보관",
    subcategory: "isms-privacy-lifecycle",
    sections: [
      { id: "overview", title: "개인정보 생명주기" },
      { id: "retention-policy", title: "보유기간과 분리보관" },
      { id: "secure-deletion", title: "안전한 파기 방법" },
      { id: "privacy-impact-assessment", title: "개인정보 영향평가(PIA)" },
    ],
    component: () => import("@/pages/articles/isms-aml/isms-privacy-lifecycle"),
  },
];

const ismsAml: Category = {
  slug: "isms-aml",
  name: "ISMS / AML",
  description:
    "정보보호 관리체계(ISMS-P), 자금세탁방지(AML/CFT), VASP 컴플라이언스",
  subcategories: [
    {
      slug: "isms-management",
      name: "ISMS 관리체계",
      description: "정보보호정책, 위험평가, 자산관리, 조직 역할",
      icon: "🛡️",
    },
    {
      slug: "isms-protection",
      name: "ISMS 보호대책",
      description: "접근통제, 암호화, 인증, 물리보안, 개발보안",
      icon: "🔒",
      children: [
        {
          slug: "isms-auth",
          name: "인증 및 권한관리",
          description: "MFA, 비밀번호 정책, 계정관리",
        },
        {
          slug: "isms-access",
          name: "접근통제",
          description: "DB 접근제어, 망분리, IP 제한",
        },
        {
          slug: "isms-crypto",
          name: "암호화",
          description: "키관리, 해시 알고리즘, Secrets Manager",
        },
        {
          slug: "isms-dev-sec",
          name: "개발 보안",
          description: "웹 보안, 세션 관리, 코드 리뷰",
        },
        {
          slug: "isms-incident",
          name: "사고 대응",
          description: "침해사고 탐지, 대응, 복구 절차",
        },
        {
          slug: "isms-backup",
          name: "백업 및 재해복구",
          description: "백업 정책, 복구 절차, 소산백업",
        },
        {
          slug: "isms-infra",
          name: "보안 인프라",
          description: "UTM, SIEM, IDS/IPS, 방화벽 규칙",
        },
      ],
    },
    {
      slug: "isms-privacy",
      name: "개인정보 처리 (3.x)",
      description: "처리방침 공시, 수집/이용 동의, 파기, 영향평가",
      icon: "📋",
      children: [
        {
          slug: "isms-privacy-policy",
          name: "처리방침과 동의",
          description: "웹 공시, 수집/이용 동의, 쿠키 정책",
        },
        {
          slug: "isms-privacy-lifecycle",
          name: "보유와 파기",
          description: "보유기간, 안전한 파기, 분리보관",
        },
      ],
    },
    {
      slug: "aml-cft",
      name: "AML/CFT",
      description: "자금세탁방지, 고객확인(CDD), 의심거래보고(STR)",
      icon: "💰",
      children: [
        {
          slug: "aml-cdd",
          name: "고객확인제도",
          description: "CDD/EDD, 실명인증, 실제소유자 확인",
        },
        {
          slug: "aml-rba",
          name: "위험기반 접근법",
          description: "RBA 위험평가, FATF 권고, 3선 방어",
        },
        {
          slug: "aml-fds",
          name: "이상거래 탐지",
          description: "FDS, 감시체계, 자동 탐지 패턴",
        },
        {
          slug: "aml-str",
          name: "의심거래 보고",
          description: "SAR 작성, FIU 보고 절차",
        },
      ],
    },
    {
      slug: "vasp-compliance",
      name: "VASP 컴플라이언스",
      description: "가상자산사업자 내부통제, 지갑관리, 불공정거래 방지",
      icon: "⛓️",
      children: [
        {
          slug: "vasp-internal",
          name: "내부통제",
          description: "핫/콜드월렛, Multi-sig, 접근통제",
        },
        {
          slug: "vasp-custody",
          name: "자산 보관",
          description: "콜드월렛 80% 규정, 외부 수탁, 이용자 명부",
        },
        {
          slug: "vasp-unfair",
          name: "불공정거래 방지",
          description: "미공개정보, 시세조종, 내부자 거래",
        },
      ],
    },
  ],
  articles: ismsAmlArticles,
};

export default ismsAml;
