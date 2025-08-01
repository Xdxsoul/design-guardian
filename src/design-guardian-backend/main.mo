import Map "mo:map/Map";
import Principal "mo:base/Principal";
import Types "./types";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Utils "./utils";
import { print } "mo:base/Debug";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor {

  type User = Types.User;
  type Design = Types.Design;
  type DesignId = Types.DesignId;
  public type KindDesign = Types.KindDesign;
  

  stable let users = Map.new<Principal, User>();
  stable let designs = Map.new<DesignId, Design>();
  stable let trashDesigns = Map.new<DesignId, Design>(); 

  stable var lastDesignID = 0;

  public shared ({ caller }) func whoAmi(): async Principal {
    caller
  };

  public func getLetra(name: Text): async Text {
    name # " Hola"
  };


  public shared ({ caller }) func register({name: Text; email: ?Text; avatar: ?Blob}): async Result.Result<User, Text> {
    if(Principal.isAnonymous(caller)) {
      return #err("Error - anonymous caller");
    };
    switch (Map.get<Principal, User>(users, Map.phash, caller)) {
      case (?user) { #ok(user) };
      case null {
        if (Utils.validateUserDataInit(name, email)) {
          let newUser: User = {
            id: Principal = caller;
            registerDate: Int = Time.now();
            name: Text = name;
            bio = null;
            logo = null;
            avatar;
            email: ?Text = email;
            phone: ?Nat = null;
            followeds: [Principal] = [];
            followers: [Principal] = [];
            designs: [DesignId] = [];
            preferences: Types.Preferences = Types.defaultPreferences;
            account: ?Types.Account = null;
          };
          ignore Map.put<Principal, User>(users, Map.phash, caller, newUser);
          #ok(newUser)
        } else {
          #err("Error register data init")
        }
      }
    }
  };

  public shared ({ caller }) func logIn(): async ?User {
    let response = Map.get<Principal, User>(users, Map.phash, caller);
    response
  };

  public shared ({ caller }) func editProfile({name: Text; email: ?Text; phone: ?Nat}): async ?User{
    let user = Map.get<Principal, User>(users, Map.phash, caller);
    switch user {
      case null null;
      case ( ?user ) {
        if(Utils.validateUserDataInit(name, email)){
          let updateUser = {user with name; email; phone};
          ignore Map.put<Principal, User>(users, Map.phash, caller, updateUser);
          ?updateUser
        } else {
          ?user
        }
      }
    }
  };

  public shared ({ caller }) func loadAvatar(avatar: ?Blob): async Bool {
    let user = Map.get<Principal, User>(users, Map.phash, caller);
    switch user {
      case null { false };
      case ( ?user ) {
        ignore Map.put<Principal, User>(users, Map.phash, caller, {user with avatar });
        true
      }
    }
  };

  public shared ({ caller }) func loadLogo(logo: ?Blob): async Bool {
    let user = Map.get<Principal, User>(users, Map.phash, caller);
    switch user {
      case null { false };
      case ( ?user ) {
        ignore Map.put<Principal, User>(users, Map.phash, caller, {user with logo });
        true
      }
    }
  };

  // CRUD Designs

  public shared ({ caller }) func createDesign(data: Types.DesignDataInit): async {#Ok: Nat; #Err: Text}{
    let user = Map.get<Principal, User>(users, Map.phash, caller);
    switch user {
      case null { return #Err("Caller is not an user") };
      case ( ?user ) {
        let {name; sourceFiles; kind; description; coverImage} = data;
        lastDesignID += 1;
        let design: Design = {
          id = lastDesignID;
          kind;
          name;
          description;
          creator: Principal = caller;
          creatorName = user.name;
          visible3DRendering = true;
          dateCreation: Int = Time.now();
          lastModification: Int = Time.now();
          sourceFiles: [Types.File] = sourceFiles;
          coverImage
        };
        ignore Map.put<DesignId, Design>(designs, Map.nhash, design.id, design);
        let updateDesignIds = Array.tabulate<DesignId>(
          user.designs.size() + 1,
          func i = if (i < user.designs.size()) { user.designs[i] } else { design.id }
        );
        ignore Map.put<Principal, User>(
          users, 
          Map.phash,
          caller,
          {user with designs = updateDesignIds}
        );
        #Ok(lastDesignID)
      }
    }  
  };

  public shared ({ caller }) func getMyGalery(): async [Types.DesignPreview]{
    let user = Map.get<Principal, User>(users, Map.phash, caller);
    switch user {
      case null { return [] };
      case ( ?user ) {
        getDesignsPreviewList(user.designs)
      }
    }
  };

  func getDesignsPreviewList(ids: [Nat]): [Types.DesignPreview] {
    let bufferResult = Buffer.Buffer<Types.DesignPreview>(0);
    for(id in ids.vals()){
      switch(Map.get<DesignId, Design>(designs, Map.nhash, id)){
        case ( ?design ) {
          bufferResult.add(design)
        };
        case _ {}
      };
    };
    Buffer.toArray(bufferResult)
  };

  public shared ({ caller }) func readDesign(id: Nat): async ?Design {
    let design = Map.get<DesignId, Design>(designs, Map.nhash, id);
    switch design {
      case ( null ) { return null};
      case ( ?design ) {
        if (caller == design.creator) {
          return (?design)
        } else {
          return null
        }
      } 
    }
  };

  public query func feed(): async [Types.DesignPreview]{
    let arrayDesigns = Iter.toArray(Map.vals<DesignId, Design>(designs));
    let size = if (arrayDesigns.size() < 30) { arrayDesigns.size() } else { 30 };
    Array.tabulate<Types.DesignPreview>( size, func i = arrayDesigns[i] )
  };

  public shared ({ caller }) func updateDesign(id: Nat, sourceFiles: [Types.File]): async ?Design {
    let design = Map.get<DesignId, Design>(designs, Map.nhash, id);
    switch design {
      case ( null ) { return null};
      case ( ?design ) {
        if (caller != design.creator) {
          return ( null )
        } else {
          let updatedDesign: Design = {
            design with 
            sourceFiles;
            lastModification = Time.now();
          };
          ignore Map.put<DesignId, Design>(designs, Map.nhash, id, updatedDesign);
          ?updatedDesign
        }
      } 
    }
  };

  public shared ({ caller }) func renameDesign(id: Nat, name: Text): async ?Design {
    let design = Map.get<DesignId, Design>(designs, Map.nhash, id);
    switch design {
      case ( null ) { return null};
      case ( ?design ) {
        if (caller != design.creator) {
          return ( null )
        } else {
          let updatedDesign: Design = {
            design with 
            name;
            lastModification = Time.now();
          };
          ignore Map.put<DesignId, Design>(designs, Map.nhash, id, updatedDesign);
          ?updatedDesign
        }
      } 
    }
  };

  public shared ({ caller }) func reDescriptionDesign(id: Nat, description: Text): async ?Design {
    let design = Map.get<DesignId, Design>(designs, Map.nhash, id);
    switch design {
      case ( null ) { return null};
      case ( ?design ) {
        if (caller != design.creator) {
          return ( null )
        } else {
          let updatedDesign: Design = {
            design with 
            description;
            lastModification = Time.now();
          };
          ignore Map.put<DesignId, Design>(designs, Map.nhash, id, updatedDesign);
          ?updatedDesign
        }
      } 
    }
  };

  public shared ({ caller }) func setVisibilityDesign(id: Nat, visible3DRendering: Bool): async ?Design {
    let design = Map.get<DesignId, Design>(designs, Map.nhash, id);
    switch design {
      case ( null ) { return null};
      case ( ?design ) {
        if (caller != design.creator) {
          return ( null )
        } else {
          let updatedDesign: Design = {
            design with visible3DRendering
          };
          ignore Map.put<DesignId, Design>(designs, Map.nhash, id, updatedDesign);
          ?updatedDesign
        }
      } 
    }
  };

  public shared ({ caller }) func deleteDesign(id: Nat): async Bool {
    let design = Map.remove<DesignId, Design>(designs, Map.nhash, id);
    switch design {
      case ( ?design ) {
        if(caller == design.creator) {
          ignore Map.put<DesignId, Design>(trashDesigns, Map.nhash, id, design);
          true
        } else {
          ignore Map.put<DesignId, Design>(designs, Map.nhash, id, design);
          false;
        }
      };
      case null { false }
    }
  };

  func isUser(p: Principal ): Bool {
    switch (Map.get<Principal, User>(users, Map.phash, p)) {
      case null false;
      case (_) { true }
    }
  };

  public shared ({ caller }) func trashView(): async [{id: Nat; name: Text; description: Text}] {
    if (not isUser(caller)) {return []};
    let bufferDesign = Buffer.Buffer<{id: Nat; name: Text; description: Text}>(0);
    for(design in Map.vals(designs)) {
      if(design.creator == caller ) {
        bufferDesign.add(design)
      }
    };
    Buffer.toArray(bufferDesign)
  };

  func verifyRestorePaymentFee(_transactionHash: Nat): Bool{
    return true
  };

  public shared ({ caller }) func retoreDesign({id: Nat; transactionHash: Nat}): async ?Design {
    if(not verifyRestorePaymentFee(transactionHash)) {
      return null
    };
    let design = Map.remove<DesignId, Design>(trashDesigns, Map.nhash, id);
    switch design {
      case null { null };
      case ( ?design ) {
        if(design.creator != caller ){
          ignore Map.put<DesignId, Design>(trashDesigns, Map.nhash, id, design);
          return null
        };
        ignore Map.put<DesignId, Design>(designs, Map.nhash, id, design);
        ?design
      }
    } 
  };


};
