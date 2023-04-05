import type Chain from "@/common/Chain";
import type { Plugins } from "@/common/Plugins";
import type { StateInterface as UserModule } from "@/store/modules/UserModule/State";

export interface StateInterface {
  chains: Array<Chain>;
  UserModule?: UserModule;
  loading: boolean;
  plugins: Array<Plugins>;
}

export class State implements StateInterface {
  chains = [];
  loading: boolean = false;
  plugins: Array<Plugins> = [];
}
