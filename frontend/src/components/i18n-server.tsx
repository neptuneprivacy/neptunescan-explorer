import React from "react";
import I18N from "./i18n";

export type II18NServerProps = {
  children: React.ReactNode;
};

const I18NServer = ({ children }: II18NServerProps) => {
  return <I18N locale={"en"}>{children}</I18N>;
};

export default I18NServer;
