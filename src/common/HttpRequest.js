import moment from "moment";
import jsonBigint from "json-bigint";
import UserSessionDto from "@/common/dto/UserSessionDto.js";
import { HttpResponse } from "@/common/HttpResponse.js";
import store from "@/state/store";
import Toast from "@/mixins/Toast.js";
import router from "@/router/router-config";

export class HttpRequest {
  /**
   * @type {UserSessionDto}
   */
  session = null;

  static parseErrorMessage(data) {
    let message = "";
    if (data.errors && data.errors.length > 0) {
      for (const k in data.errors) {
        if (message !== "") {
          message += "\n";
        }
        message += "• " + data.errors[k][0];
      }
    }
    if (!data.success && !message) {
      message = "The server failed to serve your request";
    }
    return message;
  }

  /**
   * @param {String} endpoint
   * @param {Object} data
   * @param {String} prefix
   * @return {HttpResponse}
   */
  static async makeRequest(endpoint, data = null, prefix = "dashboard") {
    let request = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (data !== null) {
      request["body"] = JSON.stringify(data);
      request["method"] = "POST";
    }

    if (this.session) {
      request["headers"]["X-Auth-Token"] = this.session.token;
    }

    let response;
    try {
      response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/${prefix}/${endpoint}`,
          request
      );
    } catch (e) {
      console.error(e);
      Toast.methods.Toast("Can't connect to server", e, "error");
      return new HttpResponse(false, null, "Network error", moment());
    }

    let errorMessage = "";
    let jsonData = null;
    try {
      const responseText = await response.text();
      jsonData = jsonBigint.parse(responseText);
      errorMessage = HttpRequest.parseErrorMessage(jsonData);
    } catch (e) {
      console.error(e);
      errorMessage = "Can't parse server response (response code " + response.status + ")";
    }
    if (!response.ok && !errorMessage) {
      errorMessage = "The server returned error code " + response.status;
    }
    if (errorMessage) {
      console.error(errorMessage);
      let title = (response.status === 401) ? "Session expired" : "backend error";
      Toast.methods.Toast("Server returned an error", errorMessage, "error");
    }

    if (response.status === 401) {
      // user is logged out
      this.session = null;
      store.commit("Auth/setUser", null, { root: true });
      store.commit("Project/setProject", null, { root: true });
      store.commit("Campaign/clearCampaigns", null, { root: true });
      Toast.methods.Toast("Session expired", errorMessage, "warning");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpire");
      HttpRequest.setSession(null, null);
      router.push("/");
    }

    if (!response.ok && response.status !== 400) {
      // return this on non-400 error response
      return new HttpResponse(false, null, errorMessage, moment());
    }

    const responseBody = new HttpResponse(
      jsonData.success,
      jsonData.payload,
      jsonData.errors,
      moment(jsonData.now)
    );

    if (!responseBody.success) {
      return responseBody;
    }

    if (jsonData.payload && jsonData.payload.session) {
      // auto-populate session info from server response
      HttpRequest.setSession(
        jsonData.payload.session.token,
        moment(jsonData.payload.session.expiresOn)
      );

      localStorage.setItem("token", this.session.token);
      localStorage.setItem("tokenExpire", this.session.expiresOn.toISOString());
    }

    return responseBody;
  }
  /**
   * @param {String} token
   * @param {moment.Moment} expiresOn
   */
  static setSession(token, expiresOn) {
    if (token == null && expiresOn == null) {
      this.session = null;
    } else {
      this.session = new UserSessionDto({
        token: token,
        expiresOn: expiresOn,
      });
    }
  }
}
