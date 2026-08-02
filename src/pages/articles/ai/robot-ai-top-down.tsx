import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  BeginnerOpening,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  ExecutionBoundaryLab,
  FeedbackDisturbanceLab,
  OrchardEvidenceLab,
  RosContractLab,
  SimulatorReleaseStrip,
} from './robot-ai-top-down/viz/RobotAiViz';

const boundaryTerms = [
  {
    term: 'Observation',
    meaning: '카메라·LiDAR·encoder가 특정 시각에 측정한 불완전한 값이다.',
    why: 'Pixel이나 encoder count를 세계의 참값이라고 놓으면 noise, 가림, 지연을 설명할 수 없다.',
  },
  {
    term: 'State estimate',
    meaning: 'Observation과 calibration·history를 결합해 현재라고 믿는 robot·object 상태다.',
    why: 'Planner와 controller는 raw image가 아니라 frame과 시간이 정렬된 상태를 필요로 한다.',
  },
  {
    term: 'Reference',
    meaning: 'Trajectory가 지금 이 시각에 도달하라고 요구하는 pose·position·velocity다.',
    why: '목표 pose 하나와 매 control tick에 따라야 할 값은 서로 다른 계약이다.',
  },
  {
    term: 'Command',
    meaning: 'Controller가 오차와 제약을 보고 lower layer에 내리는 position·velocity·effort 요청이다.',
    why: 'Policy action을 곧바로 PWM이나 motor current로 착각하지 않게 한다.',
  },
  {
    term: 'Physical effect',
    meaning: 'Drive와 mechanism이 실제로 만든 torque·force·motion·contact다.',
    why: '명령을 보냈다는 로그와 물체가 실제로 움직였다는 증거를 분리한다.',
  },
  {
    term: 'Safety boundary',
    meaning: 'Policy 성공 여부와 별도로 limit, obstacle, contact, deadline을 감시하고 중단하는 경계다.',
    why: '학습 성능이 높아져도 stop·hold·recovery가 사라지지 않는 이유다.',
  },
];

