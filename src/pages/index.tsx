import { Button } from "antd";
import { useState } from "react";
import Web3AuthService from "@/services/web3Auth";
import RenderIf from "@/components/common/RenderIf";
import UserOperationService from "@/services/userOperation";
import { ethers } from "ethers";
import YourNFT from "@/components/YourNFT";
import { Web3Context, Web3StoreInterface } from "@/contexts/web3Context";
import ExecutionOpService from "@/services/executionOp";
import Listing from "@/components/Listing";

const Index = () => {
  const [store, setStore] = useState<Web3StoreInterface | null>(null);
  const web3AuthService = new Web3AuthService(
    process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID
  ).buildWeb3Auth();
  const [balance, setBalance] = useState<ethers.BigNumber>(
    ethers.BigNumber.from(0)
  );

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState({
    login: false,
    logout: false,
    execute: false,
  });

  const handleLogin = async () => {
    setLoading({ ...loading, login: true });

    console.log(web3AuthService);
    if (web3AuthService !== null) {
      try {
        await web3AuthService.initialize();
        await web3AuthService.connect();
        const [privateKey] = await Promise.all([
          web3AuthService.getPrivateKey(),
        ]);
        const userOpService = new UserOperationService(privateKey);
        await userOpService.createAccount();
        const executionOpService = new ExecutionOpService(userOpService);
        await executionOpService.buildClient();
        const account = userOpService.getAccount();
        const balance = await userOpService.getBalance();

        setBalance(balance);
        setStore({
          web3AuthService,
          userOpService,
          executionOpService,
          account,
        });
        setIsLogin(true);
      } catch (err: any) {
        console.error(err);
      }
    }
    setLoading({ ...loading, login: false });
  };

  const handleLogout = async () => {
    setLoading({ ...loading, logout: true });
    if (web3AuthService !== null) {
      try {
        await web3AuthService.disconnect();
        setIsLogin(false);
      } catch (err: any) {
        console.error(err);
        window.location.reload();
      }
    }
    window.localStorage.removeItem("openlogin_store");
    setLoading({ ...loading, logout: false });
  };

  return (
    <Web3Context.Provider
      value={{
        store,
      }}
    >
      <div id="home" className="px-[12px]">
        <RenderIf isTrue={!isLogin}>
          <Button
            type="primary"
            className="bg-[#1677ff]"
            onClick={handleLogin}
            loading={loading.login}
          >
            Login
          </Button>
        </RenderIf>
        <RenderIf isTrue={isLogin && store?.account.getSender() !== null}>
          <p>Your address: {store && store?.account.getSender()}</p>
          <p>Your balance: {ethers.utils.formatEther(balance.toString())}</p>
          <p>Working Chain: GOERLI</p>
          <Button
            type="primary"
            className="bg-[#1677ff]"
            ghost={true}
            onClick={handleLogout}
            loading={loading.logout}
          >
            Logout
          </Button>
          <YourNFT address={store?.account ? store.account.getSender() : ""} />
          <Listing />
        </RenderIf>
      </div>
    </Web3Context.Provider>
  );
};

export default Index;
