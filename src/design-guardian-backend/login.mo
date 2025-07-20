import Map "mo:map/Map";

module {

    type state<T> = {
        users: Map.Map<Principal, T>
    };

    public class Login() {

    }
}