import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";

const RUNTIME_LAYERS = [
  ["Provider", "인증 profile과 model catalog를 관리합니다."],
  ["Model", "이번 turn에 사용할 구체적인 언어 모델입니다."],
  ["Agent runtime", "준비된 prompt를 받아 model output·native tool call·finished turn을 처리합니다."],
  ["Channel", "요청과 답장이 드나드는 Telegram·Slack 같은 표면입니다."],
] as const;

export default function PiSDKStructure({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <>
      <h3 className="mt-8 text-xl font-semibold">
        Pi 중심 설명에서 runtime 계약으로 전환해 읽기
      </h3>
      <p>
        예전 OpenClaw 코드를 설명할 때는 Pi SDK package 계층을 architecture 그
        자체처럼 다루곤 했습니다. 현재 public 개념에서는
        <strong> agent runtime</strong>이 핵심입니다. runtime은 준비된 model
        turn을 실행하는 저수준 loop이고, <strong>harness</strong>는 그 runtime을
        제공하는 구현입니다. package 이름은 바뀔 수 있지만 이 책임 계약은
        configuration과 운영 판단에 직접 쓰입니다.
      </p>

      <div className="not-prose my-6 grid min-w-0 gap-3 sm:grid-cols-2">
        {RUNTIME_LAYERS.map(([term, description]) => (
          <article
            key={term}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h4 className="break-words text-sm font-semibold">{term}</h4>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </article>
        ))}
      </div>

      <p>
        현재 내장 compatibility runtime의 정식 id는 <code>openclaw</code>입니다.
        <code>pi</code>는 이전 설정을 읽기 위한 deprecated alias일 뿐이며 새
        설정에서 쓸 이름이 아닙니다. plugin SDK의
        <code>runEmbeddedPiAgent</code>도 <code>runEmbeddedAgent</code>로 이어지는
        deprecated compatibility alias입니다. 즉, “OpenClaw = Pi SDK wrapper”로
        이해하면 provider/model resolution, plugin harness, channel delivery의
        현재 경계를 놓칩니다.
      </p>
      <p>
        과거 package 도식의 <code>pi-tui</code>는 terminal UI 계층이므로 Gateway의
        agent runtime·channel delivery 계약과 같은 층이 아닙니다. Migration에서는
        UI package 이름, runtime id, Plugin SDK 함수 alias를 서로 다른 변경으로
        기록해야 합니다.
      </p>

      <div
        id="paper-openclaw-agent-runtimes"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Agent runtimes
        </p>
        <CitationBlock
          source="OpenClaw Docs — Agent Runtimes"
          citeKey={4}
          type="paper"
          href="https://docs.openclaw.ai/concepts/agent-runtimes"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> provider, model, channel, runtime이 설정 화면에서 함께 보이면 인증 경로와 실행 loop를 같은 것으로 오해하기 쉽습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> 네 층을 분리하고, runtime이 한 번의 준비된 model loop를 소유하며 harness가 이를 구현한다고 명시합니다.</p>
            <p><strong>전제·조건:</strong> provider와 model을 먼저 해석한 뒤 model-scoped, provider-scoped, auto 순서로 runtime policy를 적용합니다. 명시한 plugin runtime은 사용할 수 없을 때 fail closed해야 합니다.</p>
            <p><strong>근거 범위:</strong> runtime 선택과 loop ownership, OpenClaw가 channel delivery를 계속 소유한다는 공식 계약을 뒷받침합니다.</p>
            <p><strong>비주장:</strong> runtime을 바꾸면 모든 native tool hook, compaction, canonical thread state가 자동으로 동일해진다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div
        id="paper-openclaw-runtime-migration"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Runtime architecture migration
        </p>
        <CitationBlock
          source="OpenClaw Docs — Agent Runtime Architecture"
          citeKey={5}
          type="paper"
          href="https://docs.openclaw.ai/agent-runtime-architecture"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> 과거 package·함수 이름이 public architecture처럼 남으면 compatibility alias와 현재 ownership을 구분하기 어렵습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> built-in runtime id를 <code>openclaw</code>로 정의하고 agent core, embedded runner, provider transport, harness registry의 현재 경계를 문서화합니다.</p>
            <p><strong>전제·조건:</strong> <code>pi</code>는 legacy config normalization을 위한 alias이며, plugin은 documented <code>openclaw/plugin-sdk/*</code> surface를 사용해야 합니다.</p>
            <p><strong>근거 범위:</strong> Pi 중심 서술에서 OpenClaw-owned runtime과 plugin harness 계약으로 이동한 현재 naming과 source boundary의 근거입니다.</p>
            <p><strong>비주장:</strong> deprecated alias가 곧바로 제거됐거나, 과거 bundle의 모든 내부 파일 경로가 현재도 존재한다는 주장은 하지 않습니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div
        id="paper-openclaw-plugin-sdk-runtime"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Plugin SDK runtime migration
        </p>
        <CitationBlock
          source="OpenClaw Docs — Plugin SDK Runtime"
          citeKey={6}
          type="paper"
          href="https://docs.openclaw.ai/plugins/sdk-runtime"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Plugin 코드가 과거 embedded runner 함수명에 묶이면 runtime API가 바뀔 때 호환 경계와 이관 대상을 구분하기 어렵습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> 현재 Plugin SDK는 <code>runEmbeddedAgent</code>를 사용하고 <code>runEmbeddedPiAgent</code>를 deprecated alias로만 남깁니다.</p>
            <p><strong>전제·조건:</strong> 실제 설치 version의 Plugin SDK export와 migration note를 확인하고, alias를 새 코드의 안정 API로 간주하지 않아야 합니다.</p>
            <p><strong>근거 범위:</strong> 두 함수 이름 사이의 현재 compatibility 관계만 뒷받침합니다.</p>
            <p><strong>비주장:</strong> 과거 Pi package 전체가 제거됐거나 plugin의 동작이 이름 변경만으로 항상 동일하다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>
    </>
  );
}
