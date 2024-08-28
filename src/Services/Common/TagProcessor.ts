import Formatter from "./Formatter";

export default class TagProcessor {
    static customTagExpansions = {
        "\\n": '<br class="newline-space">',
        "<spacer>": "<div class='spacer'></div>",
        "--\x3e": "→",
        "<<": "<span class='sutra-text-color'>",
        ">>": "</span>",
        "<ऽ": "<span class='paribhasha-text-color'>",
        "ऽ>": "</span>",
        "<!": "<span class='vartika-text-color'>",
        "!>": "</span>",
        "<=": "<span class='ganasutra-text-color'>",
        "=>": "</span>",
        "<title>": "<div class='section-separator'></div><div class='title'>",
        "</title>": "</div>",
        "<pr>": "<div class='prakriya'>",
        "</pr>": "</div>",
        "<prd>": "<div class='prakriya prakriya-wrong'>",
        "</prd>": "</div>",
        "<pt>": "<div class='pratyahar'><b>प्रत्याहाराः — </b>",
        "</pt>": "</div>",
        "<bg>": "<div class='pratyahar'>",
        "</bg>": "</div>",
        "<karika>": "<div class='karika'>",
        "</karika>": "</div>",
        "<list>": "<div class='list'>",
        "</list>": "</div>",
        "<listsp>": "<div class='listsp'>",
        "</listsp>": "</div>",
        "<note>": "<div class='note'><b>सूचना - </b>",
        "</note>": "</div>",
        "<gana>": "<div class='gana'>",
        "</gana>": "</div>",
        "<source>": "<div class='source'>",
        "</source>": "</div>",
        "<inline>": "<span class='inline'>",
        "</inline>": "</span>",
        "<ex>": "<span class='example'>",
        "</ex>": "</span>",
        "<nex>": "<span class='nonexample'>",
        "</nex>": "</span>",
        "<qt>": "<span class='quote'>",
        "</qt>": "</span>",
        "<hl>": "<span class='highlight'>",
        "</hl>": "</span>",
        "<hlb>": "<span class='highlight-bold'>",
        "</hlb>": "</span>",
        "<light>": "<span class='text-secondary'>",
        "</light>": "</span>",
        "<pv>": "<span class='complex-topic-indicator'>प्रौढविषयः</span>",
        "<vr>": "<span class='vrutti'>",
        "</vr>": "</span>",
        "<lightnl>": "<div class='mt-3 mb-0 text-secondary'>",
        "</lightnl>": "</div>",
        "<w>": '<span class="commentaries-moolam">',
        "</w>": "</span>",
        "<x>": '<span class="bhashya-moolam">',
        "</x>": "</span>",
        "<y>": '<span class="pradeep-moolam">',
        "</y>": "</span>",
        "<v>": '<span class="bhashya-vartikam">',
        "</v>": "</span>"
    };
    static processCustomTags(t : any) {
        for (var [e, a] of Object.entries(TagProcessor.customTagExpansions)) t = t.replaceAll(e, a);
        return t
    }
    static processSutraNumberTag(t : any, r = !1) {
        return t.replace(/\[\[([०-९0-9])[-_.|॥।/]([०-९0-9])[-_.|॥।/]([०-९0-9]{1,3})\]\]/g, ((t : any)=> {
            var e = t[2],
                a = t[4],
                i = (t = t.substring(6, t.length - 2), Formatter.toEnglishNumeral(e)),
                n = Formatter.toEnglishNumeral(a),
                s = Formatter.toEnglishNumeral(t);
            e = `<a href="/sutraani/${i}/${n}/${s}"  data-nav="/sutraani/${i}/${n}/${s}"  class="href default-sanskrit-font text-font">${e}.${a}.${t}</a>`;
            return !0 === r && (e += `<span class="ml-2 subtext-font" data-anchor="sutralist-entry-${1e4*i.toNumber()+1e3*n.toNumber()+s.toNumber()}"><i class="fas fa-anchor cursor-pointer sutra-num-anchor"></i></span>`), e
        }))
    }
    static processSutraReferences(t : any) {
        return t.replaceAll(/<{SK([0123456789०१२३४५६७८९]+)}>/g, (function(e : any) {
            var a = Formatter.toEnglishNumeral(e);
            return `<a class="sutra-text-color" href="/sutraani/sk${a}" data-nav="/sutraani/sk${a}">(कौमुदी-${Formatter.toDevanagariNumeral(e)})</a>`
        })).replaceAll(/<{([0123456789०१२३४५६७८९]+)}>/g, (function(e : any) {
            var a = Formatter.toEnglishNumeral(e);
            return ` <aclass="sutra-text-color" href="/sutraani/sk${a}" data-nav="/sutraani/sk${a}">(कौमुदी-${Formatter.toDevanagariNumeral(e)})</a>`
        })).replaceAll(/<{LSK([0123456789०१२३४५६७८९]+)}>/g, (function(e : any) {
            var a = Formatter.toEnglishNumeral(e);
            return `<a class="sutra-text-color" href="/sutraani/lsk${a}" data-nav="/sutraani/lsk${a}">(लघुकौमुदी-${Formatter.toDevanagariNumeral(e)})</a>`
        })).replaceAll(/<{([0123456789०१२३४५६७८९]+\.[0123456789०१२३४५६७८९]+)}>/g, (function(e : any) {
            var a = Formatter.toEnglishNumeral(e);
            return `<a class="sutra-text-color" href="/dhatu/${a}" data-nav="/dhatu/${a}">${Formatter.toDevanagariNumeral(e)}</a>`
        }))
    }
}