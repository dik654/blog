import MNISTViz from './viz/MNISTViz';
import MnistInfoViz from './viz/MnistInfoViz';
import MnistParamsViz from './viz/MnistParamsViz';

export default function MNIST() {
  return (
    <section id="mnist" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">손글씨 숫자 인식</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        MNIST — 28×28 흑백 이미지, 0~9 숫자 10클래스 분류.<br />
        784→50→100→10 구조의 3층 신경망으로 정확도 ~97% 달성.
      </p>
      <MNISTViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">MNIST 데이터셋 상세</h3>
        <p>
          LeCun 1998 Modified NIST — 딥러닝의 "Hello World"
        </p>
      </div>
      <MnistInfoViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">3-layer MLP 구현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# 데이터 로드
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))  # MNIST mean/std
])
train_set = datasets.MNIST('./data', train=True, download=True, transform=transform)
test_set = datasets.MNIST('./data', train=False, transform=transform)
train_loader = DataLoader(train_set, batch_size=64, shuffle=True)
test_loader = DataLoader(test_set, batch_size=1000)

# 모델 정의
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 50)
        self.fc2 = nn.Linear(50, 100)
        self.fc3 = nn.Linear(100, 10)

    def forward(self, x):
        x = x.view(-1, 784)           # flatten
        x = F.relu(self.fc1(x))        # layer 1
        x = F.relu(self.fc2(x))        # layer 2
        x = self.fc3(x)                # layer 3 (logits)
        return x

model = MLP()
optimizer = optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss()

# 훈련 루프
for epoch in range(10):
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

    # 평가
    model.eval()
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            output = model(data)
            pred = output.argmax(dim=1)
            correct += pred.eq(target).sum().item()
    accuracy = correct / len(test_set)
    print(f'Epoch {epoch+1}: Accuracy = {accuracy:.4f}')`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">파라미터 수 계산 & MNIST 해결 역사</h3>
        <p>
          784→50→100→10 구조로 총 45,360 파라미터 (Layer 1이 87% 차지)<br />
          Linear → MLP → LeNet(CNN) → ResNet → Human 수준으로 진화
        </p>
      </div>
      <MnistParamsViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: MNIST가 여전히 교육 표준인 이유</p>
          <p>
            <strong>교육적 가치</strong>:<br />
            - 데이터 크기 적절 (빠른 실험)<br />
            - 의미 명확 (직관적)<br />
            - GPU 없이도 훈련 가능<br />
            - 다양한 방법 비교 용이
          </p>
          <p className="mt-2">
            <strong>한계 인식</strong>:<br />
            ✗ 이미 "풀린" 문제 (99%+ 정확도)<br />
            ✗ 실제 세계 대비 단순<br />
            ✗ Overfitting 위험 (모델 크기 대비 데이터 작음)<br />
            → "MNIST solved" ≠ "CV solved"
          </p>
          <p className="mt-2">
            <strong>MNIST 이후 벤치마크</strong>:<br />
            - CIFAR-10/100: natural images<br />
            - ImageNet: 1M 이미지, 1000 classes<br />
            - COCO: object detection<br />
            - Fashion-MNIST: "MNIST replacement"<br />
            - Korean MNIST, EMNIST 등 변형
          </p>
        </div>

      </div>
    </section>
  );
}
