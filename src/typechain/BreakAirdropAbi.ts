/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface BreakAirdropAbiInterface extends ethers.utils.Interface {
  functions: {
    "airDropBalance()": FunctionFragment;
    "airDropPerUser()": FunctionFragment;
    "airdropAmount(address)": FunctionFragment;
    "changeOwner(address)": FunctionFragment;
    "claim()": FunctionFragment;
    "createAirDrop(uint256,address[])": FunctionFragment;
    "isAirdrop(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "removeFromAirDrop(address[])": FunctionFragment;
    "xchain()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "airDropBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "airDropPerUser",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "airdropAmount",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "changeOwner", values: [string]): string;
  encodeFunctionData(functionFragment: "claim", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "createAirDrop",
    values: [BigNumberish, string[]]
  ): string;
  encodeFunctionData(functionFragment: "isAirdrop", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "removeFromAirDrop",
    values: [string[]]
  ): string;
  encodeFunctionData(functionFragment: "xchain", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "airDropBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "airDropPerUser",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "airdropAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createAirDrop",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isAirdrop", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeFromAirDrop",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "xchain", data: BytesLike): Result;

  events: {};
}

export interface BreakAirdropAbi extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BreakAirdropAbiInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    airDropBalance(overrides?: CallOverrides): Promise<[BigNumber]>;

    airDropPerUser(overrides?: CallOverrides): Promise<[BigNumber]>;

    airdropAmount(
      _address: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    changeOwner(
      _newAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createAirDrop(
      _amount: BigNumberish,
      _airDropList: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isAirdrop(_address: string, overrides?: CallOverrides): Promise<[boolean]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    removeFromAirDrop(
      _list: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    xchain(overrides?: CallOverrides): Promise<[string]>;
  };

  airDropBalance(overrides?: CallOverrides): Promise<BigNumber>;

  airDropPerUser(overrides?: CallOverrides): Promise<BigNumber>;

  airdropAmount(
    _address: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  changeOwner(
    _newAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claim(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createAirDrop(
    _amount: BigNumberish,
    _airDropList: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isAirdrop(_address: string, overrides?: CallOverrides): Promise<boolean>;

  owner(overrides?: CallOverrides): Promise<string>;

  removeFromAirDrop(
    _list: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  xchain(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    airDropBalance(overrides?: CallOverrides): Promise<BigNumber>;

    airDropPerUser(overrides?: CallOverrides): Promise<BigNumber>;

    airdropAmount(
      _address: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    changeOwner(_newAddress: string, overrides?: CallOverrides): Promise<void>;

    claim(overrides?: CallOverrides): Promise<void>;

    createAirDrop(
      _amount: BigNumberish,
      _airDropList: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    isAirdrop(_address: string, overrides?: CallOverrides): Promise<boolean>;

    owner(overrides?: CallOverrides): Promise<string>;

    removeFromAirDrop(
      _list: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    xchain(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    airDropBalance(overrides?: CallOverrides): Promise<BigNumber>;

    airDropPerUser(overrides?: CallOverrides): Promise<BigNumber>;

    airdropAmount(
      _address: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    changeOwner(
      _newAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createAirDrop(
      _amount: BigNumberish,
      _airDropList: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isAirdrop(_address: string, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    removeFromAirDrop(
      _list: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    xchain(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    airDropBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    airDropPerUser(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    airdropAmount(
      _address: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    changeOwner(
      _newAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createAirDrop(
      _amount: BigNumberish,
      _airDropList: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isAirdrop(
      _address: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeFromAirDrop(
      _list: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    xchain(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
