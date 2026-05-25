"use client";

import { useState } from "react";

export function useTogglePassword() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((previous) => !previous);
  };

  return {
    isVisible,
    inputType: isVisible ? "text" : "password",
    toggleVisibility,
  };
}