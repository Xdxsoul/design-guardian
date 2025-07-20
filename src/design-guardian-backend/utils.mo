import Text "mo:base/Text";
import Iter "mo:base/Iter";

module {
    public func validateUserDataInit(name: Text, email: ?Text): Bool {
        let emailValid = switch email {
            case null { true };
            case ( ?email ) {
                let emailParts = Iter.toArray(Text.split(email, #char('@')));
                emailParts.size() == 2 and
                emailParts[0] != "" and
                Text.contains(emailParts[1], #char('.')) and
                not Text.startsWith(emailParts[1], #char('.')) and
                not Text.endsWith(emailParts[1], #char('.'));
            }
        };
        name.size() > 3 and
        name.size() < 18 and
        emailValid;
    };
}