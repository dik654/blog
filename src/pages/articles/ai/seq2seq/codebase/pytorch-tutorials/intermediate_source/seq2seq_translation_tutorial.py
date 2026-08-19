# pytorch/tutorials 공식 저장소 · intermediate_source/seq2seq_translation_tutorial.py
# (main branch, commit 4ed884d, 2026년 8월 기준). "Translation with a Sequence
# to Sequence Network and Attention" — PyTorch 팀이 직접 유지하는 seq2seq
# reference 구현입니다. 전체 876줄 중 이 글이 다루는 EncoderRNN·DecoderRNN·
# train_epoch만 발췌했습니다. AttnDecoderRNN·BahdanauAttention(attention 글이
# 별도 소유), 데이터 로딩·평가·plotting 코드는 생략했습니다.
# 본문 대응: Encoder→decoder state handoff, decoder recurrent transition+
# output projection, teacher forcing training loop.

import torch
import torch.nn as nn
import torch.nn.functional as F

SOS_token = 0
EOS_token = 1
MAX_LENGTH = 10


# === Encoder ===
# article의 (h_j^E, C_j^E) = LSTM_E(e(x_j), h_{j-1}^E, C_{j-1}^E) — 이 튜토리얼은
# LSTM 대신 GRU를 쓰지만(cell state가 없어 하나의 recurrent state만 다룸),
# "embedding을 순서대로 읽으며 state를 갱신"하는 encoder recurrence 자체는 같다.
class EncoderRNN(nn.Module):
    def __init__(self, input_size, hidden_size, dropout_p=0.1):
        super(EncoderRNN, self).__init__()
        self.hidden_size = hidden_size

        self.embedding = nn.Embedding(input_size, hidden_size)
        self.gru = nn.GRU(hidden_size, hidden_size, batch_first=True)
        self.dropout = nn.Dropout(dropout_p)

    def forward(self, input):
        embedded = self.dropout(self.embedding(input))
        output, hidden = self.gru(embedded)
        return output, hidden


# === Simple Decoder ===
class DecoderRNN(nn.Module):
    def __init__(self, hidden_size, output_size):
        super(DecoderRNN, self).__init__()
        self.embedding = nn.Embedding(output_size, hidden_size)
        self.gru = nn.GRU(hidden_size, hidden_size, batch_first=True)
        self.out = nn.Linear(hidden_size, output_size)

    def forward(self, encoder_outputs, encoder_hidden, target_tensor=None):
        batch_size = encoder_outputs.size(0)
        decoder_input = torch.empty(batch_size, 1, dtype=torch.long).fill_(SOS_token)
        # article의 s_0^D = W_h h_S^E + b_h — 이 구현은 encoder·decoder hidden
        # size가 같아 projection(W_h) 없이 encoder_hidden을 그대로 넘긴다.
        # 두 dimension이 다르면 article이 설명한 learned projection이 필요하다.
        decoder_hidden = encoder_hidden
        decoder_outputs = []

        for i in range(MAX_LENGTH):
            decoder_output, decoder_hidden = self.forward_step(decoder_input, decoder_hidden)
            decoder_outputs.append(decoder_output)

            if target_tensor is not None:
                # article의 teacher forcing — 정답 prefix를 다음 input으로 사용
                decoder_input = target_tensor[:, i].unsqueeze(1)
            else:
                # article의 autoregressive decoding — model 자신의 예측을 사용
                _, topi = decoder_output.topk(1)
                decoder_input = topi.squeeze(-1).detach()

        decoder_outputs = torch.cat(decoder_outputs, dim=1)
        decoder_outputs = F.log_softmax(decoder_outputs, dim=-1)
        return decoder_outputs, decoder_hidden, None

    # article의 u_t=e(y_{t-1}), s_t=LSTM_D(u_t,s_{t-1}), p_t=softmax(W_o s_t+b_o)와
    # 같은 세 단계(embedding→recurrent transition→output projection) 구조.
    def forward_step(self, input, hidden):
        output = self.embedding(input)
        output = F.relu(output)
        output, hidden = self.gru(output, hidden)
        output = self.out(output)
        return output, hidden


# === Training loop ===
# article의 L_TF = -(1/N) Σ m_t log p_t*와 비교할 실제 training step.
def train_epoch(dataloader, encoder, decoder, encoder_optimizer,
                 decoder_optimizer, criterion):
    total_loss = 0
    for data in dataloader:
        input_tensor, target_tensor = data

        encoder_optimizer.zero_grad()
        decoder_optimizer.zero_grad()

        encoder_outputs, encoder_hidden = encoder(input_tensor)
        # target_tensor를 항상 넘겨 매 step teacher forcing한다 — 튜토리얼
        # 문서 주석은 teacher_forcing_ratio로 확률적으로 껐다 켰다 한다고
        # 설명하지만, 실제 이 버전의 코드에는 그 분기가 없다(과거 버전의
        # 남은 설명 텍스트). article의 teacher forcing 식은 여전히 유효하되,
        # "확률적 teacher forcing"은 이 pinned 버전의 실제 동작이 아니다.
        decoder_outputs, _, _ = decoder(encoder_outputs, encoder_hidden, target_tensor)

        # NLLLoss(criterion)에 ignore_index가 없어, EOS 뒤 padding(SOS_token=0으로
        # 채움) 위치도 loss에 그대로 포함된다 — article의 mask m_t로 padding을
        # 제외하는 masked-average는 이 pinned 튜토리얼에는 없는, 더 신중한
        # production 관례다.
        loss = criterion(
            decoder_outputs.view(-1, decoder_outputs.size(-1)),
            target_tensor.view(-1)
        )
        loss.backward()

        encoder_optimizer.step()
        decoder_optimizer.step()

        total_loss += loss.item()

    return total_loss / len(dataloader)
