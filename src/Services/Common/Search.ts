import Sanscript from "@indic-transliteration/sanscript";
import Formatter from "./Formatter";
import Query from "./Query";
import { ArrayExtension } from "./GlobalServices";

export default class GlobalSearch {
    static DebouceDelayMs = 550;
    static searchFieldDirty = !1;
    static latestSearch = "";
    static keysForFullSearch = [{
        key: "sutraani",
        value: "सूत्रपाठः"
    }, {
        key: "dhatu",
        value: "धातुपाठः"
    }, {
        key: "shabda",
        value: "शब्दपाठः"
    }, {
        key: "search",
        value: "अष्टाध्यायीव्याख्यानानि"
    }, {
        key: "kosha",
        value: "कोशान्वेषः"
    }, {
        key: "upasargarthachandrika",
        value: "उपसर्गार्थचन्द्रिका"
    }, {
        key: "wordindex",
        value: "अष्टाध्यायीशब्दानुक्रमः"
    }, {
        key: "ganapath",
        value: "गणपाठः"
    }, {
        key: "unaadi",
        value: "उणादिपाठः"
    }, {
        key: "paribhashendushekhar",
        value: "परिभाषेन्दुशेखरः"
    }, {
        key: "bhushanasaar",
        value: "वैयाकरणभूषणसारः"
    }, {
        key: "paramalaghumanjoosha",
        value: "परमलघुमञ्जूषा"
    }, {
        key: "vakyapadeeyam",
        value: "वाक्यपदीयम्"
    }, {
        key: "linganushasanam",
        value: "लिङ्गानुशासनम्"
    }, {
        key: "shiksha",
        value: "पाणिनीयशिक्षा"
    }, {
        key: "fit",
        value: "फिट्सूत्राणि"
    }, {
        key: "ska",
        value: "सरस्वतीकण्ठाभरणम्"
    }];
    static searchEntryPoint = [{
        key: "amara",
        value: "kosha"
    }, {
        key: "dhatufilters",
        value: "dhatu"
    }];
    static getOriginalSearchString() {
        return "" //return text from searchbox
    }
    static setSearchString(t : any) {
        //assign value to search box
        t;
    }
    static clearSearchString() {
        //clear search box
    }
    static getDevanagariSearchStrings(t : any) {
        var a : any, i : any;
        return t && t.trim() ? (t = t.replaceAll(":", "ः")) == Sanscript.t(t, "hk", "devanagari") ? t.endsWith("्") ? [t] : [t, t + "्"] : (a = [...new Set([t, t.toLowerCase()])], i = [], ["itrans", "slp1", "hk", "iast"].forEach((e => a.forEach(((t : any) => {
            "" != t && (i.push(Sanscript.t(t, e, "devanagari")), -1 == ["aeiou"].indexOf(t.slice(-1))) && i.push(Sanscript.t(t + "a", e, "devanagari"))
        })))), i = (i = [...new Set(i)]).filter(((t : any) => t.split("").every(((t : any) => !ArrayExtension.between(["a".charCodeAt(0), "z".charCodeAt(0)], t.charCodeAt()) && !Object.keys(Formatter.diacriticsMap).includes(t) && !ArrayExtension.between(["A".charCodeAt(0), "Z".charCodeAt(0)], t.charCodeAt())))))) : []
    }
    static initializeGlobalSearch() {
        // $("body").off("input"), $("body").on("input", "#global-search", _.debounce((() => {
            GlobalSearch.searchFieldDirty = !0;
            var t = [{
                    key: "search",
                    value: GlobalSearch.getOriginalSearchString()
                }],
                e : any = ((e = ((e = ((e = Query.getQueryValue("tab")) && t.push({
                    key: "tab",
                    value: e
                }), Query.getQueryValue("filters"))) && t.push({
                    key: "filters",
                    value: e
                }), Query.getQueryValue("page"))) && t.push({
                    key: "page",
                    value: e
                }), Query.clearEverythingAndSetQueryValues(t));
            // Router.loadUrl(document.location.pathname + e.trim() ? "?" + e : "")
        // }), GlobalSearch.DebouceDelayMs))
    }
}