# torch/distributions/transforms.py — AffineTransform (PyTorch v2.13.0).
# 여러 shape·caching 분기는 생략하고 핵심 세 method만 발췌했습니다.
# 본문 대응: z=f^{-1}(x), r(x)=|det ∂z/∂x|. Article은 z→x 방향으로,
# 이 class는 x→y(base→data) 방향으로 이름 붙였다는 점에 유의.

class AffineTransform(Transform):
    r"""
    Transform via the pointwise affine mapping y = loc + scale * x
    """

    def _call(self, x):
        # article의 forward transform (base sample → observed sample)
        return self.loc + self.scale * x

    def _inverse(self, y):
        # article의 z=f^{-1}(x) — observed sample에서 base sample로
        return (y - self.loc) / self.scale

    def log_abs_det_jacobian(self, x, y):
        # forward 방향(base→data)의 log|dy/dx| = log|scale|을 계산
        # article의 log r(x) = log|dz/dx|는 이 값의 부호를 반대로 한 것과 같음
        # (affine이라 |dz/dx| = 1/|scale|이므로 log r(x) = -log|scale|)
        scale = self.scale
        if isinstance(scale, (int, float)):
            result = torch.full_like(x, math.log(abs(scale)))
        else:
            result = torch.abs(scale).log()
        return result.expand(x.shape)
