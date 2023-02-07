// import { ABI_LIT, ALL_LIT_CHAINS, LOCAL_STORAGE_KEYS } from "@lit-protocol/constants";
import { useEffect, useState } from 'react';
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { saveSigningCondition } from "@lit-protocol/sdk-browser";

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

export default ConnectToLitProtocol = () => {
  const [isReady, setIsReady] = useState(false);

  const handleReadyStatus = () => {
    setIsReady(window.litNodeClient.ready);
  }

  useEffect (() => {
    connectToLit();
    document.addEventListener("lit-ready", handleReadyStatus);
    
    return () => {
      document.removeEventListener('lit-ready');
    };
  }, []);

  (async() => {
    await LitJsSdk.checkAndSignAuthMessage({
      chain: "ethereum",
      debug: debugOn
    });

    if (!window.useLitPostMessageProxy) {
      const litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: 'serrano',
        debug: debugOn 
      });

      litNodeClient.connect();
      window.litNodeClient = litNodeClient;
    }
  });

  return (
    isReady ? <h1>Is Ready!</h1> : <h1>Connecting to Lit Protocol Nodes...</h1>
  )
}

export default ProvisionAccess = () => {
  const provisionAccess = async() => {
    console.log("Provisioning Access..");

    await saveSigningCondition({
      accessControlConditions,
      chain,
      authSig: JSON.parse(localStorage.getItem("lit-auth-signature")),
      resourceId,
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

export default LitAccessControl = () => {
  const [ jwt, setJwt ] = useState(localStorage.getItem('fic-basic-auth-token'));
  const authSig = JSON.parse(localStorage.getItem("lit-auth-signature"));

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