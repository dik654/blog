const raw = String.raw;

const under = (body: string, label: string) => raw`\underbrace{${body}}_{\text{${label}}}`;
const over = (body: string, label: string) => raw`\overbrace{${body}}^{\text{${label}}}`;
const aligned = (...rows: string[]) => raw`\begin{aligned}${rows.join(raw`\\[5pt]`)}\end{aligned}`;

const annotations = new Map<string, string>([
  // Deep learning overview
  [raw`\hat{y} = f_{\theta}(x), \qquad \theta' = \theta - \eta\nabla_{\theta}\mathcal{L}(\hat{y}, y)`, aligned(
    raw`${under(raw`\hat y`, '현재 예측')}=${under(raw`f_\theta(x)`, '현재 파라미터로 순전파')}`,
    raw`${under(raw`\theta'`, '다음 파라미터')}=${under(raw`\theta`, '현재 파라미터')}-${under(raw`\eta`, '이동 크기')}${under(raw`\nabla_\theta\mathcal L(\hat y,y)`, '손실이 커지는 방향')}`,
  )],
  [raw`W_3(W_2(W_1x)) = (W_3W_2W_1)x`, raw`${under(raw`W_3(W_2(W_1x))`, '세 선형 변환의 합성')}=${under(raw`(W_3W_2W_1)x`, '행렬 하나로 축약')}`],
  [raw`h_{\ell}=\sigma(W_{\ell}h_{\ell-1}+b_{\ell})`, raw`${under(raw`h_\ell`, '다음 층에 보낼 표현')}=${under(raw`\sigma(\,\cdot\,)`, '비선형성으로 축약 방지')}\!\left(${under(raw`W_\ell h_{\ell-1}+b_\ell`, '이전 표현을 섞고 이동')}\right)`],
  [raw`\hat{y}=wx+b=1\cdot2+0=2`, aligned(
    raw`${under(raw`\hat y`, '예측')}=${under(raw`wx`, '입력의 가중 기여')}+${under(raw`b`, '기준점 이동')}`,
    raw`=${under(raw`1\cdot2`, '현재 값 대입')}+0=2`,
  )],
  [raw`\mathcal{L}=\frac{1}{2}(\hat{y}-y)^2=\frac{1}{2}(2-5)^2=4.5`, raw`${under(raw`\mathcal L`, '오차를 비교할 한 숫자')}=${under(raw`\frac12`, '미분 계수 단순화')}${under(raw`(\hat y-y)^2`, '오차 부호를 없애고 큰 오차 강조')}=4.5`],
  [raw`\frac{\partial\mathcal{L}}{\partial w}=(\hat{y}-y)x=-6`, raw`${under(raw`\frac{\partial\mathcal L}{\partial w}`, 'w의 책임')}=${under(raw`(\hat y-y)`, '출력 오차')} ${under(raw`x`, 'w를 거친 입력')}=-6`],
  [raw`\frac{\partial\mathcal{L}}{\partial b}=\hat{y}-y=-3`, raw`${under(raw`\frac{\partial\mathcal L}{\partial b}`, 'b의 책임')}=${under(raw`\hat y-y`, 'bias에는 그대로 전달된 오차')}=-3`],
  [raw`w'=1-0.1(-6)=1.6`, raw`${under(raw`w'`, '새 가중치')}=${under(raw`1`, '현재값')}-${under(raw`0.1`, '학습률')}${under(raw`(-6)`, '현재 gradient')}=1.6`],
  [raw`b'=0-0.1(-3)=0.3`, raw`${under(raw`b'`, '새 편향')}=${under(raw`0`, '현재값')}-${under(raw`0.1`, '학습률')}${under(raw`(-3)`, '현재 gradient')}=0.3`],
  [raw`X_{[B\times d]}W_{[d\times h]} = Z_{[B\times h]}`, raw`${under(raw`X_{[B\times d]}`, 'B개 샘플의 d개 특징')}${under(raw`W_{[d\times h]}`, 'd를 h개 표현으로 투영')}=${under(raw`Z_{[B\times h]}`, '샘플마다 h개 출력')}`],

  // Perceptron
  [raw`s=w^\top x+b, \qquad \hat{y}=\mathbf{1}[s\ge0]`, aligned(
    raw`${under(raw`s`, '결정 전 점수')}=${under(raw`w^\top x`, '특징별 기여를 합산')}+${under(raw`b`, '결정 경계 이동')}`,
    raw`${under(raw`\hat y`, '이산 예측')}=${under(raw`\mathbf1[s\ge0]`, '점수의 부호를 label로 변환')}`,
  )],
  [raw`w_1x_1+w_2x_2+b=0`, raw`${under(raw`w_1x_1+w_2x_2`, '두 특징의 가중합')}+${under(raw`b`, '경계 위치')}=${under(raw`0`, '예측이 바뀌는 기준')}`],
  [raw`w' = w+\eta(y-\hat{y})x`, raw`${under(raw`w'`, '수정된 weight')}=${under(raw`w`, '현재 weight')}+${under(raw`\eta`, '수정 크기')}${under(raw`(y-\hat y)`, '예측 오차')}${under(raw`x`, '책임이 있는 입력')}`],
  [raw`b'=b+\eta(y-\hat{y})`, raw`${under(raw`b'`, '수정된 bias')}=${under(raw`b`, '현재 bias')}+${under(raw`\eta(y-\hat y)`, '입력과 무관한 기준 수정')}`],
  [raw`h_1=\operatorname{ReLU}(x_1+x_2)`, raw`${under(raw`h_1`, '하나 이상 켜진 신호')}=${under(raw`\operatorname{ReLU}(x_1+x_2)`, '음수는 버리고 합을 통과')}`],
  [raw`h_2=\operatorname{ReLU}(x_1+x_2-1)`, raw`${under(raw`h_2`, '둘 다 켜진 신호')}=${under(raw`\operatorname{ReLU}(x_1+x_2-1)`, 'threshold를 넘은 경우만 통과')}`],
  [raw`\hat{y}=h_1-2h_2`, raw`${under(raw`\hat y`, 'XOR 출력')}=${under(raw`h_1`, '하나 이상 켜짐')}-${under(raw`2h_2`, '둘 다 켜진 경우 제거')}`],

  // Neural network forward pass
  [raw`X_{[B\times d]}W_{[d\times h]}+b_{[h]}=Z_{[B\times h]}`, raw`${under(raw`X_{[B\times d]}W_{[d\times h]}`, 'batch를 h차원으로 투영')}+${under(raw`b_{[h]}`, '모든 샘플에 같은 이동을 broadcast')}=${under(raw`Z_{[B\times h]}`, '활성화 전 출력')}`],
  [raw`x=[1,2]`, raw`${under(raw`x`, '샘플 하나')}=${under(raw`[1,2]`, '두 입력 특징')}`],
  [raw`z_1=xW_1+b_1=[2,3]`, raw`${under(raw`z_1`, '첫 pre-activation')}=${under(raw`xW_1`, '두 방향으로 입력을 투영')}+${under(raw`b_1`, '기준점 이동')}=[2,3]`],
  [raw`a_1=\max(0,z_1)=[2,3]`, raw`${under(raw`a_1`, '은닉 표현')}=${under(raw`\max(0,z_1)`, '음수 신호를 차단')}=[2,3]`],
  [raw`z_2=a_1W_2+b_2`, raw`${under(raw`z_2`, '분류 logit')}=${under(raw`a_1W_2`, '은닉 특징을 점수로 결합')}+${under(raw`b_2`, '출력 기준 조정')}`],
  [raw`2-3+0.5=-0.5`, raw`${under(raw`2-3`, '두 은닉 특징의 반대 기여')}+${under(raw`0.5`, '출력 bias')}=-0.5`],
  [raw`\hat{y}=\sigma(-0.5)\approx0.378`, raw`${under(raw`\hat y`, '양성 확률')}=${under(raw`\sigma(-0.5)`, 'logit을 0과 1 사이로 변환')}\approx0.378`],
  [raw`P=(dh+h)+(h\cdot1+1)`, raw`${under(raw`P`, '전체 학습 파라미터')}=${under(raw`(dh+h)`, '입력-은닉 weight와 bias')}+${under(raw`(h\cdot1+1)`, '은닉-출력 weight와 bias')}`],

  // LLM architecture lineage
  [raw`z_0^{\mathrm{text}}=E_{\mathrm{text}}(x_{\mathrm{text}})`, raw`${under(raw`z_0^{\mathrm{text}}`, 'backbone에 넣을 text 표현')}=${under(raw`E_{\mathrm{text}}(x_{\mathrm{text}})`, 'text token을 hidden 차원으로 embedding')}`],
  [raw`z_0^{\mathrm{img}}=P_{\mathrm{img}}(x_{\mathrm{img}}),\qquad z_0^{\mathrm{audio}}=P_{\mathrm{audio}}(x_{\mathrm{audio}})`, aligned(
    raw`${under(raw`z_0^{\mathrm{img}}`, '이미지 표현')}&=${under(raw`P_{\mathrm{img}}(x_{\mathrm{img}})`, '공통 토큰 차원으로 투영')}`,
    raw`${under(raw`z_0^{\mathrm{audio}}`, '오디오 표현')}&=${under(raw`P_{\mathrm{audio}}(x_{\mathrm{audio}})`, '공통 토큰 차원으로 투영')}`,
  )],
  [raw`z_0=\left[z_0^{\mathrm{text}};z_0^{\mathrm{img}};z_0^{\mathrm{audio}}\right]`, aligned(
    raw`${under(raw`z_0`, '공통 backbone 입력')}&=\operatorname{concat}!\bigl(`,
    raw`&\quad ${under(raw`z_0^{\mathrm{text}}`, 'text token')},`,
    raw`&\quad ${under(raw`z_0^{\mathrm{img}}`, 'image token')},`,
    raw`&\quad ${under(raw`z_0^{\mathrm{audio}}`, 'audio token')}\bigr)`,
  )],
  [raw`S=\frac{QK^\top}{\sqrt{d}}`, raw`${under(raw`S`, 'attention 원점수')}=${under(raw`QK^\top`, 'query·key 일치')}\Big/${under(raw`\sqrt d`, '차원 크기 보정')}`],
  [raw`A=\mathrm{softmax}(S)`, raw`${under(raw`A`, '문맥 token별 선택 비율')}=${under(raw`\mathrm{softmax}(S)`, '점수를 합이 1인 비율로 변환')}`],
  [raw`\mathrm{Attention}(Q,K,V)=AV`, raw`${under(raw`\mathrm{Attention}(Q,K,V)`, '문맥에서 가져온 결과')}=${under(raw`A`, '각 위치의 선택 비율')}${under(raw`V`, '선택되면 가져올 내용')}`],
  [raw`D_{\mathrm{KV}}=H_{\mathrm{KV}}d_h`, raw`${under(raw`D_{\mathrm{KV}}`, 'token 하나의 KV 너비')}=${under(raw`H_{\mathrm{KV}}`, '저장할 KV head 수')}${under(raw`d_h`, 'head 하나의 차원')}`],
  [raw`M_{\mathrm{KV/token}}=2D_{\mathrm{KV}}b`, raw`${under(raw`M_{\mathrm{KV/token}}`, 'token 하나의 KV byte')}=${under(raw`2`, 'K와 V')}${under(raw`D_{\mathrm{KV}}`, 'token별 KV 너비')}${under(raw`b`, '원소 byte')}`],
  [raw`M_{\mathrm{KV}}=BLN M_{\mathrm{KV/token}}`, aligned(
    raw`${under(raw`M_{\mathrm{KV}}`, '전체 KV cache')}&=${under(raw`BL`, 'batch × layer')}`,
    raw`&\quad\times${under(raw`N`, '문맥 토큰 수')}`,
    raw`&\quad\times${under(raw`M_{\mathrm{KV/token}}`, '토큰당 KV 바이트')}`,
  )],
  [raw`B{=}2,\quad L{=}48,\quad N{=}8192`, aligned(
    raw`${under(raw`B=2`, '동시 sequence 두 개')}`,
    raw`${under(raw`L=48`, 'decoder 48층')}`,
    raw`${under(raw`N=8192`, 'sequence당 context token')}`,
  )],
  [raw`H_{\mathrm{KV}}{=}4,\quad d_h{=}128,\quad b{=}2`, aligned(
    raw`${under(raw`H_{\mathrm{KV}}=4`, 'GQA의 KV head 수')}`,
    raw`${under(raw`d_h=128`, 'head 차원')}`,
    raw`${under(raw`b=2`, 'FP16 byte')}`,
  )],
  [raw`M_{\mathrm{KV}}=1.50\ \mathrm{GiB}`, raw`${under(raw`M_{\mathrm{KV}}`, '계산된 KV cache')}=${under(raw`1.50\ \mathrm{GiB}`, '현재 batch·layer·context 사양의 메모리')}`],
  [raw`\rho_{\mathrm{active}}=\frac{P_{\mathrm{active}}}{P_{\mathrm{total}}}`, raw`${under(raw`\rho_{\mathrm{active}}`, 'token당 계산 비율')}=${under(raw`P_{\mathrm{active}}`, '이번 token 계산량')}\Big/${under(raw`P_{\mathrm{total}}`, '모델 전체 용량')}`],
  [raw`P_{\mathrm{active}}=37\mathrm{B},\qquad P_{\mathrm{total}}=671\mathrm{B}`, raw`${under(raw`P_{\mathrm{active}}=37\mathrm B`, 'token당 계산량')},\qquad${under(raw`P_{\mathrm{total}}=671\mathrm B`, '모델 전체 용량')}`],
  [raw`\rho_{\mathrm{active}}\approx\frac{37}{671}\approx5.5\%`, raw`${under(raw`\rho_{\mathrm{active}}`, 'DeepSeek V3 활성 비율')}\approx${under(raw`\frac{37}{671}`, '계산량을 전체로 나눔')}\approx${under(raw`5.5\%`, 'token이 쓰는 몫')}`],
  [raw`u_l^{\mathrm{base}}=h_{l-1}`, raw`${under(raw`u_l^{\mathrm{base}}`, '기준 block 입력')}=${under(raw`h_{l-1}`, '직전 layer 출력 하나')}`],
  [raw`u_l^{\mathrm{depth}}=\sum_{i<l}\alpha_{i\to l}v_i`, raw`${under(raw`u_l^{\mathrm{depth}}`, 'depth mixer가 만든 입력')}=\sum_{i<l}${under(raw`\alpha_{i\to l}`, '이전 layer i의 선택 비율')}${under(raw`v_i`, '가져올 이전 표현')}`],
  [raw`h_l=u_l+F_l(u_l)`, raw`${under(raw`h_l`, '현재 layer 출력')}=${under(raw`u_l`, '선택된 block 입력')}+${under(raw`F_l(u_l)`, '현재 attention·MLP의 변화량')}`],

  // Activation functions
  [raw`W_2(W_1x)=W_*x`, raw`${under(raw`W_2(W_1x)`, '선형층 두 번')}=${under(raw`W_*x`, '행렬 하나와 같은 표현력')}`],
  [raw`a=\phi(Wx+b)`, raw`${under(raw`a`, '다음 층의 표현')}=${under(raw`\phi(\,\cdot\,)`, '비선형 변환')}\!\left(${under(raw`Wx+b`, '선형 결합')}\right)`],
  [raw`\frac{\partial\mathcal{L}}{\partial a^{(0)}}=\frac{\partial\mathcal{L}}{\partial a^{(L)}}\prod_{\ell=1}^{L}\left(W^{(\ell)}\odot\phi'(z^{(\ell)})\right)`, aligned(
    raw`${under(raw`\frac{\partial\mathcal L}{\partial a^{(0)}}`, '입력층까지 도달한 gradient')}=${under(raw`\frac{\partial\mathcal L}{\partial a^{(L)}}`, '출력층에서 시작한 gradient')}\prod_{\ell=1}^{L}J_\ell`,
    raw`J_\ell=${under(raw`W^{(\ell)}`, '선형층이 전달한 민감도')}\odot${under(raw`\phi'(z^{(\ell)})`, '활성화가 통과시킨 비율')}`,
  )],

  // Cross entropy and information theory
  [raw`I(x)=-\log p(x)`, raw`${under(raw`I(x)`, '사건이 주는 정보량')}=${under(raw`-\log p(x)`, '희귀할수록 큰 비용으로 변환')}`],
  [raw`-\log(ab)=-\log a-\log b`, raw`${under(raw`-\log(ab)`, '독립 사건의 결합 비용')}=${under(raw`-\log a-\log b`, '곱을 더하기로 바꿔 누적')}`],
  [raw`\mathcal{L}(\theta)=\prod_{n=1}^{N}p_\theta(y_n\mid x_n)`, raw`${under(raw`\mathcal L(\theta)`, '전체 데이터 likelihood')}=${under(raw`\prod_{n=1}^{N}`, '모든 관측을 함께 만족')} ${under(raw`p_\theta(y_n\mid x_n)`, '각 정답에 준 확률')}`],
  [raw`\theta^*=\arg\min_\theta\left[-\sum_{n=1}^{N}\log p_\theta(y_n\mid x_n)\right]`, raw`${under(raw`\theta^*`, '선택할 파라미터')}=${under(raw`\arg\min_\theta`, '가장 작은 비용의 위치 탐색')}\left[${under(raw`-\sum_n\log p_\theta(y_n\mid x_n)`, '정답 확률의 음의 로그를 누적')}\right]`],
  [raw`\ell_n=-\sum_{c=1}^{C}y_{n,c}\log \hat p_{n,c}=-\log \hat p_{n,y_n}`, raw`${under(raw`\ell_n`, '한 샘플의 loss')}=${under(raw`-\sum_c y_{n,c}\log\hat p_{n,c}`, 'one-hot으로 정답 항만 선택')}=${under(raw`-\log\hat p_{n,y_n}`, '정답 확률의 비용')}`],
  [raw`\frac{d}{dp}[-\log p]=-\frac{1}{p}`, raw`${under(raw`\frac d{dp}[-\log p]`, '확률 변화에 대한 loss 민감도')}=${under(raw`-\frac1p`, '낮은 정답 확률을 더 강하게 수정')}`],
  [raw`p_j=\frac{e^{z_j}}{\sum_k e^{z_k}}`, raw`${under(raw`p_j`, 'class j의 확률')}=${under(raw`e^{z_j}`, 'j의 양수 score')}\Big/${under(raw`\sum_k e^{z_k}`, '모든 class와 합이 1이 되게 정규화')}`],
  [raw`\ell=-z_y+\log\sum_k e^{z_k}`, raw`${under(raw`\ell`, 'softmax cross-entropy')}=${under(raw`-z_y`, '정답 logit은 올리기')}+${under(raw`\log\sum_k e^{z_k}`, '모든 logit의 경쟁 비용')}`],
  [raw`\frac{\partial \ell}{\partial z_j}=p_j-y_j`, raw`${under(raw`\frac{\partial\ell}{\partial z_j}`, 'logit j가 받을 신호')}=${under(raw`p_j`, '현재 예측')}-${under(raw`y_j`, '원하는 target')}`],
  [raw`m=\max_k z_k`, raw`${under(raw`m`, '안정화 기준')}=${under(raw`\max_k z_k`, '가장 큰 logit을 기준점으로 선택')}`],
  [raw`\log\sum_k e^{z_k}=m+\log\sum_k e^{z_k-m}`, raw`${under(raw`\log\sum_k e^{z_k}`, '원래 log-sum-exp')}=${under(raw`m`, '빼 둔 기준 복원')}+${under(raw`\log\sum_k e^{z_k-m}`, 'overflow 없이 상대 차이만 지수화')}`],
  [raw`H(P,Q)=H(P)+D_{\mathrm{KL}}(P\Vert Q)`, raw`${under(raw`H(P,Q)`, '전체 설명 비용')}=${under(raw`H(P)`, '피할 수 없는 entropy')}+${under(raw`D_{\mathrm{KL}}(P\Vert Q)`, '분포 불일치 비용')}`],
  [raw`H(P)=-\sum_c P(c)\log P(c)`, raw`${under(raw`H(P)`, '분포 P의 entropy')}=${under(raw`-\sum_c P(c)`, '사건별 평균')} ${under(raw`\log P(c)`, '각 사건의 surprisal')}`],
  [raw`D_{\mathrm{KL}}(P\Vert Q)=\sum_c P(c)\log\frac{P(c)}{Q(c)}`, raw`${under(raw`D_{\mathrm{KL}}(P\Vert Q)`, 'P에서 본 Q의 불일치')}=${under(raw`\sum_c P(c)`, 'P가 자주 내는 사건으로 평균')} ${under(raw`\log\frac{P(c)}{Q(c)}`, '두 분포의 상대 확률 차이')}`],

  // Backpropagation
  [raw`g = \nabla_{\theta}\mathcal{L} = \left[\frac{\partial\mathcal{L}}{\partial\theta_1},\ldots,\frac{\partial\mathcal{L}}{\partial\theta_n}\right]`, aligned(
    raw`${under(raw`g`, 'optimizer가 받을 gradient')}=${under(raw`\nabla_\theta\mathcal L`, '모든 파라미터의 loss 민감도')}`,
    raw`g=${under(raw`\left[\frac{\partial\mathcal L}{\partial\theta_1},\ldots,\frac{\partial\mathcal L}{\partial\theta_n}\right]`, '파라미터별 책임을 원래 shape로 모음')}`,
  )],
  [raw`\bar{x}=\bar{y}\,\frac{\partial y}{\partial x}, \qquad \bar{y}=\frac{\partial\mathcal{L}}{\partial y}, \quad \bar{x}=\frac{\partial\mathcal{L}}{\partial x}`, aligned(
    raw`${under(raw`\bar x`, 'x로 보낼 gradient')}=${under(raw`\bar y`, '뒤에서 도착한 gradient')}${under(raw`\frac{\partial y}{\partial x}`, '현재 연산의 local derivative')}`,
    raw`\bar y=${under(raw`\frac{\partial\mathcal L}{\partial y}`, 'y의 최종 손실 책임')},\quad \bar x=${under(raw`\frac{\partial\mathcal L}{\partial x}`, 'x의 최종 손실 책임')}`,
  )],
  [raw`\frac{\partial\mathcal{L}}{\partial h}=\frac{\partial\mathcal{L}}{\partial a}\frac{\partial a}{\partial h}+\frac{\partial\mathcal{L}}{\partial b}\frac{\partial b}{\partial h}`, raw`${under(raw`\frac{\partial\mathcal L}{\partial h}`, '공유 node h의 전체 책임')}=${under(raw`\frac{\partial\mathcal L}{\partial a}\frac{\partial a}{\partial h}`, '경로 A가 돌려준 책임')}+${under(raw`\frac{\partial\mathcal L}{\partial b}\frac{\partial b}{\partial h}`, '경로 B가 돌려준 책임')}`],
  [raw`\bar{x}=\bar{y}\,J_f(x)`, raw`${under(raw`\bar x`, '입력으로 전파할 gradient')}=${under(raw`\bar y`, '출력에서 온 gradient')}${under(raw`J_f(x)`, '함수 f의 모든 local 변화율')}`],
  [raw`Z=XW+b, \qquad A=\sigma(Z)`, aligned(
    raw`${under(raw`Z`, '선형층 출력')}=${under(raw`XW`, 'batch와 weight의 행렬곱')}+${under(raw`b`, '샘플마다 broadcast')}`,
    raw`${under(raw`A`, '다음 층 activation')}=${under(raw`\sigma(Z)`, '원소별 비선형 변환')}`,
  )],
  [raw`G_Z=G_A\odot\sigma'(Z)`, raw`${under(raw`G_Z`, 'pre-activation gradient')}=${under(raw`G_A`, '다음 층에서 온 gradient')}\odot${under(raw`\sigma'(Z)`, '활성화가 통과시킨 비율')}`],
  [raw`G_W=X^\top G_Z`, raw`${under(raw`G_W`, 'weight의 gradient')}=${under(raw`X^\top`, '각 weight가 본 입력')} ${under(raw`G_Z`, '각 출력 위치의 오차 신호')}`],
  [raw`G_b=\sum_{i=1}^{B}G_{Z,i}`, raw`${under(raw`G_b`, 'bias의 gradient')}=${under(raw`\sum_{i=1}^{B}`, 'broadcast된 모든 샘플의 책임을 합산')}G_{Z,i}`],
  [raw`G_X=G_ZW^\top`, raw`${under(raw`G_X`, '이전 층으로 보낼 gradient')}=${under(raw`G_Z`, '현재 층 오차 신호')}${under(raw`W^\top`, '연결 방향을 입력 쪽으로 되돌림')}`],
  [raw`\frac{\partial\mathcal{L}}{\partial\theta_i}\approx\frac{\mathcal{L}(\theta+\epsilon e_i)-\mathcal{L}(\theta-\epsilon e_i)}{2\epsilon}`, raw`${under(raw`\frac{\partial\mathcal L}{\partial\theta_i}`, 'autograd와 비교할 gradient')}\approx${under(raw`\mathcal L(\theta+\epsilon e_i)-\mathcal L(\theta-\epsilon e_i)`, '양쪽으로 흔들었을 때 loss 차이')}\Big/${under(raw`2\epsilon`, '전체 이동 거리')}`],

  // Optimizers
  [raw`g_t=\nabla_\theta L(\theta_t)`, raw`${under(raw`g_t`, '현재 step의 gradient')}=${under(raw`\nabla_\theta L(\theta_t)`, '현재 위치에서 loss가 커지는 방향')}`],
  [raw`\theta_{t+1}=\theta_t+\Delta\theta_t`, raw`${under(raw`\theta_{t+1}`, '다음 파라미터')}=${under(raw`\theta_t`, '현재 파라미터')}+${under(raw`\Delta\theta_t`, 'optimizer가 만든 실제 이동량')}`],
  [raw`g_t=\frac{1}{B}\sum_{i\in\mathcal{B}_t}\nabla_\theta \ell_i(\theta_t)`, raw`${under(raw`g_t`, 'mini-batch gradient')}=${under(raw`\frac1B`, 'batch 크기로 평균')}\sum_{i\in\mathcal B_t}${under(raw`\nabla_\theta\ell_i(\theta_t)`, '샘플별 gradient')}`],
  [raw`\mathbb{E}_{\mathcal{B}}[g_t]=\nabla_\theta L(\theta_t)`, raw`${under(raw`\mathbb E_\mathcal B[g_t]`, 'batch를 바꿔 얻은 평균')}=${under(raw`\nabla_\theta L(\theta_t)`, '전체 데이터 gradient')}`],
  [raw`v_t=\beta v_{t-1}+(1-\beta)g_t`, raw`${under(raw`v_t`, '현재 momentum')}=${under(raw`\beta v_{t-1}`, '이전 방향을 기억')}+${under(raw`(1-\beta)g_t`, '새 gradient를 반영')}`],
  [raw`\theta_{t+1}=\theta_t-\eta v_t`, raw`${under(raw`\theta_{t+1}`, '다음 파라미터')}=${under(raw`\theta_t`, '현재 파라미터')}-${under(raw`\eta`, '이동 크기')}${under(raw`v_t`, '평활한 이동 방향')}`],
  [raw`m_t=\beta_1m_{t-1}+(1-\beta_1)g_t`, raw`${under(raw`m_t`, 'gradient의 1차 모멘트')}=${under(raw`\beta_1m_{t-1}`, '과거 방향 기억')}+${under(raw`(1-\beta_1)g_t`, '현재 방향 반영')}`],
  [raw`v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2`, raw`${under(raw`v_t`, 'gradient 크기의 2차 모멘트')}=${under(raw`\beta_2v_{t-1}`, '과거 크기 기억')}+${under(raw`(1-\beta_2)g_t^2`, '현재 좌표별 크기 반영')}`],
  [raw`\hat m_t=\frac{m_t}{1-\beta_1^t},\quad \hat v_t=\frac{v_t}{1-\beta_2^t}`, raw`${under(raw`\hat m_t`, '보정된 방향')}=${under(raw`\frac{m_t}{1-\beta_1^t}`, '0에서 시작한 초기 편향 제거')},\quad${under(raw`\hat v_t`, '보정된 크기')}=${under(raw`\frac{v_t}{1-\beta_2^t}`, '초기 과소추정 제거')}`],
  [raw`\Delta\theta_t=-\eta\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}`, raw`${under(raw`\Delta\theta_t`, 'Adam의 실제 이동량')}=-${under(raw`\eta`, '전체 step 크기')}\frac{${under(raw`\hat m_t`, '이동 방향')}}{${under(raw`\sqrt{\hat v_t}`, '좌표별 gradient 규모')}+${under(raw`\epsilon`, '0으로 나눔 방지')}}`],
  [raw`g_t\leftarrow \nabla L(\theta_t)+\lambda\theta_t`, raw`${under(raw`g_t`, 'L2가 섞인 gradient')}\leftarrow${under(raw`\nabla L(\theta_t)`, '데이터 loss gradient')}+${under(raw`\lambda\theta_t`, '큰 weight에 주는 벌점')}`],
  [raw`\theta_{t+1}=\theta_t+\Delta\theta_t-\eta\lambda\theta_t`, raw`${under(raw`\theta_{t+1}`, '다음 파라미터')}=${under(raw`\theta_t+\Delta\theta_t`, 'optimizer update 적용')}-${under(raw`\eta\lambda\theta_t`, 'weight decay를 별도로 적용')}`],

  // Autoencoders
  [raw`z=f_\phi(x)`, raw`${under(raw`z`, '압축된 latent code')}=${under(raw`f_\phi(x)`, 'encoder가 입력에서 필요한 표현 추출')}`],
  [raw`\hat x=g_\psi(z)`, raw`${under(raw`\hat x`, '입력의 복원')}=${under(raw`g_\psi(z)`, 'decoder가 code를 관측 공간으로 확장')}`],
  [raw`\min_{\phi,\psi}\;\mathbb{E}_{x\sim p_{data}}\left[\mathcal{L}_{rec}(x,\hat x)\right]`, raw`${under(raw`\min_{\phi,\psi}`, 'encoder와 decoder를 함께 학습')}\;${under(raw`\mathbb E_{x\sim p_{data}}`, '데이터 전체에서 평균')}\left[${under(raw`\mathcal L_{rec}(x,\hat x)`, '원본과 복원의 차이')}\right]`],
  [raw`z=\sigma(0.5x_1+0.3x_2)`, raw`${under(raw`z`, '한 개의 code')}=${under(raw`\sigma(\,\cdot\,)`, 'code 범위를 비선형 변환')}\!\left(${under(raw`0.5x_1+0.3x_2`, '두 입력을 하나로 압축')}\right)`],
  [raw`\hat x=\left[\sigma(0.6z),\;\sigma(0.7z)\right]`, raw`${under(raw`\hat x`, '두 차원 복원')}=\left[${under(raw`\sigma(0.6z)`, 'code에서 x₁ 복원')},\;${under(raw`\sigma(0.7z)`, 'code에서 x₂ 복원')}\right]`],
  [raw`\mathcal{L}_{MSE}=\frac{(x_1-\hat x_1)^2+(x_2-\hat x_2)^2}{2}`, raw`${under(raw`\mathcal L_{MSE}`, '평균 복원 오차')}=\frac{${under(raw`(x_1-\hat x_1)^2`, '첫 특징의 제곱 오차')}+${under(raw`(x_2-\hat x_2)^2`, '둘째 특징의 제곱 오차')}}{${under(raw`2`, '두 특징으로 평균')}}`],
  [raw`\delta_{out}=\frac{2}{d}(\hat x-x)\odot \sigma'(a_{out})`, raw`${under(raw`\delta_{out}`, 'decoder 출력의 오차 신호')}=${under(raw`\frac2d(\hat x-x)`, 'MSE가 만든 복원 오차')}\odot${under(raw`\sigma'(a_{out})`, '출력 활성화가 통과시킨 비율')}`],
  [raw`\nabla_{W_{dec}}L=\delta_{out}z^\top`, raw`${under(raw`\nabla_{W_{dec}}L`, 'decoder weight 책임')}=${under(raw`\delta_{out}`, '출력 오차')} ${under(raw`z^\top`, '그 연결이 본 latent 입력')}`],
  [raw`\delta_z=(W_{dec}^\top\delta_{out})\odot\sigma'(a_z)`, raw`${under(raw`\delta_z`, 'latent로 돌아온 오차')}=${under(raw`W_{dec}^\top\delta_{out}`, 'decoder 연결을 거꾸로 통과')}\odot${under(raw`\sigma'(a_z)`, 'latent 활성화 미분')}`],
  [raw`\nabla_{W_{enc}}L=\delta_zx^\top`, raw`${under(raw`\nabla_{W_{enc}}L`, 'encoder weight 책임')}=${under(raw`\delta_z`, 'latent 오차')} ${under(raw`x^\top`, 'encoder가 본 원본 입력')}`],
  [raw`\mathcal{L}_{VAE}=\mathcal{L}_{rec}+\mathcal{L}_{KL}`, raw`${under(raw`\mathcal L_{VAE}`, 'VAE의 전체 목적')}=${under(raw`\mathcal L_{rec}`, '입력을 잘 복원')}+${under(raw`\mathcal L_{KL}`, 'latent 분포를 prior에 정렬')}`],
  [raw`\mathcal{L}_{rec}=\mathbb{E}_{q(z\mid x)}[-\log p(x\mid z)]`, raw`${under(raw`\mathcal L_{rec}`, '기대 복원 비용')}=${under(raw`\mathbb E_{q(z\mid x)}`, 'encoder가 낸 latent에서 평균')}\left[${under(raw`-\log p(x\mid z)`, 'decoder가 원본에 준 음의 로그확률')}\right]`],
  [raw`\mathcal{L}_{KL}=D_{KL}(q(z\mid x)\Vert p(z))`, raw`${under(raw`\mathcal L_{KL}`, 'latent 규제 비용')}=${under(raw`D_{KL}(q(z\mid x)\Vert p(z))`, '샘플별 posterior를 공통 prior에 가깝게')}`],

  // Fourier transform
  [raw`x(t)=A_1\sin(2\pi f_1t)+A_2\sin(2\pi f_2t)`, raw`${under(raw`x(t)`, '관측한 시간 신호')}=${under(raw`A_1\sin(2\pi f_1t)`, '첫 주파수 성분')}+${under(raw`A_2\sin(2\pi f_2t)`, '둘째 주파수 성분')}`],
  [raw`X_k=\sum_{n=0}^{N-1}x_n e^{-i2\pi kn/N}`, raw`${under(raw`X_k`, '주파수 k의 복소 계수')}=${under(raw`\sum_{n=0}^{N-1}`, '모든 sample의 일치도를 누적')} ${under(raw`x_n`, '시간 sample')} ${under(raw`e^{-i2\pi kn/N}`, '주파수 k의 회전 basis')}`],
  [raw`x_n=\frac{1}{N}\sum_{k=0}^{N-1}X_k e^{i2\pi kn/N}`, raw`${under(raw`x_n`, '복원한 시간 sample')}=${under(raw`\frac1N`, '성분 수로 정규화')}\sum_{k=0}^{N-1}${under(raw`X_k`, '주파수별 크기와 위상')}${under(raw`e^{i2\pi kn/N}`, '시간 위치 n의 basis')}`],
  [raw`e^{i\theta}=\cos\theta+i\sin\theta`, raw`${under(raw`e^{i\theta}`, '복소평면의 회전')}=${under(raw`\cos\theta`, '실수축 성분')}+i${under(raw`\sin\theta`, '허수축 성분')}`],
  [raw`X_k=E_k+\omega_N^kO_k`, raw`${under(raw`X_k`, '앞 절반 주파수 결과')}=${under(raw`E_k`, '짝수 index의 DFT')}+${under(raw`\omega_N^kO_k`, '회전시킨 홀수 index DFT')}`],
  [raw`X_{k+N/2}=E_k-\omega_N^kO_k`, raw`${under(raw`X_{k+N/2}`, '뒤 절반 주파수 결과')}=${under(raw`E_k`, '같은 짝수 결과 재사용')}-${under(raw`\omega_N^kO_k`, '홀수 결과의 부호만 반전')}`],
  [raw`T(N)=2T(N/2)+O(N)=O(N\log N)`, raw`${under(raw`T(N)`, 'N개 DFT 비용')}=${under(raw`2T(N/2)`, '절반 문제 두 개')}+${under(raw`O(N)`, '두 결과를 합치는 비용')}=${under(raw`O(N\log N)`, '재귀 깊이만큼 선형 결합')}`],
  [raw`f_{max}<\frac{f_s}{2}`, raw`${under(raw`f_{max}`, '복원할 최고 주파수')}<${under(raw`\frac{f_s}{2}`, 'sampling이 구분 가능한 Nyquist 한계')}`],
  [raw`\Delta f=\frac{f_s}{N}`, raw`${under(raw`\Delta f`, '주파수 bin 간격')}=${under(raw`f_s`, '초당 sample 수')}\Big/${under(raw`N`, '관측 window의 sample 수')}`],
  [raw`x*h=\mathcal{F}^{-1}\left(\mathcal{F}(x)\odot\mathcal{F}(h)\right)`, raw`${under(raw`x*h`, '시간 영역 convolution')}=${under(raw`\mathcal F^{-1}`, '결과를 시간 영역으로 복원')}\!\left(${under(raw`\mathcal F(x)\odot\mathcal F(h)`, '주파수별 element-wise 곱')}\right)`],

  // Word2Vec
  [raw`h_{SG}=v_{w_I}`, raw`${under(raw`h_{SG}`, 'Skip-gram의 예측 표현')}=${under(raw`v_{w_I}`, '중심 단어의 input embedding')}`],
  [raw`h_{CBOW}=\frac{1}{|C|}\sum_{c\in C}v_c`, raw`${under(raw`h_{CBOW}`, 'CBOW의 문맥 표현')}=${under(raw`\frac1{|C|}`, '문맥 수로 평균')}\sum_{c\in C}${under(raw`v_c`, '주변 단어 embedding')}`],
  [raw`s(w_O,w_I)=u_{w_O}^{\top}v_{w_I}`, raw`${under(raw`s(w_O,w_I)`, '두 역할의 pair score')}=${under(raw`u_{w_O}^{\top}v_{w_I}`, '방향이 맞을수록 커지는 dot product')}`],
  [raw`\mathcal{L}_{pos}=-\log\sigma(u_O^\top v_I)`, raw`${under(raw`\mathcal L_{pos}`, '실제 문맥쌍의 비용')}=${under(raw`-\log\sigma(\,\cdot\,)`, 'positive 확률이 낮으면 큰 벌점')}\!\left(${under(raw`u_O^\top v_I`, '실제 pair의 방향 일치도')}\right)`],
  [raw`\mathcal{L}_{neg}=-\sum_{i=1}^{k}\log\sigma(-u_i^\top v_I)`, raw`${under(raw`\mathcal L_{neg}`, 'noise pair들의 비용')}=${under(raw`-\sum_{i=1}^{k}`, 'k개 negative를 누적')}\log\sigma\!\left(${under(raw`-u_i^\top v_I`, 'noise pair score는 낮추기')}\right)`],
  [raw`\frac{\partial\mathcal{L}}{\partial s}=\sigma(s)-y`, raw`${under(raw`\frac{\partial\mathcal L}{\partial s}`, 'pair score가 받을 gradient')}=${under(raw`\sigma(s)`, '현재 pair 확률')}-${under(raw`y`, 'positive 또는 negative target')}`],
  [raw`\cos(a,b)=\frac{a^\top b}{\lVert a\rVert_2\lVert b\rVert_2}`, raw`${under(raw`\cos(a,b)`, '크기와 무관한 방향 유사도')}=\frac{${over(raw`a^\top b`, '방향 일치도')}}{${under(raw`\lVert a\rVert_2\lVert b\rVert_2`, '두 vector 길이로 정규화')}}`],

  // Math & Science: linear algebra and tensors
  [raw`x=\begin{bmatrix}2\\1\end{bmatrix}`, raw`${under(raw`x`, '하나의 vector')}=${under(raw`\begin{bmatrix}2\\1\end{bmatrix}`, '두 feature 축의 좌표')}`],
  [raw`\lVert x\rVert_2=\sqrt{2^2+1^2}=\sqrt5`, raw`${under(raw`\lVert x\rVert_2`, 'vector의 L2 길이')}=${under(raw`\sqrt{2^2+1^2}`, '좌표 제곱합의 제곱근')}=\sqrt5`],
  [raw`a^\top b=\sum_i a_ib_i`, raw`${under(raw`a^\top b`, '두 vector의 dot product')}=${under(raw`\sum_i`, '같은 축의 기여를 모두 합산')}${under(raw`a_ib_i`, '축 i의 성분끼리 곱함')}`],
  [raw`a^\top b=\lVert a\rVert\lVert b\rVert\cos\theta`, raw`${under(raw`a^\top b`, '크기까지 포함한 방향 일치도')}=${under(raw`\lVert a\rVert\lVert b\rVert`, '두 vector 길이의 영향')}${under(raw`\cos\theta`, '순수한 방향 일치도')}`],
  [raw`(m\times n)(n\times p)\rightarrow(m\times p)`, raw`${under(raw`(m\times n)`, '왼쪽 matrix')} ${under(raw`(n\times p)`, '안쪽 n을 공유하는 오른쪽 matrix')}\longrightarrow${under(raw`(m\times p)`, '안쪽 축을 합산한 출력 shape')}`],
  [raw`[32,128]+[128]\rightarrow[32,128]`, aligned(
    raw`${under(raw`[32,128]`, 'batch activation')}+${under(raw`[128]`, '모든 sample이 공유할 bias')}`,
    raw`\longrightarrow${under(raw`[32,128]`, 'bias가 batch 축으로 확장된 결과')}`,
  )],

  // Math & Science: calculus and computational graphs
  [raw`f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}`, raw`${under(raw`f'(x)`, 'x에서의 순간 변화율')}=${under(raw`\lim_{h\to0}`, '측정 간격을 0으로 보냄')}\frac{${under(raw`f(x+h)-f(x)`, '출력 변화량')}}{${under(raw`h`, '입력 변화량')}}`],
  [raw`f(x)=x^2\Rightarrow f'(x)=2x`, raw`${under(raw`f(x)=x^2`, '원래 함수')}\Rightarrow${under(raw`f'(x)=2x`, '위치마다 달라지는 local slope')}`],
  [raw`L(w,b)=(w-2)^2+\frac12(b+1)^2`, raw`${under(raw`L(w,b)`, '두 파라미터의 loss')}=${under(raw`(w-2)^2`, 'w가 목표 2에서 벗어난 비용')}+${under(raw`\frac12(b+1)^2`, 'b가 목표 -1에서 벗어난 비용')}`],
  [raw`\nabla L=\begin{bmatrix}2(w-2)\\b+1\end{bmatrix}`, raw`${under(raw`\nabla L`, '모든 파라미터의 gradient')}=${under(raw`\begin{bmatrix}2(w-2)\\b+1\end{bmatrix}`, 'w와 b의 편미분을 원래 순서로 모음')}`],
  [raw`\nabla L(0,1)=\begin{bmatrix}-4\\2\end{bmatrix}`, raw`${under(raw`\nabla L(0,1)`, '현재 위치의 gradient')}=${under(raw`\begin{bmatrix}-4\\2\end{bmatrix}`, 'loss가 가장 빨리 증가하는 방향')}`],
  [raw`\frac{dL}{dx}=\frac{dL}{dy}\frac{dy}{du}\frac{du}{dx}`, aligned(
    raw`${under(raw`\frac{dL}{dx}`, '입력 x의 전체 책임')}&=${under(raw`\frac{dL}{dy}`, '뒤에서 온 민감도')}${under(raw`\frac{dy}{du}`, '제곱의 local 변화율')}`,
    raw`&\qquad\times${under(raw`\frac{du}{dx}`, '곱셈의 local 변화율')}`,
  )],
  [raw`1\times2u\times2=24`, aligned(
    raw`${under(raw`1`, 'L에서 y로 전달')}\times${under(raw`2u`, 'y=u²의 local slope')}`,
    raw`\qquad\times${under(raw`2`, 'u=2x의 local slope')}=${under(raw`24`, '전체 변화율')}`,
  )],
  [raw`\frac{dL}{du}=\frac{dL}{da}\frac{da}{du}+\frac{dL}{db}\frac{db}{du}=8+3=11`, aligned(
    raw`${under(raw`\frac{dL}{du}`, '공유 node u의 전체 책임')}&=${under(raw`\frac{dL}{da}\frac{da}{du}`, 'a 경로가 돌려준 책임')}`,
    raw`&\qquad+${under(raw`\frac{dL}{db}\frac{db}{du}`, 'b 경로가 돌려준 책임')}`,
    raw`&=${under(raw`8`, 'square 경로')}+${under(raw`3`, 'linear 경로')}=${under(raw`11`, '두 경로의 합')}`,
  )],
  [raw`J_{ij}=\frac{\partial y_i}{\partial x_j}`, raw`${under(raw`J_{ij}`, 'Jacobian의 i,j 원소')}=${under(raw`\frac{\partial y_i}{\partial x_j}`, '입력 좌표가 출력 좌표에 미치는 변화율')}`],
  [raw`\bar x=\bar yJ`, raw`${under(raw`\bar x`, '입력 gradient')}=${under(raw`\bar y`, 'upstream gradient')}${under(raw`J`, 'local 변화율')}`],
  [raw`\frac{\partial L}{\partial\theta_i}\approx\frac{L(\theta_i+\epsilon)-L(\theta_i-\epsilon)}{2\epsilon}`, raw`${under(raw`\frac{\partial L}{\partial\theta_i}`, '검산할 analytic gradient')}\approx\frac{${under(raw`L(\theta_i+\epsilon)-L(\theta_i-\epsilon)`, '양쪽 perturbation의 loss 차이')}}{${under(raw`2\epsilon`, '두 측정점 사이 거리')}}`],

  // Math & Science: probability and information theory
  [raw`\mathbb{E}[X]=\sum_x xP(X=x)`, raw`${under(raw`\mathbb E[X]`, '확률변수의 장기 평균')}=${under(raw`\sum_x`, '가능한 모든 결과를 합산')}${under(raw`xP(X=x)`, '결과값에 발생 확률을 가중')}`],
  [raw`\mathrm{Var}(X)=\mathbb{E}[(X-\mu)^2]`, raw`${under(raw`\mathrm{Var}(X)`, '평균 주변의 퍼짐')}=${under(raw`\mathbb E`, '확률로 가중한 평균')}\left[${under(raw`(X-\mu)^2`, '부호를 없앤 평균과의 제곱 거리')}\right]`],
  [raw`P(D\mid +)=\frac{P(+\mid D)P(D)}{P(+\mid D)P(D)+P(+\mid\neg D)P(\neg D)}`, aligned(
    raw`${under(raw`P(D\mid+)`, '양성 관측 뒤 실제 질병 확률')}=\frac{${under(raw`P(+\mid D)P(D)`, '질병이며 양성인 경로')}}{Z}`,
    raw`Z=${under(raw`P(+\mid D)P(D)`, '진양성 경로')}+${under(raw`P(+\mid\neg D)P(\neg D)`, '위양성 경로')}`,
  )],
  [raw`\mathcal{L}(\theta)=\theta^8(1-\theta)^2`, raw`${under(raw`\mathcal L(\theta)`, '관측 데이터의 likelihood')}=${under(raw`\theta^8`, '성공 8번의 결합 확률')}${under(raw`(1-\theta)^2`, '실패 2번의 결합 확률')}`],
  [raw`\log\mathcal{L}(\theta)=8\log\theta+2\log(1-\theta)`, raw`${under(raw`\log\mathcal L(\theta)`, '계산하기 쉬운 log-likelihood')}=${under(raw`8\log\theta`, '성공의 log 확률 누적')}+${under(raw`2\log(1-\theta)`, '실패의 log 확률 누적')}`],
  [raw`\hat\theta_{MLE}=\frac{8}{10}=0.8`, aligned(
    raw`${under(raw`\hat\theta_{MLE}`, 'likelihood가 가장 큰 성공 확률')}&=${under(raw`\frac8{10}`, '성공 수를 전체 시행 수로 나눔')}`,
    raw`&=${under(raw`0.8`, '관측 데이터의 MLE')}`,
  )],
  [raw`H(P)=-\sum_xP(x)\log P(x)`, raw`${under(raw`H(P)`, '분포 P의 평균 불확실성')}=${under(raw`-\sum_xP(x)`, 'P가 내는 사건으로 평균')} ${under(raw`\log P(x)`, '희귀 사건의 정보 비용')}`],
  [raw`H(P,Q)=-\sum_xP(x)\log Q(x)`, raw`${under(raw`H(P,Q)`, 'Q로 P를 예측하는 평균 비용')}=${under(raw`-\sum_xP(x)`, '실제 분포 P로 평균')} ${under(raw`\log Q(x)`, '모델 Q가 실제 사건에 준 log 확률')}`],
  [raw`D_{KL}(P\Vert Q)=H(P,Q)-H(P)`, raw`${under(raw`D_{KL}(P\Vert Q)`, 'Q가 P와 달라 생긴 추가 비용')}=${under(raw`H(P,Q)`, 'Q를 쓴 전체 비용')}-${under(raw`H(P)`, 'P 자체의 피할 수 없는 비용')}`],

  // Math & Science: statistics and generalization
  [raw`\hat R(\theta)=\frac1N\sum_{i=1}^N\ell(f_\theta(x_i),y_i)`, aligned(
    raw`${under(raw`\hat R(\theta)`, '표본에서 측정한 위험')}=${under(raw`\frac1N\sum_{i=1}^{N}`, 'N개 sample을 평균')}`,
    raw`\qquad ${under(raw`\ell(f_\theta(x_i),y_i)`, 'sample i의 예측 오차')}`,
  )],
  [raw`R(\theta)=\mathbb E_{(x,y)\sim P_{deploy}}[\ell]`, aligned(
    raw`${under(raw`R(\theta)`, '배포 분포의 실제 위험')}`,
    raw`=${under(raw`\mathbb E_{(x,y)\sim P_{deploy}}`, '실제 배포 입력으로 평균')}\left[${under(raw`\ell`, '입력별 예측 오차')}\right]`,
  )],
  [raw`\text{test error}\approx\text{reducible error}+\text{noise}`, aligned(
    raw`${under(raw`\text{test error}`, '관측한 전체 오차')}`,
    raw`\approx${under(raw`\text{reducible error}`, '학습으로 줄일 수 있는 부분')}+${under(raw`\text{noise}`, '줄일 수 없는 변동')}`,
  )],
  [raw`\text{reducible error}=\text{bias}^2+\text{variance}`, aligned(
    raw`${under(raw`\text{reducible error}`, '줄일 수 있는 예측 오차')}`,
    raw`=${under(raw`\text{bias}^2`, '단순한 가정의 체계적 오차')}+${under(raw`\text{variance}`, '표본 변화에 민감한 오차')}`,
  )],
  [raw`\mathrm{Brier}=\frac1N\sum_i\sum_c(p_{ic}-y_{ic})^2`, aligned(
    raw`${under(raw`\mathrm{Brier}`, '확률 예측의 제곱 오차')}=${under(raw`\frac1N\sum_i\sum_c`, 'sample과 class를 평균')}`,
    raw`\qquad ${under(raw`(p_{ic}-y_{ic})^2`, '예측 확률과 target의 거리')}`,
  )],
  [raw`\mathrm{ECE}=\sum_b\frac{|B_b|}{N}|\mathrm{acc}(B_b)-\mathrm{conf}(B_b)|`, aligned(
    raw`${under(raw`\mathrm{ECE}`, '보정 오차의 가중 평균')}=${under(raw`\sum_b\frac{|B_b|}{N}`, 'bin 크기로 가중')}`,
    raw`\qquad ${under(raw`|\mathrm{acc}(B_b)-\mathrm{conf}(B_b)|`, '정확도와 confidence 차이')}`,
  )],

  // Math & Science: subspaces and matrix decompositions
  [raw`\operatorname{rank}(A)+\operatorname{nullity}(A)=n`, raw`${under(raw`\operatorname{rank}(A)`, '출력으로 보존하는 독립 방향')}+${under(raw`\operatorname{nullity}(A)`, '0으로 지우는 독립 방향')}=${under(raw`n`, '전체 입력 방향 수')}`],
  [raw`x^*=\arg\min_x\lVert Ax-b\rVert_2^2`, raw`${under(raw`x^*`, '선택할 최적 계수')}=${under(raw`\arg\min_x`, '가장 작은 지점을 찾음')}${under(raw`\lVert Ax-b\rVert_2^2`, '예측과 관측의 제곱 거리')}`],
  [raw`A^\top(Ax^*-b)=0`, raw`${under(raw`A^\top`, 'column 방향과 내적')}${under(raw`(Ax^*-b)`, '최적점의 residual')}=${under(raw`0`, '모든 column과 직교')}`],
  [raw`Av=\lambda v\quad\Longrightarrow\quad A^kv=\lambda^kv`, aligned(
    raw`${under(raw`Av`, '행렬을 한 번 적용')}=${under(raw`\lambda v`, '방향은 같고 크기만 변화')}`,
    raw`${under(raw`A^kv`, '같은 변환을 k번 반복')}=${under(raw`\lambda^kv`, '방향별 배율도 k제곱')}`,
  )],
  [raw`A=U\Sigma V^\top,\qquad A_k=\sum_{i=1}^{k}\sigma_i u_iv_i^\top`, aligned(
    raw`${under(raw`A`, '원래 linear map')}=${under(raw`U`, '출력 방향')}${under(raw`\Sigma`, '방향별 크기')}${under(raw`V^\top`, '입력을 singular 좌표로 회전')}`,
    raw`${under(raw`A_k`, 'rank-k 근사')}=${under(raw`\sum_{i=1}^{k}`, '큰 방향 k개만 선택')}${under(raw`\sigma_i u_iv_i^\top`, '방향 하나의 rank-1 기여')}`,
  )],

  // Math & Science: optimization geometry
  [raw`\min_x f_0(x)\quad\text{s.t.}\quad f_i(x)\le0,\;h_j(x)=0`, aligned(
    raw`${under(raw`\min_x f_0(x)`, '변수 x로 objective 최소화')}`,
    raw`${under(raw`f_i(x)\le0`, '부등식 허용 영역')}\,,\qquad${under(raw`h_j(x)=0`, '등식으로 고정한 경계')}`,
  )],
  [raw`f(\theta x+(1-\theta)y)\le\theta f(x)+(1-\theta)f(y),\qquad0\le\theta\le1`, aligned(
    raw`${under(raw`z=\theta x+(1-\theta)y`, '두 후보 사이의 점')}`,
    raw`${under(raw`f(z)`, '중간점의 실제 비용')}\le${under(raw`\theta f(x)+(1-\theta)f(y)`, '두 끝 비용을 이은 chord')}`,
    raw`${under(raw`0\le\theta\le1`, '선분 안에서만 비교')}`,
  )],
  [raw`f(x+\Delta)\approx f(x)+\nabla f(x)^\top\Delta+\frac12\Delta^\top H(x)\Delta`, aligned(
    raw`${under(raw`f(x+\Delta)`, '이동 뒤 예상 비용')}\approx${under(raw`f(x)`, '현재 비용')}+${under(raw`\nabla f(x)^\top\Delta`, 'gradient의 1차 변화')}`,
    raw`\qquad+${under(raw`\frac12\Delta^\top H(x)\Delta`, 'Hessian이 보정한 방향별 곡률')}`,
  )],
  [raw`\Delta_{\mathrm{Newton}}=-H(x)^{-1}\nabla f(x)`, raw`${under(raw`\Delta_{\mathrm{Newton}}`, '곡률을 고려한 이동')}=-${under(raw`H(x)^{-1}`, '가파른 축은 줄이고 완만한 축은 확대')}${under(raw`\nabla f(x)`, '현재 gradient')}`],
  [raw`\mathcal L(x,\lambda,\nu)=f_0(x)+\sum_i\lambda_i f_i(x)+\sum_j\nu_j h_j(x)`, aligned(
    raw`${under(raw`\mathcal L(x,\lambda,\nu)`, '목적과 제약을 합친 Lagrangian')}=${under(raw`f_0(x)`, '원래 objective')}`,
    raw`\qquad+${under(raw`\sum_i\lambda_i f_i(x)`, '부등식 위반의 shadow price')}+${under(raw`\sum_j\nu_j h_j(x)`, '등식 경계의 균형 힘')}`,
  )],

  // Math & Science: signals and systems
  [raw`T\{a x_1+b x_2\}=aT\{x_1\}+bT\{x_2\}`, aligned(
    raw`${under(raw`T\{a x_1+b x_2\}`, '합친 입력을 한 번 처리')}`,
    raw`=${under(raw`aT\{x_1\}`, '첫 입력의 scale된 응답')}+${under(raw`bT\{x_2\}`, '둘째 입력의 scale된 응답')}`,
  )],
  [raw`T\{x[n-k]\}=y[n-k]\quad\text{if}\quad T\{x[n]\}=y[n]`, aligned(
    raw`${under(raw`T\{x[n]\}=y[n]`, '원래 입력과 출력')}`,
    raw`${under(raw`T\{x[n-k]\}`, '입력을 k만큼 이동')}=${under(raw`y[n-k]`, '출력도 모양 그대로 k만큼 이동')}`,
  )],
  [raw`x[n]=\sum_k x[k]\delta[n-k]`, raw`${under(raw`x[n]`, '전체 입력 신호')}=${under(raw`\sum_k`, '모든 위치를 합산')}${under(raw`x[k]`, 'k 위치의 sample 크기')}${under(raw`\delta[n-k]`, 'k 위치만 켜는 impulse')}`],
  [raw`y[n]=(x*h)[n]=\sum_k x[k]h[n-k]`, aligned(
    raw`${under(raw`y[n]`, 'n 위치의 system 출력')}=${under(raw`(x*h)[n]`, '입력과 impulse response의 convolution')}`,
    raw`=${under(raw`\sum_k`, '겹치는 모든 위치를 합산')}${under(raw`x[k]`, '입력 sample')}${under(raw`h[n-k]`, '뒤집어 n까지 이동한 응답')}`,
  )],
  [raw`y=x*h\quad\Longleftrightarrow\quad Y(e^{j\omega})=H(e^{j\omega})X(e^{j\omega})`, aligned(
    raw`${under(raw`y=x*h`, '시간 영역에서는 convolution')}`,
    raw`\Longleftrightarrow${under(raw`Y(e^{j\omega})`, '출력 spectrum')}=${under(raw`H(e^{j\omega})`, '주파수별 system 응답')}${under(raw`X(e^{j\omega})`, '입력 spectrum')}`,
  )],
  [raw`f_{\max}<\frac{f_s}{2}`, raw`${under(raw`f_{\max}`, '보존하려는 최고 주파수')}<${under(raw`\frac{f_s}{2}`, 'sampling rate 절반인 Nyquist 경계')}`],

  // NLP & Attention: tokenizer and distributional semantics
  [raw`(a,b)^*=\arg\max_{(a,b)}\;\mathrm{count}(a,b)`, aligned(
    raw`${under(raw`(a,b)^*`, '다음에 합칠 symbol pair')}`,
    raw`=${under(raw`\arg\max_{(a,b)}`, '빈도가 가장 큰 pair 선택')}\;${under(raw`\mathrm{count}(a,b)`, 'corpus 안의 pair 횟수')}`,
  )],
  [raw`\mathrm{fertility}=\frac{\text{token 수}}{\text{공백 단어 수}}`, raw`${under(raw`\mathrm{fertility}`, '단어당 token 분절도')}=\frac{${under(raw`\text{token 수}`, '모델이 처리할 길이')}}{${under(raw`\text{공백 단어 수}`, '원문의 단어 수')}}`],
  [raw`X_{w,c}=\sum_{t}\mathbf 1[w_t=w]\,\mathbf 1[c\in\mathcal C_t]`, aligned(
    raw`${under(raw`X_{w,c}`, 'word-context 행렬의 한 칸')}`,
    raw`=${under(raw`\sum_t`, 'corpus 위치를 순회')}${under(raw`\mathbf 1[w_t=w]`, '중심이 w인지 확인')}${under(raw`\mathbf 1[c\in\mathcal C_t]`, '문맥에 c가 있는지 확인')}`,
  )],
  [raw`\mathrm{PMI}(w,c)=\log_2\frac{P(w,c)}{P(w)P(c)}`, aligned(
    raw`${under(raw`\mathrm{PMI}(w,c)`, '우연을 넘는 동시 등장 정도')}`,
    raw`=${under(raw`\log_2`, '비율을 정보량으로 변환')}\frac{${under(raw`P(w,c)`, '실제 동시 등장 확률')}}{${under(raw`P(w)P(c)`, '독립일 때 기대 확률')}}`,
  )],
  [raw`\mathrm{PPMI}(w,c)=\max(0,\mathrm{PMI}(w,c))`, raw`${under(raw`\mathrm{PPMI}(w,c)`, '양의 연관만 남긴 값')}=${under(raw`\max(0,\mathrm{PMI}(w,c))`, '음의 PMI를 0으로 절단')}`],
  [raw`M\approx U_k\Sigma_kV_k^\top,\qquad E=U_k\Sigma_k`, aligned(
    raw`${under(raw`M`, '희소 word-context 행렬')}\approx${under(raw`U_k\Sigma_kV_k^\top`, '상위 k개 축으로 저차원 복원')}`,
    raw`${under(raw`E`, 'word embedding 행렬')}=${under(raw`U_k\Sigma_k`, 'word 좌표와 축 중요도 결합')}`,
  )],
  [raw`\cos(u,v)=\frac{u^\top v}{\lVert u\rVert_2\lVert v\rVert_2}`, raw`${under(raw`\cos(u,v)`, '크기와 무관한 문맥 방향 유사도')}=\frac{${under(raw`u^\top v`, '두 embedding의 방향 일치')}}{${under(raw`\lVert u\rVert_2\lVert v\rVert_2`, '두 vector 길이로 정규화')}}`],

  // NLP & Attention: recurrent models
  [raw`a_t=W_xx_t+W_hh_{t-1}+b_h`, aligned(
    raw`${under(raw`a_t`, '현재 timestep의 pre-activation')}`,
    raw`=${under(raw`W_xx_t`, '현재 token의 입력 기여')}+${under(raw`W_hh_{t-1}`, '이전 state의 기억 기여')}+${under(raw`b_h`, '공통 기준 이동')}`,
  )],
  [raw`h_t=\tanh(a_t)`, raw`${under(raw`h_t`, '현재 prefix를 압축한 state')}=${under(raw`\tanh(a_t)`, '값을 -1과 1 사이로 제한')}`],
  [raw`z_t=W_oh_t+b_o`, raw`${under(raw`z_t`, '다음 token의 logits')}=${under(raw`W_oh_t`, 'state를 vocabulary score로 투영')}+${under(raw`b_o`, 'token별 기준 score')}`],
  [raw`p(y_t\mid y_{<t})=\mathrm{softmax}(z_t)`, raw`${under(raw`p(y_t\mid y_{<t})`, '현재 prefix 뒤의 token 분포')}=${under(raw`\mathrm{softmax}(z_t)`, 'logit을 합이 1인 확률로 변환')}`],
  [raw`\frac{\partial h_t}{\partial h_k}=\prod_{j=k+1}^{t}\left[\mathrm{diag}(1-h_j^2)W_h\right]`, aligned(
    raw`${under(raw`\frac{\partial h_t}{\partial h_k}`, '먼 state가 현재 state에 미치는 영향')}`,
    raw`=${under(raw`\prod_{j=k+1}^{t}`, '사이 timestep을 모두 곱함')}\left[${under(raw`\mathrm{diag}(1-h_j^2)`, 'tanh의 local 변화율')}${under(raw`W_h`, 'recurrent 선형 변환')}\right]`,
  )],
  [raw`f_t=\sigma(W_f[x_t;h_{t-1}]+b_f)`, raw`${under(raw`f_t`, '이전 기억의 보존 비율')}=${under(raw`\sigma(W_f[x_t;h_{t-1}]+b_f)`, '현재 입력과 과거로 0~1 gate 결정')}`],
  [raw`i_t=\sigma(W_i[x_t;h_{t-1}]+b_i)`, raw`${under(raw`i_t`, '새 기억의 기록 비율')}=${under(raw`\sigma(W_i[x_t;h_{t-1}]+b_i)`, '현재 입력과 과거로 write gate 결정')}`],
  [raw`g_t=\tanh(W_g[x_t;h_{t-1}]+b_g)`, raw`${under(raw`g_t`, '새로 기록할 후보 내용')}=${under(raw`\tanh(W_g[x_t;h_{t-1}]+b_g)`, '입력과 과거에서 candidate 생성')}`],
  [raw`o_t=\sigma(W_o[x_t;h_{t-1}]+b_o)`, raw`${under(raw`o_t`, '현재 기억의 노출 비율')}=${under(raw`\sigma(W_o[x_t;h_{t-1}]+b_o)`, 'hidden state로 읽을 양 결정')}`],
  [raw`c_t=f_t\odot c_{t-1}+i_t\odot g_t`, aligned(
    raw`${under(raw`c_t`, '갱신된 장기 cell state')}`,
    raw`=${under(raw`f_t\odot c_{t-1}`, '이전 기억 중 보존할 부분')}+${under(raw`i_t\odot g_t`, '새 후보 중 기록할 부분')}`,
  )],
  [raw`h_t=o_t\odot\tanh(c_t)`, raw`${under(raw`h_t`, '외부로 내보낼 hidden state')}=${under(raw`o_t`, '읽기 gate')}\odot${under(raw`\tanh(c_t)`, 'cell 내용을 안정된 범위로 변환')}`],

  // NLP & Attention: sequence generation and attention
  [raw`c=\mathrm{Encoder}(x_{1:m})`, raw`${under(raw`c`, 'source 전체의 고정 context')}=${under(raw`\mathrm{Encoder}(x_{1:m})`, 'm개 source token을 한 state로 압축')}`],
  [raw`p(y_{1:n}\mid x)=\prod_{t=1}^{n}p(y_t\mid y_{<t},c)`, aligned(
    raw`${under(raw`p(y_{1:n}\mid x)`, 'target sequence 전체 확률')}`,
    raw`=${under(raw`\prod_{t=1}^{n}`, 'target 위치를 순서대로 결합')}${under(raw`p(y_t\mid y_{<t},c)`, 'prefix와 source가 정한 다음 token 확률')}`,
  )],
  [raw`\mathcal L=-\sum_{t=1}^{n}\log p_\theta(y_t^*\mid y_{<t}^*,x)`, aligned(
    raw`${under(raw`\mathcal L`, 'teacher-forcing 학습 손실')}`,
    raw`=${under(raw`-\sum_{t=1}^{n}`, '정답 target 위치의 비용 누적')}${under(raw`\log p_\theta(y_t^*\mid y_{<t}^*,x)`, '정답 token에 준 log 확률')}`,
  )],
  [raw`s(y)=\frac{\sum_t\log p(y_t\mid y_{<t},x)}{|y|^\alpha}`, aligned(
    raw`${under(raw`s(y)`, 'beam 후보 sequence의 점수')}`,
    raw`=\frac{${under(raw`\sum_t\log p(y_t\mid y_{<t},x)`, 'token별 log 확률 누적')}}{${under(raw`|y|^\alpha`, '짧은 문장 편향을 줄이는 길이 보정')}}`,
  )],
  [raw`\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}+M\right)V`, aligned(
    raw`${under(raw`S`, 'query-key score 행렬')}=${under(raw`\frac{QK^\top}{\sqrt{d_k}}`, '유사도를 scale로 안정화')}+${under(raw`M`, '볼 수 없는 위치 차단')}`,
    raw`${under(raw`A`, 'memory 선택 확률')}=${under(raw`\operatorname{softmax}(S)`, 'key 축으로 합이 1이 되게 정규화')}`,
    raw`${under(raw`\operatorname{Attention}(Q,K,V)`, 'query별 조회 결과')}=${under(raw`AV`, '선택 확률로 value를 가중합')}`,
  )],
  [raw`e_{ti}=\frac{q_t^\top k_i}{\sqrt{d_k}}`, raw`${under(raw`e_{ti}`, 'query t와 memory i의 score')}=\frac{${under(raw`q_t^\top k_i`, '두 방향의 dot-product 일치도')}}{${under(raw`\sqrt{d_k}`, '차원이 커질 때 score 폭발 완화')}}`],
  [raw`Q=XW^Q,\qquad K=XW^K,\qquad V=XW^V`, aligned(
    raw`${under(raw`Q`, '무엇을 찾는지 표현')}=${under(raw`XW^Q`, '입력을 query 공간으로 투영')}`,
    raw`${under(raw`K`, '무엇을 가진지 표현')}=${under(raw`XW^K`, '입력을 key 공간으로 투영')}`,
    raw`${under(raw`V`, '조회 뒤 가져올 내용')}=${under(raw`XW^V`, '입력을 value 공간으로 투영')}`,
  )],
  [raw`\mathrm{MHA}(Q,K,V)=\mathrm{Concat}(\mathrm{head}_1,\ldots,\mathrm{head}_h)W^O`, aligned(
    raw`${under(raw`H`, '여러 관계 공간의 결과')}=${under(raw`\mathrm{Concat}(\mathrm{head}_1,\ldots,\mathrm{head}_h)`, 'head 결과를 feature 축으로 연결')}`,
    raw`${under(raw`\mathrm{MHA}(Q,K,V)`, '원래 model width의 출력')}=${under(raw`HW^O`, 'head 정보를 다시 섞어 투영')}`,
  )],

  // NLP & Attention: Transformer and BERT
  [raw`\mathrm{PE}_{(p,2i)}=\sin\!\left(p/10000^{2i/d}\right),\quad \mathrm{PE}_{(p,2i+1)}=\cos\!\left(p/10000^{2i/d}\right)`, aligned(
    raw`${under(raw`\mathrm{PE}_{(p,2i)}`, 'position p의 짝수 channel')}=${under(raw`\sin(p/10000^{2i/d})`, '주기별 sine 좌표')}`,
    raw`${under(raw`\mathrm{PE}_{(p,2i+1)}`, '같은 주기의 홀수 channel')}=${under(raw`\cos(p/10000^{2i/d})`, '위상이 다른 cosine 좌표')}`,
  )],
  [raw`X\in\mathbb R^{B\times N\times d}\to Q,K,V\in\mathbb R^{B\times H\times N\times d_k}\to A\in\mathbb R^{B\times H\times N\times N}`, aligned(
    raw`${under(raw`X\in\mathbb R^{B\times N\times d}`, 'batch-token-model 입력')}`,
    raw`\longrightarrow${under(raw`Q,K,V\in\mathbb R^{B\times H\times N\times d_k}`, 'head 축으로 나눈 projection')}`,
    raw`\longrightarrow${under(raw`A\in\mathbb R^{B\times H\times N\times N}`, 'query-key 모든 위치의 weight')}`,
  )],
  [raw`y=x+\operatorname{Sublayer}(\operatorname{LN}(x))`, raw`${under(raw`y`, '갱신된 residual stream')}=${under(raw`x`, '원래 정보를 보존하는 skip path')}+${under(raw`\operatorname{Sublayer}(\operatorname{LN}(x))`, '정규화 뒤 계산한 변화량')}`],
  [raw`\operatorname{FFN}(x)=W_2\,\sigma(W_1x+b_1)+b_2`, aligned(
    raw`${under(raw`h`, '확장된 중간 feature')}=${under(raw`\sigma(W_1x+b_1)`, '각 token의 channel을 확장·비선형 변환')}`,
    raw`${under(raw`\operatorname{FFN}(x)`, 'token별 channel mixing 결과')}=${under(raw`W_2h+b_2`, 'model width로 다시 축소')}`,
  )],
  [raw`\mathcal L_{\mathrm{CLM}}=-\sum_{t=1}^{N-1}\log p_\theta(x_{t+1}\mid x_{\le t})`, aligned(
    raw`${under(raw`\mathcal L_{\mathrm{CLM}}`, 'causal language-model 손실')}`,
    raw`=${under(raw`-\sum_{t=1}^{N-1}`, '예측 가능한 모든 위치를 누적')}${under(raw`\log p_\theta(x_{t+1}\mid x_{\le t})`, '왼쪽 prefix로 다음 token 복원')}`,
  )],
  [raw`h_i^{(0)}=E_{\mathrm{token}(i)}+E_{\mathrm{segment}(i)}+E_{\mathrm{position}(i)}`, aligned(
    raw`${under(raw`h_i^{(0)}`, 'BERT 위치 i의 입력 표현')}`,
    raw`=${under(raw`E_{\mathrm{token}(i)}`, 'subword 정체성')}+${under(raw`E_{\mathrm{segment}(i)}`, '문장 A/B 구분')}+${under(raw`E_{\mathrm{position}(i)}`, 'sequence 위치')}`,
  )],
  [raw`\mathcal L_{\mathrm{MLM}}=-\sum_{i\in\mathcal M}\log p_\theta(x_i\mid \widetilde{x}_{1:N})`, aligned(
    raw`${under(raw`\mathcal L_{\mathrm{MLM}}`, '선택 위치 복원 손실')}`,
    raw`=${under(raw`-\sum_{i\in\mathcal M}`, '선택한 15\\% 위치만 채점')}${under(raw`\log p_\theta(x_i\mid\widetilde{x}_{1:N})`, '손상 입력의 양쪽 문맥으로 원 token 예측')}`,
  )],

  // NLP foundational paper spine
  [raw`\frac{\partial h_t}{\partial h_k}=\prod_{j=k+1}^{t}\frac{\partial h_j}{\partial h_{j-1}}`, aligned(
    raw`${under(raw`\frac{\partial h_t}{\partial h_k}`, '과거 state k의 장기 영향')}`,
    raw`=${under(raw`\prod_{j=k+1}^{t}`, '시간 간격만큼 반복 곱')}${under(raw`\frac{\partial h_j}{\partial h_{j-1}}`, '각 recurrent transition의 Jacobian')}`,
  )],
  [raw`s_c(t)=s_c(t-1)+y^{\mathrm{in}}(t)\,g(\mathrm{net}_c(t))`, aligned(
    raw`${under(raw`s_c(t)`, '갱신된 original LSTM cell')}`,
    raw`=${under(raw`s_c(t-1)`, '계수 1로 보존되는 이전 기억')}+${under(raw`y^{\mathrm{in}}(t)g(\mathrm{net}_c(t))`, 'input gate가 허용한 새 기록')}`,
  )],
  [raw`p(y_{1:T'}\mid x_{1:T})=\prod_{t=1}^{T'}p(y_t\mid y_{<t},c)`, aligned(
    raw`${under(raw`p(y_{1:T'}\mid x_{1:T})`, 'source에 조건부인 target 전체 확률')}`,
    raw`=${under(raw`\prod_{t=1}^{T'}`, 'target timestep을 순서대로 결합')}${under(raw`p(y_t\mid y_{<t},c)`, 'prefix와 고정 context의 다음 token 확률')}`,
  )],
  [raw`e_{ti}=v_a^\top\tanh(W_s s_{t-1}+W_h h_i),\qquad \alpha_{ti}=\frac{\exp(e_{ti})}{\sum_j\exp(e_{tj})}`, aligned(
    raw`${under(raw`q_t`, 'target 쪽 비교 좌표')}=${under(raw`W_ss_{t-1}`, 'decoder state를 공통 공간으로 투영')}`,
    raw`${under(raw`k_i`, 'source 쪽 비교 좌표')}=${under(raw`W_hh_i`, 'source 위치를 같은 공간으로 투영')}`,
    raw`${under(raw`u_{ti}`, '두 위치의 비선형 비교')}=${under(raw`\tanh(q_t+k_i)`, '합친 뒤 포화시켜 비교 특징 생성')}`,
    raw`${under(raw`e_{ti}`, 'target-source 정렬 score')}=${under(raw`v_a^\top u_{ti}`, '비교 특징을 scalar로 축약')}`,
    raw`${under(raw`\alpha_{ti}`, 'source i를 읽을 확률')}=\frac{${under(raw`\exp(e_{ti})`, '현재 위치 score의 양수화')}}{${under(raw`\sum_j\exp(e_{tj})`, '모든 source 위치로 정규화')}}`,
  )],
  [raw`c_t=\sum_{i=1}^{T_x}\alpha_{ti}h_i`, aligned(
    raw`${under(raw`u_{ti}`, 'source i가 만드는 기여')}=${under(raw`\alpha_{ti}`, '현재 query의 선택 weight')}${under(raw`h_i`, 'source 위치 i의 value')}`,
    raw`${under(raw`c_t`, 'target t 전용 source context')}=${under(raw`\sum_{i=1}^{T_x}u_{ti}`, '모든 source 기여를 합산')}`,
  )],
  [raw`\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V`, aligned(
    raw`${under(raw`A`, 'query별 key 선택 확률')}=${under(raw`\operatorname{softmax}(QK^\top/\sqrt{d_k})`, 'scaled score를 key 축으로 정규화')}`,
    raw`${under(raw`\operatorname{Attention}(Q,K,V)`, 'query별 조회 결과')}=${under(raw`AV`, '선택 확률로 value를 가중합')}`,
  )],
  [raw`\operatorname{MultiHead}(Q,K,V)=\operatorname{Concat}(head_1,\dots,head_h)W^O`, aligned(
    raw`${under(raw`H`, '여러 attention 공간의 결과')}=${under(raw`\operatorname{Concat}(head_1,\dots,head_h)`, 'head feature를 연결')}`,
    raw`${under(raw`\operatorname{MultiHead}(Q,K,V)`, 'model width의 통합 출력')}=${under(raw`HW^O`, 'head 정보를 output projection으로 혼합')}`,
  )],
  [raw`\mathcal L=\mathcal L_{\mathrm{MLM}}+\mathcal L_{\mathrm{NSP}}`, raw`${under(raw`\mathcal L`, '원 BERT pretraining 목표')}=${under(raw`\mathcal L_{\mathrm{MLM}}`, '가린 token 복원 비용')}+${under(raw`\mathcal L_{\mathrm{NSP}}`, '두 문장의 연속 여부 비용')}`],

  // Foundation paper spine
  [raw`s=w^\top x+b,\qquad \hat y=\mathbf 1[s\ge 0]`, aligned(
    raw`${under(raw`s`, '결정 경계까지의 부호 있는 score')}=${under(raw`w^\top x`, '입력과 경계 방향의 일치도')}+${under(raw`b`, '경계 위치 이동')}`,
    raw`${under(raw`\hat y`, '예측 class')}=${under(raw`\mathbf 1[s\ge0]`, 'score가 경계를 넘었는지 판정')}`,
  )],
  [raw`\delta_j=f'(z_j)\sum_k w_{kj}\delta_k,\qquad \frac{\partial L}{\partial w_{ji}}=\delta_j a_i`, aligned(
    raw`${under(raw`\delta_j`, 'hidden unit j의 오차 책임')}=${under(raw`f'(z_j)`, 'unit j가 통과시킨 민감도')}${under(raw`\sum_k w_{kj}\delta_k`, '다음 층에서 되돌아온 책임 합')}`,
    raw`${under(raw`\frac{\partial L}{\partial w_{ji}}`, '연결 weight의 gradient')}=${under(raw`\delta_j`, '도착점의 오차 신호')}${under(raw`a_i`, '그 연결이 본 입력 activation')}`,
  )],
  [raw`m_t=\beta_1m_{t-1}+(1-\beta_1)g_t,\quad v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2`, aligned(
    raw`${under(raw`m_t`, '방향의 이동 평균')}=${under(raw`\beta_1m_{t-1}`, '과거 방향 기억')}+${under(raw`(1-\beta_1)g_t`, '현재 gradient 반영')}`,
    raw`${under(raw`v_t`, '크기의 이동 평균')}=${under(raw`\beta_2v_{t-1}`, '과거 제곱 크기 기억')}+${under(raw`(1-\beta_2)g_t^2`, '현재 좌표별 크기 반영')}`,
  )],
  [raw`\hat m_t=\frac{m_t}{1-\beta_1^t},\quad \hat v_t=\frac{v_t}{1-\beta_2^t},\quad \theta_t=\theta_{t-1}-\alpha\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}`, aligned(
    raw`${under(raw`\hat m_t`, '보정된 방향')}=${under(raw`\frac{m_t}{1-\beta_1^t}`, '0에서 시작한 초기 편향 제거')}`,
    raw`${under(raw`\hat v_t`, '보정된 크기')}=${under(raw`\frac{v_t}{1-\beta_2^t}`, '초기 제곱 크기 과소추정 제거')}`,
    raw`${under(raw`u_t`, '좌표별 정규화된 이동 방향')}=\frac{${under(raw`\hat m_t`, '보정된 방향')}}{${under(raw`\sqrt{\hat v_t}`, '좌표별 gradient 규모')}+${under(raw`\epsilon`, '0으로 나눔 방지')}}`,
    raw`${under(raw`\theta_t`, '갱신된 파라미터')}=${under(raw`\theta_{t-1}`, '이전 파라미터')}-${under(raw`\alpha`, '전체 학습률')}${under(raw`u_t`, '정규화된 이동 방향')}`,
  )],
  [raw`\theta_{t+1}=\theta_t-\eta\,u_t-\eta\lambda\theta_t`, raw`${under(raw`\theta_{t+1}`, '다음 파라미터')}=${under(raw`\theta_t`, '현재 파라미터')}-${under(raw`\eta u_t`, 'loss를 줄이는 optimizer update')}-${under(raw`\eta\lambda\theta_t`, 'optimizer와 분리된 weight decay')}`],
  [raw`z=f_\phi(x),\qquad \hat x=g_\psi(z),\qquad \min_{\phi,\psi}\sum_i L(x_i,\hat x_i)`, aligned(
    raw`${under(raw`z`, '중앙의 압축 code')}=${under(raw`f_\phi(x)`, 'encoder가 입력을 압축')}`,
    raw`${under(raw`\hat x`, '입력의 복원')}=${under(raw`g_\psi(z)`, 'decoder가 code를 관측 공간으로 확장')}`,
    raw`${under(raw`\min_{\phi,\psi}`, 'encoder와 decoder를 함께 학습')}\;${under(raw`\sum_i L(x_i,\hat x_i)`, '모든 샘플의 복원 오차를 최소화')}`,
  )],
  [raw`X_k=E_k+\omega_N^kO_k,\qquad X_{k+N/2}=E_k-\omega_N^kO_k`, aligned(
    raw`${under(raw`X_k`, '앞 절반 주파수 결과')}=${under(raw`E_k`, '짝수 sample DFT 재사용')}+${under(raw`\omega_N^kO_k`, '위상을 맞춘 홀수 sample DFT')}`,
    raw`${under(raw`X_{k+N/2}`, '뒤 절반 주파수 결과')}=${under(raw`E_k`, '같은 짝수 결과 재사용')}-${under(raw`\omega_N^kO_k`, '홀수 결과의 부호만 반전')}`,
  )],
  [raw`\max_\theta\sum_t\sum_{-c\le j\le c,\,j\ne0}\log p_\theta(w_{t+j}\mid w_t)`, raw`${under(raw`\max_\theta`, 'embedding 파라미터 선택')}\;${under(raw`\sum_t`, '모든 중심 단어를 순회')} ${under(raw`\sum_{-c\le j\le c,\,j\ne0}`, 'window 안의 주변 위치를 순회')} ${under(raw`\log p_\theta(w_{t+j}\mid w_t)`, '실제 문맥 단어의 예측 확률을 높임')}`],

  // Reinforcement learning foundations
  [raw`p(s_{t+1},r_{t+1}\mid s_{0:t},a_{0:t})=p(s_{t+1},r_{t+1}\mid s_t,a_t)`, aligned(
    raw`${under(raw`p(s_{t+1},r_{t+1}\mid s_{0:t},a_{0:t})`, '전체 과거를 본 다음 결과 분포')}`,
    raw`=${under(raw`p(s_{t+1},r_{t+1}\mid s_t,a_t)`, '현재 상태와 행동만으로 같은 예측')}`,
  )],
  [raw`G_t=\sum_{k=0}^{\infty}\gamma^k r_{t+k+1}=r_{t+1}+\gamma G_{t+1}`, aligned(
    raw`${under(raw`G_t`, '현재 이후의 전체 return')}=${under(raw`\sum_{k=0}^{\infty}`, '미래 시점을 모두 합산')}${under(raw`\gamma^k`, '멀수록 할인')}${under(raw`r_{t+k+1}`, 'k step 뒤 보상')}`,
    raw`=${under(raw`r_{t+1}`, '바로 다음 보상')}+${under(raw`\gamma G_{t+1}`, '다음 시점 이후의 할인된 return')}`,
  )],
  [raw`V^\pi(s)=\mathbb E_\pi[G_t\mid S_t=s]`, raw`${under(raw`V^\pi(s)`, '상태 s의 가치')}=${under(raw`\mathbb E_\pi`, '정책과 환경의 미래를 평균')}\left[${under(raw`G_t`, '현재 이후 return')}\mid S_t=s\right]`],
  [raw`Q^\pi(s,a)=\mathbb E_\pi[G_t\mid S_t=s,A_t=a]`, aligned(
    raw`${under(raw`Q^\pi(s,a)`, '상태-행동의 가치')}=${under(raw`\mathbb E_\pi`, '첫 행동 뒤 정책의 미래를 평균')}`,
    raw`\qquad\left[${under(raw`G_t`, '현재 이후 return')}\mid${under(raw`S_t=s,A_t=a`, '상태와 첫 행동을 고정')}\right]`,
  )],
  [raw`A^\pi(s,a)=Q^\pi(s,a)-V^\pi(s)`, raw`${under(raw`A^\pi(s,a)`, '행동의 상대적 이점')}=${under(raw`Q^\pi(s,a)`, '이 행동을 했을 때 가치')}-${under(raw`V^\pi(s)`, '현재 정책의 상태 평균 가치')}`],
  [raw`V^\pi(s)=\sum_a\pi(a\mid s)Q^\pi(s,a),\qquad\sum_a\pi(a\mid s)A^\pi(s,a)=0`, aligned(
    raw`${under(raw`w_a`, '행동 a의 가중치')}=${under(raw`\pi(a\mid s)`, 'policy가 a를 고를 확률')}`,
    raw`${under(raw`M_Q`, '행동 Q의 policy 평균')}=${under(raw`\sum_a w_aQ^\pi(s,a)`, '확률로 가중한 Q를 합산')}`,
    raw`${under(raw`V^\pi(s)`, '상태만 고정한 가치')}=${under(raw`M_Q`, '방금 계산한 Q 평균')}`,
    raw`${under(raw`M_A`, 'advantage의 policy 평균')}=${under(raw`\sum_a w_aA^\pi(s,a)`, '행동별 advantage를 가중 평균')}`,
    raw`\qquad=${under(raw`M_Q-V^\pi(s)`, 'Q 평균에서 baseline을 뺌')}=${under(raw`0`, 'V와 V가 상쇄')}`,
  )],
  [raw`V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s',r}p(s',r\mid s,a)\left[r+\gamma V^\pi(s')\right]`, aligned(
    raw`${under(raw`B^\pi(s,a)`, '행동 a의 한 step backup')}=${under(raw`\sum_{s',r}p(s',r\mid s,a)`, '환경의 다음 결과를 평균')}${under(raw`\left[r+\gamma V^\pi(s')\right]`, '보상과 다음 가치')}`,
    raw`${under(raw`V^\pi(s)`, '정책의 상태 가치')}=${under(raw`\sum_a\pi(a\mid s)B^\pi(s,a)`, '정책 행동 확률로 backup을 평균')}`,
  )],
  [raw`Q^*(s,a)=\sum_{s',r}p(s',r\mid s,a)\left[r+\gamma\max_{a'}Q^*(s',a')\right]`, aligned(
    raw`${under(raw`M^*(s')`, '다음 상태의 최적 가치')}=${under(raw`\max_{a'}Q^*(s',a')`, '다음 행동 중 가장 큰 Q 선택')}`,
    raw`${under(raw`Q^*(s,a)`, '현재 행동의 최적 가치')}=${under(raw`\sum_{s',r}p(s',r\mid s,a)`, '다음 결과를 평균')}\left[${under(raw`r+\gamma M^*(s')`, '보상과 최적 미래')}\right]`,
  )],
  [raw`Y_t^{\mathrm{MC}}=G_t=\sum_{k=0}^{T-t-1}\gamma^k r_{t+k+1}`, aligned(
    raw`${under(raw`Y_t^{\mathrm{MC}}`, 'MC가 사용할 회귀 목표')}=${under(raw`G_t`, '현재 이후 실제로 관측한 return')}`,
    raw`\qquad=${under(raw`\sum_{k=0}^{T-t-1}`, 'episode 끝까지 합산')}${under(raw`\gamma^k`, '먼 보상의 영향 할인')}${under(raw`r_{t+k+1}`, 'k step 뒤에 받은 보상')}`,
  )],
  [raw`G_t^{(n)}=\sum_{k=0}^{n-1}\gamma^k r_{t+k+1}+\gamma^n m_{t+n-1}V(s_{t+n})`, aligned(
    raw`${under(raw`O_t^{(n)}`, '직접 관측한 앞부분')}=${under(raw`\sum_{k=0}^{n-1}\gamma^k r_{t+k+1}`, 'n개 보상을 할인해 합산')}`,
    raw`${under(raw`B_t^{(n)}`, 'n step 뒤의 추정 몫')}=${under(raw`\gamma^n`, 'n칸 거리 할인')}${under(raw`m_{t+n-1}`, '진짜 종료면 0')}${under(raw`V(s_{t+n})`, '아직 보지 않은 미래 가치')}`,
    raw`${under(raw`G_t^{(n)}`, 'n-step return')}=${under(raw`O_t^{(n)}+B_t^{(n)}`, '관측한 보상과 bootstrap을 결합')}`,
  )],
  [raw`G_t^\lambda=(1-\lambda)\sum_{n=1}^{N-1}\lambda^{n-1}G_t^{(n)}+\lambda^{N-1}G_t^{(N)}`, aligned(
    raw`${under(raw`w_n`, '끝 전 n-step의 무게')}=${under(raw`(1-\lambda)\lambda^{n-1}`, '길이가 늘수록 기하급수로 감쇠')}\quad(n<N)` ,
    raw`${under(raw`w_N`, '마지막 return의 남은 무게')}=${under(raw`\lambda^{N-1}`, '전체 무게 합을 1로 맞춤')}`,
    raw`${under(raw`G_t^\lambda`, '여러 horizon을 섞은 return')}=${under(raw`\sum_{n=1}^{N}w_nG_t^{(n)}`, '모든 n-step 답을 가중 평균')}`,
  )],
  [raw`Y_t^{\mathrm{TD}}=r_{t+1}+\gamma m_tV(s_{t+1}),\qquad\delta_t=Y_t^{\mathrm{TD}}-V(s_t)`, aligned(
    raw`${under(raw`m_t`, '미래 gate')}=${under(raw`1-\mathrm{terminated}_t`, '진짜 종료에서만 0')}`,
    raw`${under(raw`B_t`, '추정한 미래 몫')}=${under(raw`\gamma`, '거리 할인')}${under(raw`m_t`, '종료 gate')}${under(raw`V(s_{t+1})`, '다음 value 예측')}`,
    raw`${under(raw`Y_t^{\mathrm{TD}}`, '한 step 목표')}=${under(raw`r_{t+1}`, '관측한 보상')}+${under(raw`B_t`, '추정한 미래')}`,
    raw`${under(raw`\delta_t`, 'TD residual')}=${under(raw`Y_t^{\mathrm{TD}}`, '목표')}-${under(raw`V(s_t)`, '현재 예측')}`,
  )],
  [raw`\delta_t=r_{t+1}+\gamma V(s_{t+1})-V(s_t)`, raw`${under(raw`\delta_t`, '한 step TD 오차')}=${under(raw`r_{t+1}+\gamma V(s_{t+1})`, '보상과 다음 추정으로 만든 target')}-${under(raw`V(s_t)`, '현재 value 예측')}`],
  [raw`Y_t^{\mathrm{SARSA}}=r_{t+1}+\gamma Q(s_{t+1},a_{t+1})`, raw`${under(raw`Y_t^{\mathrm{SARSA}}`, 'on-policy Q target')}=${under(raw`r_{t+1}`, '다음 보상')}+\gamma${under(raw`Q(s_{t+1},a_{t+1})`, 'behavior가 실제 고른 다음 행동의 가치')}`],
  [raw`Y_t^{\mathrm{SARSA}}=r_{t+1}+\gamma m_tQ(s_{t+1},a_{t+1})`, aligned(
    raw`${under(raw`a'`, '실제로 고른 행동')}=${under(raw`a_{t+1}`, 'behavior의 다음 선택')}`,
    raw`${under(raw`Y_t^{\mathrm{SARSA}}`, 'on-policy 표적')}=${under(raw`r_{t+1}`, '즉시 보상')}+${under(raw`\gamma m_tQ(s_{t+1},a')`, '종료 전 실제 선택의 미래 가치')}`,
  )],
  [raw`Y_t^{Q}=r_{t+1}+\gamma\max_{a'}Q(s_{t+1},a')`, raw`${under(raw`Y_t^Q`, 'off-policy Q target')}=${under(raw`r_{t+1}`, '다음 보상')}+\gamma${under(raw`\max_{a'}Q(s_{t+1},a')`, 'greedy target 정책의 다음 가치')}`],
  [raw`Y_t^Q=r_{t+1}+\gamma m_t\max_{a'}Q(s_{t+1},a')`, aligned(
    raw`${under(raw`M_t`, 'greedy한 다음 가치')}=${under(raw`\max_{a'}Q(s_{t+1},a')`, '다음 행동 후보 중 가장 큰 Q를 선택')}`,
    raw`${under(raw`Y_t^Q`, 'off-policy 행동 가치 목표')}=${under(raw`r_{t+1}`, '즉시 보상')}+${under(raw`\gamma m_tM_t`, '종료 전 greedy 미래만 할인')}`,
  )],
  [raw`\mathcal L(\theta)=\mathbb E_{(s,a,r,s',d)\sim\mathcal D}\left[\left(Q_\theta(s,a)-\left(r+\gamma(1-d)\max_{a'}Q_{\theta^-}(s',a')\right)\right)^2\right]`, aligned(
    raw`${under(raw`Y`, '고정할 DQN target')}=${under(raw`r`, '즉시 보상')}+\gamma${under(raw`(1-d)`, 'terminal이면 미래 차단')}${under(raw`\max_{a'}Q_{\theta^-}(s',a')`, 'target network의 다음 최대 Q')}`,
    raw`${under(raw`\mathcal L(\theta)`, 'online Q 회귀 손실')}=${under(raw`\mathbb E_{\mathcal D}`, 'replay transition으로 평균')}\left[${under(raw`(Q_\theta(s,a)-Y)^2`, '현재 예측과 target의 제곱 오차')}\right]`,
  )],
  [raw`a^*=\arg\max_{a'}Q_\theta(s',a'),\qquad Y^{\mathrm{Double}}=r+\gamma mQ_{\theta^-}(s',a^*)`, aligned(
    raw`${under(raw`a^*`, '선택 행동')}=${under(raw`\arg\max_{a'}Q_\theta(s',a')`, 'online Q로 argmax')}`,
    raw`${under(raw`E`, '선택 행동의 평가값')}=${under(raw`Q_{\theta^-}(s',a^*)`, 'target Q로 평가')}`,
    raw`${under(raw`Y^{\mathrm{Double}}`, 'Double DQN 목표')}=${under(raw`r`, '즉시 보상')}+${under(raw`\gamma m`, '종료 전 할인')}${under(raw`E`, '분리해 평가한 미래')}`,
  )],
  [raw`Y=r+\gamma m\max_{a'}Q_{\theta^-}(s',a'),\qquad\mathcal L(\theta)=\mathbb E_{\mathcal D}\left[(Q_\theta(s,a)-Y)^2\right]`, aligned(
    raw`${under(raw`M`, '고정한 다음 가치')}=${under(raw`\max_{a'}Q_{\theta^-}(s',a')`, 'target Q에서 최대값')}`,
    raw`${under(raw`Y`, 'DQN 회귀 목표')}=${under(raw`r`, '즉시 보상')}+${under(raw`\gamma m`, '종료 전 할인')}${under(raw`M`, '고정한 미래')}`,
    raw`${under(raw`e`, 'online residual')}=${under(raw`Q_\theta(s,a)`, '학습할 현재 예측')}-${under(raw`Y`, 'gradient 없는 목표')}`,
    raw`${under(raw`\mathcal L(\theta)`, 'DQN 회귀 손실')}=${under(raw`\mathbb E_{\mathcal D}[e^2]`, 'replay의 제곱 residual 평균')}`,
  )],
  [raw`J(\theta)=\mathbb E_{\tau\sim\pi_\theta}\left[R(\tau)\right]`, aligned(
    raw`${under(raw`J(\theta)`, 'policy의 기대 성능')}=${under(raw`\mathbb E_{\tau\sim\pi_\theta}`, '현재 정책이 만드는 경로로 평균')}`,
    raw`\qquad\left[${under(raw`R(\tau)`, '경로 전체 return')}\right]`,
  )],
  [raw`p_\theta(\tau)=\rho_0(s_0)\prod_{t=0}^{T-1}\pi_\theta(a_t\mid s_t)p(s_{t+1},r_{t+1}\mid s_t,a_t)`, aligned(
    raw`${under(raw`p_\theta(\tau)`, '이 trajectory가 나올 확률')}=${under(raw`\rho_0(s_0)`, '환경의 초기 state 확률')}`,
    raw`\qquad\times\prod_{t=0}^{T-1}${under(raw`\pi_\theta(a_t\mid s_t)`, '학습할 행동 선택 확률')}${under(raw`p(s_{t+1},r_{t+1}\mid s_t,a_t)`, '미분하지 않을 환경 전이')}`,
  )],
  [raw`\nabla_\theta p_\theta(\tau)=p_\theta(\tau)\nabla_\theta\log p_\theta(\tau)`, aligned(
    raw`${under(raw`\nabla_\theta p_\theta(\tau)`, 'trajectory 확률의 직접 미분')}`,
    raw`=${under(raw`p_\theta(\tau)`, '그 trajectory가 뽑힐 확률')}${under(raw`\nabla_\theta\log p_\theta(\tau)`, 'log 확률이 움직이는 방향')}`,
  )],
  [raw`\nabla_\theta\log p_\theta(\tau)=\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t\mid s_t)`, aligned(
    raw`${under(raw`\nabla_\theta\log p_\theta(\tau)`, 'trajectory 확률의 gradient')}`,
    raw`=${under(raw`\sum_{t=0}^{T-1}`, '각 의사결정 시점을 합산')}${under(raw`\nabla_\theta\log\pi_\theta(a_t\mid s_t)`, '환경 미분 없이 남는 policy score')}`,
  )],
  [raw`\nabla_\theta J(\theta)=\mathbb E_{\tau\sim\pi_\theta}\left[\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t\mid s_t)G_t\right]`, aligned(
    raw`${under(raw`g_t`, '시점 t의 policy 신호')}=${under(raw`\nabla_\theta\log\pi_\theta(a_t\mid s_t)`, '선택 행동 확률의 방향')}${under(raw`G_t`, '그 행동 뒤의 return')}`,
    raw`${under(raw`\nabla_\theta J(\theta)`, '기대 policy gradient')}=${under(raw`\mathbb E_{\tau\sim\pi_\theta}\left[\sum_t g_t\right]`, '현재 policy rollout으로 평균')}`,
  )],
  [raw`G_t=\sum_{k=t}^{T-1}\gamma^{k-t}r_{k+1}`, aligned(
    raw`${under(raw`G_t`, '현재 행동 뒤의 return')}=${under(raw`\sum_{k=t}^{T-1}`, '현재 시점부터 episode 끝까지')}`,
    raw`\qquad${under(raw`\gamma^{k-t}`, '먼 reward의 영향 할인')}${under(raw`r_{k+1}`, '행동 뒤에 관측한 reward')}`,
  )],
  [raw`\mathbb E\!\left[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\sum_{k=0}^{t-1}\gamma^k r_{k+1}\right]=0`, aligned(
    raw`${under(raw`P_t`, '현재 행동 전에 확정된 과거 보상')}=${under(raw`\sum_{k=0}^{t-1}\gamma^k r_{k+1}`, '미래 action이 바꿀 수 없는 항')}`,
    raw`${under(raw`\mathbb E[\nabla_\theta\log\pi_\theta(a_t\mid s_t)P_t]`, '과거 보상과 현재 policy score의 평균')}=${under(raw`0`, '기대 gradient에는 기여하지 않음')}`,
  )],
  [raw`\mathbb E_{a\sim\pi_\theta}\left[\nabla_\theta\log\pi_\theta(a\mid s)b(s)\right]=0`, aligned(
    raw`${under(raw`b(s)`, '행동과 무관한 state baseline')}${under(raw`\sum_a\pi_\theta(a\mid s)\nabla_\theta\log\pi_\theta(a\mid s)`, '모든 행동 score의 기대')}`,
    raw`=b(s)\nabla_\theta${under(raw`\sum_a\pi_\theta(a\mid s)`, '확률 합은 1')}=0`,
  )],
  [raw`\widehat A_t=G_t-V_\phi(s_t)`, aligned(
    raw`${under(raw`\widehat A_t`, 'sampled advantage')}=${under(raw`G_t`, '행동 뒤의 return')}`,
    raw`\qquad-${under(raw`V_\phi(s_t)`, 'critic이 예측한 state baseline')}`,
  )],
  [raw`\delta_t=r_{t+1}+\gamma V_\phi(s_{t+1})-V_\phi(s_t)`, raw`${under(raw`\delta_t`, 'critic의 한 step residual')}=${under(raw`r_{t+1}+\gamma V_\phi(s_{t+1})`, 'bootstrap target')}-${under(raw`V_\phi(s_t)`, '현재 critic 예측')}`],
  [raw`\widehat A_t^{\mathrm{GAE}(\gamma,\lambda)}=\sum_{l=0}^{T-t-1}(\gamma\lambda)^l\delta_{t+l}`, aligned(
    raw`${under(raw`w_l`, 'l step 뒤의 credit 무게')}=${under(raw`(\gamma\lambda)^l`, '거리에 따라 지수 감쇠')}`,
    raw`${under(raw`c_{t,l}`, 'l step 뒤에서 온 credit')}=${under(raw`w_l`, '방금 정한 무게')}${under(raw`\delta_{t+l}`, '미래 TD residual')}`,
    raw`${under(raw`\widehat A_t^{\mathrm{GAE}}`, '여러 길이를 섞은 advantage')}=${under(raw`\sum_{l=0}^{T-t-1}c_{t,l}`, '현재부터 끝까지 credit 합산')}`,
  )],
  [raw`\delta_t=r_t+\gamma(1-d_t)V_\phi(s_{t+1})-V_\phi(s_t)`, aligned(
    raw`${under(raw`Y_t`, '한 step value target')}=${under(raw`r_t`, '지금 받은 보상')}+${under(raw`\gamma(1-d_t)V_\phi(s_{t+1})`, '종료 전의 다음 가치만 할인')}`,
    raw`${under(raw`\delta_t`, '한 step TD 오차')}=${under(raw`Y_t`, '방금 만든 target')}-${under(raw`V_\phi(s_t)`, '현재 state의 value 예측')}`,
  )],
  [raw`\widehat A_t=\delta_t+\gamma\lambda(1-d_t)\widehat A_{t+1},\qquad \widehat R_t=\widehat A_t+V_\phi(s_t)`, aligned(
    raw`${under(raw`m_t`, '종료 마스크')}=${under(raw`1-d_t`, '종료면 0')}`,
    raw`${under(raw`C_t`, '남길 미래 credit')}=${under(raw`\gamma\lambda m_t\widehat A_{t+1}`, '다음 advantage를 감쇠')}`,
    raw`${under(raw`\widehat A_t`, '현재 advantage')}=${under(raw`\delta_t`, '현재 TD 오차')}+${under(raw`C_t`, '미래에서 온 몫')}`,
    raw`${under(raw`\widehat R_t`, 'critic target')}=${under(raw`\widehat A_t`, '상대적 가치')}+${under(raw`V_\phi(s_t)`, '현재 baseline')}`,
  )],
  [raw`r_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\mathrm{old}}}(a_t\mid s_t)}`, raw`${under(raw`r_t(\theta)`, '선택 행동의 확률 변화 비율')}=\frac{${under(raw`\pi_\theta(a_t\mid s_t)`, 'update 중인 새 policy 확률')}}{${under(raw`\pi_{\theta_{\mathrm{old}}}(a_t\mid s_t)`, 'rollout을 만든 old policy 확률')}}`],
  [raw`L^{\mathrm{clip}}(\theta)=\mathbb E_t\left[\min\left(r_t(\theta)\widehat A_t,\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\widehat A_t\right)\right]`, aligned(
    raw`${under(raw`u_t`, '제한 없는 surrogate')}=${under(raw`r_t(\theta)`, 'old-to-new 확률 비')}${under(raw`\widehat A_t`, '행동의 상대 가치')}`,
    raw`${under(raw`c_t`, 'ratio를 제한한 surrogate')}=${under(raw`\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)`, '허용 범위 밖 ratio를 경계로 고정')}\widehat A_t`,
    raw`${under(raw`L^{\mathrm{clip}}(\theta)`, '보수적인 PPO 목적')}=${under(raw`\mathbb E_t[\min(u_t,c_t)]`, '과도한 개선 이득을 선택하지 않음')}`,
  )],
  [raw`L_{\mathrm{total}}=-L^{\mathrm{clip}}+c_v\mathbb E_t[(V_\phi(s_t)-\widehat R_t)^2]-c_e\mathbb E_t[\mathcal H(\pi_\theta(\cdot\mid s_t))]`, aligned(
    raw`${under(raw`L_{\mathrm{actor}}`, '정책 개선 손실')}=${under(raw`-L^{\mathrm{clip}}`, '최대화 목적을 최소화 부호로 변환')}`,
    raw`${under(raw`L_{\mathrm{critic}}`, 'value 회귀 손실')}=${under(raw`c_v\mathbb E_t[(V_\phi(s_t)-\widehat R_t)^2]`, 'critic과 return target의 오차')}`,
    raw`${under(raw`L_{\mathrm{total}}`, 'PPO 전체 최소화 손실')}=L_{\mathrm{actor}}+L_{\mathrm{critic}}-${under(raw`c_e\mathbb E_t[\mathcal H(\pi_\theta)]`, 'entropy를 유지하는 보너스')}`,
  )],
  [raw`\nabla_\theta J(\theta)=\mathbb E_{s\sim\mathcal D}\left[\nabla_a Q_\phi(s,a)\vert_{a=\mu_\theta(s)}\nabla_\theta\mu_\theta(s)\right]`, aligned(
    raw`${under(raw`g_a`, 'critic이 제시한 action 개선 방향')}=${under(raw`\nabla_a Q_\phi(s,a)\vert_{a=\mu_\theta(s)}`, 'actor action에서 Q를 키우는 방향')}`,
    raw`${under(raw`\nabla_\theta J(\theta)`, 'deterministic actor gradient')}=${under(raw`\mathbb E_{s\sim\mathcal D}[g_a\nabla_\theta\mu_\theta(s)]`, 'action 방향을 actor parameter로 연쇄 전달')}`,
  )],
  [raw`J_{\mathrm{SAC}}(\theta)=\mathbb E_{s\sim\mathcal D,a\sim\pi_\theta}\left[\alpha\log\pi_\theta(a\mid s)-Q_\phi(s,a)\right]`, aligned(
    raw`${under(raw`C_{\mathrm{entropy}}`, '확률 집중 비용')}=${under(raw`\alpha\log\pi_\theta(a\mid s)`, 'temperature로 조절한 log-probability')}`,
    raw`${under(raw`J_{\mathrm{SAC}}(\theta)`, 'SAC actor 최소화 목적')}=${under(raw`\mathbb E[C_{\mathrm{entropy}}-Q_\phi(s,a)]`, 'entropy는 유지하고 높은 Q 행동을 선호')}`,
  )],

  // Reinforcement learning paper spine
  [raw`Q_{t+1}(s_t,a_t)=Q_t(s_t,a_t)+\alpha_t\left[r_{t+1}+\gamma\max_a Q_t(s_{t+1},a)-Q_t(s_t,a_t)\right]`, aligned(
    raw`${under(raw`Y_t`, '한 전이로 만든 최적 target')}=${under(raw`r_{t+1}`, '즉시 보상')}+${under(raw`\gamma\max_a Q_t(s_{t+1},a)`, '다음 상태의 greedy 미래 가치')}`,
    raw`${under(raw`\delta_t`, '현재 Q의 TD 오차')}=${under(raw`Y_t-Q_t(s_t,a_t)`, 'target에서 현재 예측을 뺌')}`,
    raw`${under(raw`Q_{t+1}(s_t,a_t)`, '방문한 항목의 새 값')}=${under(raw`Q_t(s_t,a_t)`, '현재 값')}+${under(raw`\alpha_t\delta_t`, '오차 중 일부만 반영')}`,
  )],
  [raw`\sum_t\alpha_t(s,a)=\infty,\qquad \sum_t\alpha_t(s,a)^2<\infty`, aligned(
    raw`${under(raw`\sum_t\alpha_t(s,a)=\infty`, '끝까지 남는 총 학습량')}`,
    raw`${under(raw`\sum_t\alpha_t(s,a)^2<\infty`, '누적 noise 분산은 유한하게 억제')}`,
  )],
  [raw`\Delta\theta=\alpha\,(R-b)\,\nabla_\theta\log\pi_\theta(a\mid s)`, aligned(
    raw`${under(raw`A`, '결과의 상대적 이점')}=${under(raw`R-b`, 'reinforcement에서 행동 무관 기준을 제거')}`,
    raw`${under(raw`e`, '선택 행동의 파라미터 책임')}=${under(raw`\nabla_\theta\log\pi_\theta(a\mid s)`, '환경을 미분하지 않는 score gradient')}`,
    raw`${under(raw`\Delta\theta`, 'policy 파라미터 변화')}=${under(raw`\alpha`, 'update 크기')}${under(raw`A e`, '좋은 선택 확률은 높이고 나쁜 선택은 낮춤')}`,
  )],
  [raw`\nabla_\theta J(\theta)=\mathbb E_{\tau\sim\pi_\theta}\!\left[\sum_t G_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)\right]`, aligned(
    raw`${under(raw`g_t`, '시점 t의 sampled policy 신호')}=${under(raw`G_t`, '그 행동 뒤의 return')}${under(raw`\nabla_\theta\log\pi_\theta(a_t\mid s_t)`, '선택 행동의 score gradient')}`,
    raw`${under(raw`\nabla_\theta J(\theta)`, '기대 return의 gradient')}=${under(raw`\mathbb E_{\tau\sim\pi_\theta}[\sum_t g_t]`, '현재 policy trajectory로 평균')}`,
  )],
  [raw`a_t=\begin{cases}\text{uniform action},&u<\epsilon\\ \arg\max_a Q_\theta(s_t,a),&u\ge\epsilon\end{cases}`, aligned(
    raw`${under(raw`u<\epsilon`, '탐색 구간')};\Longrightarrow\;${under(raw`a_t=\text{uniform action}`, '모든 행동에 방문 기회 부여')}`,
    raw`${under(raw`u\ge\epsilon`, '활용 구간')};\Longrightarrow\;${under(raw`a_t=\arg\max_a Q_\theta(s_t,a)`, '현재 Q가 가장 큰 행동 선택')}`,
  )],
  [raw`r_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\theta_{\mathrm{old}}}(a_t\mid s_t)}=\exp\!\left(\log\pi_\theta-\log\pi_{\theta_{\mathrm{old}}}\right)`, aligned(
    raw`${under(raw`\ell_t^{\mathrm{old}}`, '저장한 rollout 기준')}=${under(raw`\log\pi_{\theta_{\mathrm{old}}}(a_t\mid s_t)`, 'old policy의 선택 행동 log 확률')}`,
    raw`${under(raw`\Delta\ell_t`, '선택 행동의 log 확률 변화')}=${under(raw`\log\pi_\theta(a_t\mid s_t)`, '새 policy로 다시 평가')}-${under(raw`\ell_t^{\mathrm{old}}`, '저장한 기준을 뺌')}`,
    raw`${under(raw`r_t(\theta)`, 'old 대비 확률 배율')}=${under(raw`\exp(\Delta\ell_t)`, 'log 차이를 양수 ratio로 복원')}`,
  )],
  [raw`L^{\mathrm{CLIP}}(\theta)=\mathbb E_t\left[\min\left(r_t(\theta)\widehat A_t,\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\widehat A_t\right)\right]`, aligned(
    raw`${under(raw`u_t`, '제한 없는 개선 점수')}=${under(raw`r_t(\theta)`, '선택 확률 변화')}${under(raw`\widehat A_t`, '행동의 상대 가치')}`,
    raw`${under(raw`c_t`, 'ratio를 제한한 점수')}=${under(raw`\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)`, '허용 범위 밖 추가 이득 차단')}\widehat A_t`,
    raw`${under(raw`L^{\mathrm{CLIP}}(\theta)`, 'PPO가 최대화할 보수적 목적')}=${under(raw`\mathbb E_t[\min(u_t,c_t)]`, '두 점수 중 작은 쪽을 채택')}`,
  )],
  [raw`y=r+\gamma(1-d)Q_{\phi^-}\!\left(s',\mu_{\theta^-}(s')\right)`, aligned(
    raw`${under(raw`a'`, 'target actor의 다음 행동')}=${under(raw`\mu_{\theta^-}(s')`, '천천히 바뀌는 actor로 선택')}`,
    raw`${under(raw`y`, 'critic의 bootstrap target')}=${under(raw`r`, '즉시 보상')}+${under(raw`\gamma(1-d)`, 'terminal 밖 미래만 할인')}${under(raw`Q_{\phi^-}(s',a')`, 'slow critic의 다음 가치')}`,
  )],
  [raw`y=r+\gamma(1-d)\min_{i=1,2}Q_{\phi_i^-}\!\left(s',\mu_{\theta^-}(s')+\epsilon\right)`, aligned(
    raw`${under(raw`\tilde a'`, '평활한 target 행동')}=${under(raw`\mu_{\theta^-}(s')`, 'slow actor 행동')}+${under(raw`\epsilon`, '좁은 Q peak를 평균화할 noise')}`,
    raw`${under(raw`Q^-_{\min}`, '보수적 다음 가치')}=${under(raw`\min_{i=1,2}Q_{\phi_i^-}(s',\tilde a')`, '두 critic 중 작은 추정을 선택')}`,
    raw`${under(raw`y`, 'TD3 critic target')}=${under(raw`r`, '즉시 보상')}+${under(raw`\gamma(1-d)Q^-_{\min}`, 'terminal 밖의 보수적 미래 가치')}`,
  )],
  [raw`\epsilon\sim\operatorname{clip}(\mathcal N(0,\sigma^2),-c,c)`, aligned(
    raw`${under(raw`z\sim\mathcal N(0,\sigma^2)`, 'target 행동 주변의 Gaussian perturbation')}`,
    raw`${under(raw`\epsilon`, '사용할 smoothing noise')}=${under(raw`\operatorname{clip}(z,-c,c)`, '과도한 action 왜곡을 상한으로 절단')}`,
  )],
  [raw`J(\pi)=\mathbb E_{\tau\sim\pi}\left[\sum_t\gamma^t\left(r(s_t,a_t)+\alpha\mathcal H(\pi(\cdot\mid s_t))\right)\right]`, aligned(
    raw`${under(raw`u_t`, '시점 t의 soft utility')}=${under(raw`r(s_t,a_t)`, '환경이 준 보상')}+${under(raw`\alpha\mathcal H(\pi(\cdot\mid s_t))`, '행동 다양성에 둔 가치')}`,
    raw`${under(raw`J(\pi)`, 'maximum-entropy policy 목적')}=${under(raw`\mathbb E_{\tau\sim\pi}`, 'stochastic trajectory로 평균')}\left[${under(raw`\sum_t\gamma^t u_t`, '먼 미래를 할인해 누적')}\right]`,
  )],

  // Reinforcement learning: imitation, offline data, and world models
  [raw`\theta_{\mathrm{BC}}=\arg\min_\theta\;\mathbb E_{(s,a)\sim\mathcal D_E}\left[-\log\pi_\theta(a\mid s)\right]`, aligned(
    raw`${under(raw`\mathcal D_E`, 'expert demonstration 분포')}`,
    raw`${under(raw`c_\theta(s,a)`, '한 action의 NLL')}=${under(raw`-\log\pi_\theta(a\mid s)`, 'expert action 확률을 비용으로 변환')}`,
    raw`${under(raw`L_{\mathrm{BC}}(\theta)`, 'expert state의 평균 비용')}=${under(raw`\mathbb E_{(s,a)\sim\mathcal D_E}[c_\theta(s,a)]`, 'dataset 분포에서 평균')}`,
    raw`${under(raw`\theta_{\mathrm{BC}}`, '행동 복제 policy')}=${under(raw`\arg\min_\theta L_{\mathrm{BC}}(\theta)`, '평균 NLL이 최소인 파라미터')}`,
  )],
  [raw`\Pr(\text{한 번 이상 오류})=1-(1-\epsilon)^T\approx T\epsilon`, aligned(
    raw`${under(raw`p_{\mathrm{clean}}`, '모두 맞을 확률')}=${under(raw`(1-\epsilon)^T`, 'step별 무오류 확률을 곱함')}`,
    raw`${under(raw`p_{\mathrm{any}}`, '한 번 이상 틀릴 확률')}=${under(raw`1-p_{\mathrm{clean}}`, '전체에서 무오류를 제외')}`,
    raw`${under(raw`p_{\mathrm{any}}`, '작은 error의 근사')}\approx${under(raw`T\epsilon`, 'horizon과 one-step error의 곱')}`,
  )],
  [raw`\mathcal D_i=\{(s,\pi^*(s)):s\sim d_{\pi_i}\},\qquad \mathcal D\leftarrow\mathcal D\cup\mathcal D_i`, aligned(
    raw`${under(raw`s\sim d_{\pi_i}`, '현재 policy가 실제 방문한 state')};\quad${under(raw`\pi^*(s)`, '그 state에서 expert에게 받은 복구 action')}`,
    raw`${under(raw`\mathcal D_i`, '이번 iteration의 recovery 사례')}=${under(raw`\{(s,\pi^*(s))\}`, '방문 state와 expert label의 쌍')}`,
    raw`${under(raw`\mathcal D`, '다음 policy를 학습할 누적 data')}\leftarrow${under(raw`\mathcal D\cup\mathcal D_i`, '과거와 새 recovery 사례를 합침')}`,
  )],
  [raw`J(\widehat\pi_{\mathrm{BC}})\le J(\pi^*)+T^2\epsilon,\qquad J(\widehat\pi_{\mathrm{DAgger}})\le J(\pi^*)+uT\epsilon_N+O(1)`, aligned(
    raw`${under(raw`\Delta_{\mathrm{BC}}`, 'BC 추가 비용 항')}=${under(raw`T^2\epsilon`, 'expert 분포 error의 제곱 누적')}`,
    raw`${under(raw`\Delta_{\mathrm{DAgger}}`, 'DAgger 추가 비용 항')}=${under(raw`uT\epsilon_N`, 'learner 분포 error의 누적')}`,
    raw`${under(raw`J(\widehat\pi_{\mathrm{BC}})`, 'BC policy 비용')}\le${under(raw`J(\pi^*)+\Delta_{\mathrm{BC}}`, 'expert 비용과 BC 항')}`,
    raw`${under(raw`J(\widehat\pi_{\mathrm{DAgger}})`, 'DAgger policy 비용')}\le${under(raw`J(\pi^*)+\Delta_{\mathrm{DAgger}}+O(1)`, 'expert 비용과 DAgger 항')}`,
  )],
  [raw`\mathcal R_{\mathrm{CQL}}(Q)=\mathbb E_{s\sim\mathcal D}\!\left[\log\sum_a e^{Q(s,a)}-\mathbb E_{a\sim\widehat\pi_\beta(\cdot\mid s)}Q(s,a)\right]`, aligned(
    raw`${under(raw`Q_{\mathrm{cand}}(s)`, 'candidate의 soft maximum')}=${under(raw`\log\sum_a e^{Q(s,a)}`, '큰 Q에 민감한 집계')}`,
    raw`${under(raw`Q_{\mathrm{data}}(s)`, 'behavior action의 평균 Q')}=${under(raw`\mathbb E_{a\sim\widehat\pi_\beta}Q(s,a)`, 'dataset action으로 평균')}`,
    raw`${under(raw`g(s)`, 'state별 conservative gap')}=${under(raw`Q_{\mathrm{cand}}(s)-Q_{\mathrm{data}}(s)`, 'candidate와 data의 차이')}`,
    raw`${under(raw`\mathcal R_{\mathrm{CQL}}(Q)`, 'CQL regularizer')}=${under(raw`\mathbb E_{s\sim\mathcal D}[g(s)]`, 'dataset state에서 gap 평균')}`,
  )],
  [raw`\min_Q\;\alpha\mathcal R_{\mathrm{CQL}}(Q)+\frac12\mathbb E_{(s,a,s')\sim\mathcal D}\!\left[\left(Q(s,a)-\widehat{\mathcal B}^{\pi_k}\widehat Q_k(s,a)\right)^2\right]`, aligned(
    raw`${under(raw`L_{\mathrm{cons}}`, '보수적 간격 항')}=${under(raw`\alpha\mathcal R_{\mathrm{CQL}}(Q)`, 'gap에 강도 alpha를 적용')}`,
    raw`${under(raw`Y_{\mathcal D}`, 'dataset Bellman target')}=${under(raw`\widehat{\mathcal B}^{\pi_k}\widehat Q_k(s,a)`, '기록 transition으로 backup')}`,
    raw`${under(raw`\delta_{\mathcal B}`, 'offline Bellman 오차')}=${under(raw`Q(s,a)-Y_{\mathcal D}`, '현재 Q와 target의 차이')}`,
    raw`${under(raw`L_{\mathrm{Bellman}}`, 'transition 적합 항')}=${under(raw`\frac12\mathbb E_{\mathcal D}[\delta_{\mathcal B}^2]`, 'dataset에서 제곱 오차 평균')}`,
    raw`${under(raw`Q^*_{\mathrm{CQL}}`, '보수적 critic')}=${under(raw`\arg\min_Q[L_{\mathrm{cons}}+L_{\mathrm{Bellman}}]`, '두 항을 함께 최소화')}`,
  )],
  [raw`L_V(\psi)=\mathbb E_{(s,a)\sim\mathcal D}\!\left[L_2^\tau\!\left(\widehat Q(s,a)-V_\psi(s)\right)\right],\qquad L_2^\tau(u)=\left|\tau-\mathbf 1(u<0)\right|u^2`, aligned(
    raw`${under(raw`u`, 'dataset action의 residual')}=${under(raw`\widehat Q(s,a)-V_\psi(s)`, 'target Q에서 state value를 뺌')}`,
    raw`${under(raw`w_\tau(u)`, '부호별 비대칭 weight')}=${under(raw`|\tau-\mathbf 1(u<0)|`, '높은 Q 쪽을 강조')}`,
    raw`${under(raw`\ell_V(u)`, '한 sample의 expectile loss')}=${under(raw`w_\tau(u)u^2`, 'weighted squared residual')}`,
    raw`${under(raw`L_V(\psi)`, 'IQL value loss')}=${under(raw`\mathbb E_{(s,a)\sim\mathcal D}[\ell_V(u)]`, 'dataset action에서 평균')}`,
  )],
  [raw`\mathcal L_\pi(\theta)=-\mathbb E_{(s,a)\sim\mathcal D}\!\left[\exp\!\left(\beta(\widehat Q(s,a)-V_\psi(s))\right)\log\pi_\theta(a\mid s)\right]`, aligned(
    raw`${under(raw`A_{\mathcal D}(s,a)`, 'dataset action advantage')}=${under(raw`\widehat Q(s,a)-V_\psi(s)`, 'state 기준보다 좋은 정도')}`,
    raw`${under(raw`w(s,a)`, '복제 weight')}=${under(raw`\exp(\beta A_{\mathcal D}(s,a))`, '좋은 action을 더 강조')}`,
    raw`${under(raw`\ell_\pi(s,a)`, '한 sample의 actor loss')}=${under(raw`-w(s,a)\log\pi_\theta(a\mid s)`, 'weighted action NLL')}`,
    raw`${under(raw`\mathcal L_\pi(\theta)`, 'IQL actor loss')}=${under(raw`\mathbb E_{(s,a)\sim\mathcal D}[\ell_\pi(s,a)]`, 'dataset에서 평균')}`,
  )],
  [raw`\rho_i=\prod_{t=0}^{T_i}\frac{\pi(a_t^i\mid s_t^i)}{\pi_\beta(a_t^i\mid s_t^i)},\qquad \widehat V_{\mathrm{IS}}=\frac1N\sum_{i=1}^N\rho_iG_i,\qquad N_{\mathrm{eff}}=\frac{(\sum_i\rho_i)^2}{\sum_i\rho_i^2}`, aligned(
    raw`${under(raw`r_{it}`, '한 step의 확률비')}=${under(raw`\frac{\pi(a_t^i\mid s_t^i)}{\pi_\beta(a_t^i\mid s_t^i)}`, 'target 확률을 behavior로 나눔')}`,
    raw`${under(raw`\rho_i`, 'trajectory weight')}=${under(raw`\prod_{t=0}^{T_i}r_{it}`, 'step ratio를 끝까지 곱함')}`,
    raw`${under(raw`h_i`, '재가중 return')}=${under(raw`\rho_iG_i`, '관측 return에 weight 적용')}`,
    raw`${under(raw`\widehat V_{\mathrm{IS}}`, 'target return 추정')}=${under(raw`\frac1N\sum_{i=1}^Nh_i`, 'episode별 값을 평균')}`,
    raw`${under(raw`S_1`, 'weight 합')}=\sum_i\rho_i;\quad${under(raw`S_2`, '제곱 weight 합')}=\sum_i\rho_i^2`,
    raw`${under(raw`N_{\mathrm{eff}}`, '유효 표본 수')}=${under(raw`S_1^2/S_2`, 'weight 집중이 크면 감소')}`,
  )],
  [raw`\pi(a\mid s)>0\quad\Longrightarrow\quad\pi_\beta(a\mid s)>0`, aligned(
    raw`${under(raw`\pi(a\mid s)>0`, 'target policy가 선택할 수 있는 action')}`,
    raw`${under(raw`\pi_\beta(a\mid s)>0`, 'behavior log에도 반드시 존재할 확률 근거')}`,
    raw`${under(raw`\operatorname{supp}(\pi)\subseteq\operatorname{supp}(\pi_\beta)`, 'offline evaluation이 요구하는 support 포함 관계')}`,
  )],
  [raw`\widehat R_t=\sum_{t'=t}^{T}r_{t'},\qquad \tau=(\widehat R_1,s_1,a_1,\ldots,\widehat R_T,s_T,a_T)`, aligned(
    raw`${under(raw`\widehat R_t`, '현재부터 남은 return')}=${under(raw`\sum_{t'=t}^{T}r_{t'}`, '미래 reward를 hindsight로 합산')}`,
    raw`${under(raw`x_t`, '한 timestep의 token 묶음')}=${under(raw`(\widehat R_t,s_t,a_t)`, 'return·state·action 순서')}`,
    raw`${under(raw`\tau`, 'Transformer 입력 trajectory')}=${under(raw`(x_1,\ldots,x_T)`, 'timestep 묶음을 시간순 연결')}`,
  )],
  [raw`\widehat a_t=f_\theta(\widehat R_{t-K+1:t},s_{t-K+1:t},a_{t-K+1:t-1}),\qquad \mathcal L(\theta)=\frac1K\sum_t\|\widehat a_t-a_t\|_2^2`, aligned(
    raw`${under(raw`h_t^R`, 'return context')}=\widehat R_{t-K+1:t}`,
    raw`${under(raw`h_t^s`, 'state context')}=s_{t-K+1:t}`,
    raw`${under(raw`h_t^a`, '과거 action context')}=a_{t-K+1:t-1}`,
    raw`${under(raw`\widehat a_t`, '현재 action 예측')}=${under(raw`f_\theta(h_t^R,h_t^s,h_t^a)`, 'causal history로 조건화')}`,
    raw`${under(raw`\ell_t`, '한 timestep의 오차')}=${under(raw`\|\widehat a_t-a_t\|_2^2`, 'dataset action과 제곱 거리')}`,
    raw`${under(raw`\mathcal L(\theta)`, 'sequence action loss')}=${under(raw`\frac1K\sum_t\ell_t`, 'context timestep을 평균')}`,
  )],
  [raw`(\widehat r,\widehat s')=M_\psi(s,a),\qquad M_\psi\leftarrow\operatorname{fit}(s,a,r,s')`, aligned(
    raw`${under(raw`(\widehat r,\widehat s')`, 'planning에 쓸 가상 결과')}=${under(raw`M_\psi(s,a)`, 'learned dynamics가 action 결과를 생성')}`,
    raw`${under(raw`M_\psi`, '환경을 근사하는 model')}\leftarrow${under(raw`\operatorname{fit}(s,a,r,s')`, '실제 transition으로 model을 교정')}`,
  )],
  [raw`Q(s,a)\leftarrow Q(s,a)+\alpha\!\left[\widehat r+\gamma\max_{a'}Q(\widehat s',a')-Q(s,a)\right]`, aligned(
    raw`${under(raw`\widehat V`, '예측한 다음 가치')}=${under(raw`\max_{a'}Q(\widehat s',a')`, '예측 state에서 최선 선택')}`,
    raw`${under(raw`\widehat Y`, '가상 planning target')}=${under(raw`\widehat r`, '예측 보상')}+${under(raw`\gamma\widehat V`, '할인한 다음 가치')}`,
    raw`${under(raw`Q(s,a)`, '새 action value')}\leftarrow Q(s,a)+${under(raw`\alpha`, '반영률')}${under(raw`(\widehat Y-Q(s,a))`, '가상 TD 오차')}`,
  )],
  [raw`Q^{(n)}=\widehat y+\left(Q^{(0)}-\widehat y\right)(1-\alpha)^n`, aligned(
    raw`${under(raw`e_0`, 'planning 전 target 오차')}=${under(raw`Q^{(0)}-\widehat y`, '시작 value와 model target의 차이')}`,
    raw`${under(raw`e_n`, 'n번 뒤 남은 오차')}=${under(raw`e_0(1-\alpha)^n`, 'backup마다 1-alpha만큼 축소')}`,
    raw`${under(raw`Q^{(n)}`, 'n번 가상 backup 뒤 value')}=${under(raw`\widehat y+e_n`, 'model target에 남은 오차를 더함')}`,
  )],
  [raw`\Delta x_H=\frac12 bH^2,\qquad \frac{\Delta x_H}{\Delta x_1}=H^2`, aligned(
    raw`${under(raw`\Delta x_H`, 'H-step 뒤 위치 drift')}=${under(raw`\frac12 bH^2`, '일정 acceleration bias를 두 번 적분한 누적')}`,
    raw`${under(raw`\Delta x_1`, '한 step drift')}=${under(raw`\frac12 b`, 'H=1인 validation 오차')}`,
    raw`${under(raw`\Delta x_H/\Delta x_1`, '장기·단기 오차 비')}=${under(raw`H^2`, '이 단순 동역학에서 horizon 제곱으로 증폭')}`,
  )],
  [raw`z_t\sim q_\phi(z_t\mid x_t),\qquad z_{t+1}\sim p_\psi(z_{t+1}\mid a_t,z_t,h_t)`, aligned(
    raw`${under(raw`z_t\sim q_\phi(z_t\mid x_t)`, '현재 frame을 stochastic latent로 압축')}`,
    raw`${under(raw`z_{t+1}\sim p_\psi(z_{t+1}\mid a_t,z_t,h_t)`, 'action과 history에서 다음 latent 분포를 예측')}`,
  )],
  [raw`a_t=W_c[z_t;h_t]+b_c`, aligned(
    raw`${under(raw`u_t`, '장면·기억의 결합')}=${under(raw`W_c[z_t;h_t]`, '작은 선형 policy')}`,
    raw`${under(raw`a_t`, '환경에 보낼 action')}=${under(raw`u_t`, '결합한 신호')}+${under(raw`b_c`, 'action 기준점')}`,
  )],
  [raw`s^0=h_\theta(o_{1:t}),\qquad (r^k,s^k)=g_\theta(s^{k-1},a^k),\qquad (p^k,v^k)=f_\theta(s^k)`, aligned(
    raw`${under(raw`s^0`, '탐색 뿌리')}=${under(raw`h_\theta(o_{1:t})`, '관측 기록을 인코딩')}`,
    raw`${under(raw`y_g^k`, 'dynamics 출력')}=${under(raw`g_\theta(s^{k-1},a^k)`, '가상 action 한 단계')}`,
    raw`${under(raw`(r^k,s^k)`, '보상·다음 잠재')}=${under(raw`y_g^k`, '출력을 두 역할로 분리')}`,
    raw`${under(raw`(p^k,v^k)`, '탐색 prior·가치')}=${under(raw`f_\theta(s^k)`, 'node를 평가')}`,
  )],
  [raw`\ell_t(\theta)=\sum_{k=0}^{K}\!\left[\ell_r(u_{t+k},r_t^k)+\ell_v(z_{t+k},v_t^k)+\ell_p(\pi_{t+k},p_t^k)\right]+c\|\theta\|^2`, aligned(
    raw`${under(raw`L_r^k`, '보상 오차')}=${under(raw`\ell_r(u_{t+k},r_t^k)`, '실제·예측 보상 비교')}`,
    raw`${under(raw`L_v^k`, '가치 오차')}=${under(raw`\ell_v(z_{t+k},v_t^k)`, 'return·예측 가치 비교')}`,
    raw`${under(raw`L_p^k`, 'policy 오차')}=${under(raw`\ell_p(\pi_{t+k},p_t^k)`, 'MCTS·prior 비교')}`,
    raw`${under(raw`L_\Sigma`, '깊이 전체 오차')}=${under(raw`\sum_{k=0}^{K}(L_r^k+L_v^k+L_p^k)`, '세 target을 unroll마다 합산')}`,
    raw`${under(raw`\ell_t(\theta)`, '최종 학습 손실')}=${under(raw`L_\Sigma`, 'target 오차')}+${under(raw`c\|\theta\|^2`, '가중치 규제')}`,
  )],
  [raw`h_t=f_\phi(h_{t-1},z_{t-1},a_{t-1}),\quad z_t\sim q_\phi(z_t\mid h_t,x_t),\quad \widehat z_t\sim p_\phi(\widehat z_t\mid h_t)`, aligned(
    raw`${under(raw`u_t`, '직전 시간 정보')}=${under(raw`(h_{t-1},z_{t-1},a_{t-1})`, '기억·잠재·행동')}`,
    raw`${under(raw`h_t`, '결정적 memory')}=${under(raw`f_\phi(u_t)`, '시간 정보를 누적')}`,
    raw`${under(raw`z_t`, 'posterior 잠재')}\sim${under(raw`q_\phi(z_t\mid h_t,x_t)`, '실제 관측까지 사용')}`,
    raw`${under(raw`\widehat z_t`, 'prior 잠재')}\sim${under(raw`p_\phi(\widehat z_t\mid h_t)`, '관측 없이 상상')}`,
  )],
  [raw`R_t^\lambda=r_t+\gamma c_t\!\left[(1-\lambda)v_t+\lambda R_{t+1}^\lambda\right],\qquad R_T^\lambda=v_T`, aligned(
    raw`${under(raw`B_t`, '짧고 긴 미래를 섞은 target')}=${under(raw`(1-\lambda)v_t`, '지금 critic으로 끝내는 몫')}+${under(raw`\lambda R_{t+1}^\lambda`, '상상을 더 잇는 몫')}`,
    raw`${under(raw`R_t^\lambda`, '상상 trajectory의 return')}=${under(raw`r_t`, '예측한 현재 reward')}+${under(raw`\gamma c_t B_t`, '종료 전 미래 target을 할인')}`,
    raw`${under(raw`R_T^\lambda`, '상상 horizon의 끝값')}=${under(raw`v_T`, '끝 이후를 critic으로 연결')}`,
  )],
  [raw`\mathbb E[N]=Tp,\qquad \Pr(N\ge1)=1-(1-p)^T`, aligned(
    raw`${under(raw`\mathbb E[N]`, 'trajectory당 기대 위반 수')}=${under(raw`T`, '전체 step 수')}${under(raw`p`, 'step당 위반 확률')}`,
    raw`${under(raw`\Pr(N\ge1)`, '한 번 이상 위반할 확률')}=${under(raw`1-(1-p)^T`, '모든 step이 무사할 확률의 여집합')}`,
  )],
  [raw`\max_{\pi\in\Pi}J_R(\pi)\quad\text{s.t.}\quad J_{C_i}(\pi)\le d_i,\quad i=1,\ldots,m`, aligned(
    raw`${under(raw`\Pi_F`, '예산을 지키는 policy 집합')}=${under(raw`\{\pi\in\Pi:J_{C_i}(\pi)\le d_i,\ \forall i\}`, '각 expected cost를 제한')}`,
    raw`${under(raw`\pi^*`, '선택할 feasible policy')}=${under(raw`\arg\max_{\pi\in\Pi_F}J_R(\pi)`, '허용 집합 안에서 task return 최대화')}`,
  )],
  [raw`\mathcal L(\pi,\lambda)=J_R(\pi)-\sum_{i=1}^{m}\lambda_i\left(J_{C_i}(\pi)-d_i\right),\qquad \lambda_i\ge0`, aligned(
    raw`${under(raw`\mathcal L(\pi,\lambda)`, 'reward와 제약을 합친 목적')}=${under(raw`J_R(\pi)`, '높일 task return')}-${under(raw`\sum_i\lambda_i v_i`, 'budget 초과에 매긴 가격')}`,
    raw`${under(raw`v_i`, 'i번째 constraint 초과량')}=${under(raw`J_{C_i}(\pi)`, '현재 expected cost')}-${under(raw`d_i`, '허용 budget')}`,
    raw`${under(raw`\lambda_i\ge0`, '위반할수록 커지는 shadow price')}`,
  )],
  [raw`\max_{\Delta\theta}\;g^\top\Delta\theta\quad\text{s.t.}\quad c+b^\top\Delta\theta\le0,\qquad \frac12\Delta\theta^\top H\Delta\theta\le\delta`, aligned(
    raw`${under(raw`\max_{\Delta\theta}g^\top\Delta\theta`, 'local reward 개선이 가장 큰 update 선택')}`,
    raw`${under(raw`c+b^\top\Delta\theta`, '현재 cost와 update 뒤의 선형 변화')}\le${under(raw`0`, 'budget 안쪽')}`,
    raw`${under(raw`\frac12\Delta\theta^\top H\Delta\theta`, 'policy KL의 quadratic 근사')}\le${under(raw`\delta`, '한 번에 허용할 이동 크기')}`,
  )],
  [raw`J_C(\pi_{k+1})\le d+\frac{\sqrt{2\delta}\,\gamma\,\epsilon_C^{\pi_{k+1}}}{(1-\gamma)^2}`, aligned(
    raw`${under(raw`J_C(\pi_{k+1})`, '새 policy의 실제 expected cost')}\le${under(raw`d`, '목표 budget')}+\Delta_C`,
    raw`${under(raw`\Delta_C`, '근사 뒤 남는 최악 위반')}=${under(raw`\sqrt{2\delta}`, 'trust region 크기')}G_C`,
    raw`${under(raw`G_C`, '미래 cost의 민감도')}=${under(raw`\frac{\gamma\epsilon_C^{\pi_{k+1}}}{(1-\gamma)^2}`, 'discount와 cost advantage 규모')}`,
  )],
  [raw`\mathcal L_{\pi_B}(s_0,d)=\left\{L\ge0:\mathcal T_{\pi_B,C}[L](s)\le L(s),\quad L(s_0)\le d\right\}`, aligned(
    raw`${under(raw`\mathcal T_{\pi_B,C}[L](s)`, 'baseline의 한-step cost와 next budget')}\le${under(raw`L(s)`, '현재 state의 cost 상한')}`,
    raw`${under(raw`L(s_0)`, 'initial state의 cumulative cost 상한')}\le${under(raw`d`, '전체 safety budget')}`,
    raw`${under(raw`\mathcal L_{\pi_B}(s_0,d)`, '두 조건을 만족하는 Lyapunov 함수 집합')}`,
  )],
  [raw`\mathcal F_L(s)=\left\{\pi(\cdot\mid s):\mathcal T_{\pi,C}[L](s)\le L(s)\right\},\qquad L(s_0)\le d`, aligned(
    raw`${under(raw`B_L^\pi(s)`, 'candidate의 local backup')}=${under(raw`\mathcal T_{\pi,C}[L](s)`, '즉시 cost와 next budget')}`,
    raw`${under(raw`\mathcal F_L(s)`, 'state별 허용 policy')}=${under(raw`\{\pi:B_L^\pi(s)\le L(s)\}`, '현재 budget을 늘리지 않는 집합')}`,
    raw`${under(raw`L(s_0)`, 'initial cost 상한')}\le${under(raw`d`, 'global expected cost budget')}`,
  )],
  [raw`Q_{\mathrm{risk}}^\pi(s_t,a_t)=c_t+(1-c_t)\gamma_{\mathrm{risk}}\mathbb E_\pi\!\left[Q_{\mathrm{risk}}^\pi(s_{t+1},a_{t+1})\right]`, aligned(
    raw`${under(raw`B_t`, '다음 step부터의 평균 risk')}=${under(raw`\mathbb E_\pi[Q_{t+1}^{\mathrm{risk}}]`, '다음 action을 policy로 평균')}`,
    raw`${under(raw`Q_{t+1}^{\mathrm{risk}}`, '다음 state-action의 risk')}=Q_{\mathrm{risk}}^\pi(s_{t+1},a_{t+1})`,
    raw`${under(raw`F_t`, '안전 state에서 이어 붙일 미래')}=${under(raw`(1-c_t)`, 'violation이면 차단')}${under(raw`\gamma_{\mathrm{risk}}`, '먼 위험 할인')}B_t`,
    raw`${under(raw`Q_{\mathrm{risk}}^\pi(s_t,a_t)`, '현재 action 뒤의 전체 risk')}=${under(raw`c_t`, '지금의 violation')}+F_t`,
  )],
  [raw`a_t=\begin{cases}a_t^{\mathrm{task}},&Q_{\mathrm{risk}}(s_t,a_t^{\mathrm{task}})\le\epsilon_{\mathrm{risk}}\\a_t^{\mathrm{rec}},&Q_{\mathrm{risk}}(s_t,a_t^{\mathrm{task}})>\epsilon_{\mathrm{risk}}\end{cases}`, aligned(
    raw`${under(raw`Q_{\mathrm{risk}}(s_t,a_t^{\mathrm{task}})`, 'task action을 먼저 위험 평가')}\le${under(raw`\epsilon_{\mathrm{risk}}`, '허용 threshold')}\Rightarrow${under(raw`a_t=a_t^{\mathrm{task}}`, '제안 action 실행')}`,
    raw`Q_{\mathrm{risk}}(s_t,a_t^{\mathrm{task}})>\epsilon_{\mathrm{risk}}\Rightarrow${under(raw`a_t=a_t^{\mathrm{rec}}`, 'recovery가 actuator command를 대체')}`,
  )],
  [raw`m_{\mathrm{time}}=t_{\mathrm{TTC}}-\left(t_{\mathrm{detect}}+t_{\mathrm{handoff}}+t_{\mathrm{brake}}\right)`, aligned(
    raw`${under(raw`t_{\mathrm{need}}`, 'recovery에 필요한 전체 시간')}=${under(raw`t_{\mathrm{detect}}`, '위험 감지')}+${under(raw`t_{\mathrm{handoff}}`, 'policy 전환')}+${under(raw`t_{\mathrm{brake}}`, '물리 제동')}`,
    raw`${under(raw`m_{\mathrm{time}}`, '충돌 전 남는 여유')}=${under(raw`t_{\mathrm{TTC}}`, '현재 time to collision')}-${under(raw`t_{\mathrm{need}}`, '감지부터 제동까지 필요 시간')}`,
  )],

  // Robot dynamics and feedback control
  [raw`x_{t+1}=Ax_t+Bu_t+w_t`, aligned(
    raw`${under(raw`p_t`, 'model이 예측한 변화')}=${under(raw`Ax_t`, 'plant 자체 dynamics')}+${under(raw`Bu_t`, 'actuator 영향')}`,
    raw`${under(raw`x_{t+1}`, '실제 next state')}=${under(raw`p_t`, 'model prediction')}+${under(raw`w_t`, 'process disturbance')}`,
  )],
  [raw`y_t=Cx_t+v_t`, raw`${under(raw`y_t`, 'sensor가 낸 observation')}=${under(raw`Cx_t`, 'state를 측정 공간으로 투영')}+${under(raw`v_t`, 'measurement noise')}`],
  [raw`u_t=-Kx_t`, raw`${under(raw`u_t`, 'plant에 요구할 control input')}=-${under(raw`K`, 'state별 feedback gain')}${under(raw`x_t`, '현재 state error')}`],
  [raw`x_{t+1}=(A-BK)x_t`, raw`${under(raw`x_{t+1}`, 'feedback 뒤 next state')}=${under(raw`(A-BK)`, 'controller를 포함한 closed-loop dynamics')}${under(raw`x_t`, '현재 state')}`],
  [raw`\mathcal C=[B\;\;AB\;\;\cdots\;\;A^{n-1}B],\qquad \operatorname{rank}(\mathcal C)=n`, aligned(
    raw`${under(raw`\mathcal C`, 'actuator가 닿는 state 방향')}=[${under(raw`B`, '한 step의 영향')}\;${under(raw`AB,\ldots,A^{n-1}B`, 'dynamics를 거친 미래 영향')}]`,
    raw`${under(raw`\operatorname{rank}(\mathcal C)=n`, '모든 n개 state 방향을 독립적으로 제어 가능')}`,
  )],
  [raw`\mathcal O=\begin{bmatrix}C\\CA\\\vdots\\CA^{n-1}\end{bmatrix},\qquad \operatorname{rank}(\mathcal O)=n`, aligned(
    raw`${under(raw`\mathcal O`, 'sensor history에 드러나는 state 방향')}=\begin{bmatrix}${under(raw`C`, '현재 관측')}\\${under(raw`CA,\ldots,CA^{n-1}`, 'dynamics 뒤의 미래 관측')}\end{bmatrix}`,
    raw`${under(raw`\operatorname{rank}(\mathcal O)=n`, '모든 n개 state 방향을 서로 구분 가능')}`,
  )],
  [raw`u(t)=K_Pe(t)+K_I\int_0^t e(\tau)\,d\tau+K_D\frac{de(t)}{dt}`, aligned(
    raw`${under(raw`u(t)`, '현재 control command')}=${under(raw`K_Pe(t)`, '지금의 오차에 반응')}+${under(raw`K_I\int_0^t e(\tau)d\tau`, '오래 남은 bias를 누적')}`,
    raw`\qquad+${under(raw`K_D\frac{de(t)}{dt}`, '오차 변화 추세로 진동을 감쇠')}`,
  )],
  [raw`J=x_N^\top Q_Nx_N+\sum_{t=0}^{N-1}\left(x_t^\top Qx_t+u_t^\top Ru_t\right)`, aligned(
    raw`${under(raw`J`, 'horizon 전체 control 비용')}=${under(raw`x_N^\top Q_Nx_N`, '마지막 state 오차의 가격')}`,
    raw`\qquad+\sum_{t=0}^{N-1}\left(${under(raw`x_t^\top Qx_t`, '진행 중 state deviation')}+${under(raw`u_t^\top Ru_t`, 'actuator effort')}\right)`,
  )],
  [raw`P_t=Q+A^\top P_{t+1}A-A^\top P_{t+1}B(R+B^\top P_{t+1}B)^{-1}B^\top P_{t+1}A`, aligned(
    raw`${under(raw`G_t=R+B^\top P_{t+1}B`, 'action의 전체 가격')}`,
    raw`${under(raw`P_t`, '현재 cost-to-go')}=${under(raw`Q+A^\top P_{t+1}A`, 'action 전 비용')}`,
    raw`\qquad-${under(raw`A^\top P_{t+1}BG_t^{-1}B^\top P_{t+1}A`, '최적 action의 절감분')}`,
  )],
  [raw`K_t=(R+B^\top P_{t+1}B)^{-1}B^\top P_{t+1}A`, aligned(
    raw`${under(raw`G_t`, 'action의 전체 가격')}=${under(raw`R+B^\top P_{t+1}B`, '현재 effort와 미래 영향')}`,
    raw`${under(raw`K_t`, 'optimal feedback gain')}=${under(raw`G_t^{-1}`, '전체 가격의 inverse')}${under(raw`B^\top P_{t+1}A`, 'state-to-input 민감도')}`,
  )],
  [raw`\min_{u_{0:N-1}}\;\ell_f(x_N)+\sum_{k=0}^{N-1}\ell(x_k,u_k)\quad\text{s.t.}\quad x_{k+1}=f(x_k,u_k),\;x_k\in\mathcal X,\;u_k\in\mathcal U`, aligned(
    raw`${under(raw`\min_{u_{0:N-1}}`, '미래 action sequence를 선택')}\;${under(raw`\ell_f(x_N)+\sum_{k=0}^{N-1}\ell(x_k,u_k)`, 'terminal과 stage cost 최소화')}`,
    raw`${under(raw`x_{k+1}=f(x_k,u_k)`, 'prediction dynamics를 만족')},\quad${under(raw`x_k\in\mathcal X`, 'state 제약')},\quad${under(raw`u_k\in\mathcal U`, 'actuator 제약')}`,
  )],
  [raw`u_t=u_{0\mid t}^{*},\qquad \text{then measure }x_{t+1}\text{ and solve again}`, aligned(
    raw`${under(raw`u_t=u_{0\mid t}^{*}`, '현재 plan의 첫 action만 실행')}`,
    raw`${under(raw`\text{measure }x_{t+1}`, '실제 결과를 다시 관측')}\;\longrightarrow\;${under(raw`\text{solve again}`, '새 state에서 horizon을 다시 최적화')}`,
  )],
  [raw`\widehat x_{t+1}=A\widehat x_t+Bu_t+L(y_t-C\widehat x_t),\qquad u_t=-K\widehat x_t`, aligned(
    raw`${under(raw`\widehat x_{t+1}`, '다음 state 추정')}=${under(raw`A\widehat x_t+Bu_t`, 'model prediction')}`,
    raw`\qquad+${under(raw`L(y_t-C\widehat x_t)`, 'sensor 오차로 보정')}`,
    raw`${under(raw`u_t=-K\widehat x_t`, '추정 state로 feedback')}`,
  )],
  [raw`\dot x(t)=F(t)x(t)+G(t)u(t)`, raw`${under(raw`\dot x(t)`, 'state의 시간 변화율')}=${under(raw`F(t)x(t)`, 'plant의 자체 dynamics')}+${under(raw`G(t)u(t)`, 'control input의 영향')}`],
  [raw`W_c(t_0,t_1)=\int_{t_0}^{t_1}\Phi(t_1,\tau)G(\tau)G(\tau)^\top\Phi(t_1,\tau)^\top d\tau`, aligned(
    raw`${under(raw`M(\tau)`, 'tau의 input이 final state에 남기는 영향')}=${under(raw`\Phi(t_1,\tau)G(\tau)`, 'input direction을 t1까지 전파')}`,
    raw`${under(raw`W_c(t_0,t_1)`, 'interval의 controllability Gramian')}=${under(raw`\int_{t_0}^{t_1}M(\tau)M(\tau)^\top d\tau`, '모든 시점의 control direction을 누적')}`,
  )],
  [raw`J=x(t_1)^\top Sx(t_1)+\int_{t_0}^{t_1}\left(x^\top Qx+u^\top Ru\right)dt`, aligned(
    raw`${under(raw`J`, '전체 transient control 비용')}=${under(raw`x(t_1)^\top Sx(t_1)`, 'terminal state 오차의 가격')}`,
    raw`\qquad+\int_{t_0}^{t_1}\left(${under(raw`x^\top Qx`, 'state deviation')}+${under(raw`u^\top Ru`, 'control effort')}\right)dt`,
  )],
  [raw`-\dot P=F^\top P+PF-PGR^{-1}G^\top P+Q`, aligned(
    raw`${under(raw`-\dot P`, 'terminal에서 현재로 접는 cost 변화')}=${under(raw`F^\top P+PF+Q`, '그대로 진행할 state 비용')}`,
    raw`\qquad-${under(raw`PGR^{-1}G^\top P`, 'optimal input으로 줄이는 future 비용')}`,
  )],
  [raw`u^*(t)=-R^{-1}G(t)^\top P(t)x(t)`, aligned(
    raw`${under(raw`K(t)`, 'Riccati feedback gain')}=${under(raw`R^{-1}`, 'input 가격의 inverse')}${under(raw`G(t)^\top P(t)`, 'future cost를 input 방향으로 투영')}`,
    raw`${under(raw`u^*(t)`, 'LQ 문제의 optimal input')}=-${under(raw`K(t)`, '계산한 feedback gain')}${under(raw`x(t)`, 'current full state')}`,
  )],
  [raw`x_{k+1}=f(x_k,u_k),\qquad x_k\in\mathcal X,\quad u_k\in\mathcal U`, aligned(
    raw`${under(raw`x_{k+1}=f(x_k,u_k)`, 'prediction model을 따르는 next state')}`,
    raw`${under(raw`x_k\in\mathcal X`, '허용 state 안에 유지')},\qquad${under(raw`u_k\in\mathcal U`, 'actuator limit 안에 유지')}`,
  )],
  [raw`V_f(f(x,k_f(x)))-V_f(x)\le-\ell(x,k_f(x))`, aligned(
    raw`${under(raw`V_f(f(x,k_f(x)))-V_f(x)`, 'terminal controller 한 step 뒤 value 변화')}`,
    raw`\le-${under(raw`\ell(x,k_f(x))`, '현재 stage cost만큼 반드시 감소')}`,
  )],

  // Robot kinematics and coordinate frames
  ['R^\\top R=I,\\qquad \\det(R)=+1', aligned(
    under('R^\\top R=I', '축 길이와 직교성을 보존'),
    under('\\det(R)=+1', '반사가 아닌 오른손 회전'),
  )],
  ['p_a=R_{ab}p_b+t_{ab}', aligned(
    under('p_a', 'frame a에서 본 같은 점'),
    under('R_{ab}p_b', 'b축 성분을 a축으로 회전'),
    under('t_{ab}', 'b 원점의 위치를 더함'),
  )],
  ['T_{ab}=\\begin{bmatrix}R_{ab}&t_{ab}\\\\0&1\\end{bmatrix},\\qquad \\bar p_a=T_{ab}\\bar p_b', aligned(
    under('R_{ab}', '축 방향 변환'),
    under('t_{ab}', 'b 원점의 위치'),
    under('\\bar p_a=T_{ab}\\bar p_b', '회전과 이동을 한 행렬곱으로 적용'),
  )],
  ['T_{ac}=T_{ab}T_{bc}', aligned(
    under('T_{bc}', 'c 좌표를 b로 먼저 이동'),
    under('T_{ab}', 'b 좌표를 a로 이동'),
    under('T_{ac}', 'c에서 a로 가는 합성 변환'),
  )],
  ['T_{ab}^{-1}=\\begin{bmatrix}R_{ab}^{\\top}&-R_{ab}^{\\top}t_{ab}\\\\0&1\\end{bmatrix}', aligned(
    under('R_{ab}^{\\top}', '회전 방향을 되돌림'),
    under('-R_{ab}^{\\top}t_{ab}', '이동도 되돌린 축에서 재표현'),
  )],
  ['\\begin{aligned}x&=l_1\\cos q_1+l_2\\cos(q_1+q_2)\\\\y&=l_1\\sin q_1+l_2\\sin(q_1+q_2)\\end{aligned}', aligned(
    under('(l_1\\cos q_1,\\,l_1\\sin q_1)', '첫 link의 base-frame 벡터'),
    under('(l_2\\cos(q_1+q_2),\\,l_2\\sin(q_1+q_2))', '둘째 link의 누적 회전 벡터'),
    under('(x,y)', '두 link 벡터를 더한 tool 위치'),
  )],
  ['T(q)=e^{[S_1]q_1}e^{[S_2]q_2}\\cdots e^{[S_n]q_n}M', aligned(
    under('M', 'zero configuration의 tool pose'),
    under('e^{[S_1]q_1}\\cdots e^{[S_n]q_n}', 'joint screw motion을 순서대로 합성'),
    under('T(q)', '현재 joint configuration의 tool pose'),
  )],
  ['|l_1-l_2|\\le\\sqrt{x_d^2+y_d^2}\\le l_1+l_2', aligned(
    under('|l_1-l_2|', '접힌 arm의 최소 도달 반경'),
    under('\\sqrt{x_d^2+y_d^2}', 'base에서 target까지 거리'),
    under('l_1+l_2', '편 arm의 최대 도달 반경'),
  )],
  ['\\cos q_2=\\frac{x_d^2+y_d^2-l_1^2-l_2^2}{2l_1l_2}', aligned(
    under('x_d^2+y_d^2', 'target 거리의 제곱'),
    under('\\cos q_2', 'elbow 각의 두 대칭 해를 결정'),
    under('2l_1l_2', '두 link 길이로 정규화'),
  )],
  ['q_{k+1}=q_k+\\alpha J(q_k)^{\\dagger}e_k', aligned(
    under('e_k', '현재 tool pose와 target의 오차'),
    under('J(q_k)^{\\dagger}e_k', 'task 오차를 joint correction으로 변환'),
    under('\\alpha', '한 iteration의 step 크기'),
    under('q_{k+1}', '수정된 joint configuration'),
  )],
  ['\\dot x=J(q)\\dot q,\\qquad J_{ij}=\\frac{\\partial x_i}{\\partial q_j}', aligned(
    under('J_{ij}', 'joint j가 task 좌표 i에 미치는 국소 민감도'),
    under('\\dot q', 'joint 순간 속도'),
    under('\\dot x', 'tool의 순간 속도'),
  )],
  ['J=U\\Sigma V^\\top', aligned(
    under('V^\\top', 'joint 속도를 주방향으로 분해'),
    under('\\Sigma', '방향별 속도 증폭률'),
    under('U', 'task-space 주방향으로 회전'),
  )],
  ['\\dot q^{\\dagger}=J^{\\dagger}v_d', aligned(
    under('v_d', '요청한 task-space 속도'),
    under('J^{\\dagger}', '도달 가능한 성분의 최소-norm inverse'),
    under('\\dot q^{\\dagger}', '필요한 joint 속도 명령'),
  )],
  ['\\dot q_{DLS}=J^\\top(JJ^\\top+\\lambda^2I)^{-1}v_d', aligned(
    under('v_d', '요청한 tool 속도'),
    under('(JJ^\\top+\\lambda^2I)^{-1}', '작은 singular direction의 inverse gain을 제한'),
    under('J^\\top', '보정된 task 성분을 joint 방향으로 되돌림'),
    under('\\dot q_{DLS}', '오차를 허용한 bounded joint 속도'),
  )],

  // Foundational papers: robot kinematics
  ['T_0^n(q)=T_0^1(q_1)T_1^2(q_2)\\cdots T_{n-1}^n(q_n)', aligned(
    under('T_{i-1}^i(q_i)', '인접한 두 link frame의 변환'),
    under('T_0^1T_1^2\\cdots T_{n-1}^n', 'mechanism 순서대로 합성'),
    under('T_0^n(q)', 'base에서 tool까지의 pose'),
  )],
  ['T_{i-1}^i=R_x(\\alpha_{i-1})D_x(a_{i-1})D_z(d_i)R_z(\\theta_i)', aligned(
    under('R_x(\\alpha_{i-1})', 'joint axis 사이의 twist'),
    under('D_x(a_{i-1})', 'common normal 길이만큼 이동'),
    under('D_z(d_i)', 'joint axis 방향 offset'),
    under('R_z(\\theta_i)', 'joint axis 주위 회전'),
  )],
  ['\\begin{aligned}q_i&=\\theta_i&&\\text{revolute joint}\\\\q_i&=d_i&&\\text{prismatic joint}\\end{aligned}', aligned(
    under('q_i=\\theta_i', '회전 관절은 각도가 runtime 변수'),
    under('q_i=d_i', '직선 관절은 이동량이 runtime 변수'),
  )],
  ['T_{i-1}^i\\in SE(3),\\qquad T_0^n\\in SE(3)', aligned(
    under('T_{i-1}^i\\in SE(3)', '각 link 변환이 rigid motion'),
    under('T_0^n\\in SE(3)', '전체 합성도 rigid motion'),
  )],
  ['S=J(\\theta)\\dot\\theta', aligned(
    under('\\dot\\theta', '동시에 움직이는 joint rates'),
    under('J(\\theta)', '현재 자세의 local kinematic map'),
    under('S', 'hand 좌표계의 병진·회전 속도'),
  )],
  ['\\dot\\theta=J(\\theta)^{-1}S', aligned(
    under('S', 'operator가 요청한 hand rate'),
    under('J(\\theta)^{-1}', 'nonsingular square map을 역변환'),
    under('\\dot\\theta', 'joint servo에 보낼 협응 속도'),
  )],
  ['\\dot\\phi=M_2\\dot\\theta=M_2J^{-1}S', aligned(
    under('J^{-1}S', 'task rate를 joint rate로 변환'),
    under('M_2', 'gear와 linkage의 motor-joint 변환'),
    under('\\dot\\phi', '실제 motor shaft 속도'),
  )],
  ['\\min_{\\dot\\theta}\\frac12\\dot\\theta^\\top A\\dot\\theta\\quad\\text{s.t.}\\quad J\\dot\\theta=S', aligned(
    under('J\\dot\\theta=S', '요청한 task rate는 반드시 만족'),
    under('\\frac12\\dot\\theta^\\top A\\dot\\theta', '남는 자유도에서 weighted joint motion 최소화'),
  )],
  ['\\dot\\theta=A^{-1}J^\\top(JA^{-1}J^\\top)^{-1}S', aligned(
    under('S', '요청한 task rate'),
    under('(JA^{-1}J^\\top)^{-1}', 'task 방향의 weighted coupling을 해소'),
    under('A^{-1}J^\\top', 'joint 선호도를 반영해 역투영'),
    under('\\dot\\theta', 'weighted minimum-motion solution'),
  )],

  // Reinforcement learning: partial observability and state estimation
  [raw`s_t\not\equiv o_t,\qquad h_t=(o_1,a_1,o_2,a_2,\ldots,o_t)`, aligned(
    raw`${under(raw`s_t`, '미래를 결정하는 latent state')}\not\equiv${under(raw`o_t`, 'sensor가 낸 현재 observation')}`,
    raw`${under(raw`h_t`, '현재까지 모은 evidence')}=${under(raw`(o_1,a_1,o_2,a_2,\ldots,o_t)`, '관측과 개입의 시간 순서')}`,
  )],
  [raw`\mathcal P=\langle\mathcal S,\mathcal A,T,R,\Omega,O,\gamma,b_0\rangle`, aligned(
    raw`${under(raw`\mathcal P`, '부분 관측 의사결정 문제')}=\langle${under(raw`\mathcal S,\mathcal A`, 'latent state와 action')},${under(raw`T,R`, 'dynamics와 reward')},` ,
    raw`${under(raw`\Omega,O`, 'observation 공간과 sensor likelihood')},${under(raw`\gamma,b_0`, 'discount와 initial belief')}\rangle`,
  )],
  [raw`\begin{aligned}\bar b_{t+1}(s')&=\sum_s T(s,a_t,s')b_t(s)\\m_{t+1}(s')&=O(s',a_t,o_{t+1})\bar b_{t+1}(s')\\Z_{t+1}&=\sum_{s'}m_{t+1}(s'),\qquad b_{t+1}(s')=\frac{m_{t+1}(s')}{Z_{t+1}}\end{aligned}`, aligned(
    raw`${under(raw`\bar b_{t+1}(s')`, '관측 전 next-state prior')}=${under(raw`\sum_s T(s,a_t,s')b_t(s)`, 'action과 dynamics로 belief mass 이동')}`,
    raw`${under(raw`m_{t+1}(s')`, 'observation을 반영한 mass')}=${under(raw`O(s',a_t,o_{t+1})`, 'state별 sensor likelihood')}${under(raw`\bar b_{t+1}(s')`, 'predicted prior')}`,
    raw`${under(raw`Z_{t+1}`, '관측 evidence')}=${under(raw`\sum_{s'}m_{t+1}(s')`, '모든 candidate mass의 합')}`,
    raw`${under(raw`b_{t+1}(s')`, '정규화한 posterior')}=\frac{${under(raw`m_{t+1}(s')`, 'state별 mass')}}{${under(raw`Z_{t+1}`, '전체 evidence')}}`,
  )],
  [raw`\begin{aligned}r(b,a)&=\sum_s b(s)R(s,a)\\Q^*(b,a)&=r(b,a)+\gamma\sum_oP(o\mid b,a)V^*(\tau(b,a,o))\\\pi^*(b)&=\arg\max_a Q^*(b,a)\end{aligned}`, aligned(
    raw`${under(raw`r(b,a)`, 'belief의 즉시 reward')}=${under(raw`\sum_s b(s)R(s,a)`, 'latent state별 reward를 belief로 평균')}`,
    raw`${under(raw`I_a`, '관측 뒤 미래 가치')}=${under(raw`\sum_oP(o\mid b,a)V^*(\tau(b,a,o))`, '가능한 signal branch를 확률 평균')}`,
    raw`${under(raw`Q^*(b,a)`, 'belief-action 장기 가치')}=${under(raw`r(b,a)`, '즉시 가치')}+\gamma${under(raw`I_a`, '정보가 바꾼 미래 가치')}`,
    raw`${under(raw`\pi^*(b)`, 'belief에서의 최적 행동')}=${under(raw`\arg\max_a Q^*(b,a)`, '장기 가치가 가장 큰 action 선택')}`,
  )],
  [raw`\widehat x_k^-=F_k\widehat x_{k-1}+B_ku_{k-1},\qquad P_k^-=F_kP_{k-1}F_k^\top+Q_k`, aligned(
    raw`${under(raw`d_k`, 'dynamics가 옮긴 mean')}=${under(raw`F_k\widehat x_{k-1}`, '이전 estimate를 state transition으로 이동')}`,
    raw`${under(raw`c_k`, 'control이 더한 mean')}=${under(raw`B_ku_{k-1}`, '직전 actuator input의 영향')}`,
    raw`${under(raw`\widehat x_k^-`, 'sensor 전 state 예측')}=${under(raw`d_k+c_k`, 'dynamics와 control 몫을 합산')}`,
    raw`${under(raw`P_k^{dyn}`, '전파한 이전 uncertainty')}=${under(raw`F_kP_{k-1}F_k^\top`, 'covariance를 dynamics로 이동')}`,
    raw`${under(raw`P_k^-`, 'prediction error covariance')}=${under(raw`P_k^{dyn}+Q_k`, '전파분에 process noise 추가')}`,
  )],
  [raw`\widehat x_k^-=F_k\widehat x_{k-1}+B_ku_{k-1}`, raw`${under(raw`\widehat x_k^-`, 'sensor 전 state 예측')}=${under(raw`F_k\widehat x_{k-1}`, '이전 estimate를 dynamics로 이동')}+${under(raw`B_ku_{k-1}`, 'control input의 영향')}`],
  [raw`P_k^-=F_kP_{k-1}F_k^\top+Q_k`, raw`${under(raw`P_k^-`, 'prior covariance')}=${under(raw`F_kP_{k-1}F_k^\top`, '이전 covariance 전파')}+${under(raw`Q_k`, 'process noise')}`],
  [raw`S_k=H_kP_k^-H_k^\top+R_k`, aligned(
    raw`${under(raw`P_k^z`, '예측 measurement covariance')}=${under(raw`H_kP_k^-H_k^\top`, 'state uncertainty를 sensor 공간으로 이동')}`,
    raw`${under(raw`S_k`, 'innovation의 불확실성')}=${under(raw`P_k^z+R_k`, '예측분과 sensor noise를 합산')}`,
  )],
  [raw`K_k=P_k^-H_k^\top S_k^{-1}`, aligned(
    raw`${under(raw`C_k`, 'state-measurement 연결')}=${under(raw`P_k^-H_k^\top`, 'prior covariance를 sensor 방향으로 투영')}`,
    raw`${under(raw`K_k`, 'model과 sensor의 신뢰 배분')}=${under(raw`C_kS_k^{-1}`, 'innovation uncertainty로 direction별 정규화')}`,
  )],
  [raw`\widehat x_k=\widehat x_k^-+K_k(z_k-H_k\widehat x_k^-),\qquad P_k=(I-K_kH_k)P_k^-`, aligned(
    raw`${under(raw`\nu_k`, 'sensor innovation')}=${under(raw`z_k-H_k\widehat x_k^-`, '실제와 예측 measurement의 차이')}`,
    raw`${under(raw`\widehat x_k`, '보정된 state estimate')}=${under(raw`\widehat x_k^-+K_k\nu_k`, 'innovation을 gain만큼 mean에 반영')}`,
    raw`${under(raw`G_k`, '남은 uncertainty operator')}=${under(raw`I-K_kH_k`, '관측이 설명한 direction을 제거')}`,
    raw`${under(raw`P_k`, '보정 뒤 covariance')}=${under(raw`G_kP_k^-`, 'prediction covariance에 남은 몫 적용')}`,
  )],
  [raw`\nu_k=z_k-H_k\widehat x_k^-,\qquad \operatorname{NIS}_k=\nu_k^\top S_k^{-1}\nu_k`, aligned(
    raw`${under(raw`\nu_k`, 'sensor innovation')}=${under(raw`z_k`, '실제 measurement')}-${under(raw`H_k\widehat x_k^-`, '예측한 measurement')}`,
    raw`${under(raw`\operatorname{NIS}_k`, '정규화 innovation 크기')}=${under(raw`\nu_k^\top S_k^{-1}\nu_k`, '예상 covariance로 residual을 whiten')}`,
  )],
  [raw`\widehat x_k=\widehat x_k^-+K_k(z_k-H_k\widehat x_k^-)`, raw`${under(raw`\widehat x_k`, 'posterior mean')}=${under(raw`\widehat x_k^-`, 'prior mean')}+${under(raw`K_k`, 'gain')}${under(raw`(z_k-H_k\widehat x_k^-)`, 'innovation')}`],
  [raw`P_k=(I-K_kH_k)P_k^-`, raw`${under(raw`P_k`, '보정 뒤 covariance')}=${under(raw`(I-K_kH_k)`, '관측이 설명한 uncertainty를 제거')}${under(raw`P_k^-`, '보정 전 covariance')}`],
  [raw`h_t=f_\theta(h_{t-1},o_t,a_{t-1})`, raw`${under(raw`h_t`, 'learned state')}=${under(raw`f_\theta`, 'recurrent update')}(${under(raw`h_{t-1}`, '이전 memory')},${under(raw`o_t,a_{t-1}`, '관측과 직전 action')})`],
  [raw`a_t\sim\pi_\theta(\cdot\mid h_t)`, raw`${under(raw`a_t`, '실행할 action')}\sim${under(raw`\pi_\theta(\cdot\mid h_t)`, 'learned history state의 policy')}`],
  [raw`\begin{aligned}h_B&=\operatorname{stopgrad}(\operatorname{Unroll}_{0:B}(h_0,o,a))\\\mathcal L_{seq}&=\frac{\sum_{t=B}^{B+U-1}m_t\left(Q_\theta(h_t,a_t)-Y_t\right)^2}{\sum_{t=B}^{B+U-1}m_t}\end{aligned}`, aligned(
    raw`${under(raw`h_B`, 'training 시작 hidden state')}=${under(raw`\operatorname{stopgrad}(\operatorname{Unroll}_{0:B})`, 'burn-in history로 복원하되 gradient 차단')}`,
    raw`${under(raw`e_t`, 'valid step의 TD residual')}=${under(raw`Q_\theta(h_t,a_t)-Y_t`, 'recurrent prediction과 target 차이')}`,
    raw`${under(raw`\mathcal L_{seq}`, 'masked sequence loss')}=\frac{${under(raw`\sum_{t=B}^{B+U-1}m_te_t^2`, 'unroll 안 valid error 합')}}{${under(raw`\sum_{t=B}^{B+U-1}m_t`, 'padding을 뺀 step 수')}}`,
  )],
  [raw`V_t(b)=\max_{p\in\mathcal P_t}V_p(b)=\max_{p\in\mathcal P_t}\sum_s b(s)\alpha_p(s)`, aligned(
    raw`${under(raw`V_p(b)`, 'policy tree p의 belief value')}=${under(raw`\sum_s b(s)\alpha_p(s)`, 'state별 return을 belief로 평균한 linear function')}`,
    raw`${under(raw`V_t(b)`, '남은 t step의 optimal value')}=${under(raw`\max_{p\in\mathcal P_t}V_p(b)`, '모든 conditional policy tree의 upper surface')}`,
  )],
  [raw`h_t=\operatorname{LSTM}_\theta(\phi(o_t),h_{t-1})`, raw`${under(raw`h_t`, 'recurrent state')}=${under(raw`\operatorname{LSTM}_\theta`, 'LSTM update')}(${under(raw`\phi(o_t)`, 'frame feature')},${under(raw`h_{t-1}`, 'previous state')})`],
  [raw`Q_\theta(h_t,a_t)=w_{a_t}^\top h_t+b_{a_t}`, raw`${under(raw`Q_\theta(h_t,a_t)`, 'memory에서 action value 예측')}=${under(raw`w_{a_t}^\top h_t+b_{a_t}`, 'chosen action head의 readout')}`],
  [raw`Y_t=r_{t+1}+\gamma(1-d_t)\max_{a'}Q_{\theta^-}(h_{t+1},a')`, aligned(
    raw`${under(raw`Y_t`, 'recurrent TD target')}=${under(raw`r_{t+1}`, '즉시 reward')}+${under(raw`\gamma(1-d_t)`, 'terminal 밖 미래만 할인')}`,
    raw`\qquad\times${under(raw`\max_{a'}Q_{\theta^-}(h_{t+1},a')`, 'target DRQN의 next value')}`,
  )],
  [raw`\mathcal L=\frac1L\sum_{t=1}^{L}\left(Q_\theta(h_t,a_t)-Y_t\right)^2`, raw`${under(raw`\mathcal L`, 'sequence Q loss')}=${under(raw`\frac1L\sum_{t=1}^{L}`, 'valid timestep을 평균')}${under(raw`(Q_\theta(h_t,a_t)-Y_t)^2`, 'timestep별 TD error')}`],

  // Robot motion planning
  [raw`\mathcal C_{obs}=\{q\in\mathcal C\mid R(q)\cap O\neq\varnothing\},\qquad \mathcal C_{free}=\mathcal C\setminus\mathcal C_{obs}`, aligned(
    raw`${under(raw`\mathcal C_{obs}`, '충돌 자세 집합')}=\left\{${under(raw`q\in\mathcal C`, '가능한 자세')}\;\middle|\right.`,
    raw`\left.\qquad${under(raw`R(q)\cap O\neq\varnothing`, 'robot과 obstacle이 겹침')}\right\}`,
    raw`${under(raw`\mathcal C_{free}`, 'planner의 허용 영역')}=${under(raw`\mathcal C`, '전체 자세 공간')}\setminus${under(raw`\mathcal C_{obs}`, '금지 영역')}`,
  )],
  [raw`d_{S^1}(\theta_a,\theta_b)=\min_{k\in\mathbb Z}|\theta_a-\theta_b+2\pi k|`, aligned(
    raw`${under(raw`d_{S^1}(\theta_a,\theta_b)`, '회전 joint의 최단 거리')}`,
    raw`=${under(raw`\min_{k\in\mathbb Z}`, '모든 2π wrap 중 최소 선택')}\left|${under(raw`\theta_a-\theta_b+2\pi k`, '같은 각도의 여러 숫자 표현')}\right|`,
  )],
  [raw`\operatorname{MotionValid}(q_a,q_b)=\bigwedge_{s\in[0,1]}\operatorname{StateValid}((1-s)q_a+s q_b)`, aligned(
    raw`${under(raw`\operatorname{MotionValid}(q_a,q_b)`, 'edge 전체의 유효성')}`,
    raw`=${under(raw`\bigwedge_{s\in[0,1]}`, '중간 모든 지점을 검사')}${under(raw`\operatorname{StateValid}((1-s)q_a+s q_b)`, '보간 자세마다 collision과 limit 확인')}`,
  )],
  [raw`f(n)=g(n)+h(n),\qquad 0\le h(n)\le h^*(n)`, aligned(
    raw`${under(raw`f(n)`, 'A*의 확장 우선순위')}=${under(raw`g(n)`, 'start부터 누적 비용')}+${under(raw`h(n)`, 'goal까지 추정 비용')}`,
    raw`${under(raw`0\le h(n)\le h^*(n)`, 'optimality를 지키는 낙관적 heuristic')}`,
  )],
  [raw`q_{near}=\arg\min_{q\in T}d(q,q_{rand}),\qquad q_{new}=\operatorname{Steer}(q_{near},q_{rand},\eta)`, aligned(
    raw`${under(raw`q_{near}`, '가장 가까운 node')}=${under(raw`\arg\min_{q\in T}`, 'tree에서 최소 선택')}${under(raw`d(q,q_{rand})`, 'target까지 거리')}`,
    raw`${under(raw`q_{new}`, '검사할 새 node')}`,
    raw`=${under(raw`\operatorname{Steer}(q_{near},q_{rand},\eta)`, '최대 step η만큼 확장')}`,
  )],
  [raw`\dot q=\frac{dq}{ds}\dot s,\qquad \ddot q=\frac{dq}{ds}\ddot s+\frac{d^2q}{ds^2}\dot s^2`, aligned(
    raw`${under(raw`\dot q`, '시간에 따른 joint 속도')}=${under(raw`\frac{dq}{ds}`, 'path의 기하학적 방향')}${under(raw`\dot s`, 'path 진행 속도')}`,
    raw`${under(raw`\ddot q`, 'joint 가속도')}=${under(raw`\frac{dq}{ds}\ddot s`, '진행 속도의 변화')}+${under(raw`\frac{d^2q}{ds^2}\dot s^2`, 'path 곡률의 기여')}`,
  )],

  // Robot trajectory generation and retiming
  [raw`\underbrace{q(t)}_{\text{실행할 궤적}}=\underbrace{q(s)}_{\text{고정된 경로}}\big|_{s=\underbrace{s(t)}_{\text{시간 법칙}}}`, raw`\underbrace{q(t)}_{\text{실행할 궤적}}=\left.\underbrace{q(s)}_{\text{고정된 경로}}\right|_{s=\underbrace{s(t)}_{\text{시간 법칙}}}`],
  [raw`\underbrace{\dot q}_{\text{관절 속도}}=\underbrace{q'(s)}_{\text{경로 기울기}}\underbrace{\dot s}_{\text{진행 속도}},\qquad \underbrace{\ddot q}_{\text{관절 가속도}}=\underbrace{q'(s)\ddot s}_{\text{접선 가속}}+\underbrace{q''(s)\dot s^2}_{\text{곡률 가속}}`, aligned(
    raw`${under(raw`\dot q`, '관절 속도')}=${under(raw`q'(s)`, '경로 기울기')}${under(raw`\dot s`, '진행 속도')}`,
    raw`${under(raw`\ddot q`, '관절 가속도')}=${under(raw`q'(s)\ddot s`, '접선 방향의 가속')}+${under(raw`q''(s)\dot s^2`, '곡률이 요구하는 가속')}`,
  )],
  [raw`\underbrace{s_3(u)=3u^2-2u^3}_{\text{위치·속도 4조건}},\qquad \underbrace{s_5(u)=10u^3-15u^4+6u^5}_{\text{위치·속도·가속도 6조건}}`, aligned(
    raw`${under(raw`s_3(u)=3u^2-2u^3`, '위치·속도 4개 경계조건')}`,
    raw`${under(raw`s_5(u)=10u^3-15u^4+6u^5`, '위치·속도·가속도 6개 경계조건')}`,
  )],
  [raw`\underbrace{q_i(t_i^-)=q_i(t_i^+)}_{\text{C0: 위치 연속}},\qquad \underbrace{\dot q_i(t_i^-)=\dot q_i(t_i^+)}_{\text{C1: 속도 연속}},\qquad \underbrace{\ddot q_i(t_i^-)=\ddot q_i(t_i^+)}_{\text{C2: 가속도 연속}}`, aligned(
    raw`${under(raw`q_i(t_i^-)=q_i(t_i^+)`, 'C0: 위치가 이어짐')}`,
    raw`${under(raw`\dot q_i(t_i^-)=\dot q_i(t_i^+)`, 'C1: 속도가 이어짐')}`,
    raw`${under(raw`\ddot q_i(t_i^-)=\ddot q_i(t_i^+)`, 'C2: 가속도가 이어짐')}`,
  )],
  [raw`\underbrace{T_i}_{\text{관절별 최소 시간}}\ge\max\!\left(\underbrace{\frac{1.875|\Delta q_i|}{v_{i,\max}}}_{\text{속도 한계}},\ \underbrace{\sqrt{\frac{5.774|\Delta q_i|}{a_{i,\max}}}}_{\text{가속도 한계}}\right),\qquad \underbrace{T}_{\text{공통 시간}}=\max_i T_i`, aligned(
    raw`${under(raw`T_i`, '관절 i의 최소 시간')}\ge\max\!\left(${under(raw`\frac{1.875|\Delta q_i|}{v_{i,\max}}`, '속도 한계가 요구한 시간')},` ,
    raw`\qquad${under(raw`\sqrt{\frac{5.774|\Delta q_i|}{a_{i,\max}}}`, '가속도 한계가 요구한 시간')}\right)` ,
    raw`${under(raw`T`, '모든 관절의 공통 시간')}=${under(raw`\max_i T_i`, '가장 느린 관절에 동기화')}`,
  )],
  [raw`\underbrace{T_{i,v}}_{\text{속도 최소 시간}}=\frac{1.875|\Delta q_i|}{v_{i,\max}},\qquad \underbrace{T_{i,a}}_{\text{가속도 최소 시간}}=\sqrt{\frac{5.774|\Delta q_i|}{a_{i,\max}}}`, aligned(
    raw`${under(raw`T_{i,v}`, '속도가 정한 최소 시간')}=${under(raw`\frac{1.875|\Delta q_i|}{v_{i,\max}}`, 'quintic peak 속도를 limit으로 나눔')}`,
    raw`${under(raw`T_{i,a}`, '가속도가 정한 최소 시간')}=${under(raw`\sqrt{\frac{5.774|\Delta q_i|}{a_{i,\max}}}`, 'quintic peak 가속도를 limit으로 나눔')}`,
  )],
  [raw`\underbrace{T}_{\text{동기화된 공통 시간}}=\max_i\!\left(\underbrace{T_{i,v}}_{\text{속도 기준}},\underbrace{T_{i,a}}_{\text{가속도 기준}}\right)`, aligned(
    raw`${under(raw`T_i`, '관절 i가 필요한 시간')}=\max\!\left(${under(raw`T_{i,v}`, '속도 기준')},${under(raw`T_{i,a}`, '가속도 기준')}\right)` ,
    raw`${under(raw`T`, '동기화된 공통 시간')}=${under(raw`\max_i T_i`, '가장 느린 관절의 시간')}`,
  )],
  [raw`\underbrace{M(q)\ddot q+h(q,\dot q)}_{\text{로봇 동역학}}=\underbrace{\tau}_{\text{관절 토크}}`, raw`${under(raw`M(q)\ddot q+h(q,\dot q)`, '관성과 속도·중력 효과의 합')}=${under(raw`\tau`, '관절 actuator 토크')}`],
  [raw`\dot q=q_s\dot s`, raw`${under(raw`\dot q`, '실제 관절 속도')}=${under(raw`q_s`, 'path 접선')}${under(raw`\dot s`, 'path 진행 속도')}`],
  [raw`\ddot q=q_s\ddot s+q_{ss}\dot s^2`, raw`${under(raw`\ddot q`, '실제 관절 가속도')}=${under(raw`q_s\ddot s`, '접선 방향 가속')}+${under(raw`q_{ss}\dot s^2`, 'path 곡률이 만든 가속')}`],
  [raw`\tau_i=\sum_jJ_{ij}\ddot q_j+\sum_{j,k}C_{ijk}\dot q_j\dot q_k+\sum_jR_{ij}\dot q_j+G_i`, aligned(
    raw`${under(raw`\tau_i`, '관절 i의 필요 torque')}=${under(raw`\sum_jJ_{ij}\ddot q_j`, '관성 부담')}+${under(raw`\sum_{j,k}C_{ijk}\dot q_j\dot q_k`, '코리올리·원심 부담')}`,
    raw`\qquad+${under(raw`\sum_jR_{ij}\dot q_j`, '속도 비례 점성 마찰')}+${under(raw`G_i`, '중력·위치 부하')}`,
  )],
  [raw`a_i(s)=\sum_jJ_{ij}q_{s,j}`, raw`${under(raw`a_i(s)`, 'path 가속의 관성 계수')}=${under(raw`\sum_jJ_{ij}q_{s,j}`, 'inertia를 path 접선에 투영')}`],
  [raw`b_i(s)=\sum_jJ_{ij}q_{ss,j}+\sum_{j,k}C_{ijk}q_{s,j}q_{s,k}`, aligned(
    raw`${under(raw`b_i(s)`, '속도 제곱 계수')}=${under(raw`\sum_jJ_{ij}q_{ss,j}`, 'path 곡률의 관성 부담')}`,
    raw`\qquad+${under(raw`\sum_{j,k}C_{ijk}q_{s,j}q_{s,k}`, '코리올리·원심 부담')}`,
  )],
  [raw`d_i(s)=\sum_jR_{ij}q_{s,j}`, raw`${under(raw`d_i(s)`, 'path 속도 비례 계수')}=${under(raw`\sum_jR_{ij}q_{s,j}`, '점성 마찰을 path 접선에 투영')}`],
  [raw`c_i(s)=G_i(q(s))`, raw`${under(raw`c_i(s)`, '정지해도 남는 계수')}=${under(raw`G_i(q(s))`, 'path 위치의 중력·부하')}`],
  [raw`a_i=\sum_jJ_{ij}q_{s,j},\quad b_i=\sum_jJ_{ij}q_{ss,j}+\sum_{j,k}C_{ijk}q_{s,j}q_{s,k},\quad d_i=\sum_jR_{ij}q_{s,j},\quad c_i=G_i(q(s))`, aligned(
    raw`${under(raw`a_i`, 'path 가속 관성')}=${under(raw`\sum_jJ_{ij}q_{s,j}`, 'inertia와 tangent')}`,
    raw`${under(raw`b_i`, '속도 제곱 부담')}=${under(raw`\sum_jJ_{ij}q_{ss,j}`, 'curvature inertia')}+${under(raw`\sum_{j,k}C_{ijk}q_{s,j}q_{s,k}`, 'Coriolis·centrifugal')}`,
    raw`${under(raw`d_i`, '속도 비례 마찰')}=${under(raw`\sum_jR_{ij}q_{s,j}`, 'viscous friction')},\qquad${under(raw`c_i`, '중력·정적 부하')}=${under(raw`G_i(q(s))`, 'path 위치의 gravity')}`,
  )],
  [raw`\tau=2\ddot s+0.5\dot s^2+1`, raw`${under(raw`\tau`, '필요 torque')}=${under(raw`2\ddot s`, '가속에 쓸 torque')}+${under(raw`0.5\dot s^2`, '속도 제곱 부담')}+${under(raw`1`, '중력 부담')}`],
  [raw`-3\le\tau\le5,\qquad\dot s=2`, raw`${under(raw`-3\le\tau\le5`, 'actuator torque 범위')}\,,\qquad${under(raw`\dot s=2`, '현재 path 속도')}`],
  [raw`\tau=2\ddot s+3`, raw`${under(raw`\tau`, '현재 필요 torque')}=${under(raw`2\ddot s`, '가속에 따라 바뀌는 몫')}+${under(raw`3`, '속도·중력이 이미 쓰는 몫')}`],
  [raw`-3\le2\ddot s+3\le5\quad\Longrightarrow\quad-3\le\ddot s\le1`, aligned(
    raw`${under(raw`-3\le2\ddot s+3\le5`, 'torque limit을 대입')}`,
    raw`\Longrightarrow${under(raw`-3\le\ddot s\le1`, '현재 허용되는 path 가속도 범위')}`,
  )],
  [raw`\tau=2\ddot s+0.5\dot s^2+1,\qquad -3\le\tau\le5,\qquad \dot s=2`, aligned(
    raw`${under(raw`\tau=2\ddot s+0.5\dot s^2+1`, 'frictionless 교육용 torque 식')}`,
    raw`${under(raw`-3\le\tau\le5`, 'actuator torque 범위')},\qquad${under(raw`\dot s=2`, '현재 path 속도')}`,
  )],
  [raw`-3\le2\ddot s+3\le5\quad\Longrightarrow\quad\underbrace{-3}_{L}\le\ddot s\le\underbrace{1}_{U}`, aligned(
    raw`${under(raw`-3\le2\ddot s+3\le5`, 'torque 한계를 path 가속도로 변환')}`,
    raw`\Longrightarrow${under(raw`-3`, '최대 감속 L')}\le${under(raw`\ddot s`, '선택할 path 가속도')}\le${under(raw`1`, '최대 가속 U')}`,
  )],
  [raw`\underbrace{a(s)}_{\text{접선 관성}}\ddot s+\underbrace{b(s)}_{\text{곡률·속도 항}}\dot s^2+\underbrace{d(s)}_{\text{점성 마찰}}\dot s+\underbrace{c(s)}_{\text{중력·부하}}=\tau,\qquad \underbrace{L(s,\dot s)}_{\text{최대 감속}}\le\ddot s\le\underbrace{U(s,\dot s)}_{\text{최대 가속}}`, aligned(
    raw`${under(raw`a(s)\ddot s`, '경로 접선 방향의 관성')}+${under(raw`b(s)\dot s^2`, '곡률·속도 효과')}+${under(raw`d(s)\dot s`, '점성 마찰')}+${under(raw`c(s)`, '중력·부하')}=${under(raw`\tau`, '필요 torque')}`,
    raw`${under(raw`L(s,\dot s)`, '허용되는 최대 감속')}\le${under(raw`\ddot s`, '선택할 path 가속도')}\le${under(raw`U(s,\dot s)`, '허용되는 최대 가속')}`,
  )],
  [raw`\underbrace{j(t)}_{\text{jerk}}=\frac{d^3q}{dt^3},\qquad \underbrace{x_{now}}_{\text{현재 상태}}=(q,\dot q,\ddot q),\qquad \underbrace{x_{target}}_{\text{목표 상태}}=(q^*,\dot q^*,\ddot q^*)`, aligned(
    raw`${under(raw`j(t)=\frac{d^3q}{dt^3}`, '가속도가 변하는 속도')}`,
    raw`${under(raw`x_{now}=(q,\dot q,\ddot q)`, '이번 tick의 실제 시작 상태')}`,
    raw`${under(raw`x_{target}=(q^*,\dot q^*,\ddot q^*)`, '연결할 목표 상태')}`,
  )],

  // Shin-McKay time-optimal retiming paper
  [raw`\underbrace{q}_{\text{관절 경로}}=q(\underbrace{s}_{\text{경로 위치}}),\qquad 0\le s\le1`, raw`${under(raw`q`, '관절 configuration')}=q(${under(raw`s`, '시간이 아닌 path 위치')})\,,\qquad${under(raw`0\le s\le1`, 'start에서 goal까지')}`],
  [raw`\underbrace{\dot q}_{\text{관절 속도}}=\underbrace{q_s}_{\text{경로 접선}}\dot s,\qquad \underbrace{\ddot q}_{\text{관절 가속도}}=\underbrace{q_s\ddot s}_{\text{접선 가속}}+\underbrace{q_{ss}\dot s^2}_{\text{곡률 가속}}`, aligned(
    raw`${under(raw`\dot q`, '관절 속도')}=${under(raw`q_s`, 'path 접선')}${under(raw`\dot s`, 'path 속도')}`,
    raw`${under(raw`\ddot q`, '관절 가속도')}=${under(raw`q_s\ddot s`, '접선 방향 가속')}+${under(raw`q_{ss}\dot s^2`, 'path 곡률의 가속')}`,
  )],
  [raw`\underbrace{\tau}_{\text{관절 토크}}=\underbrace{a(s)}_{\text{접선 관성}}\ddot s+\underbrace{b(s)}_{\text{속도 제곱 항}}\dot s^2+\underbrace{d(s)}_{\text{점성 마찰}}\dot s+\underbrace{c(s)}_{\text{중력·부하}}`, aligned(
    raw`${under(raw`\tau`, '필요한 관절 torque')}=${under(raw`a(s)\ddot s`, 'path 가속의 관성 효과')}`,
    raw`\qquad+${under(raw`b(s)\dot s^2`, '곡률·속도 효과')}+${under(raw`d(s)\dot s`, '점성 마찰')}+${under(raw`c(s)`, '중력·payload')}`,
  )],
  [raw`\underbrace{L(s,\dot s)}_{\text{허용 최대 감속}}\le\ddot s\le\underbrace{U(s,\dot s)}_{\text{허용 최대 가속}}`, raw`${under(raw`L(s,\dot s)`, '모든 torque가 허용한 최대 감속')}\le${under(raw`\ddot s`, '선택할 path 가속도')}\le${under(raw`U(s,\dot s)`, '모든 torque가 허용한 최대 가속')}`],
  [raw`\underbrace{T}_{\text{총 실행 시간}}=\int_0^1\underbrace{\frac{1}{\dot s(s)}}_{\text{path 한 단위의 시간}}\,ds`, raw`${under(raw`T`, '총 실행 시간')}=\int_0^1${under(raw`\frac{1}{\dot s(s)}`, 'path 한 단위에 필요한 시간')}\,ds`],

  // Robot camera geometry and calibration
  [raw`\underbrace{s\begin{bmatrix}u\\v\\1\end{bmatrix}}_{\text{깊이 비율을 잃은 영상점}}=\underbrace{K}_{\text{카메라 내부 기하}}\underbrace{\begin{bmatrix}X_c\\Y_c\\Z_c\end{bmatrix}}_{\text{카메라 좌표계의 3차원 점}}`, aligned(
    raw`${under(raw`s\begin{bmatrix}u\\v\\1\end{bmatrix}`, '깊이 비율을 잃은 동차 영상점')}`,
    raw`=${under(raw`K`, '카메라 내부의 영상 좌표 기하')}${under(raw`\begin{bmatrix}X_c\\Y_c\\Z_c\end{bmatrix}`, '카메라 좌표계의 실제 단위 3차원 점')}`,
  )],
  [raw`\underbrace{r_c}_{\text{크기 없는 카메라 광선}}\propto\underbrace{K^{-1}}_{\text{영상 좌표 눈금 제거}}\underbrace{\begin{bmatrix}u\\v\\1\end{bmatrix}}_{\text{관측 영상점}},\qquad \underbrace{p_c}_{\text{실제 단위의 카메라 점}}=\underbrace{Z_c}_{\text{광축 방향 깊이}}\begin{bmatrix}(u-c_x)/f_x\\(v-c_y)/f_y\\1\end{bmatrix}`, aligned(
    raw`${under(raw`r_c`, '크기 없는 카메라 광선')}\propto${under(raw`K^{-1}`, '영상 좌표를 정규화된 광선으로 되돌림')}${under(raw`\begin{bmatrix}u\\v\\1\end{bmatrix}`, '관측 영상점')}`,
    raw`${under(raw`p_c`, '실제 단위의 카메라 점')}=${under(raw`Z_c`, '광축 방향 깊이')}${under(raw`\begin{bmatrix}(u-c_x)/f_x\\(v-c_y)/f_y\\1\end{bmatrix}`, '정규화된 광선')}`,
  )],
  [raw`\underbrace{f'_x,f'_y}_{\text{크기 변경 뒤 초점거리}}=\underbrace{\alpha f_x,\beta f_y}_{\text{축별 영상 눈금 적용}},\qquad \underbrace{c'_x,c'_y}_{\text{새 광학 중심}}=\underbrace{\alpha(c_x-x_0),\beta(c_y-y_0)}_{\text{잘라낸 원점을 빼고 크기 변경}}`, aligned(
    raw`${under(raw`(f'_x,f'_y)`, '처리 영상의 초점거리')}=${under(raw`(\alpha f_x,\beta f_y)`, '축별 크기 변경 비율 적용')}`,
    raw`${under(raw`(c'_x,c'_y)`, '새 영상 원점의 광학 중심')}=${under(raw`(\alpha(c_x-x_0),\beta(c_y-y_0))`, '잘라낸 원점을 빼고 크기 변경')}`,
  )],
  [raw`\underbrace{r^2}_{\text{광축에서의 거리}}=x^2+y^2,\qquad \underbrace{x_d}_{\text{왜곡된 가로 좌표}}=\underbrace{x(1+k_1r^2+k_2r^4+k_3r^6)}_{\text{반지름 방향 이동}}+\underbrace{2p_1xy+p_2(r^2+2x^2)}_{\text{렌즈 중심 이탈에 의한 이동}}`, aligned(
    raw`${under(raw`r^2=x^2+y^2`, '광축에서 정규화된 반지름 계산')}`,
    raw`${under(raw`x_d`, '실제로 관측되는 왜곡 좌표')}=${under(raw`x(1+k_1r^2+k_2r^4+k_3r^6)`, '반지름에 따라 방사형 배율 적용')}`,
    raw`\qquad+${under(raw`2p_1xy+p_2(r^2+2x^2)`, '렌즈 중심 이탈에 의한 접선 이동')}`,
  )],
  [raw`\underbrace{s\widetilde m}_{\text{영상에서 관측한 점}}=\underbrace{H}_{\text{평면을 영상으로 옮기는 변환}}\underbrace{\widetilde M}_{\text{평면 표적의 점}},\qquad \underbrace{H}_{[h_1\ h_2\ h_3]}=\underbrace{K}_{\text{모든 영상이 공유하는 내부 기하}}\underbrace{[r_1\ r_2\ t]}_{\text{그 영상의 표적 자세}}`, aligned(
    raw`${under(raw`s\widetilde m`, '영상의 동차 좌표점')}=${under(raw`H`, '평면을 영상으로 옮기는 사영변환')}${under(raw`\widetilde M`, '좌표를 아는 평면 표적점')}`,
    raw`${under(raw`H=[h_1\ h_2\ h_3]`, '한 영상에서 추정한 변환')}=${under(raw`K`, '모든 영상이 공유하는 내부 기하')}${under(raw`[r_1\ r_2\ t]`, '그 영상의 표적 자세')}`,
  )],
  [raw`\underbrace{h_1^TK^{-T}K^{-1}h_2}_{\text{두 회전축이 서로 수직}}=0,\qquad \underbrace{h_1^TK^{-T}K^{-1}h_1}_{\text{첫 회전축의 제곱 길이}}=\underbrace{h_2^TK^{-T}K^{-1}h_2}_{\text{둘째 회전축의 제곱 길이}}`, aligned(
    raw`${under(raw`h_1^TK^{-T}K^{-1}h_2`, 'K를 제거한 두 회전축의 내적')}=${under(raw`0`, '두 축이 수직이라는 제약')}`,
    raw`${under(raw`h_1^TK^{-T}K^{-1}h_1`, '첫 회전축의 제곱 길이')}=${under(raw`h_2^TK^{-T}K^{-1}h_2`, '둘째 회전축의 같은 제곱 길이')}`,
  )],
  [raw`\underbrace{Vb}_{\text{모든 영상의 내부 기하 제약}}=0,\qquad \underbrace{b^*}_{\text{닫힌 형태로 구한 초기값}}=\underbrace{\operatorname*{argmin}_{\lVert b\rVert=1}\lVert Vb\rVert_2}_{\text{잔차가 가장 작은 특이벡터 선택}}`, aligned(
    raw`${under(raw`Vb`, '모든 영상의 내부 기하 제약')}=${under(raw`0`, '동차 선형식의 영공간 조건')}`,
    raw`${under(raw`b^*`, '닫힌 형태로 구한 내부 기하 방향')}=${under(raw`\operatorname*{argmin}_{\lVert b\rVert=1}\lVert Vb\rVert_2`, '크기를 고정하고 잔차가 최소인 특이벡터 선택')}`,
  )],
  [raw`\underbrace{\theta^*}_{\text{다듬어진 보정값}}=\operatorname*{argmin}_{\theta}\sum_{i=1}^{n}\sum_{j=1}^{m}\underbrace{\left\lVert m_{ij}-\pi(\theta,R_i,t_i,M_j)\right\rVert_2^2}_{\text{각 모서리점의 재투영 오차 누적}}`, aligned(
    raw`${under(raw`e_{ij}`, '모서리점별 영상 오차')}=${under(raw`m_{ij}`, '관측 영상점')}-${under(raw`\pi(\theta,R_i,t_i,M_j)`, '카메라 모델의 재투영')}`,
    raw`${under(raw`\theta^*`, '다듬어진 보정값')}=${under(raw`\operatorname*{argmin}_{\theta}`, '영상 오차를 최소화할 매개변수 선택')}\sum_{i=1}^{n}\sum_{j=1}^{m}${under(raw`\lVert e_{ij}\rVert_2^2`, '방향별 오차를 제곱해 누적')}`,
  )],
  [raw`\underbrace{A_i}_{\text{그리퍼에서 본 상대 운동}}\underbrace{X}_{\text{카메라에서 그리퍼로 가는 고정 장착}}=\underbrace{X}_{\text{모든 자세가 공유하는 장착}}\underbrace{B_i}_{\text{카메라에서 본 상대 운동}}`, aligned(
    raw`${under(raw`A_i`, '그리퍼 좌표계에서 본 상대 운동')}${under(raw`X`, '카메라에서 그리퍼로 가는 고정 장착')}`,
    raw`=${under(raw`X`, '모든 자세 쌍이 공유하는 같은 장착')}${under(raw`B_i`, '카메라 좌표계에서 본 같은 상대 운동')}`,
  )],
  [raw`\underbrace{p_b(t_{img})}_{\text{촬영 시각의 기준 좌표계 점}}=\underbrace{T_{bg}(t_{img})}_{\text{시간 버퍼에서 찾은 로봇 자세}}\underbrace{T_{gc}}_{\text{고정 카메라 장착 변환}}\underbrace{p_c(t_{img})}_{\text{카메라 측정점}},\qquad \underbrace{\lVert\delta p\rVert}_{\text{시간 오차의 공간 영향}}\lesssim \underbrace{\lVert v\rVert\Delta t}_{\text{직선 이동 오차}}+\underbrace{\omega\Delta t\,\lVert p_c\rVert}_{\text{회전 이동 오차}}`, aligned(
    raw`${under(raw`p_b(t_{img})`, '촬영 시각의 기준 좌표계 점')}=${under(raw`T_{bg}(t_{img})`, '그 시각의 로봇 자세')}${under(raw`T_{gc}`, '고정 카메라 장착 변환')}${under(raw`p_c(t_{img})`, '카메라 측정점')}`,
    raw`${under(raw`\lVert\delta p\rVert`, '시각 불일치의 점 오차')}\lesssim${under(raw`\lVert v\rVert\Delta t`, '직선 운동이 만든 이동')}+${under(raw`\omega\Delta t\lVert p_c\rVert`, '회전이 거리를 돌려 만든 이동')}`,
  )],
  [raw`\underbrace{p(\lambda)}_{\text{광선 위의 후보점}}=\underbrace{o}_{\text{카메라 원점}}+\lambda\underbrace{r}_{\text{길이가 1인 광선}},\qquad \underbrace{\lambda^*}_{\text{평면까지의 거리}}=-\frac{\underbrace{n^To+d}_{\text{원점의 부호 있는 평면값}}}{\underbrace{n^Tr}_{\text{광선과 평면 법선의 정렬 정도}}}`, aligned(
    raw`${under(raw`p(\lambda)=o+\lambda r`, '카메라 원점에서 단위 광선을 따라 이동')}`,
    raw`${under(raw`\lambda^*`, '평면과 만나는 광선의 크기')}=-\frac{${under(raw`n^To+d`, '원점의 부호 있는 평면값')}}{${under(raw`n^Tr`, '광선이 평면 법선을 가로지르는 정도')}}`,
  )],
  [raw`\underbrace{\Sigma_{p_b}}_{\text{기준 좌표계 점의 방향별 불확실성}}\approx\underbrace{J_z\Sigma_zJ_z^T}_{\text{영상점과 깊이 오차 전파}}+\underbrace{J_\xi\Sigma_\xi J_\xi^T}_{\text{보정값과 자세 오차 전파}}`, aligned(
    raw`${under(raw`\Sigma_{p_b}`, '기준 좌표계 점의 방향별 불확실성')}\approx${under(raw`J_z\Sigma_zJ_z^T`, '영상점과 깊이 오차를 점으로 전파')}`,
    raw`\qquad+${under(raw`J_\xi\Sigma_\xi J_\xi^T`, '보정값과 로봇 자세 오차를 전파')}`,
  )],

  // Zhang planar camera calibration paper
  [raw`\underbrace{s\widetilde m}_{\text{영상 관측점}}=\underbrace{K}_{\text{카메라 내부 기하}}\underbrace{[R\mid t]}_{\text{세계에서 카메라로 가는 자세}}\underbrace{\widetilde M}_{\text{3차원 표적점}}`, aligned(
    raw`${under(raw`s\widetilde m`, '깊이 비율을 잃은 영상 관측점')}=${under(raw`K`, '카메라 내부의 영상 좌표 기하')}`,
    raw`\qquad\times${under(raw`[R\mid t]`, '세계의 표적을 카메라로 옮기는 자세')}${under(raw`\widetilde M`, '좌표를 아는 3차원 표적점')}`,
  )],
  [raw`\underbrace{H}_{[h_1\ h_2\ h_3]}=\underbrace{K}_{\text{모든 영상이 공유}}\underbrace{[r_1\ r_2\ t]}_{\text{그 영상에서 본 평면 자세}}`, aligned(
    raw`${under(raw`H=[h_1\ h_2\ h_3]`, '평면을 영상으로 옮기는 사영변환')}`,
    raw`=${under(raw`K`, '모든 영상이 공유하는 내부 기하')}${under(raw`[r_1\ r_2\ t]`, '그 영상의 두 회전축과 이동')}`,
  )],
  [raw`\underbrace{h_1^TBh_2}_{\text{두 회전축이 수직이라는 제약}}=0,\qquad \underbrace{h_1^TBh_1-h_2^TBh_2}_{\text{두 회전축 길이가 같다는 제약}}=0,\qquad \underbrace{B}_{\text{내부 기하를 묶은 이차형식}}=K^{-T}K^{-1}`, aligned(
    raw`${under(raw`h_1^TBh_2`, 'K를 제거한 두 회전축의 내적')}=${under(raw`0`, '직교')}`,
    raw`${under(raw`h_1^TBh_1-h_2^TBh_2`, '두 회전축의 제곱 길이 차이')}=${under(raw`0`, '두 축의 길이가 같음')}`,
    raw`${under(raw`B=K^{-T}K^{-1}`, '내부 기하 미지수를 대칭 이차형식으로 묶음')}`,
  )],
  [raw`\underbrace{Vb}_{\text{영상마다 두 개씩 쌓은 동차방정식}}=0,\qquad \underbrace{b^*}_{\text{내부 기하의 초기 방향}}=\underbrace{v_{\min}(V)}_{\text{잔차가 가장 작은 오른쪽 특이벡터}}`, aligned(
    raw`${under(raw`Vb`, 'n개 영상에서 쌓은 2n개 제약')}=${under(raw`0`, '동차 선형식')}`,
    raw`${under(raw`b^*`, '내부 기하의 초기 영공간 방향')}=${under(raw`v_{\min}(V)`, '가장 작은 특이값의 오른쪽 벡터')}`,
  )],
  [raw`\underbrace{\theta^*}_{\text{가능도를 최대로 하는 보정값}}=\operatorname*{argmin}_{\theta}\sum_{i=1}^{n}\sum_{j=1}^{m}\underbrace{\left\lVert m_{ij}-\widehat m(\theta,R_i,t_i,M_j)\right\rVert_2^2}_{\text{영상점 재투영 오차의 제곱합}}`, aligned(
    raw`${under(raw`e_{ij}`, '영상 i, 모서리점 j의 오차')}=${under(raw`m_{ij}`, '관측 영상점')}-${under(raw`\widehat m(\theta,R_i,t_i,M_j)`, '왜곡까지 적용한 예측 영상점')}`,
    raw`${under(raw`\theta^*`, '가능도를 최대로 하는 보정값')}=${under(raw`\operatorname*{argmin}_{\theta}`, '영상점 오차가 최소인 매개변수 선택')}\sum_{i,j}${under(raw`\lVert e_{ij}\rVert_2^2`, '가우시안 잡음 가정의 제곱 비용')}`,
  )],

  // Lozano-Perez configuration-space paper
  [raw`\mathrm{CO}_A(B)=\{x\in\mathrm{Cspace}_A\mid (A)_x\cap B\neq\varnothing\}`, aligned(
    raw`${under(raw`\mathrm{CO}_A(B)`, 'B가 만드는 A의 금지 configuration')}`,
    raw`=\left\{${under(raw`x\in\mathrm{Cspace}_A`, 'A의 가능한 자세')}\;\middle|\;${under(raw`(A)_x\cap B\neq\varnothing`, 'x에 둔 A가 B와 겹침')}\right\}`,
  )],
  [raw`x\notin\bigcup_j\mathrm{CO}_A(B_j)\quad\Longrightarrow\quad x\text{ is safe}`, aligned(
    raw`${under(raw`x\notin\bigcup_j\mathrm{CO}_A(B_j)`, '어느 obstacle의 금지 영역에도 속하지 않음')}`,
    raw`\Longrightarrow${under(raw`x\text{ is safe}`, 'object collision이 없는 configuration')}`,
  )],
  [raw`\gamma:[0,1]\to\mathrm{Cspace}_A,\quad \gamma(0)=s,\quad\gamma(1)=g,\quad\gamma(t)\notin\bigcup_j\mathrm{CO}_A(B_j)`, aligned(
    raw`${under(raw`\gamma:[0,1]\to\mathrm{Cspace}_A`, 'configuration path')}\,,\quad${under(raw`\gamma(0)=s`, 'start')}\,,\quad${under(raw`\gamma(1)=g`, 'goal')}`,
    raw`${under(raw`\gamma(t)\notin\bigcup_j\mathrm{CO}_A(B_j)`, 'path 전체가 모든 C-obstacle 밖')}`,
  )],
  [raw`\mathrm{CO}_A(B)=B\oplus(-A)\qquad\text{(fixed orientation, translation only)}`, aligned(
    raw`${under(raw`\mathrm{CO}_A(B)`, 'reference point 금지 영역')}=${under(raw`B\oplus(-A)`, 'obstacle과 반사 body의 합')}`,
    raw`${under(raw`\text{fixed orientation, translation only}`, '회전 고정·평행이동만')}`,
  )],

  // Kavraki PRM paper
  [raw`G=(N,E),\qquad N\subset\mathcal C_{free}`, raw`${under(raw`G=(N,E)`, 'node와 edge로 저장한 roadmap')}\,,\qquad${under(raw`N\subset\mathcal C_{free}`, '모든 milestone은 collision-free')}`],
  [raw`(q_i,q_j)\in E\quad\Longleftrightarrow\quad L(q_i,q_j)\subset\mathcal C_{free}`, aligned(
    raw`${under(raw`(q_i,q_j)\in E`, 'roadmap에 edge를 추가')}`,
    raw`\Longleftrightarrow${under(raw`L(q_i,q_j)\subset\mathcal C_{free}`, 'local path 전체가 collision-free')}`,
  )],
  [raw`\gamma_{query}=L(s,n_s)\oplus\operatorname{Search}_G(n_s,n_g)\oplus L(n_g,g)`, aligned(
    raw`${under(raw`\gamma_{query}`, 'query의 전체 path')}=${under(raw`L(s,n_s)`, 'start를 roadmap에 연결')}`,
    raw`\qquad\oplus${under(raw`\operatorname{Search}_G(n_s,n_g)`, 'roadmap 안의 graph path')}\oplus${under(raw`L(n_g,g)`, 'roadmap에서 goal로 연결')}`,
  )],
  [raw`d(q,q^\prime)=\left(\sum_{k=1}^{d}w_k\,\delta_k(q_k,q_k^\prime)^2\right)^{1/2}`, aligned(
    raw`${under(raw`d(q,q^\prime)`, 'configuration 사이 거리')}`,
    raw`=\left(${under(raw`\sum_{k=1}^{d}`, '모든 joint의 기여를 합산')}${under(raw`w_k`, 'joint별 scale')}${under(raw`\delta_k(q_k,q_k^\prime)^2`, 'topology를 반영한 차이')}\right)^{1/2}`,
  )],

  [raw`\widehat m,\widehat b=\arg\min_{m,b}\sum_i\left(y_i-(mx_i+b)\right)^2`, aligned(
    raw`${under(raw`e_i`, 'i번째 나무 점의 오차')}=${under(raw`y_i-(mx_i+b)`, '관측에서 직선 예측을 뺌')}`,
    raw`${under(raw`E(m,b)`, 'row 전체 fitting cost')}=${under(raw`\sum_i e_i^2`, '큰 이탈을 더 강하게 벌점')}`,
    raw`${under(raw`(\widehat m,\widehat b)`, '선택할 row 직선')}=${under(raw`\arg\min_{m,b}E(m,b)`, 'fitting cost가 가장 작은 선')}`,
  )],
]);

export function foundationFormulaAnnotation(source: string): string | undefined {
  const registered = annotations.get(source);
  if (registered) return registered;
  // Article-specific formulas may carry their Korean semantic labels directly.
  // Treat those as annotated so authors do not have to duplicate the full source
  // string in this global registry merely to satisfy the coverage audit.
  if (/\\(?:under|over)brace\{/.test(source) && /\\text\{[^}]+\}/.test(source)) return source;
  return undefined;
}

export const foundationFormulaAnnotationCount = annotations.size;
