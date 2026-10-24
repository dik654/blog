import Overview from "./arima/Overview";
import Components from "./arima/Components";
import Modeling from "./arima/Modeling";
import Applications from "./arima/Applications";
import {
  TimeSeriesLearningLocator,
  TimeSeriesLearningMapReturn,
} from "./shared/TimeSeriesLearningLocator";

export default function ARIMAArticle() {
  return (
    <>
      <TimeSeriesLearningLocator current="baseline" />
      <Overview />
      <Components />
      <Modeling />
      <Applications />
      <TimeSeriesLearningMapReturn current="baseline" />
    </>
  );
}
