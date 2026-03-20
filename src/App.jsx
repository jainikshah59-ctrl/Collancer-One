/* eslint-disable */
import React, { useState } from 'react';
import { Styles, AnimBg, BizSplashScreen, RoleSelectPage } from './shared';
import { BizApp } from './BizApp';
import { CreatorApp } from './CreatorApp';

export default function App() {
  const [phase, setPhase] = useState("splash");   // splash | role | biz | creator
  const [roleEntering, setRoleEntering] = useState(false);

  const handleSplashDone = () => {
    setPhase("role");
  };

  const handleRoleSelect = (role) => {
    setRoleEntering(true);
    setTimeout(() => {
      setPhase(role === "business" ? "biz" : "creator");
      setRoleEntering(false);
    }, 520);
  };

  if (phase === "splash") {
    return (
      <><Styles/><AnimBg/>
        <BizSplashScreen onDone={handleSplashDone}/>
      </>
    );
  }

  if (phase === "role") {
    return (
      <><Styles/><AnimBg/>
        <RoleSelectPage onSelect={handleRoleSelect}/>
      </>
    );
  }

  if (phase === "biz") {
    return <BizApp/>;
  }

  return <CreatorApp/>;
}

