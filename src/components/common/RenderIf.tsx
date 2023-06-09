import { ReactNode } from "react";

interface RenderIfProps {
  isTrue: boolean;
  children: ReactNode;
}

const RenderIf: React.FC<RenderIfProps> = ({ isTrue, children }) => {
  return isTrue ? <>{children}</> : null;
};

export default RenderIf;
