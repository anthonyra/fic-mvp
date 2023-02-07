import { ABI_LIT, ALL_LIT_CHAINS, LOCAL_STORAGE_KEYS } from "@lit-protocol/constants";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

const debugOn = true;

export const ConnectToLitProtocol = () => {
  const [isReady, setIsReady] = useState(false);

  const handleReadyStatus = () => {
    setIsReady(window.litNodeClient.ready);
  }

  const connectToLit = async() => {
     await LitNodeClient.checkAndSignAuthMessage({
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
  };

  useEffect (() => {
    connectToLit();
    document.addEventListener("lit-ready", handleReadyStatus);
    
    return () => {
      document.removeEventListener('lit-ready');
    };
  }, []);
  
  if (isReady) {
    return (
      <>
        <h1>Is Ready!</h1>
      </>
    )
  } else {
    return (
      <Loading/>
    )
  }
}
