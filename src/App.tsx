import React, { useState } from "react";
import { BooksWrapper, Input } from "./components";

function App() {
  const [searchString, setSearchString] = useState<string>("");
  return (
    <div className="App">
      <Input onSubmit={setSearchString} />
      <BooksWrapper searchString={searchString} />
    </div>
  );
}

export default App;
