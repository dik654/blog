import Overview from './vllm-serving/Overview';
import PagedAttention from './vllm-serving/PagedAttention';
import ServingArchitecture from './vllm-serving/ServingArchitecture';

export default function VLLMServingArticle() {
  return (
    <>
      <Overview />
      <PagedAttention />
      <ServingArchitecture />
    </>
  );
}
