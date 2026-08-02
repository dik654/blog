import WanMoeSwitchViz from './viz/WanMoeSwitchViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function MoeDenoising() {
  return (
    <section id="moe-denoising" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2단계: 노이즈 구간에 따라 달라지는 전문가 역할</h2>
      <div className="not-prose mb-8"><WanMoeSwitchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          디퓨전 추론은 순수 노이즈에 가까운 잠재 표현에서 시작해 점점 깨끗한 잠재 표현으로 이동한다.
          초반 시간 단계에서는 이미지나 비디오의 구체적 디테일이 아직 불안정하다. 이때 모델은 화면 배치,
          피사체 관계, 카메라 방향, 큰 움직임 같은 전역 구조를 먼저 잡는다.
        </p>
        <p>
          후반 시간 단계에서는 이미 장면의 큰 형태가 정해져 있다. 모델은 피부, 옷감, 조명, 가장자리, 작은 움직임,
          시간 방향 깜빡임 같은 디테일을 정리한다. Wan2.2의 MoE 설명은 이 두 성격이 다른 구간을 전문가로 분리해,
          같은 추론 비용 안에서 더 큰 유효 용량을 쓰겠다는 설계로 읽을 수 있다.
        </p>
        <p>
          이 구조의 장점은 역할 분리다. 모든 레이어가 모든 노이즈 강도를 똑같이 잘해야 하는 대신,
          전문가가 노이즈 구간별로 특화된다. 반대로 사용자가 파인튜닝할 때는 어느 전문가를 얼마나 건드리는지가
          결과 품질과 안정성에 영향을 줄 수 있으므로, 일반 LoRA보다 신중한 검증이 필요하다.
        </p>
        <p>
          Wan2.2 공개 설명은 이 전환을 SNR 기반으로 표현한다. 초기에는 SNR이 낮고 노이즈가 많으므로 고노이즈 전문가가
          전체 레이아웃과 움직임을 만든다. 특정 기준점인 <M>{'t_{moe}'}</M>를 지나면 저노이즈 전문가가 활성화되어
          디테일을 정리한다. 이 때문에 A14B는 전체 파라미터가 약 27B이지만, 각 단계에서 실제로 활성화되는 파라미터는 약 14B로 유지된다.
        </p>
        <M display>{'\\mathrm{SNR}(t) = \\frac{\\alpha_t^2}{\\sigma_t^2}, \\quad e(t)=\\begin{cases}e_{high}, & t \\ge t_{moe} \\\\ e_{low}, & t < t_{moe}\\end{cases}'}</M>
        <FormulaNote
          meaning="SNR은 현재 latent에 clean signal과 noise가 섞인 비율을 나타낸다. Wan2.2 A14B는 이 noise regime을 기준으로 한 step에 high-noise 또는 low-noise expert 하나를 선택한다. Timestep 숫자의 방향은 scheduler마다 다를 수 있으므로 실제 구현에서는 sigma·SNR과 함께 확인한다."
          symbols={[
            ['\\alpha_t^2', '현재 latent에 남은 clean signal power'],
            ['\\sigma_t^2', '현재 latent에 섞인 noise power'],
            ['t_{moe}', '두 noise-regime expert의 전환 경계'],
            ['e_{high}', 'noise가 많은 구간에서 전역 배치와 큰 움직임을 담당하는 expert'],
            ['e_{low}', 'noise가 적은 구간에서 질감과 작은 움직임을 정리하는 expert'],
          ]}
        />
        <p>
          <M>{'\\alpha_t'}</M>는 clean latent 비중, <M>{'\\sigma_t'}</M>는 noise 비중이다.
          <M>{'\\mathrm{SNR}(t)'}</M>가 낮으면 latent가 noise에 가깝고, 높으면 이미 장면 구조가 어느 정도 드러난다.
          <M>{'e_{high}'}</M>는 high-noise expert, <M>{'e_{low}'}</M>는 low-noise expert다. workflow의 step schedule은
          이 expert 전환이 어느 구간에서 얼마나 오래 작동하는지와 연결된다.
        </p>
        <h3>왜 timestep이 아니라 “노이즈 구간”으로 이해하는가</h3>
        <p>
          scheduler마다 시간 단계의 숫자 방향은 다르게 보일 수 있다. 어떤 구현에서는 큰 <code>t</code>가 초반이고,
          어떤 설명에서는 sigma나 SNR을 중심으로 말한다. 그래서 학습용으로는 숫자 자체보다 현재 latent가 얼마나 noisy한지를 보는 편이 안전하다.
          노이즈가 많으면 모델은 큰 구조를 맞추고, 노이즈가 적으면 이미 생긴 구조를 세밀하게 다듬는다.
        </p>
        <h3>두 expert가 나뉘면 생기는 해석</h3>
        <ul>
          <li><strong>High-noise expert</strong>: 장면 레이아웃, 피사체 수, 카메라 방향, 큰 동작, 장면 전환에 더 가깝다.</li>
          <li><strong>Low-noise expert</strong>: 표면 질감, 조명, 윤곽, 작은 움직임, temporal flicker 보정에 더 가깝다.</li>
          <li><strong>전환점</strong>: <code>t_moe</code>는 두 역할을 어느 순간에 넘길지 정하는 기준이다.</li>
          <li><strong>추론 비용</strong>: 전체 capacity는 커지지만 한 step에서 모든 expert를 동시에 쓰지 않아 비용을 제한한다.</li>
        </ul>
      </div>
    </section>
  );
}
