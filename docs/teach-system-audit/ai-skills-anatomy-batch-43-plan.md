# Batch 43 — Agent Skill 선택부터 실행까지

## 독자가 가져온 질문

Skill은 Tool·MCP·Plugin과 무엇이 다르며, 요청과 맞는 Skill이 선택된 뒤 실제 실행과 검증까지 어떻게 이어집니까?

## 한 문장 답

Skill은 짧은 metadata로 발견된 뒤 전체 지침과 필요한 자료를 펼치는 작업 지식이며, 실제 동작과 권한은 Tool·MCP·실행 환경이 계속 소유하고 결과는 별도로 검증합니다.

## 고정 사례

“이 PR에서 실패한 CI를 고치고 검증 결과를 보고해 주세요”라는 요청과 `gh-fix-ci` Skill을 처음부터 끝까지 재사용합니다.

## 이름 없는 흐름

요청 → 후보 정보 → 전체 작업 순서 → 필요한 자료 → 권한 확인 → 실제 실행 → 검증 결과

## 원문 실물

- OpenAI API Skills: SKILL.md, discovery, user-prompt 우선순위, version, safety
- OpenAI Plugins Skills: Skill과 MCP server의 책임 경계
- OpenAI Plugins package: plugin.json, skills/, mcp.json 배포 구조

## 검증할 화면

- 1440×1000 desktop
- 390×844 mobile
- 첫 시각 자료가 본문보다 먼저 보이는지
- 자동 재생 없이 클릭·ArrowLeft·ArrowRight·Space로만 진행하는지
- reduced-motion에서 정지 상태를 유지하는지
- JavaScript 비활성 상태에서 여섯 장면의 순서와 결론이 보이는지
- 문서·시각화의 가로 넘침과 조작부 겹침이 없는지

## 금지한 일반화

- Skill instruction이 system instruction이거나 새 권한을 만든다고 쓰지 않습니다.
- Plugin을 Tool이나 MCP server의 상위 실행 권한으로 설명하지 않습니다.
- 현재 공식 문서에서 확인하지 못한 metadata context 비율·문자 수 상한을 쓰지 않습니다.
- 특정 local directory 탐색 규칙을 모든 OpenAI 실행 환경의 공통 규약으로 쓰지 않습니다.
