import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { EvidenceLedgerLab } from './practical-strategy/viz/CompetitionEvidenceLabs';

export default function ExperimentTrackingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Tracking은 차트 저장이 아니라 claim의 계보다</h2>
        <QuestionLead
          question="어제의 0.982가 오늘 재현되지 않을 때, 같은 model과 seed를 기억하면 충분할까?"
          answer="아니다. Dataset digest, split manifest, code revision, environment, config, seed policy, OOF prediction과 artifact가 하나의 run identity로 연결되어야 차이의 원인을 조사할 수 있다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            “XGBoost가 0.982를 냈다”는 claim이 아니다. 어떤 data snapshot의 어떤 행을 train/valid로
            썼고, 어떤 preprocessing과 code가 어떤 config로 실행되어 어떤 OOF와 model artifact를
            만들었는지 식별할 수 있어야 한다. W&amp;B와 MLflow는 이 계약을 저장하고 검색하는 구현이지,
            dashboard를 켠 것만으로 재현성이 생기지는 않는다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Run identity', meaning: '하나의 실행을 불변 입력과 출력으로 식별하는 key', why: '같은 이름의 실험이 덮어써지거나 서로 다른 data를 비교하는 것을 막는다.' },
          { term: 'Dataset digest', meaning: 'Data snapshot의 내용·schema를 가리키는 hash 또는 version', why: '파일명이 같아도 행과 label이 바뀐 상황을 식별한다.' },
          { term: 'Lineage', meaning: '입력 data와 code가 artifact로 이어지는 관계', why: 'Score가 어떤 model·submission을 만들었는지 역추적한다.' },
          { term: 'Seed policy', meaning: 'Seed 값뿐 아니라 반복 횟수와 nondeterminism 처리 규칙', why: '한 번 운 좋게 나온 값을 재현성으로 오해하지 않는다.' },
          { term: 'OOF prediction', meaning: '각 행을 학습하지 않은 fold model이 만든 out-of-fold 예측', why: 'Threshold, calibration, slice와 ensemble을 같은 행 기준으로 다시 검사한다.' },
          { term: 'Guardrail', meaning: 'Primary score가 올라도 악화되면 release를 막는 보호 지표', why: '특정 집단 오류, latency와 비용 증가를 평균 score가 숨기지 못하게 한다.' },
        ]} />
        <EvidenceLedgerLab />
      </section>

      <section id="run-identity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Run은 사람이 읽는 이름과 기계가 검증하는 manifest를 가진다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>exp_final_v7</code> 같은 이름은 검색용 별칭일 뿐이다. 기계가 검증할 identity에는
            dataset digest, split manifest digest, Git commit, dirty diff 여부, container/package
            lock, config와 seed policy가 들어간다. 실행 시작 시 manifest를 쓰고 종료 시 output
            artifact의 URI와 checksum을 연결한다.
          </p>
        </div>
        <pre className="not-prose my-6 overflow-x-auto rounded-md border border-border bg-muted/20 p-4 text-xs leading-relaxed"><code>{`run_id: fraud-gbt-20260723-014
data: sha256:8bf…  # schema + row snapshot
split: sha256:2ac… # immutable row → fold manifest
code: 7e91c4d
environment: image@sha256:91a…
config: configs/gbt-v4.yaml
seed_policy: [17, 29, 43]
outputs:
  oof: artifacts/oof.parquet
  model: artifacts/fold-models/
  feature_schema: artifacts/features.json`}</code></pre>
        <Misconception>Seed를 하나 고정하면 완전 재현된다는 뜻이 아니다. GPU kernel, data loader, library version과 distributed reduction은 nondeterministic할 수 있다. 예를 들어 seed 17·29·43의 OOF score 범위와 허용 편차를 baseline manifest에 기록하고, 새 run의 개선이 그 변동보다 큰지 비교한다.</Misconception>
      </section>

      <section id="data-lineage" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Data version은 메모란이 아니라 first-class input이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원본 URI만 저장하면 upstream table이 갱신된 뒤 같은 run을 다시 만들 수 없다. Snapshot
            version, query text, extraction cutoff, row count, schema, label definition과 digest를
            기록한다. 개인정보 때문에 snapshot을 보관할 수 없다면 최소한 point-in-time query와
            source version, 재생성 검증 hash를 남긴다.
          </p>
          <p>
            Split 역시 data artifact다. Runtime마다 random seed로 새 fold를 만들지 말고 row ID에서
            fold로 가는 manifest를 저장한다. Data가 추가되면 기존 행의 fold가 유지되는지, 새 행을
            어떤 규칙으로 배치했는지 version 차이로 보인다.
          </p>
        </div>
        <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[
            ['v12 입력', '1.2M rows · cutoff 5월 31일 · data digest 8bf…'],
            ['v12 split', '기존 row의 fold 유지 · 신규 18K rows는 6월 audit'],
            ['Diff gate', 'Schema 2개 변경 · label 정의 동일 · 재학습 필요'],
          ].map(([title, note]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <p className="text-xs font-bold">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
        <StopRule>Dataset과 split을 URI·version·digest로 다시 찾을 수 없다면 score 비교표에 해당 run을 넣지 않는다.</StopRule>
      </section>

      <section id="artifacts" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Scalar metric보다 실패를 재생할 artifact가 중요하다</h2>
        <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {[
            ['Fold·slice metrics', 'Mean뿐 아니라 fold 값, worst slice, calibration과 latency'],
            ['OOF predictions', 'Row ID, target, score, fold, group/time slice'],
            ['Feature evidence', 'Schema, dtype, missing policy, category vocabulary와 importance'],
            ['Model outputs', 'Fold model, calibrator, ensemble config와 inference order'],
            ['Execution evidence', 'Stdout/stderr, warning, resource usage와 failure note'],
            ['Release artifact', 'Submission checksum, container, fallback와 rollback pointer'],
          ].map(([title, note]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실패한 run도 남긴다. OOM, NaN, data drift assertion failure는 search space와 system
            boundary에 대한 증거다. 성공한 run만 보존하면 같은 실패를 반복하고 compute 비용을
            실제보다 작게 계산한다.
          </p>
        </div>
      </section>

      <section id="tool-implementation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">W&amp;B와 MLflow는 같은 계약의 서로 다른 구현이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            두 도구 모두 parameter, metric, artifact와 run 비교를 지원한다. 선택 기준은 팀의
            hosting, access control, registry, query, offline 환경과 기존 platform이다. 먼저
            tool-independent manifest schema와 artifact naming을 정한 뒤 SDK adapter를 붙인다.
            그러면 제품을 바꾸어도 evidence가 사라지지 않는다.
          </p>
          <p>
            자동 logging은 편하지만 integration별 기록 범위를 audit한다. Data version, split
            manifest, OOF와 dirty diff가 자동 수집되는지 확인하고, 빠진 값은 명시적으로 log한다.
            Required field가 비어 있으면 release pipeline이 실패하도록 schema validation을 둔다.
          </p>
        </div>
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실험 비교는 표가 아니라 판정 규칙으로 닫는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Candidate와 baseline은 같은 dataset·split·metric contract에서 비교한다. Primary gain,
            fold/seed spread, guardrail, inference cost와 artifact completeness를 gate로 만든다.
            기준을 통과한 run만 model registry나 final submission 후보로 승격한다.
          </p>
          <p>
            다음은 <InternalLink slug="hyperparameter-tuning">하이퍼파라미터 탐색</InternalLink>이다.
            Tracking contract가 고정되어야 수백 trial이 서로 비교 가능한 실험이 된다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Dataset, split, code, environment와 config를 run identity로 묶을 수 있다.',
          'OOF, feature schema와 failure log를 scalar metric과 함께 보존할 수 있다.',
          'W&B/MLflow 기능과 tool-independent tracking contract를 구분할 수 있다.',
          'Evidence completeness를 release gate로 자동 검사할 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          Run·dataset·artifact API의 기능 범위는 아래 공식 문서에 근거한다. Dirty diff, immutable
          split manifest, required-field gate와 release 판정은 이 글이 제안하는 engineering synthesis다.
        </p>
        <SourceNotes sources={[
          { label: 'MLflow · Tracking', href: 'https://mlflow.org/docs/latest/ml/tracking/', note: 'Run, parameter, metric과 artifact tracking의 공식 개념.' },
          { label: 'MLflow · Dataset tracking', href: 'https://mlflow.org/docs/latest/dataset/', note: 'Dataset input과 digest를 run에 연결하는 공식 API.' },
          { label: 'Weights & Biases · Experiments', href: 'https://docs.wandb.ai/guides/track/', note: 'Run logging, config, metric과 artifact 연결의 공식 안내.' },
        ]} />
      </section>
    </div>
  );
}
