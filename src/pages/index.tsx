import { Button } from "antd";
import { useContext, useEffect, useState } from "react";
import Web3AuthService from "@/services/web3Auth";
import { Web3Auth } from "@web3auth/modal";
import { SafeEventEmitterProvider, UserAuthInfo } from "@web3auth/base";
import RenderIf from "@/components/common/RenderIf";
import UserOperationService from "@/services/userOperation";
import { Presets } from "userop";
import { ethers } from "ethers";
import YourNFT from "@/components/YourNFT";
import { Web3Context } from "@/contexts/web3Context";

const Index = () => {
  const [web3AuthService, setWeb3AuthService] =
    useState<Web3AuthService | null>(
      new Web3AuthService(
        process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID
      ).buildWeb3Auth()
    );
  const [useropService, setUseropService] =
    useState<UserOperationService | null>(null);
  const [account, setAccount] = useState<Presets.Builder.SimpleAccount | null>(
    null
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
        const account = await userOpService.createAccount();
        // const balance = (await provider!.sendAsync(
        //   "eth_getBalance",
        //   account.getSender()
        // )) as ethers.BigNumber;

        // console.log(balance);

        // setBalance(balance);
        setAccount!(account);
        setUseropService!(userOpService);
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
        await web3AuthService!.disconnect();
        setIsLogin(false);
      } catch (err: any) {
        console.error(err);
      }
    }
    setLoading({ ...loading, logout: false });
  };

  const handleTransfer = async () => {
    const tx = await useropService?.simpleTransfer(
      "0x0deB52499C2e9F3921c631cb6Ad3522C576d5484",
      ethers.utils.parseEther("0.01")
    );
    console.log(tx);
  };

  return (
    <Web3Context.Provider
      value={{
        web3AuthService,
        account,
        useropService,
        setUseropService,
        setAccount,
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
        <RenderIf isTrue={isLogin && account?.getSender() !== null}>
          <p>Your address: {account && account!.getSender()}</p>
          <p>Working Chain: GOERLI</p>
          <Button
            type="primary"
            className="bg-[#1677ff]"
            onClick={handleTransfer}
            loading={loading.execute}
          >
            Simple Transfer
          </Button>
          <Button
            type="primary"
            className="bg-[#1677ff]"
            ghost={true}
            onClick={handleLogout}
            loading={loading.logout}
          >
            Logout
          </Button>
          <YourNFT address={account ? account!.getSender() : ""} />
        </RenderIf>
      </div>
    </Web3Context.Provider>
  );
};

export default Index;
