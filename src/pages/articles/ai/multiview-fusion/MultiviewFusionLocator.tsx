import ImageClassificationPathLocator, {
  ImageClassificationMapReturn,
} from "../image-classification-pipeline/ImageClassificationPathLocator";

export default function MultiviewFusionLocator() {
  return <ImageClassificationPathLocator current="multiview-fusion" />;
}

export function MultiviewFusionMapReturn() {
  return <ImageClassificationMapReturn current="multiview-fusion" />;
}
