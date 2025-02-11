import React, { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import _layout from "@/app/(tabs)/_layout";

const App = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <_layout />;
};

export default App;
