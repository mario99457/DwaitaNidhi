import Query from "./Query";
import TagProcessor from "./TagProcessor";

export default class Formatter {
    static diacriticsMap = {
        "ā": "aa",
        "ī": "ee",
        "ū": "oo",
        "ṛ": "ru",
        "l̥": "lu",
        "ṅ": "n",
        "ñ": "n",
        "ṭ": "t",
        "ṭh": "th",
        "ḍ": "d",
        "ḍh": "dh",
        "ṇ": "n",
        "ś": "sh",
        "ṣ": "sh",
        "ḥ": "h",
        "kṣ": "ksh",
        "jñ": "dnya",
        "ṁ": "m",
        "j~j": "dnya",
        "~j": "n",
        "~g": "n",
        "~lu": "lu",
        uu: "oo",
        ii: "ee"
    };
    static toDevanagariNumeral(t : any) {
        t += "";
        for (var e = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], a = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"], i = 0; i < a.length; ++i) t = t.replaceAll(e[i], a[i]);
        return t
    }
    static toEnglishNumeral(t : any) {
        t += "";
        for (var e = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], a = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"], i = 0; i < a.length; ++i) t = t.replaceAll(a[i], e[i]);
        return t
    }
    static replaceDiacritics(t : any) {
        for (var [e, a] of(t = t.toLowerCase(), Object.entries(Formatter.diacriticsMap))) t = t.replaceAll(e, a);
        return t
    }
    static isSwara(t : any) {
        return 0 <= ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ॠ", "ऌ", "ए", "ऐ", "ओ", "औ"].indexOf(t)
    }
    static formatExternalResourcesLinks(t : any) {
        var e = new RegExp("docs.google.com.*pub", "g"),
            a = t.match(e);
        if (null != a)
            for (var i = 0; i < a.length; ++i) t = t.replace(a[i], Formatter.toEnglishNumeral(a[i]));
        return t
    }
    static formatSutraVyakhya(t : any, e : any = {}) {
        return t && t.trim() ? (t = Formatter.toDevanagariNumeral(t), t = TagProcessor.processCustomTags(t), t = TagProcessor.processSutraNumberTag(t, e.includeAnchor), t = TagProcessor.processSutraReferences(t), t = Formatter.formatExternalResourcesLinks(t), Formatter.highlightString(t, e.highlight || Query.getQueryValue("highlight"))) : ""
    }
    static toPlainText(e : any) {
        return e && ([...Object.keys(TagProcessor.customTagExpansions), "\\+", "!", "=", "\\[", "\\]", "\\{", "\\}", "#", ";", "\\&", "\\^", "\\$", "→"].map((t => new RegExp(t, "g"))).forEach((t => e = e.replaceAll(t, ""))), e = (e = (e = e.replace(/<[^>]*>/g, "")).replaceAll("<", "")).replaceAll(">", "")), e
    }
    static trimAndHighlightString(t : any, e : any) {
        if (t && t.trim()) {
            e = e || [Query.getQueryValue("highlight")], Array.isArray(e) || (e = [e]), t = Formatter.toPlainText(t);
            for (var a = 0; a < e.length; ++a) {
                var i, n, s = e[a],
                    r = t.toLowerCase().indexOf(s.toLowerCase());
                if (0 <= r) return i = Formatter.locateNearestSpaceBefore(t, r - 150), n = (r = Formatter.locateNearestSpaceAfter(t, r + 150)) >= t.length ? "" : "...", (i <= 0 ? "" : "...") + Formatter.highlightString(t.substring(i, r), s) + n
            }
        }
        return ""
    }
    static highlightString(a : any, t : any) {
        return t = t || [Query.getQueryValue("highlight")], Array.isArray(t) || (t = [t]), a && a.trim() && t.forEach(((t : any) => {
            var e;
            0 < t.trim().length && (e = `<span class='highlight-string'>${t}</span>`, a = Formatter.replaceText(a, t, e))
        })), a
    }
    static replaceText(t : any, e : any, a : any) {
        var i : any[] = [];
        return t.split(/(<[^>]+>)/g).forEach(((t : any) => {
            t.startsWith("<") ? i.push(t) : i.push(t.replaceAll(e, a))
        })), i.join("")
    }
    static locateNearestSpaceBefore(t : any, e : any) {
        for (; 0 <= e && " " != t[e];) --e;
        return e
    }
    static locateNearestSpaceAfter(t : any, e : any) {
        for (; e < t.length && " " != t[e];) ++e;
        return e
    }
}

export function F(t : any, e : any) {
    return Formatter.formatSutraVyakhya(t, { highlight: e });
}

export function E(t : any) {
    return Formatter.toEnglishNumeral(t);
}

export function H(t : any, e = "") {
    return Formatter.highlightString(t, e);
}

export function TH(t : any, e = "") {
    return Formatter.trimAndHighlightString(t, e);
}

export function P(t : any) {
    return Formatter.toPlainText(t);
}

export function D(t : any) {
    return Formatter.toDevanagariNumeral(t);
}