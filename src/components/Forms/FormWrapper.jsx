import { useParams, Navigate } from "react-router-dom";

import Farewell from "./Farewell";
import Feature from "./Feature";
import TechTeam from "./TechTeam";
import DataUpdate from "./DataUpdate";
import CakeDesignCompetition from "./CakeDesignCompetition";
import Tshirt from "./Tshirt";

const formComponents = {
  "farewell": Farewell,
  "feature": Feature,
  "tech-team": TechTeam,
  "data-update": DataUpdate,
  "cake-design-competition": CakeDesignCompetition,
  "tshirt": Tshirt,
};

const FormWrapper = () => {
  const { name } = useParams();
  const FormComponent = formComponents[name];

  if (!FormComponent) {
    return <Navigate to="/forms" replace />;
  }

  return <FormComponent />;
};

export default FormWrapper;
