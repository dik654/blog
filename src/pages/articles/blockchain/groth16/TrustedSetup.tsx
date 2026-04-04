import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import TrustedSetupViz from './viz/TrustedSetupViz';
import Groth16PipelineViz from './viz/Groth16PipelineViz';
import { TOXIC_WASTE_CODE, SETUP_CODE } from './TrustedSetupData';
import { codeRefs } from './codeRefs';

export default function TrustedSetup({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="trusted-setup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Trusted Setup</h2>
      <div className="not-prose mb-8"><TrustedSetupViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Groth16 전체 파이프라인</h3>
      </div>
      <div className="not-prose mb-8"><Groth16PipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('groth16-keygen', codeRefs['groth16-keygen'])} />
          <span className="text-[10px] text-muted-foreground self-center">generate_parameters()</span>
          <CodeViewButton onClick={() => onCodeRef('groth16-vk', codeRefs['groth16-vk'])} />
          <span className="text-[10px] text-muted-foreground self-center">VerifyingKey 구조체</span>
        </div>
        <p>
          Groth16의 첫 번째 단계는 <strong>Trusted Setup(신뢰 설정)</strong>입니다.
          <br />
          QAP와 랜덤 파라미터를 결합하여 ProvingKey(PK)와 VerifyingKey(VK)를 생성합니다.
          <br />
          이 과정에서 생성되는 비밀 값들을 <strong>toxic waste(독성 폐기물)</strong>라 부르며, 반드시 삭제해야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">5개의 Toxic Waste 파라미터</h3>
        <CodePanel
          title="Toxic Waste 파라미터"
          code={TOXIC_WASTE_CODE}
          annotations={[
            { lines: [1, 1], color: 'sky', note: '비밀 평가점' },
            { lines: [2, 3], color: 'emerald', note: '구조적 일관성 강제' },
            { lines: [4, 5], color: 'amber', note: 'public/private 분리' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">Setup 과정</h3>
        <CodePanel
          title="Trusted Setup 7단계"
          code={SETUP_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: 'toxic waste 랜덤 생성' },
            { lines: [8, 9], color: 'emerald', note: 'QAP 다항식 평가' },
            { lines: [14, 17], color: 'amber', note: 'public/private LC 분리' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">Public/Private 분리</h3>
        <p>
          witness 벡터에서 인덱스 0은 상수 1(One)입니다.
          <br />
          인덱스 1..l은 공개 Instance 변수, 나머지는 비공개 Witness 변수입니다.
          <br />
          IC는 검증자가 아는 공개 부분, L은 증명자만 아는 비공개 부분입니다.
          <br />
          각각 gamma와 delta로 나누어 별도의 검증 채널을 형성합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">MPC Ceremony</h3>
        <p>
          프로덕션에서는 toxic waste 노출을 방지하기 위해 <strong>MPC(Multi-Party Computation, 다자 계산) 세레모니</strong>를 수행합니다.
          <br />
          N명의 참여자가 각각 비밀 값을 생성하고, 최종 파라미터는 이들의 곱으로 결정됩니다.
          <br />
          N명 중 단 1명이라도 자기 값을 삭제하면 안전한 <strong>1-of-N 신뢰 모델</strong>입니다.
        </p>
      </div>
    </section>
  );
}
