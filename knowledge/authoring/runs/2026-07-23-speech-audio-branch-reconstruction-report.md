# Speech · Audio branch reconstruction report

## Observed

네 핵심 글의 본문과 Viz는 이미 interaction, generation, recognition, representation의 서로 다른 책임을 깊게 닫고 있었다. 그러나 카테고리는 네 글을 한 개의 필수 직렬 경로로 보여 줬고, 질문별 출발점을 고르는 `speech-audio-models` 허브는 `OPTIONAL`로 밀려나 있었다.

2026-07-22에 공개된 OpenAI Presence는 voice agent의 현재 상단을 모델 자연스러움에서 업무 권한, 정책, 승인, 사람 escalation, simulation·grader와 배포 후 개선으로 올렸다. 기존 GPT-Live는 continuous full-duplex interaction mechanism, Moshi는 공개 아키텍처 기준점으로 그대로 유효했다.

## Inferred

독자는 시대순이나 일련번호를 고르는 것이 아니라 실패의 소유자를 골라야 한다. 말 끊기는 interaction runtime, 화자·억양 흔들림은 generation, partial transcript 뒤집힘은 recognition, bitrate·복원·지연 변화는 representation에서 시작한다. Signal foundation은 모든 독자의 입구가 아니라 sample·window·filter·delay가 실제 blocker일 때만 연다.

## Decided

1. 부모 `ai-speech-audio`는 질문 선택 허브와 네 child branch만 보인다.
2. 동시 대화·생성·인식·표현 글은 각 분기에서 하나의 판단만 소유한다.
3. 분기별 authored learning path는 공통 기반을 재사용하되, 부모 화면에서 네 글을 다시 평탄화하지 않는다.
4. 최신 제품 상단은 Presence, interaction mechanism은 GPT-Live, 공개 canonical paper는 Moshi로 서로 다른 evidence 층을 갖는다.
5. 음향학·speech 역사는 Signals and Systems에서 중단하고 현재 trace로 다시 올라간다.

## Sources and boundaries

- OpenAI Presence: production workflow·permission·evaluation contract만 사용했다. Speech token·training 구조로 확대하지 않았다.
- OpenAI GPT-Live: continuous input/output, 초당 여러 interaction decision과 foreground/background 위임만 사용했다.
- Moshi: parallel user/model audio stream, Mimi RVQ, Inner Monologue와 공개 latency setting만 canonical mechanism으로 사용했다.
- Qwen3-Omni: Thinker–Talker와 공개 runtime capability를 generation 근제로만 사용했다.

## Claude collaboration

`context-manager` 인증 API의 `/api/chat`에 `model=claude-sonnet-4-6`, `fresh=true`로 두 번 요청했다. 첫 요청은 로컬 파일 기반 IA·최신 누락·비공개 전이 문제 감사, 둘째는 확정된 네 분기의 독립성·누락·source 과장 반례 감사였다. 두 호출 모두 context-manager까지는 도달했지만 Claude provider가 HTTP 500 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았고 Claude review가 반영되었다고 기록하지 않는다.

## Verified

- 부모 화면: 네 branch link, 허브 1글, `OPTIONAL` 오분류 0.
- child 화면: 각 소유 글 1개, parent route 복귀 link, 미할당 글 0.
- 집중 Playwright: 6/6 통과.
- 관련 회귀: 첫 실행 108/109 통과, 경로 제목 기대값 1건을 갱신한 뒤 집중 재실행 통과.
- 3 routes × 3 viewports(390·768·1440): document overflow 0, console error 0.
- Realtime article formula minimum scale: mobile 0.9, tablet·desktop 1.0.

## 4B · 9B handoff

4B worker는 글 하나만 받고 `failure_owner`, `entry_symptom`, `exit_decision`, `shared_foundation_trigger`, `source_claim`, `source_boundary`, `hard_transfer_evidence`를 JSON으로 낸다. 9B reviewer는 네 packet을 받고 서로 다른 failure가 한 경로에 옮겨 붙지 않았는지, 공통 기반을 직렬 선행으로 오인하지 않는지, product claim을 model architecture로 확대하지 않았는지 검사한다. Orchestrator만 subcategory migration, authored path, source freshness, 반응형 화면과 배포를 닫는다.
