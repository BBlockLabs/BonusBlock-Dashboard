import moment from "moment";
import jsonBigint from "json-bigint";
import UserSessionDto from "@/common/dto/UserSessionDto.js";
import { HttpResponse } from "@/common/HttpResponse.js";

export class HttpRequest {
  /**
   * @type {UserSessionDto}
   */
  session = null;
  /**
   * @param {String} endpoint
   * @param {Object} data
   * @return {HttpResponse}
   */
  static async makeRequest(endpoint, data = null) {
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

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`,
      request
    );

    if (response.status === 401) {
      // user is logged out
      this.session = null;
    }

    if (!response.ok && response.status !== 400) {
      // return this on non-400 error response
      return new HttpResponse(false, null, ["response error"], moment());
    }

    const responseText = await response.text()

    const jsonData = jsonBigint.parse(responseText);

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
