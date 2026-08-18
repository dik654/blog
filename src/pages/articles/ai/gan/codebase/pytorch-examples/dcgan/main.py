# pytorch/examples · dcgan/main.py — 한 iteration의 D/G update
# (commit cc8e404, 2025-05-13). Dataloader 반복·로깅·image 저장 코드는
# 생략하고 실제 D→G 순서의 update 본문만 발췌했습니다.
# 본문 대응: Training AlgorithmBlock의 φ 업데이트(D)와 θ 업데이트(G, non-saturating).

criterion = nn.BCELoss()
real_label = 1
fake_label = 0

# (1) Update D network: maximize log(D(x)) + log(1 - D(G(z)))
netD.zero_grad()

# train with real — article의 log D(x_i) 항
real_cpu = data[0].to(device)
batch_size = real_cpu.size(0)
label = torch.full((batch_size,), real_label, dtype=real_cpu.dtype, device=device)
output = netD(real_cpu)
errD_real = criterion(output, label)  # BCE(D(x), 1) — 위 log D(x)와 부호만 다름
errD_real.backward()

# train with fake — article의 log(1-D(G(z_i))) 항
noise = torch.randn(batch_size, nz, 1, 1, device=device)
fake = netG(noise)
label.fill_(fake_label)
# .detach()로 D update가 G의 graph까지 역전파하지 않게 끊음
output = netD(fake.detach())
errD_fake = criterion(output, label)  # BCE(D(G(z)), 0) — 위 log(1-D(G(z)))와 부호만 다름
errD_fake.backward()
errD = errD_real + errD_fake
optimizerD.step()

# (2) Update G network: maximize log(D(G(z)))  — non-saturating trick
netG.zero_grad()
label.fill_(real_label)  # fake labels are real for generator cost
# 이번엔 detach하지 않은 같은 fake를 다시 D에 통과시켜 G까지 gradient가 흐르게 함
output = netD(fake)
# BCE(D(G(z)), 1) = -log D(G(z))를 최소화 == article의 log D(G(z))를 최대화(non-saturating)
errG = criterion(output, label)
errG.backward()
optimizerG.step()
