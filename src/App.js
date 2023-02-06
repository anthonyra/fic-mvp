import React, { useEffect, useState } from 'react';
import LitJsSdk from "@lit-protocol/sdk-browser";

import "./style.css";

const debugOn = true;
const chain = "ethereum";
const tokenId = "25516554643345687609132242082772976464785590388745551945048061171381515059700";
const contractAddress = "0x495f947276749ce646f68ac8c248420045cb7b5e";

const accessControlConditions = [
  {
    contractAddress: contractAddress,
    standardContractType: "ERC1155",
    chain: chain,
    method: "balanceOf",
    parameters: [":userAddress", tokenId],
    returnValueTest: {
      comparator: ">",
      value: "0",
    },
  },
];

const resourceId = {
  baseUrl: "forgedincrypto.com",
  path: "/home.html",
  orgId: "",
  role: "",
  extraData: ""
};

function Loading() {
  return (
    <h1>Connecting to the Lit Protocol</h1>
  )
};

function ProvisionAccess() {
  const provisionAccess = async() => {
    console.log("Provisioning Access..");

    await litNodeClient.saveSigningCondition({
      accessControlConditions: accessControlConditions,
      chain: chain,
      authSig: localStorage.getItem("lit-auth-signature"),
      resourceId: resourceId,
    });

    console.log("Provisioning Completed!");
  }

  return (
    <>
      <h2>Provision access to a resource</h2>
      <button onClick={provisionAccess}>Provision access</button>
    </>
  )
}

function LitAccessControl() {
  const [ jwt, setJwt ] = useState(localStorage.getItem('fic-basic-auth-token'));

  const getJwt = async() => {
    window.jwt = await litNodeClient.getSignedToken({
      accessControlConditions: accessControlConditions,
      chain: chain,
      authSig: localStorage.getItem("lit-auth-signature"),
      resourceId: resourceId,
    });

    setJwt(window.jwt);
    localStorage.setItem('fic-basic-auth-token', window.jwt);
  };

  return (
    <>
      {jwt ? 
        <h1>You have access!</h1>
      :
        <>
          <h2>Request a JWT to authenticate the user</h2>
          <button onClick={getJwt}>Request JWT</button>
        </>
      }
    </>
  )
}

function ConnectToLitProtocol() {
  const [isReady, setIsReady] = useState(false);

  const handleReadyStatus = (event) => {
    setIsReady(window.litNodeClient.ready);
  }

  const connectToLit = async() => {
    await LitJsSdk.checkAndSignAuthMessage({
      chain: "ethereum",
      debug: debugOn
    });

    if (!window.useLitPostMessageProxy) {
      const litNodeClient = new LitJsSdk.LitNodeClient({ debug: debugOn });
      litNodeClient.connect();
      window.litNodeClient = litNodeClient;
    }
  };

  useEffect (() => {
    connectToLit();
    document.addEventListener("lit-ready", handleReadyStatus);
    
    return () => {
      document.removeEventListener('lit-ready', handleReadyStatus);
    };
  }, []);
  
  if (isReady) {
    return (
      <>
        <ProvisionAccess/>
        <LitAccessControl/>
      </>
    )
  } else {
    return (
      <Loading/>
    )
  }
}

const App = () => {
  return (
    <>
       <ConnectToLitProtocol/>
    </>
  );
}

export default App;