export default function RobotAiTopDownArticle() {
  return (
    <>
      <section id="execution-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">명령 하나는 왜 곧바로 motor를 움직이지 못할까?</h2>
        <BeginnerOpening
          title="말을 이해하는 것과 실제 물체를 안전하게 옮기는 것은 다른 단계다"
          description={<>로봇은 카메라로 주변을 보고, 목표까지 갈 경로를 정하고, 관절을 조금씩 움직인 뒤 결과를 다시 확인한다. <strong>VLA</strong>는 영상(vision)과 언어(language)를 받아 행동(action) 후보를 내는 모델이지만, 모터의 전류를 직접 안전하게 결정하는 전체 로봇은 아니다.</>}
          familiarScene={<>내비게이션이 “다음 교차로에서 왼쪽으로 가세요”라고 말해도 자동차의 핸들을 곧바로 꺾지는 않는다. 현재 차선과 속도를 확인하고, 충돌을 피하며, 운전대와 브레이크를 조절하고, 실제로 차가 움직였는지 계속 확인한다.</>}
          steps={[
            { label: '말을 성공 조건으로 바꾼다', detail: '어떤 상자를 어느 위치에 놓아야 끝나는지 명확히 한다.' },
            { label: '보이는 값을 현재 상태로 바꾼다', detail: '카메라 측정을 좌표와 시간에 맞춰 로봇과 물체의 위치로 추정한다.' },
            { label: '계획·제어·확인을 반복한다', detail: '안전한 경로를 만들고 모터를 조절한 뒤 실제 결과를 다시 측정한다.' },
          ]}
        />
        <QuestionLead
          question="“빨간 상자를 왼쪽 바구니에 놓아라”라는 명령을 VLA가 이해했다면, 이제 행동 후보를 곧바로 모터에 보내면 끝일까?"
          answer={(
            <>
              아니다. 명령은 성공 조건으로 바뀌고, sensor observation은 시간과 좌표가 정렬된 state가 되며,
              policy나 planner의 후보는 collision과 동역학 제약을 통과한 trajectory가 되어야 한다. 그 다음에도
              controller, embedded deadline, motor drive, 실제 접촉 결과가 각각 증거를 남겨야 작업이 닫힌다.
            </>
          )}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Robot AI를 “카메라를 보고 action을 내는 모델”로만 보면 demo는 이해해도 실패를 고치기 어렵다.
            Detection은 정확했는데 arm이 엉뚱한 곳으로 갈 수 있고, path는 collision-free인데 motor limit을 넘을 수 있으며,
            command는 정상인데 belt가 미끄러져 물체가 움직이지 않을 수 있다. 각 실패는 서로 다른 입력, 시간 축, 담당자와 증거를 가진다.
          </p>
          <p>
            그래서 첫 지도는 기술 이름의 목록이 아니라 <strong>output이 다음 layer의 input으로 승격되는 조건</strong>이어야 한다.
            아래 도구에서 각 경계를 누르고 `stale TF`를 주입해 보자. Pixel detection이 맞아도 state estimate가 틀리면 그 뒤의
            pose, path, trajectory는 함께 폐기해야 한다.
          </p>
        </div>

        <ExecutionBoundaryLab />

        <ConceptPrimer title="한 실행을 읽는 여섯 단어" items={boundaryTerms} />

        <Misconception>
          VLA의 action 형식은 모델과 robot stack마다 다르다. Action token, end-effector delta, joint target, action chunk 중
          무엇을 내든 그것이 보편적인 motor command라는 뜻은 아니다. Lower layer가 요구하는 frame, unit, timestamp,
          limit와 execution semantics를 만족해야 실제 command 후보가 된다. 공개 VLA의 구체적인 입력·출력 계약은
          <InternalLink slug="paper-openvla-2024"> OpenVLA 원문 재구성</InternalLink>에서 모델 수준의 사실과
          downstream controller의 책임을 나눠 확인한다.
        </Misconception>
      </section>

      <section id="feedback-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Feedback은 무엇을 다시 계산하는가?</h2>
        <QuestionLead
          question="Policy가 올바른 목표를 냈는데도 접촉이나 미끄러짐이 생기면, 어느 숫자가 먼저 달라질까?"
          answer={(
            <>
              실제로 측정한 state estimate가 예상 궤적에서 벗어나고, reference와의 error가 달라진다.
              Controller는 그 error와 제약을 보고 command를 갱신한다. 상태가 오래됐거나 deadline을 놓쳤다면 error 계산 자체를
              믿지 않고 재추정·hold·stop으로 전환해야 한다.
            </>
          )}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            시간 <M>k</M>에서 trajectory가 요구하는 reference와 sensor history로 추정한 현재 state를 먼저 분리한다.
            두 값의 차이가 controller가 줄일 수 있는 error다.
          </p>
        </div>

        <M display>{String.raw`\underbrace{e_k}_{\text{지금 줄여야 할 오차}}=\underbrace{r_k}_{\text{현재 시각의 reference}}-\underbrace{\widehat{x}_k}_{\text{시간 정렬된 state 추정}}`}</M>
        <FormulaNote
          meaning="Reference와 state는 같은 좌표계·단위·시각을 가리켜야 뺄 수 있다. 오래된 camera pose나 다른 frame의 값을 빼면 수식은 계산돼도 물리적 의미가 없다."
          symbols={[
            ['r_k', 'trajectory가 현재 control tick에 요구하는 position·pose·velocity'],
            ['\\widehat{x}_k', 'sensor와 estimator가 같은 시각으로 정렬해 제공한 현재 상태 추정'],
            ['e_k', 'controller가 줄이려는 tracking error. state가 stale이면 이 값도 신뢰할 수 없다.'],
          ]}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Controller는 error만 크게 보고 무조건 큰 command를 만들지 않는다. Joint range, velocity·acceleration·torque,
            workspace, collision, thermal·current limit처럼 현재 layer가 지켜야 할 제약도 함께 본다.
          </p>
        </div>

        <M display>{String.raw`\underbrace{u_k}_{\text{실행 command}}=\underbrace{\pi_c}_{\text{feedback 법칙}}\!\left(\underbrace{e_k}_{\text{오차}},\underbrace{\mathcal C}_{\text{제약}}\right)`}</M>
        <FormulaNote
          meaning="π_c는 특정 알고리즘 이름이 아니라 controller의 역할을 나타낸다. PID, LQR, MPC, impedance control 등 구현은 달라도 유효한 state와 reference를 받아 제약 안의 command를 만든다는 경계는 같다."
          symbols={[
            ['\\pi_c', 'error와 제약을 command로 바꾸는 controller 역할'],
            ['\\mathcal C', 'joint·velocity·torque·collision·thermal·safety constraint 집합'],
            ['u_k', 'position, velocity, effort처럼 hardware interface가 받는 command'],
          ]}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Command가 적용된 뒤의 상태는 robot dynamics와 외란에 의해 달라진다. 여기서 <M>w_k</M>는 wheel slip,
            예상 밖 접촉, payload 변화처럼 model이 완전히 알지 못한 현실을 묶어 표현한다.
          </p>
        </div>

        <M display>{String.raw`\underbrace{x_{k+1}}_{\text{다음 실제 상태}}=\underbrace{f(x_k,u_k,w_k)}_{\text{robot dynamics와 환경의 결과}}`}</M>
        <FormulaNote
          meaning="이 식은 모든 robot이 같은 dynamics 함수를 쓴다는 주장이 아니다. Command가 곧 결과가 아니며, 외란을 거친 실제 결과를 다시 측정해야 loop가 닫힌다는 ownership model이다."
          symbols={[
            ['x_k', 'command 적용 전 실제 robot·world state'],
            ['u_k', '현재 tick에 적용한 actuator command'],
            ['w_k', 'slip·contact·load·model error 같은 외란'],
            ['x_{k+1}', 'command와 외란을 겪은 뒤의 다음 실제 상태'],
          ]}
        />

        <FeedbackDisturbanceLab />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>여러 실패가 같은 episode에서 겹치면</h3>
          <p>
            아래 실험 셀은 설명을 위해 transform의 최대 age를 50 ms, drive watchdog을 command update 1회 누락으로
            설정했다고 가정한다. TF age가 180 ms이고, wrist 접촉 한계를 넘었으며, actuator update까지 빠졌다면
            high-level policy가 원인을 모두 해석할 때까지 기다리지 않는다. Embedded watchdog이 먼저
            <strong> 이 장비에 설정된 safe state</strong>로 전환하고, contact guard가 정지를 확인한다. Motion이 안전하게
            멈춘 뒤에만 새 observation·TF로 state를 만들고, 오염된 pose·path·trajectory를 다시 계산한다.
          </p>
          <p>
            이 순서는 모든 robot의 보편적인 `hold &gt; slow-stop` 법칙이 아니다. Brake를 걸지, torque를 제거할지,
            controlled stop을 할지는 payload·gravity·mechanism·workspace 위험 분석에 따라 hardware와 safety controller에
            미리 설정해야 한다. 핵심은 빠른 safety boundary가 stale perception의 복구를 기다리지 않고, 재계획은 안전 상태가
            확인된 뒤 시작된다는 책임 분리다.
          </p>
          <h3>왜 모든 layer가 같은 속도로 돌지 않을까?</h3>
          <p>
            Task planning은 사건이 생길 때 갱신해도 되지만, tracking error와 actuator current는 더 빠르게 변한다.
            정확한 Hz는 robot, controller, bus, sensor와 task에 따라 달라서 하나의 숫자로 일반화할 수 없다.
            중요한 원칙은 <strong>느린 inference가 빠른 안정화·보호 loop의 deadline을 대신하지 않는다</strong>는 것이다.
          </p>
          <p>
            실제 ROS 2 Control의 joint trajectory controller도 time이 붙은 waypoint를 받아 interpolation하고,
            position feedback을 요구하며, 설정된 path·goal tolerance를 넘으면 action goal을 중단할 수 있다.
            “trajectory를 받았다”와 “허용 오차 안에서 실행됐다” 사이에 feedback evidence가 존재하는 구체적인 예다.
          </p>
        </div>

        <StopRule>
          State timestamp, frame, unit 또는 sequence가 유효하지 않으면 controller tuning으로 넘어가지 않는다.
          먼저 관측과 transform을 다시 맞춘다. 잘못된 입력에 안정적인 controller를 붙여도 올바른 motion이 되지 않는다.
        </StopRule>
      </section>

      <section id="ros-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">ROS 2는 알고리즘이 아니라 실행 계약을 연결한다</h2>
        <QuestionLead
          question="Camera image, calibration query, navigation goal, frame transform을 모두 topic으로 보내면 왜 안 될까?"
          answer={(
            <>
              네 데이터는 필요한 응답과 시간 의미가 다르다. 연속 stream은 topic, 짧은 request/response는 service,
              오래 걸리고 feedback·cancel이 필요한 실행은 action, 특정 시각의 좌표 관계는 TF가 맡는다.
              Interface 선택은 payload 모양보다 interaction contract를 고르는 일이다.
            </>
          )}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            ROS 2 node로 코드를 나누면 camera driver, perception, planner, controller가 다른 process나 machine에 있어도
            typed interface로 연결할 수 있다. 그러나 graph에 선이 그려졌다는 사실만으로 sample이 제때 도착하거나,
            QoS가 호환되거나, callback이 deadline 안에 끝나거나, 좌표 시간이 맞는다는 보장은 생기지 않는다.
          </p>
          <p>
            특히 TF는 단순한 좌표 변환 행렬 보관소가 아니다. 움직이는 robot에서 image 시각의 `camera → base → map`
            관계를 찾아야 한다. 최신 transform을 과거 image에 붙이면 detector가 본 점을 잘못된 세계 위치로 옮길 수 있다.
          </p>
        </div>

        <RosContractLab />

        <Misconception>
          ROS 2 transport가 controller stability를 만들어 주는 것은 아니다. ROS 2는 message와 실행 관계를 전달하고
          관찰할 contract를 제공한다. Queue age, executor scheduling, QoS, clock·TF, control law와 hardware timing은
          각각 별도의 검증 대상이다.
        </Misconception>
      </section>

      <section id="foundation-descent" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">최신 Robot AI에서 필요한 기반으로 어떻게 내려갈까?</h2>
        <QuestionLead
          question="동역학과 motor drive를 모두 끝낸 뒤에야 VLA나 simulator를 만져야 할까?"
          answer={(
            <>
              아니다. 먼저 검증된 simulator나 작은 real setup에서 observation → action → measured effect를 한 번 닫는다.
              그 다음 실패한 boundary의 바로 아래 기반만 내려가 읽는다. 다만 real robot을 실행할 때는 모르는 lower layer를
              없다고 가정하지 말고, 검증된 controller와 safety limit의 계약을 사용해야 한다.
            </>
          )}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 과제는 “집을 정리해”가 아니라 reach, short navigation, 한 물체 push처럼 시작 상태와 성공 판정이 짧은 task가 좋다.
            Isaac Lab은 같은 task environment를 병렬로 실행해 rollout을 모으는 workflow를 제공하지만, environment 수를 늘리면
            memory와 simulation step 비용도 증가한다. LeRobot의 real-robot workflow도 demonstration 기록, dataset 확인,
            policy 학습, checkpoint rollout 평가를 서로 다른 단계로 둔다.
          </p>
          <p>
            아래 순서는 모든 robotics 지식을 선형으로 끝내라는 교과목 목록이 아니다. 현재 실패가 어느 질문인지 보고 필요한 곳으로
            내려가는 <strong>최소 의존 경로</strong>다.
          </p>
        </div>

        <ol className="not-prose my-8 divide-y divide-border border-y border-border">
          <li className="grid gap-2 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
            <span className="font-mono text-sm font-bold text-violet-700 dark:text-violet-300">01</span>
            <div className="min-w-0">
              <p className="font-bold">관측이 곧 state가 아닌 이유</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                가림과 history가 문제면 <InternalLink slug="rl-pomdp-state-estimation">POMDP와 상태 추정</InternalLink>,
                좌표와 시간이 문제면 <InternalLink slug="robot-kinematics-coordinate-frames">좌표계와 Robot Kinematics</InternalLink>로 내려간다.
              </p>
            </div>
          </li>
          <li className="grid gap-2 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
            <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-300">02</span>
            <div className="min-w-0">
              <p className="font-bold">Pose 사이의 안전한 길과 실행 시간</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Collision-free path는 <InternalLink slug="robot-motion-planning">Robot Motion Planning</InternalLink>,
                velocity·acceleration·jerk·torque limit을 붙이는 일은 <InternalLink slug="robot-trajectory-generation">Trajectory Generation</InternalLink>이 맡는다.
              </p>
            </div>
          </li>
          <li className="grid gap-2 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
            <span className="font-mono text-sm font-bold text-teal-700 dark:text-teal-300">03</span>
            <div className="min-w-0">
              <p className="font-bold">Reference와 실제 motion 사이의 오차</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Tracking·stability·constraint 질문은 <InternalLink slug="robot-dynamics-feedback-control">동역학과 Feedback Control</InternalLink>에서
                PID·LQR·MPC의 역할로 좁힌다.
              </p>
            </div>
          </li>
          <li className="grid gap-2 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
            <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-300">04</span>
            <div className="min-w-0">
              <p className="font-bold">Graph의 선을 runtime deadline으로 바꾸기</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Message가 DDS·queue·executor에서 늦거나 callback이 제때 실행되지 않는 graph-level deadline은
                <InternalLink slug="robot-ros2-runtime-communication"> ROS 2 Runtime & Communication</InternalLink>에서
                QoS, freshness, lifecycle, clock·TF와 함께 추적한다.
              </p>
            </div>
          </li>
          <li className="grid gap-2 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
            <span className="font-mono text-sm font-bold text-rose-700 dark:text-rose-300">05</span>
            <div className="min-w-0">
              <p className="font-bold">Command를 실제 current와 torque로 닫기</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Controller output은 나왔지만 timer·fieldbus·drive가 actuator update를 놓친 hardware-level deadline은
                <InternalLink slug="robot-embedded-realtime-control"> Embedded Real-Time Control</InternalLink>에서
                ISR·DMA·watchdog까지 추적하고,
                PMSM current와 inverter·thermal 증거는 <InternalLink slug="robot-motor-drive-foc">Motor Drive & FOC</InternalLink>에서 다룬다.
              </p>
            </div>
          </li>
        </ol>

        <StopRule title="첫 프로젝트의 종료 조건.">
          Simulator episode 한 번이 아니라, 입력 schema·checkpoint·seed·task reset·success condition·failure log가 재실행 가능하고,
          같은 평가를 여러 episode에서 반복할 수 있을 때 첫 단계가 끝난다.
        </StopRule>
      </section>

      <section id="orchard-case" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">과수원 row navigation으로 전체 경계를 다시 읽기</h2>
        <QuestionLead
          question="Tree trunk를 정확히 찾고 두 row의 가운데 선을 그렸다면 자율주행 문제는 끝난 걸까?"
          answer={(
            <>
              아니다. Bounding-box 밑점은 image pixel일 뿐이다. Calibration과 image 시각의 robot pose로 ground point를 만든 뒤,
              outlier와 곡률에 맞는 row model을 고르고, centerline에 시간을 붙여 추종하며, 사람과 장비는 별도 obstacle gate로 중단해야 한다.
            </>
          )}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            인용한 orchard 연구는 YOLO V3 tree trunk detection을 사용하고, trunk bounding box의 밑점을 reference로 삼아
            좌우 row를 least-squares line으로 fit한 뒤 중앙 navigation line을 만드는 한 사례다. 이 결과를 모든 과수원과 모든
            robot에 보편적인 해법으로 확대하면 안 된다. Slope, camera vibration, 빈 row, 곡선, 계절과 작업자 진입은 다른 model과 sensor evidence를 요구한다.
          </p>
          <p>
            Calibration 뒤 ground frame에 놓인 점 <M>(x_i,y_i)</M>가 한 직선에 가깝다고 가정하면, 각 점이 현재 line에서 얼마나
            벗어났는지 residual을 먼저 계산한다.
          </p>
        </div>

        <M display>{String.raw`\underbrace{r_i}_{\text{tree point 오차}}=\underbrace{y_i}_{\text{ground 관측}}-\underbrace{(m x_i+b)}_{\text{row 예측}}`}</M>
        <FormulaNote
          meaning="Residual의 부호는 점이 line의 어느 쪽에 있는지, 절댓값은 얼마나 멀리 벗어났는지 나타낸다. Pixel 좌표를 그대로 넣는 것이 아니라 calibration과 timestamp 검증을 통과한 metric ground point를 사용해야 한다."
          symbols={[
            ['x_i,y_i', 'robot 또는 ground frame에 놓인 i번째 trunk reference point'],
            ['m,b', '현재 row 직선의 기울기와 절편'],
            ['r_i', '측정 point와 row model 사이의 residual'],
          ]}
        />

        <M display>{String.raw`\underbrace{(\widehat m,\widehat b)}_{\text{선택한 row line}}=\arg\min_{m,b}\underbrace{\sum_i r_i^2}_{\text{residual 제곱합}}`}</M>
        <FormulaNote
          meaning="제곱은 양·음 residual이 지워지는 것을 막고 큰 오차를 더 강하게 벌한다. 바로 그 때문에 오검출 한 점이 line을 끌어당길 수 있다. Outlier가 예상되면 RANSAC·robust loss·temporal tracking으로 inlier 근거를 따로 만든다."
          symbols={[
            ['\\widehat m,\\widehat b', 'residual 제곱합을 가장 작게 만든 line 계수'],
            ['\\sum_i r_i^2', '모든 tree point가 line에서 벗어난 정도를 합친 목적함수'],
            ['\\arg\\min', '목적함수를 가장 작게 하는 계수를 선택하는 연산'],
          ]}
        />

        <OrchardEvidenceLab />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            두 row의 중앙은 geometric path 후보다. 실제 주행에는 vehicle footprint, velocity·curvature limit,
            lateral·heading error, local obstacle와 stopping distance가 필요하다. 곡선 row에서 하나의 global line을 고집하거나,
            한쪽 point가 사라졌는데 같은 속도로 진행하면 perception confidence가 execution risk로 전파된다.
          </p>
        </div>

        <Misconception>
          Centerline confidence가 높다는 사실은 경로 위에 사람이 없다는 뜻이 아니다. Row model과 dynamic-obstacle safety는
          서로 다른 evidence channel이며, obstacle gate는 path score가 높아도 stop을 우선할 수 있어야 한다.
        </Misconception>
      </section>

      <section id="sim-real-release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Simulation의 성공을 현실 release로 어떻게 옮길까?</h2>
        <QuestionLead
          question="Texture, friction, mass와 sensor noise를 충분히 randomize하면 real robot 안전까지 증명된 걸까?"
          answer={(
            <>
              아니다. Domain randomization은 한 simulator setting의 단서에 과적합하는 위험을 줄일 뿐, 현실의 모든 외란을
              포함했다는 증명이 아니다. Sensor replay와 timing, 좁은 workspace의 저속 rollout, intervention·near-miss,
              hardware telemetry와 독립 stop/recovery evidence를 단계별로 추가해야 한다.
            </>
          )}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Simulator는 hardware 비용을 없애는 마법이 아니라 실패를 반복하고 원인을 고정하기 쉬운 환경이다.
            Isaac Lab의 병렬 environment는 더 많은 rollout을 모을 수 있지만, environment 수가 늘면 memory와 step time도 커지고
            image observation·rendering은 추가 비용을 만든다. Simulation instability나 잘못된 joint·force limit은 policy 학습 데이터 자체를 오염시킬 수 있다.
          </p>
          <p>
            Real robot에서는 demonstration을 모은 조건, policy checkpoint, camera·robot configuration, episode reset과 success
            definition을 함께 고정한다. LeRobot의 공식 workflow도 data 기록, policy 학습, checkpoint를 사용한 evaluation episode
            기록을 분리한다. 평균 success만 보지 말고 intervention, timeout, near-miss, contact와 hardware fault를 같은 release id로 남긴다.
          </p>
          <p>
            아래 3단 strip은 Isaac Lab과 LeRobot의 공식 workflow를 연결해 만든 <strong>편집 가이드</strong>다.
            모든 robot에 적용되는 국제 인증 절차나 단일 framework의 공식 release 표준이 아니다. 각 조직은 실제 위험 분석,
            hardware 보호 회로, 운영 환경과 규제에 맞는 승인 기준을 별도로 가져야 한다.
          </p>
        </div>

        <SimulatorReleaseStrip />

        <StopRule title="현실 실행의 독립 중단 경계.">
          Joint·workspace·velocity·effort limit, collision·obstacle monitor, communication timeout, emergency stop과 human intervention은
          learned policy의 confidence나 reward와 독립적으로 동작해야 한다. Simulation score가 이 경계를 우회할 권한을 주지 않는다.
        </StopRule>

        <CapabilityCheck
          title="이 글만 읽고 해결해야 하는 것"
          items={[
            'VLA action과 motor command 사이의 state·path·trajectory·control 경계를 순서대로 그린다.',
            'Detection은 맞지만 TF가 stale일 때 state 이후 출력을 폐기해야 하는 이유를 설명한다.',
            'Reference, estimate, error, command, disturbance와 measured effect를 분리한다.',
            'Camera stream, calibration query, navigation goal, transform에 맞는 ROS 2 contract를 고른다.',
            'Orchard pixel에서 ground point·row model·trajectory·obstacle gate까지의 증거를 잇는다.',
            'Simulation evidence와 real rollout·safety release evidence를 구분한다.',
          ]}
        />

        <SourceNotes
          sources={[
            {
              label: 'ROS 2 official · Topics, services, actions',
              href: 'https://docs.ros.org/en/ros2_documentation/rolling/Concepts/Basic/Interfaces-Topics-Services-Actions.html',
              note: '연속 stream, 짧은 request/response, 장시간 feedback·cancel 작업의 공식 interface 구분. 2026-07-29 확인.',
            },
            {
              label: 'ROS 2 official · TF2',
              href: 'https://docs.ros.org/en/rolling/Concepts/Intermediate/About-Tf2.html',
              note: '시간에 따라 달라지는 coordinate frame 관계를 buffer와 tree로 관리하는 공식 개념.',
            },
            {
              label: 'ROS 2 Control · Joint Trajectory Controller',
              href: 'https://control.ros.org/jazzy/doc/ros2_controllers/joint_trajectory_controller/doc/userdoc.html',
              note: '시간이 붙은 waypoint, feedback, command interface, tolerance와 action monitoring의 실제 runtime 계약.',
            },
            {
              label: 'Isaac Lab · Debugging and Training Guide',
              href: 'https://isaac-sim.github.io/IsaacLab/main/source/overview/reinforcement-learning/training_guide.html',
              note: '병렬 environment, memory·rendering 비용, simulation instability와 limit 설정의 공식 설명.',
            },
            {
              label: 'LeRobot · Getting Started with Real-World Robots',
              href: 'https://huggingface.co/docs/lerobot/main/en/getting_started_real_world_robot',
              note: 'Demonstration 기록, dataset 확인, policy 학습과 checkpoint evaluation의 공식 workflow.',
            },
            {
              label: 'LeRobot · Human-in-the-loop Data Collection',
              href: 'https://huggingface.co/docs/lerobot/main/hil_data_collection',
              note: 'Policy rollout 중 사람의 개입을 기록해 corrective demonstration으로 사용하는 공식 workflow. 보편적인 안전 인증 규격은 아니다.',
            },
            {
              label: 'DL-LS orchard navigation line paper',
              href: 'https://www.mdpi.com/2077-0472/12/10/1650',
              note: 'Trunk detection, bounding-box bottom reference, least-squares row fitting과 centerline을 사용한 해당 연구의 범위.',
            },
          ]}
        />
      </section>
    </>
  );
}
