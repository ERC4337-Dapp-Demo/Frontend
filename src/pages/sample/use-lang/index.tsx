import { Button } from "antd";

import useTranslate from "@/hooks/useTranslate";

const UseLang = () => {
  const { translate, changeLanguage } = useTranslate();

  return (
    <div>
      <h2>{translate.sample.avatar}</h2>
      <p>{translate.sample.banner}</p>
      <Button onClick={() => changeLanguage("vi")}>Vi</Button>
      <Button onClick={() => changeLanguage("en")}>En</Button>
      <Button onClick={() => changeLanguage("jp")}>Jp</Button>
    </div>
  );
};

export default UseLang;
