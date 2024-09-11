import Sanscript from "@indic-transliteration/sanscript";
import Formatter, { D, P, TH } from "./Formatter";
import Query from "./Query";
import CachedData, { ArrayExtension } from "./GlobalServices";

export default class GlobalSearch {
    static DebouceDelayMs = 550;
    static searchFieldDirty = !1;
    static latestSearch = "";
        
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

export class CommentarySearch {
    
}