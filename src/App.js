import React, { useEffect, useState } from 'react';
import { ConnectToLitProtocol } from "./lit.js";

import "./style.css";

const App = () => {
  return (
    <>
       <ConnectToLitProtocol/>
    </>
  );
}

export default App;