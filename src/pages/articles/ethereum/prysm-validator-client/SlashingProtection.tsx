import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function SlashingProtection({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="slashing-protection" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        Prysm의 local DB gate는 서명 뒤, 제출 앞에서 충돌을 막습니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          V37이 만든 σA는 곧바로 beacon node로 가지 않습니다. Prysm은 σA를 넣은
          indexed attestation을 만든 뒤, RA와 함께
          <code>SlashableAttestationCheck</code>에 넘깁니다.
        </p>
        <p>
          Complete BoltDB backend는 낮은 source·target 경계, 같은 target epoch의
          다른 signing root, 양방향 surround를 검사합니다. 안전하면
          source·target·RA를 저장합니다. 그 호출이 성공한 뒤에만 attestation을
          제출합니다.
        </p>
        <p>
          예를 들어 DB에 target epoch 3의 root RB가 있는데 새 vote도 target
          epoch 3이면서 root RA라면 double vote입니다. Source·target이 같아도
          signing root가 다르므로 local gate가 오류를 돌리고 submit 함수까지
          도달하지 않습니다. 같은 non-empty RA의 반복은 double vote로 보지
          않습니다.
        </p>
      </div>

      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() =>
            onCodeRef("attestation-pipeline", codeRefs["attestation-pipeline"])
          }
        />
        <CodeViewButton
          onClick={() =>
            onCodeRef("slashable-attestation", codeRefs["slashable-attestation"])
          }
        />
        <span className="self-center text-xs text-muted-foreground">
          Sign → DB check·save → submit의 실제 순서
        </span>
      </div>

      <ExplainedFormula
        question="두 attestation 중 하나가 다른 하나를 surround하는지 어떻게 판정할까요?"
        idea={<>Vote를 source epoch에서 target epoch로 가는 구간으로 봅니다. 한 구간의 양 끝이 다른 구간 안쪽에 모두 들어가면 바깥 vote가 안쪽 vote를 surround합니다.</>}
        formula={String.raw`(s_1<s_2<t_2<t_1)\;\lor\;(s_2<s_1<t_1<t_2)`}
        annotatedFormula={String.raw`\underbrace{(s_1<s_2<t_2<t_1)}_{\text{vote 1이 vote 2를 감쌈}}\;\lor\;\underbrace{(s_2<s_1<t_1<t_2)}_{\text{vote 2가 vote 1을 감쌈}}`}
        operations={[
          {
            expression: String.raw`2<3<4<5`,
            annotation: [
              "기존 vote가 2→5이고 새 vote가 3→4라면 새 구간이 기존 안에 있습니다.",
              "두 vote를 같은 key가 서명하면 기존 vote가 새 vote를 surround합니다.",
            ],
          },
          {
            expression: String.raw`2<3<5<6`,
            annotation: [
              "2→5와 3→6은 서로 교차하지만 어느 한쪽이 다른 쪽을 완전히 감싸지 않습니다.",
              "이 식만으로는 surround가 아니지만 같은 target의 다른 root인지 별도로 확인합니다.",
            ],
          },
        ]}
        terms={[
          { symbol: "s_1,t_1", name: "첫 vote의 source·target", description: "첫 attestation data가 참조하는 두 checkpoint epoch입니다." },
          { symbol: "s_2,t_2", name: "두 번째 vote의 source·target", description: "비교할 attestation data의 두 checkpoint epoch입니다." },
          { symbol: "<", name: "strict ordering", description: "끝점이 같은 경우를 surround로 만들지 않는 엄격한 epoch 순서입니다." },
        ]}
        assumptions={[
          "같은 validator public key가 서명한 유효한 attestation data끼리 비교합니다.",
          "같은 target epoch의 다른 data를 서명하는 double vote는 이 식과 별도로 검사합니다.",
          "빈 local DB는 과거 vote가 없다는 증거가 아니므로 새 client 시작 때 history를 임의로 버리지 않습니다.",
        ]}
        interpretation="Surround는 단순한 구간 겹침이 아니라 strict containment입니다. 그래서 double vote와 surround를 서로 다른 predicate로 모두 확인해야 합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>“서명 전 원자적 gate”라고 설명하면 현재 Prysm 코드를 잘못 읽게 됩니다</h3>
        <p>
          <code>SubmitAttestation</code>은 process 안에서 role과 public key로 만든
          multilock을 잡습니다. 그 lock 안에서 data를 받고 keymanager로 서명한 뒤
          DB check·save와 제출을 순서대로 실행합니다. 따라서 한 Prysm process의
          같은 role·key 작업은 직렬화됩니다.
        </p>
        <p>
          그러나 signature는 DB 호출보다 먼저 생깁니다. Complete BoltDB의
          <code>SlashableAttestationCheck</code>도 여러 read 뒤에 save를 호출하는
          구조입니다. 이 경로를 다른 process의 DB나 remote signer까지 포괄하는
          분산 transaction으로 부를 수는 없습니다. 정확한 표현은
          <strong>“한 process에서 sign 뒤 local history를 확인·저장하고, 성공한
          signature만 제출한다”</strong>입니다.
        </p>

        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
          <article className="border border-border bg-background p-4">
            <p className="text-xs font-black text-primary">Pinned source에서 확인한 것</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>같은 process의 role·key multilock</li>
              <li>Keymanager 서명 뒤 local DB check·save</li>
              <li>DB 성공 뒤 beacon node submit</li>
              <li>Complete DB의 double·surround 검사</li>
            </ul>
          </article>
          <article className="border border-amber-500/50 bg-amber-500/5 p-4">
            <p className="text-xs font-black text-amber-700 dark:text-amber-300">별도 운영 설계가 필요한 것</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>두 validator process 사이의 single writer</li>
              <li>Remote signer의 공용 slashing history</li>
              <li>Timeout-after-success의 동일-root 조정</li>
              <li>Key 이동 중 source·destination overlap 차단</li>
            </ul>
          </article>
        </div>

        <h3>Active-active보다 놓친 duty 하나가 낫습니다</h3>
        <p>
          Validator host A가 멈췄다고 판단해 host B를 켰는데 A가 실제로는 계속
          서명 중이라면, 두 client가 서로 다른 local DB를 보고 같은 key를 쓸 수
          있습니다. Process-local lock은 이 상황을 알지 못합니다.
        </p>
        <p>
          자동 failover를 하려면 lease 만료만 보지 말고 이전 signer를 확실히
          fence해야 합니다. 또는 두 client가 우회할 수 없는 remote signer 한
          곳에서 slashing protection을 집행해야 합니다.
        </p>

        <h3>Migration은 key와 EIP-3076 history를 함께 옮깁니다</h3>
        <p>
          Source client를 먼저 중지하고 key의 signing authority를 닫습니다. 그
          상태에서 EIP-3076 history를 export해 destination에 import합니다.
        </p>
        <p>
          Sample proposal slot과 attestation source·target·root가 맞는지 검증한
          뒤 새 client의 authority를 엽니다. JSON import 성공만 확인하고 source를
          계속 실행하면 두 창구가 동시에 같은 key를 쓸 수 있습니다.
        </p>

        <h3>Release gate는 성능보다 signature 수를 먼저 확인합니다</h3>
        <ul>
          <li>같은 slot의 서로 다른 proposal roots를 동시에 요청합니다.</li>
          <li>같은 target epoch의 RA·RB와 양방향 surround vote를 주입합니다.</li>
          <li>Remote signer가 서명한 직후 response만 잃는 timeout을 만듭니다.</li>
          <li>DB save 직전·직후 crash와 restart를 각각 재현합니다.</li>
          <li>Source·destination migration이 잠깐 겹치도록 해 fencing을 확인합니다.</li>
        </ul>
        <p>
          각 경우에 submit 수뿐 아니라 signer가 실제 만든 signature 수, persisted
          history와 restart 뒤 결정을 함께 봅니다. 이 safety parity를 통과한 뒤에야
          missed-duty 비율과 p95·p99 signer latency를 비교합니다.
        </p>

        <aside className="not-prose mt-5 border-l-2 border-primary bg-primary/5 p-4 text-sm leading-6">
          <strong>한 문장으로 다시 정리하면:</strong> Prysm validator client는
          beacon-node duty를 slot deadline 안의 signing request로 바꾸고,
          keymanager가 만든 signature를 local history에 기록할 수 있을 때만
          제출합니다. 여러 process와 remote signer까지 안전하게 만들려면 한 key의
          signing authority를 별도로 single-writer로 묶어야 합니다.
        </aside>
      </div>
    </section>
  );
}
