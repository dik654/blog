import { defineNarrativeFlow } from "@/components/viz/narrative-flow";

export const STEPS = defineNarrativeFlow([
  {
    id: "discover",
    label: "필요한 tool 발견",
    body: "전체 schema 대신 이름·설명 색인에서 후보를 찾습니다.",
  },
  {
    id: "load",
    label: "선택한 signature 로드",
    body: "typed stub과 반환 schema를 program 환경에 연결합니다.",
  },
  {
    id: "generate",
    label: "Program 생성·검사",
    body: "모델이 loop와 branch를 작성하고 parser·type checker가 형태를 검사합니다.",
  },
  {
    id: "execute",
    label: "격리 실행",
    body: "sandbox가 허용된 capability로 MCP/API를 호출하고 중간 데이터를 가공합니다.",
  },
  {
    id: "return",
    label: "좁은 결과 반환",
    body: "출력 schema와 budget에 맞춘 결과만 모델 context로 돌아갑니다.",
  },
]);
