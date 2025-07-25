
module {

    public type Account = {
        owner: Principal;
        subaccount: ?Blob;
    };

    public type User = {
        id: Principal;
        registerDate: Int;
        name: Text;
        bio: ?Text;
        email: ?Text;
        phone: ?Nat;
        logo: ?Blob;
        avatar: ?Blob;
        followeds: [Principal];
        followers: [Principal];
        designs: [DesignId];
        preferences: Preferences;
        account: ?Account;
    };
    
    public type Preferences = {
        privateFollowed: Bool;
        privateProfile: Bool;
    };

    public let defaultPreferences: Preferences = {
        privateFollowed = false;
        privateProfile = false;
    };
 
    public type DesignId = Nat;

    public type File = {
        name: Text;
        data: Blob;
        mimeType: Text;
    };

    public type KindDesign = {
        #Footwear;
        #Clothing;
        #Accessories;
        #TextilePrinting
    };

    public type DesignDataInit = {
        sourceFiles: [File]; 
        kind: KindDesign;
        name: Text;
        description: Text;
        coverImage: File;
        visible3DRendering: Bool;
    };

    public type Design = {
        id: DesignId;
        kind: KindDesign;
        name: Text;
        description: Text;
        creator: Principal;
        creatorName: Text;
        visible3DRendering: Bool;
        dateCreation: Int;
        lastModification: Int;
        sourceFiles: [File];
        coverImage: File;
    };

    public type DesignPreview = {
        id: DesignId;
        name: Text;
        description: Text;
        creator: Principal;
        creatorName: Text;
        coverImage: File;
        dateCreation: Int;
        kind: KindDesign;
    };


}