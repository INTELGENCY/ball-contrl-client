import { useParams } from "react-router-dom";

const DynamicRoute = ({ component: Component }) => {
  const params = useParams();
  return <Component {...params} />;
};

export default DynamicRoute;
