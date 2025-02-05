import React from "react";
import ChatterBot from "./ChatterBot";

function App() {
  const initialMessages = [
    { text: "Welcome to the Trip Planner!", isSystemMessage: true },
  ];

  return <ChatterBot initialMessages={initialMessages} />;
}

export default App;