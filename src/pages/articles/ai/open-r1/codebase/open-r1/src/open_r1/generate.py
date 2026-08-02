"""Open-R1 Distilabel generation control flow의 교육용 excerpt."""

from distilabel.llms import OpenAILLM
from distilabel.pipeline import Pipeline
from distilabel.steps import StepResources
from distilabel.steps.tasks import TextGeneration


def build_pipeline(
    model: str,
    base_url: str,
    prompt_column: str,
    num_generations: int,
    max_new_tokens: int,
    client_replicas: int,
) -> Pipeline:
    # 본문 대응: generation compute는 별도 vLLM endpoint가 소유한다.
    with Pipeline().ray() as pipeline:
        TextGeneration(
            llm=OpenAILLM(
                base_url=base_url,
                api_key="local-endpoint",
                model=model,
                generation_kwargs={"max_new_tokens": max_new_tokens},
            ),
            input_mappings={"instruction": prompt_column},
            num_generations=num_generations,
            # 본문 대응: 같은 prompt의 답을 한 행에 묶어 provenance를 보존한다.
            group_generations=True,
            resources=StepResources(replicas=client_replicas),
        )
    return pipeline


def run_generation(dataset, output_repo, **config):
    pipeline = build_pipeline(**config)
    # 본문 대응: cache 상태까지 run manifest에 남겨 재생성 여부를 설명한다.
    distiset = pipeline.run(dataset=dataset, use_cache=False)
    distiset.push_to_hub(output_repo, private=True)
    return distiset
