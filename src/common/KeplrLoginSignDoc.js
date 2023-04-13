export class LoginSignOptions {
  preferNoSetFee = true;
  preferNoSetMemo = true;
}

export class KeplrLoginMsgValue {
  permit_name;
  permissions = [];

  constructor(permitName) {
    this.permit_name = permitName;
  }
}

export class KeplrLoginMsg {
  type = "query_permit";
  value;

  constructor(permitName) {
    this.value = new KeplrLoginMsgValue(permitName);
  }
}

export class KeplrLoginCoin {
  amount = "0";
  denom;

  constructor(denom) {
    this.denom = denom;
  }
}

export class KeplrLoginFee {
  amount;
  gas = "1";

  constructor(denom) {
    this.amount = [new KeplrLoginCoin(denom)];
  }
}

export default class KeplrLoginSignDoc {
  account_number = "0";
  chain_id;
  fee;
  memo = "";
  msgs;
  sequence = "0";

  constructor(chainId, denom, permitName) {
    this.chain_id = chainId;
    this.fee = new KeplrLoginFee(denom);
    this.msgs = [new KeplrLoginMsg(permitName)];
  }
}
