# pytorch/examples · vae/main.py — VAE.forward · loss_function
# (commit fcce71c). Training loop 반복·로깅은 생략하고 model forward와
# loss 계산 본문만 발췌했습니다.
# 본문 대응: Training AlgorithmBlock의 z=μ+σ⊙ε, L_recon, L_KL.

class VAE(nn.Module):
    def __init__(self):
        super(VAE, self).__init__()
        self.fc1 = nn.Linear(784, 400)
        self.fc21 = nn.Linear(400, 20)  # article의 μ
        self.fc22 = nn.Linear(400, 20)  # article의 log σ²
        self.fc3 = nn.Linear(20, 400)
        self.fc4 = nn.Linear(400, 784)

    def encode(self, x):
        h1 = F.relu(self.fc1(x))
        # article의 (μ, log σ²) = Encoder_φ(x)
        return self.fc21(h1), self.fc22(h1)

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)  # article의 ε~N(0,I)
        # article의 z = μ + σ⊙ε — 직접 샘플링 대신 결정론적 함수로 만들어
        # encoder까지 gradient가 흐르게 함
        return mu + eps * std

    def decode(self, z):
        h3 = F.relu(self.fc3(z))
        return torch.sigmoid(self.fc4(h3))  # Bernoulli 확률 x̂_params

    def forward(self, x):
        mu, logvar = self.encode(x.view(-1, 784))
        z = self.reparameterize(mu, logvar)
        return self.decode(z), mu, logvar


# Reconstruction + KL divergence losses summed over all elements and batch
def loss_function(recon_x, x, mu, logvar):
    # article의 L_recon = -log p_θ(x|z) — 이진 x라 BCE(Bernoulli likelihood)
    BCE = F.binary_cross_entropy(recon_x, x.view(-1, 784), reduction="sum")

    # see Appendix B from VAE paper:
    # Kingma and Welling. Auto-Encoding Variational Bayes. ICLR, 2014
    # https://arxiv.org/abs/1312.6114
    # 0.5 * sum(1 + log(sigma^2) - mu^2 - sigma^2)
    # article의 L_KL = -½Σ(1+log σ²-μ²-σ²)와 부호까지 완전히 동일
    KLD = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())

    return BCE + KLD
