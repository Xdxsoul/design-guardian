import ICRC7 "mo:icrc7-mo";
import {logo} "./logo"

module {
  public let defaultConfig = func(caller : Principal) : ICRC7.InitArgs {
    ?{
      symbol = ?"DG";
      name = ?"Design Guardian";
      description = ?"https://inely-hqaaa-aaaab-qb4uq-cai.icp0.io/ Discover a collection of unique fashion designer creations — crafted to be worn both as video game character skins and as real-world garments and accessories.
Each NFT grants its owner exclusive access to the original source files needed to produce the garment in real life, ensuring every design remains authentic and one-of-a-kind.
Are you a fashion designer, 3D artist, or creative visionary? Join our platform, bring your ideas to life, share them with the world, and put them up for sale — so people can enjoy them both in the metaverse and in reality.";
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