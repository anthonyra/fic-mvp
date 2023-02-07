import React from 'react';
import { ConnectToLitProtocol, LitAccessControl } from "./lit";

import "./style.css";

const App = () => {
  return (
    <>
       <ConnectToLitProtocol/>
       <LitAccessControl/>
    </>
  );
}

export default App;