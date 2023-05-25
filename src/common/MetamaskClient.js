import ERC20abi from "@/assets/ERC20_abi.json";
import { ethers } from "ethers";

export class MetamaskClient {
  static async requestAccounts(provider) {
    const accounts = await provider.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      return accounts;
    }

    try {
      return await provider.request({ method: "eth_requestAccounts" });
    } catch (e) {
      if (e.code === -32603 || e.message === "An internal error has occurred") {
        /**
         * Brave browser error -32602 happens when there is no metamask and
         * there is no wallet connected to brave browser itself - in which case brave
         * also opens a new tab to add wallet, but we cannot prevent that.
         */
        throw new Error(
          "Could not connect to a wallet. Please verify that a wallet is added and reload the page."
        );
      }

      throw e;
    }
  }

  static async signMessage(provider, params) {
    try {
      return await provider.request({
        method: "personal_sign",
        params: params,
      });
    } catch (e) {
      if (e.code === 4001 || e.message === "The user rejected the request.") {
        /**
         * Brave browser and Metamask error 4001
         * happens when user rejects the sign request
         */
        throw new Error("Sign request rejected, can't connect.");
      }

      throw e;
    }
  }

  /**
   *
   * @param {Object} provider
   * @param {string} to
   * @param {BigInt} value
   * @param {string} data
   * @return {Promise<void>}
   */
  static async sendTransaction(provider, to, value, data) {
    try {
      const accounts = await MetamaskClient.requestAccounts(provider);
      if (accounts.length === 0) {
        throw new Error("Accounts is empty");
      }
      await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: to,
            value: value.toString(16),
            data: data,
          },
        ],
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   *
   * @param {string} tokenScAddress
   * @param {string} ourScAddress
   * @param {BigInt} amountToApprove
   */
  static async approve(tokenScAddress, ourScAddress, amountToApprove) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenScAddress, ERC20abi, signer);
    await contract.approve(ourScAddress, amountToApprove);
  }
}
