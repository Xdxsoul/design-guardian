import ICRC7 "mo:icrc7-mo";
import {logo} "./logo"

module {
  public let defaultConfig = func(caller : Principal) : ICRC7.InitArgs {
    ?{
      symbol = ?"DG";
      name = ?"Design Guardian";
      description = ?"https://inely-hqaaa-aaaab-qb4uq-cai.icp0.io/ Mint your creations as ICRC-7 NFTs on ICP — unique, on-chain fashion assets with customizable metadata. 
      Securely minted, visible in our gallery, and ready for future use as digital skins.";
      logo = ?logo;
      supply_cap = null;
      allow_transfers = null;
      max_query_batch_size = ?100;
      max_update_batch_size = ?100;
      default_take_value = ?1000;
      max_take_value = ?10000;
      max_memo_size = ?512;
      permitted_drift = null;
      tx_window = null;
      burn_account = null; //burned nfts are deleted
      deployer = caller;
      supported_standards = null;
    };
  };
};