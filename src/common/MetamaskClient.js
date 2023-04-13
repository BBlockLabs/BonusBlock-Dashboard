import { ElMessageBox } from "element-plus";

export class MetamaskClient {
  static async metamaskLogin(store, referrer = null) {
    // if (!MetamaskClient.isMetamaskAgent() && MetamaskClient.canSwitchAgent()) {
    //   window.location.href = `https://metamask.app.link/dapp/${window.location.href}?metamask-login`;
    //
    //   return;
    // }

    store.commit("setLoading", true);

    try {
      await store.dispatch("UserModule/metamaskLogin", referrer);
    } catch (e) {
      console.error(e);
      await ElMessageBox.alert(
        "There was an error connecting your wallet, please try again.",
        "Error",
        {
          center: true,
        }
      );

      return Promise.reject();
    } finally {
      store.commit("setLoading", false);
    }
  }

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
}
