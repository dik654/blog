import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeViewButton } from "@/components/code";
import HeliosContractViz from "../helios-contract-viz";
import { codeRefsReal } from "./codeRefsReal";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Persistence({ title, onCodeRef }: Props) {
  return (
    <section id="persistence" className="mb-16 scroll-mt-20">
      <h2 className="mb-3 text-2xl font-bold">{title}</h2>
      <p className="mb-6 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
        같은 32-byte root라도 어디서 왔는지, 얼마나 오래됐는지, 파일에 안전하게 남았는지는 서로 다른 질문입니다.
      </p>

      <HeliosContractViz mode="checkpoint-storage" />

      <ExplainedFormula
        question="0.12.0은 checkpoint 나이를 어떤 값과 비교합니까?"
        idea="현재 slot과 bootstrap header slot을 각각 genesis 기준 초로 바꾼 뒤 차이를 냅니다. 이 값은 source trust가 아니라 age 판정에만 쓰입니다."
        formula={String.raw`a=(g+12s_{now})-(g+12s_{checkpoint}),\qquad old=(a\ge A_{max})`}
        annotatedFormula={String.raw`a=\underbrace{(g+12s_{now})-(g+12s_{checkpoint})}_{\text{slot 두 개의 timestamp 차이(초)}},\qquad old=\underbrace{(a\ge A_{max})}_{\text{설정한 maximum age 이상}}`}
        operations={[
          { expression: String.raw`g+12s_{now}`, annotation: ["Network genesis time에", "현재 slot×12초를 더함"] },
          { expression: String.raw`g+12s_{checkpoint}`, annotation: ["같은 network 기준으로", "bootstrap header slot의 시각을 계산"] },
          { expression: String.raw`a\ge A_{max}`, annotation: ["0.12.0 구현은 strict=true이면 error", "strict=false이면 warning 뒤 sync 계속", "source authority는 별도"] },
        ]}
        terms={[
          { symbol: "g", name: "Genesis time", description: "선택한 network profile의 genesis Unix time입니다." },
          { symbol: "s_{now}", name: "Current slot", description: "현재 wall clock과 genesis time으로 계산한 예상 slot입니다." },
          { symbol: "s_{checkpoint}", name: "Checkpoint slot", description: "Bootstrap header가 가진 beacon slot입니다." },
          { symbol: "A_{max}", name: "Maximum age", description: "Config의 max_checkpoint_age seconds입니다." },
        ]}
        assumptions={[
          "Helios 0.12.0의 12초 slot 계산과 선택한 network genesis를 사용합니다.",
          "Wall clock, network profile과 header slot이 같은 실행 문맥에 속한다고 가정합니다.",
          "Age 통과는 checkpoint source가 신뢰할 만하다는 증거가 아닙니다.",
        ]}
        interpretation="strict_checkpoint_age=false가 기본이면 오래됐다는 사실만으로 sync가 중단되지 않습니다. Production에서 오래된 anchor를 거절하려면 strict policy를 명시하고 fallback 동작까지 함께 시험해야 합니다."
      />

      <div className="not-prose -mt-2 mb-8">
        <CodeViewButton
          label="Checkpoint age와 strict 분기"
          onClick={() => onCodeRef("helios-checkpoint-age", codeRefsReal["helios-checkpoint-age"])}
        />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Checkpoint 선택 순서</h3>
        <p>
          <strong>[O]</strong> ConsensusClient는 먼저 <code>config.checkpoint</code>를 봅니다. 값이 없으면 FileDB를 읽고, FileDB가 정확히
          32 bytes를 읽지 못하면 network default checkpoint를 반환합니다. 즉 explicit→local file→default 순서입니다.{" "}
          <CodeViewButton
            label="Initial checkpoint 선택"
            onClick={() => onCodeRef("helios-checkpoint-select", codeRefsReal["helios-checkpoint-select"])}
          />
        </p>
        <p>
          FileDB의 save는 checkpoint 파일을 <code>truncate</code>한 뒤 32 bytes를 바로 씁니다. Temp file, file fsync, atomic rename,
          directory fsync는 보이지 않습니다.{" "}
          <CodeViewButton
            label="FileDB save·load"
            onClick={() => onCodeRef("helios-filedb", codeRefsReal["helios-filedb"])}
          />
        </p>
        <p>
          Crash 도중 12 bytes만 남으면 다음 시작에서 조용히 default checkpoint로 돌아갈 수 있습니다. 이 동작을 crash-safe
          persistence로 부르면 안 됩니다.
        </p>

        <h3>Fallback의 실제 조건</h3>
        <p>
          Initial sync가 실패하면 <code>load_external_fallback=true</code>일 때 외부 목록을 먼저 사용하고, 그렇지 않으면서 단일
          <code>fallback</code> URL이 있으면 그 주소를 사용합니다. 외부 목록 경로는 health 상태가 true인 서비스에 질의해 가장 최신 epoch의
          root 가운데 가장 자주 나온 값을 고릅니다.{" "}
          <CodeViewButton
            label="Fallback 선택과 plurality"
            onClick={() => onCodeRef("helios-checkpoint-fallback", codeRefsReal["helios-checkpoint-fallback"])}
          />
        </p>
        <p>
          공식 문서와 코드 주석은 이 서비스를 신뢰할 수 없으며 checkpoint 조작이 가능하다고 경고합니다. 다수 응답은 availability
          signal일 뿐 protocol이 만든 trust anchor가 아닙니다.
        </p>
      </div>

      <div className="not-prose my-8 grid gap-px bg-border p-px sm:grid-cols-2" aria-label="Helios checkpoint 실패 정책 비교">
        <div className="bg-background px-4 py-4">
          <p className="font-mono text-[10px] font-black text-primary">[O] CURRENT</p>
          <p className="mt-2 text-sm font-bold">Strict off</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            오래된 checkpoint는 경고 뒤 계속 사용합니다. Sync가 다른 이유로 실패하면 설정된 fallback으로 넘어갈 수 있습니다.
          </p>
        </div>
        <div className="bg-background px-4 py-4">
          <p className="font-mono text-[10px] font-black text-primary">[A] BASELINE</p>
          <p className="mt-2 text-sm font-bold">Strict on · 자동 외부 fallback off</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            신뢰한 checkpoint source를 명시하고 age 초과·conflict에서는 새 revision을 ready로 만들지 않습니다.
          </p>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>검증할 실패와 되돌리기</h3>
        <p>
          <strong>[A]</strong> Base와 candidate에 valid 32-byte file, 31·33-byte file, truncate 중 crash, permission error, wrong-network
          root, expired checkpoint, unavailable fallback와 conflicting fallback을 같은 순서로 재생합니다.
        </p>
        <p>
          Accept·reject reason, 선택된 checkpoint source, resulting Store와 readiness가 같아야 성능을 비교할 수 있습니다.
        </p>
        <p>
          <strong>[M] 미측정</strong> 대상 환경의 startup p50·p95, fallback 요청 수, checkpoint file 복구 시간은 아직 결과가 없습니다.
          결과가 나오기 전에는 0.12.0이나 hardening 후보가 더 빠르고 안전하다고 결론 내리지 않습니다. Rollback 묶음에는 이전 binary, redacted
          config digest, checkpoint backup과 실패 receipt를 넣습니다.
        </p>
      </div>
    </section>
  );
}
