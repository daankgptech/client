import Intake2020Data from "./Intake2020Data";
import Intake2021Data from "./Intake2021Data";
import Intake2022Data from "./Intake2022Data";
import Intake2023Data from "./Intake2023Data";
import Intake2024Data from "./Intake2024Data";
import Intake2025Data from "./Intake2025Data";

const batchDataMap = {
  2025: {
    data: Intake2025Data,
    label: "'25",
    defaultCount: 42,
    year: "First Years",
  },
  2024: {
    data: Intake2024Data,
    label: "'24",
    defaultCount: 46,
    year: "Second Years",
  },
  2023: {
    data: Intake2023Data,
    label: "'23",
    defaultCount: 35,
    year: "Third Years",
  },
  2022: {
    data: Intake2022Data,
    label: "'22",
    defaultCount: 27,
    year: "Fourth Years",
  },
  2021: {
    data: Intake2021Data,
    label: "'21",
    defaultCount: 17,
    year: "Fifth Years",
  },
  2020: {
    data: Intake2020Data,
    label: "'20",
    defaultCount: 9,
    year: "Graduated!",
  },
};

export default batchDataMap;
