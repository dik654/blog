# huggingface/transformers 저장소 · src/transformers/trainer.py (main
# branch, commit e12c79c, 2026년 8월 기준). 전체 4460줄 중 이 글이 다루는
# get_batch_samples·_get_num_items_in_batch만 발췌했습니다. multi-GPU
# gather·object-detection 예외 처리 세부는 생략했습니다.
# 본문 대응: effective-batch section의 K개 micro-batch를 누적하기 전에
# "전체 유효 토큰 수를 먼저 센다"는 fix의 실제 위치 — loss_utils.py의
# fixed_cross_entropy가 나눌 분모(num_items_in_batch)가 여기서 만들어진다.

class Trainer:
    def get_batch_samples(
        self, epoch_iterator, num_batches: int, device
    ):
        """
        Collects a specified number of batches from the epoch iterator and
        optionally counts the number of items in the batches to properly
        scale the loss.
        """
        batch_samples = []

        # article의 K — gradient_accumulation_steps만큼의 micro-batch를
        # loss 계산 전에 먼저 전부 모은다. 이 시점에는 아직 아무 backward도
        # 실행하지 않는다.
        for _ in range(num_batches):
            try:
                batch_samples.append(next(epoch_iterator))
            except StopIteration:
                break

        num_items_in_batch = self._get_num_items_in_batch(batch_samples, device)
        return batch_samples, num_items_in_batch

    def _get_num_items_in_batch(self, batch_samples: list, device) -> torch.Tensor | int | None:
        """
        Counts the number of items in the batches to properly scale the loss.
        """
        num_items_in_batch = None
        count_num_items_in_batch = (
            len(batch_samples) > 0
            and "labels" in batch_samples[0]
            and (self.model_accepts_loss_kwargs or self.compute_loss_func is not None)
        )
        if count_num_items_in_batch:
            try:
                labels_for_count = [
                    batch["shift_labels"] if "shift_labels" in batch else batch["labels"][..., 1:]
                    for batch in batch_samples
                ]
                # article의 "denominator를 미리 구한다" — K개 micro-batch
                # 전부를 순회하며 -100(ignore_index)이 아닌 label token만
                # 세어 accumulation window 전체의 유효 토큰 수 하나를
                # 만든다. micro-batch별로 따로 세지 않는다.
                num_items_in_batch = sum(labels.ne(-100).sum() for labels in labels_for_count)
            except (TypeError, AttributeError):
                pass

        if num_items_in_batch is not None:
            if self.args.average_tokens_across_devices:
                if self.args.world_size > 1:
                    # article에는 없는 실제 세부 — multi-GPU에서는 각
                    # device가 센 값을 gather해 다시 합산해야 global
                    # 유효 토큰 수가 된다.
                    num_items_in_batch = self.accelerator.gather(num_items_in_batch.to(device)).sum()

        return num_items_in_batch
