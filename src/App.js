import React, { useEffect, useState } from 'react';
import LitJsSdk from "@lit-protocol/sdk-browser";
import ConnectToLitProtocol from "./lit.js";

import "./style.css";

const debugOn = true;
const chain = "ethereum";

const accessControlConditions = [
  {
    contractAddress: "0x495f947276749ce646f68ac8c248420045cb7b5e",
    standardContractType: "ERC1155",
    chain: "ethereum",
    method: "balanceOf",
    parameters: [":userAddress", "25516554643345687609132242082772976464785590388745551945048061171381515059700"],
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
      authSig: JSON.parse(localStorage.getItem("lit-auth-signature")),
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
  const authSig = JSON.parse(localStorage.getItem("lit-auth-signature"));

  console.log(authSig);

  const checkAccess = async() => {
    const newJwt = await litNodeClient.getSignedToken({
      accessControlConditions,
      chain,
      authSig,
      resourceId,
    });

    setJwt(newJwt);
    localStorage.setItem('fic-basic-auth-token', newJwt);
  };

  try {
    const { payload } = LitJsSdk.verifyJwt({ jwt });
    const expired = Date.now() >= (payload.exp * 1000);

    if (expired) checkAccess();
  } catch {
    checkAccess();
  }

  return (
    <>
      {jwt ?
        <h2>You have access!</h2>
      :
        <h2>Missing NFT for access!</h2>
      }
    </>
  )
}

const App = () => {
  return (
    <>
       <ConnectToLitProtocol/>
    </>
  );
}

export default App;