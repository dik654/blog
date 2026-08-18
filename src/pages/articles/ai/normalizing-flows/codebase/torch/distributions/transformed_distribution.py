# torch/distributions/transformed_distribution.py —
# TransformedDistribution.log_prob (PyTorch v2.13.0, 단일 transform 경우로
# 단순화 — 원본은 여러 transform을 이어 붙이는 for loop를 지원합니다).
# 본문 대응: p_X(x)=p_Z(z)·r(x)를 log-space에서 계산하는 실제 방식.

class TransformedDistribution(Distribution):
    def log_prob(self, value):
        """
        Scores the sample by inverting the transform(s) and computing the
        score using the score of the base distribution and the log abs det
        jacobian.
        """
        y = value  # article의 x(관측값)
        x = self.transform.inv(y)  # article의 z=f^{-1}(x)

        # article의 log r(x) = log|dz/dy|를 직접 계산하지 않고,
        # forward 방향 log|dy/dx|를 구해 부호를 뒤집어 뺌 — 결과는 같지만
        # inverse Jacobian을 따로 유도할 필요가 없어짐
        log_prob = -self.transform.log_abs_det_jacobian(x, y)

        # article의 p_Z(z) — base distribution의 log density를 더함
        log_prob = log_prob + self.base_dist.log_prob(x)
        return log_prob  # article의 log p_X(x) = log p_Z(z) + log r(x)
