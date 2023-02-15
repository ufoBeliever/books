import React, { useState } from "react";
import { BooksWrapper, Input, Sort } from "./components";

function App() {
  const [searchString, setSearchString] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Relevance");

  return (
    <div className="App">
      <Input onSubmit={setSearchString} />
      <Sort value={sortBy} setValue={setSortBy} />
      <BooksWrapper searchString={searchString} sortBy={sortBy} />
    </div>
  );
}

export default App;
