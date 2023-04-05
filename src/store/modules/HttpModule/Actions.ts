import type { Action, ActionContext, ActionTree, Store } from "vuex";
import type { StateInterface as RootStateInterface } from "@/store/State";
import HttpResponse from "@/common/api/HttpResponse";
import type KeplrCheckResponseRequest from "@/common/api/KeplrCheckResponseRequest";
import type LoginResponse from "@/common/api/LoginResponse";
import type KeplrUnlinkWalletRequest from "@/common/api/KeplrUnlinkWalletRequest";
import HttpCallNotSuccessfulError from "@/common/errors/HttpCallNotSuccessfulError";
import FormattedError from "@/common/errors/FormattedError";
import type MetamaskConnectRequest from "@/common/api/MetamaskConnectRequest";
import type CalculationResultDto from "@/common/api/dto/CalculationResultDto";
import HttpUnauthorizedError from "@/common/errors/HttpUnauthorizedError";

export type Context = ActionContext<{}, RootStateInterface>;
export type HttpAction = Action<{}, RootStateInterface>;

export interface ActionsInterface extends ActionTree<{}, RootStateInterface> {
  getStatus: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context
    ) => Promise<LoginResponse>);

  getAuthTicket: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: string
    ) => Promise<string>);
  keplrCheckResponse: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: KeplrCheckResponseRequest
    ) => Promise<LoginResponse>);
  connectEthereum: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: MetamaskConnectRequest
    ) => Promise<LoginResponse>);
  terminateSession: HttpAction &
    ((this: Store<RootStateInterface>, context: Context) => Promise<void>);

  getCalculationResults: HttpAction &
    ((
      this: Store<RootStateInterface>,
      context: Context
    ) => Promise<Array<CalculationResultDto>>);
}

export default class Actions implements ActionsInterface {
  [key: string]: Action<{}, RootStateInterface>;

  private static getBadResponseError(code: number): Error {
    if (code === 401) {
      return new HttpUnauthorizedError();
    }

    return new HttpCallNotSuccessfulError();
  }

  getStatus = async (context: Context): Promise<LoginResponse> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/get-status`,
      {
        headers: {
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
      }
    );

    if (!response.ok) {
      throw Actions.getBadResponseError(response.status);
    }

    const responseData = await HttpResponse.fromResponse<LoginResponse>(
      response
    );

    if (!responseData.success) {
      console.error(responseData);
      throw new HttpCallNotSuccessfulError();
    }

    return responseData.payload;
  };

  getAuthTicket = async (
    context: Context,
    payload: string
  ): Promise<string> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/get-auth-ticket`,
      {
        body: JSON.stringify({ nonce: payload }),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    if (!response.ok) {
      throw Actions.getBadResponseError(response.status);
    }

    const responseData = await HttpResponse.fromResponse<string>(response);

    if (!responseData.success) {
      console.error(responseData);
      throw new HttpCallNotSuccessfulError();
    }

    return responseData.payload;
  };

  keplrCheckResponse = async (
    context: Context,
    payload: KeplrCheckResponseRequest
  ): Promise<LoginResponse> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/cosmos`,
      {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    if (!response.ok && response.status !== 400) {
      throw Actions.getBadResponseError(response.status);
    }

    const responseData = await HttpResponse.fromResponse<LoginResponse>(
      response
    );

    if (!responseData.success) {
      if (
        responseData.errors &&
        responseData.errors[0] &&
        responseData.errors[0].includes("Cannot get wallet/staking data")
      ) {
        throw new FormattedError(
          "Cannot get wallet/staking data, please try again later or contact an administrator."
        );
      } else if (
        responseData.errors &&
        responseData.errors[0] &&
        responseData.errors[0].includes("Wallet address already in use")
      ) {
        throw new FormattedError("Wallet is already attached to an account.");
      } else {
        console.error(responseData);
        throw new HttpCallNotSuccessfulError();
      }
    }

    return responseData.payload;
  };

  connectEthereum = async (
    context: Context,
    payload: MetamaskConnectRequest
  ): Promise<LoginResponse> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/eth`,
      {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
        method: "POST",
      }
    );

    if (!response.ok && response.status !== 400) {
      throw Actions.getBadResponseError(response.status);
    }

    const responseData = await HttpResponse.fromResponse<LoginResponse>(
      response
    );

    if (!responseData.success) {
      if (
        responseData.errors &&
        responseData.errors[0] &&
        responseData.errors[0].includes("Wallet address already in use")
      ) {
        throw new FormattedError("Wallet is already attached to an account.");
      } else {
        console.error(responseData);
        throw new HttpCallNotSuccessfulError();
      }
    }

    return responseData.payload;
  };

  terminateSession = async (context: Context): Promise<void> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
      {
        headers: {
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // All good, user is logged out
        return;
      }

      throw Actions.getBadResponseError(response.status);
    }

    const responseData = await HttpResponse.fromResponse<null>(response);

    if (!responseData.success) {
      console.error(responseData);
      throw new HttpCallNotSuccessfulError();
    }
  };

  getCalculationResults = async (
    context: Context
  ): Promise<Array<CalculationResultDto>> => {
    const response: Response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/bonus-results`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": context.rootState.UserModule?.token || "",
        }
      }
    );

    if (!response.ok) {
      throw Actions.getBadResponseError(response.status);
    }

    const responseData = await HttpResponse.fromResponse<Array<CalculationResultDto>>(response);

    if (!responseData.success) {
      console.error(responseData);
      throw new HttpCallNotSuccessfulError();
    }

    return responseData.payload;
  };
}