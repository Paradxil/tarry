class Localization {
    constructor() {
        this.defaultLocal = "en";
        this.fallbackLocal = "en";
        this.strings = {};
        this.localizedStrings = {};
    }

    setDefaultLocal(local) {
        this.defaultLocal = local;
    }

    setFallbackLocal(local) {
        this.fallbackLocal = local;
    }
    
    setStrings(strings) {
        this.strings = strings;
        this.localizeStrings();
    }

    localizeStrings(local=this.defaultLocal) {
        this.localizedStrings = this.strings[this.defaultLocal]||{};
    }

    getStrings(local=this.defaultLocal) {
        //TODO: Build strings obj using fallback local
        this.localizeStrings(local);
        return this.localizedStrings;
    }
}

const _L = new Localization();

export default _L;

export let L = _L.localizedStrings;

export const Localize = function(strings, local="en") {
    let LC = new Localization();
    LC.setStrings(strings);
    LC.setDefaultLocal(local);
    return LC.localizedStrings;
}
