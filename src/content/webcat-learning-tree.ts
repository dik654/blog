export type WebcatTrack = "concept" | "practice" | "reference";

export interface WebcatLearningNode {
  id: "webcat-frontend-integrity";
  shortTitle: string;
  track: WebcatTrack;
  href: string;
  question: string;
  parentHref: string;
  parentLabel: string;
  closure: string;
  curriculumPrevious: { href: string; label: string };
  curriculumNext: { href: string; label: string };
}

export const WEBCAT_NODE = {
  id: "webcat-frontend-integrity",
  shortTitle: "프런트엔드 무결성",
  track: "concept",
  href: "/cs/blockchain/webcat-frontend-integrity#overview",
  question: "서버가 정상 HTTPS 연결로 바꾼 app.js를 보내도 브라우저가 실행 전에 막으려면 무엇을 따로 검증해야 할까요?",
  parentHref: "/cs/blockchain#eth-privacy",
  parentLabel: "Ethereum 프라이버시와 클라이언트 신뢰 경계",
  closure: "HTTPS는 서버와의 전송 채널을 보호하지만 개발자가 승인한 배포물인지는 증명하지 않습니다. WEBCAT 브라우저 확장은 2/3 합의로 서명된 enrollment preload, 사이트의 enrollment 정보, manifest 서명과 transparency proof, 전달된 resource hash와 CSP를 실행 전에 연결해서 검사합니다. 한 단계라도 맞지 않으면 페이지를 차단하지만, 승인된 코드의 취약점·악의적인 개발자·WEBCAT 자체 공급망은 이 검증만으로 해결되지 않습니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/kohaku-provider-validation#return-map",
    label: "Kohaku Provider 변경 검증",
  },
  curriculumNext: {
    href: "/cs/blockchain/pq-account#overview",
    label: "양자내성 계정",
  },
} as const satisfies WebcatLearningNode;
