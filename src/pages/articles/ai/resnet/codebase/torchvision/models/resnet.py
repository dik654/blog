# torchvision/models/resnet.py — BasicBlock·Bottleneck.forward과
# zero_init_residual 초기화 (torchvision v0.28.0). __init__의 layer 생성
# 코드는 생략하고 실제 forward 순서와, 본문이 언급한 v1.5 stride·zero-init
# 세부사항이 담긴 부분만 발췌했습니다.
# 본문 대응: Architecture의 BasicBlock forward AlgorithmBlock([v1] post-activation).
# torchvision은 pre-activation([v2]) variant를 기본 제공하지 않습니다 — 이건
# 별도 논문(Identity Mappings, He et al. 2016)의 구현이며 torchvision core에는
# 없다는 점이 실제 코드 대조로 확인됩니다.

class BasicBlock(nn.Module):
    expansion: int = 1

    def forward(self, x: Tensor) -> Tensor:
        identity = x

        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)

        out = self.conv2(out)
        out = self.bn2(out)

        if self.downsample is not None:
            identity = self.downsample(x)

        out += identity
        out = self.relu(out)

        return out


class Bottleneck(nn.Module):
    # Bottleneck in torchvision places the stride for downsampling at 3x3 convolution(self.conv2)
    # while original implementation places the stride at the first 1x1 convolution(self.conv1)
    # according to "Deep residual learning for image recognition" https://arxiv.org/abs/1512.03385.
    # This variant is also known as ResNet V1.5 and improves accuracy according to
    # https://ngc.nvidia.com/catalog/model-scripts/nvidia:resnet_50_v1_5_for_pytorch.

    expansion: int = 4

    def forward(self, x: Tensor) -> Tensor:
        identity = x

        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)

        out = self.conv2(out)
        out = self.bn2(out)
        out = self.relu(out)

        out = self.conv3(out)
        out = self.bn3(out)

        if self.downsample is not None:
            identity = self.downsample(x)

        out += identity
        out = self.relu(out)

        return out


class ResNet(nn.Module):
    def __init__(self, ..., zero_init_residual: bool = False):
        ...
        # Zero-initialize the last BN in each residual branch,
        # so that the residual branch starts with zeros, and each residual block behaves like an identity.
        # This improves the model by 0.2~0.3% according to https://arxiv.org/abs/1706.02677
        if zero_init_residual:
            for m in self.modules():
                if isinstance(m, Bottleneck) and m.bn3.weight is not None:
                    nn.init.constant_(m.bn3.weight, 0)
                elif isinstance(m, BasicBlock) and m.bn2.weight is not None:
                    nn.init.constant_(m.bn2.weight, 0)
