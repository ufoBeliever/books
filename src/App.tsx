import React from "react";
import { Input } from "./components";

function App() {
  return (
    <div className="App">
      <Input onSubmit={(a: string) => console.log(a)} />
    </div>
  );
}

export default App;
