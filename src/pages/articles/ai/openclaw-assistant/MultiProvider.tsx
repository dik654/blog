import type { CodeRef } from "@/components/code/types";

const RESOLUTION = [
  ["1 · Provider", "어떤 인증 profile과 model catalog를 사용할지 해석"],
  ["2 · Model", "이번 turn의 canonical provider/model ref 확정"],
  ["3 · Runtime policy", "model-scoped → provider-scoped → auto → built-in openclaw 순서"],
  ["4 · Prepared turn", "Gateway가 session context와 허용된 tool surface를 준비"],
  ["5 · Finished turn", "runtime이 typed result와 observation을 OpenClaw에 반환"],
] as const;

export default function MultiProvider({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <>
      <h3 className="mt-8 text-xl font-semibold">
        provider·model을 고른 뒤 runtime policy를 적용합니다
      </h3>
      <p>
        Telegram 사용자 A에게 OpenAI model을, Slack 사용자 B에게 다른 provider의 model을 지정할 수는 있습니다. 그렇다고 channel adapter가 곧
        model runtime이 되지는 않습니다. Gateway는 먼저 canonical provider/model ref를 확정하고 그 조합에 맞는 runtime policy를 별도로
        적용합니다.
      </p>

      <ol className="not-prose my-6 grid min-w-0 gap-3">
        {RESOLUTION.map(([title, body]) => (
          <li
            key={title}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <p className="break-words text-sm font-semibold">{title}</p>
            <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </li>
        ))}
      </ol>

      <p>
        explicit plugin runtime을 지정했는데 사용할 수 없다면 조용히 다른 runtime으로
        넘어가서는 안 됩니다. 공식 계약은 이 경우 fail closed를 요구합니다.
        반대로 <code>auto</code>는 등록된 runtime이 조합을 claim하는지 보고,
        맡는 runtime이 없으면 built-in <code>openclaw</code>로 이어집니다. 다만
        OpenAI agent model은 runtime을 비우거나 <code>auto</code>로 두어도 Codex
        harness로 해석되는 현재 예외가 있으므로 resolved runtime을 trace에서
        확인해야 합니다. 이 차이를 알아야 “명시한 plugin이 실패했는데 다른
        loop가 조용히 돌았다” 같은 관측 불가능한 fallback을 막을 수 있습니다.
      </p>
      <p>
        runtime이 model loop를 소유하더라도 최종 channel delivery는 OpenClaw가
        소유합니다. runtime의 finished turn은 “사용자에게 보낼 내용과 상태”이지
        임의의 reply destination 권한이 아닙니다. Telegram A의 결과는 Telegram
        inbound metadata가 가리킨 route로, Slack B의 결과는 Slack route로
        돌아갑니다.
      </p>
    </>
  );
}
