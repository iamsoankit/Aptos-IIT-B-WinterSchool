import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Network, Provider } from "aptos";
import logo from "./logo.png" 

export const provider = new Provider(Network.TESTNET);
// change this to be your module account address
export const moduleAddress = "0x7d30c480ffec596ecc7ac1bb217b5ef60c475ca20cdaeb3bf657f93972b02579"
function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [counter, setCounter] = useState<number>(0);
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);

  const fetch = async () => {
    if (!account) return;
    try {
      const todoListResource = await provider.getAccountResource(
        account?.address,
        `${moduleAddress}::mycounter::CountHolder`,
      );
      let data = JSON.parse((todoListResource?.data as any).count);
      setCounter(data);
      if(reload){
        window.location.reload();
      }
    }
    catch (e: any) {
      initialize();
    }
  }

  const initialize = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::mycounter::initialize`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
    } catch (error: any) {
      console.log(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const incrementCounter = async () => {
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::mycounter::increment`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      window.location.reload();
    } catch (error: any) {
      console.log(error);
      // setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  //Runs one Time
  useEffect(() => {
    fetch();
  }, [account?.address]);

  const timer = () => { setInterval(() => { setReload(1); fetch() }, 5000); }

  //Runs every 5 second
  useEffect(() => {
    timer();
  }, [account?.address]);

  return (
    <>
      <Layout>
        <Row align="middle" justify="space-between">
          <Col style={{paddingLeft:"30px"}}>
            <img style={{zoom:"80%",height:"60px",width:"230px",marginTop:"5px"}} src={logo} alt="" />
          </Col>
          <Col style={{ textAlign: "right" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      <div style={{ position: "absolute", top: "60%", right: "46%", transform: "translate(-50%,-50%)" }}>
        <Spin spinning={transactionInProgress}>
          <Row style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <Col>
            <Col style={{bottom:"-1%",border:"5px solid black",padding:"20px",width:"90px",marginLeft:"32%"}}></Col>
             <Col style={{border:"5px solid black",padding:"20px"}}>
                <Button
                  disabled={!account}
                  block
                  onClick={incrementCounter}
                  type="primary"
                  style={{top: "0%", margin: "0",marginLeft:"", borderRadius: "50%", height: "201px", width: "201px", backgroundColor: "#EF2121", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                >
                  {/* <PlusCircleFilled style={{ fontSize: "80px" }} /> */}
                  <p style={{ fontSize: "35px"}}>Click Me!</p>
                </Button>
              </Col> 
            </Col>
          </Row>
        </Spin>
          <Row style={{ display:"flex",flexDirection:"column"}}>
                <p style={{ border:"4px solid black",display:"flex",fontSize: "40px",marginTop: "-100%", marginLeft: "180%" }}>&nbsp;Count</p>
                <p style={{ padding:"32px",border:"4px solid black",display:"flex",fontSize: "130px",marginTop: "-40%", marginLeft: "180%" }}>{counter}</p>
          </Row>
      </div>

    </>
  );
}

export default App;
