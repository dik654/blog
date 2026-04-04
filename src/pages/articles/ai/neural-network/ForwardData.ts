import type { Annotation } from '@/components/ui/code-panel';

export const forwardCode = `import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def softmax(x):
    exp_x = np.exp(x - np.max(x))
    return exp_x / np.sum(exp_x)

# 입력 (2차원)
X = np.array([1.0, 0.5])

# 1층: X(2) -> W1(2x3) -> A1(3)
W1 = np.random.randn(2, 3)
b1 = np.zeros(3)
A1 = sigmoid(X @ W1 + b1)

# 2층: A1(3) -> W2(3x2) -> A2(2)
W2 = np.random.randn(3, 2)
b2 = np.zeros(2)
A2 = sigmoid(A1 @ W2 + b2)

# 출력층: A2(2) -> W3(2x2) -> Y(2)
W3 = np.random.randn(2, 2)
b3 = np.zeros(2)
Y = softmax(A2 @ W3 + b3)`;

export const forwardAnnotations: Annotation[] = [
  { lines: [3, 4], color: 'sky', note: 'sigmoid 활성화' },
  { lines: [6, 8], color: 'emerald', note: 'softmax 출력' },
  { lines: [13, 15], color: 'amber', note: '1층 순전파' },
  { lines: [18, 20], color: 'violet', note: '2층 순전파' },
  { lines: [23, 25], color: 'rose', note: '출력층' },
];
