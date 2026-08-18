# torchvision/models/vision_transformer.py — VisionTransformer의 patch
# embedding (torchvision v0.28.0). __init__의 conv_proj 정의, _process_input,
# forward의 class token 결합 부분만 발췌했습니다.
# 본문 대응: PatchEmbedding의 두 식 — Z_0=[e_cls;e_1;...;e_N]와
# flatten(K_d)=E_{:,d}(patch flatten+matmul ≡ Conv2d(kernel=stride=P)).

class VisionTransformer(nn.Module):
    def __init__(self, image_size, patch_size, num_layers, num_heads, hidden_dim, mlp_dim, ...):
        # article의 E — patch를 펼쳐 matmul하는 대신, kernel size와 stride를
        # 모두 patch_size로 둔 Conv2d 한 층으로 같은 연산을 수행
        # (article의 flatten(K_d)=E_{:,d}가 실제로 이렇게 구현되어 있음)
        self.conv_proj = nn.Conv2d(
            in_channels=3, out_channels=hidden_dim, kernel_size=patch_size, stride=patch_size
        )
        # article의 e_cls — 모든 image가 공유하는 학습 가능한 class token
        self.class_token = nn.Parameter(torch.zeros(1, 1, hidden_dim))
        # article의 p_i — position embedding
        self.pos_embedding = nn.Parameter(torch.empty(1, seq_length, hidden_dim).normal_(std=0.02))

    def _process_input(self, x: torch.Tensor) -> torch.Tensor:
        n, c, h, w = x.shape
        p = self.patch_size
        n_h = h // p
        n_w = w // p

        # (n, c, h, w) -> (n, hidden_dim, n_h, n_w)
        # article의 y_{r,s,d} 전체를 grid 형태로 한 번에 계산
        x = self.conv_proj(x)
        # (n, hidden_dim, n_h, n_w) -> (n, hidden_dim, n_h*n_w)
        # article의 (r,s) 2D grid 좌표를 1D patch index i로 펼침
        x = x.reshape(n, self.hidden_dim, n_h * n_w)
        # (n, hidden_dim, n_h*n_w) -> (n, n_h*n_w, hidden_dim)
        # Self-attention이 기대하는 (batch, sequence, embedding) 순서로 정렬
        x = x.permute(0, 2, 1)
        return x

    def forward(self, x: torch.Tensor):
        x = self._process_input(x)
        n = x.shape[0]

        # article의 Z_0=[e_cls;e_1;...;e_N] — class token을 patch token 앞에 붙임
        batch_class_token = self.class_token.expand(n, -1, -1)
        x = torch.cat([batch_class_token, x], dim=1)

        x = self.encoder(x)  # pos_embedding을 더한 뒤 실제 Transformer encoder 적용
        ...
