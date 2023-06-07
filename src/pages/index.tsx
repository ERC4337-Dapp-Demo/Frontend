import { Button } from "antd";
import { useEffect, useState } from "react";
import Web3AuthService from "@/services/web3Auth";
import { Web3Auth } from "@web3auth/modal";
import { SafeEventEmitterProvider, UserAuthInfo } from "@web3auth/base";
import RenderIf from "@/components/common/RenderIf";
import UserOperationService from "@/services/userOperation";
import { Presets } from "userop";
import { ethers } from "ethers";

const Index = () => {
  const [web3AuthService, setWeb3AuthService] =
    useState<Web3AuthService | null>(
      new Web3AuthService(process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID)
    );
  const [useropService, setUseropService] =
    useState<UserOperationService | null>(null);

  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [account, setAccount] = useState<Presets.Builder.SimpleAccount | null>(
    null
  );
  const [balance, setBalance] = useState<ethers.BigNumber>(
    ethers.BigNumber.from(0)
  );
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserAuthInfo | null>(null);

  const [loading, setLoading] = useState({
    login: false,
    logout: false,
    execute: false,
  });

  const handleLogin = async () => {
    setLoading({ ...loading, login: true });

    if (web3AuthService !== null) {
      try {
        const web3Auth = web3AuthService.buildWeb3Auth();
        setWeb3Auth(web3Auth);
        await web3AuthService.initialize();
        const provider = await web3AuthService.connect();
        const [privateKey, userInfo] = await Promise.all([
          web3AuthService.getPrivateKey(),
          web3AuthService.authenticateUser(),
        ]);
        const userOpService = new UserOperationService(privateKey);
        const account = await userOpService.createAccount();
        // const balance = (await provider!.sendAsync(
        //   "eth_getBalance",
        //   account.getSender()
        // )) as ethers.BigNumber;

        // console.log(balance);

        // setBalance(balance);
        setAccount(account);
        setUseropService(userOpService);
        setPrivateKey(privateKey);
        setUserInfo(userInfo);
        setProvider(provider);
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
        setProvider(null);
        setIsLogin(false);
        setPrivateKey("");
      } catch (err: any) {
        console.error(err);
      }
    }
    setLoading({ ...loading, logout: false });
  };

  const handleTransfer = async () => {
    const tx = await useropService?.simpleTransfer(
      "0x0deB52499C2e9F3921c631cb6Ad3522C576d5484",
      ethers.BigNumber.from("0.5")
    );
    console.log(tx);
  };

  return (
    <>
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
      <RenderIf isTrue={isLogin}>
        <p>Your address: {account?.getSender()}</p>
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
      </RenderIf>
    </>
  );
};

export default Index;
