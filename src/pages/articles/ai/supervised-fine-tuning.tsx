import Overview from "./supervised-fine-tuning/Overview";
import DataContract from "./supervised-fine-tuning/DataContract";
import Objective from "./supervised-fine-tuning/Objective";
import TeacherForcing from "./supervised-fine-tuning/TeacherForcing";
import Packing from "./supervised-fine-tuning/Packing";
import Evaluation from "./supervised-fine-tuning/Evaluation";

export default function SupervisedFineTuningArticle() {
  return <><Overview /><DataContract /><Objective /><TeacherForcing /><Packing /><Evaluation /></>;
}
