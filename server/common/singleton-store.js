let _singletonStore;
class SingletonStore {
    static get instance() {
        return _singletonStore;
    }
}

_singletonStore =  new SingletonStore();

module.exports = SingletonStore;