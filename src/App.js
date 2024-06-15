import React, { useState } from "react";
import { UserProvider } from "./UserContext"; // Import the UserProvider
import RouteWrapper from "./RouteWrapper";

const App = () => {
  return (
    <UserProvider>
      <RouteWrapper />
    </UserProvider>
  );
};

export default App;
