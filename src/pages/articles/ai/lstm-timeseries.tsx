import Overview from "./lstm-timeseries/Overview";
import CellArchitecture from "./lstm-timeseries/CellArchitecture";
import Training from "./lstm-timeseries/Training";
import Applications from "./lstm-timeseries/Applications";
import {
  TimeSeriesLearningLocator,
  TimeSeriesLearningMapReturn,
} from "./shared/TimeSeriesLearningLocator";

export default function LSTMTimeseriesArticle() {
  return (
    <>
      <TimeSeriesLearningLocator current="neural" />
      <Overview />
      <CellArchitecture />
      <Training />
      <Applications />
      <TimeSeriesLearningMapReturn current="neural" />
    </>
  );
}
