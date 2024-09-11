export default class Query {
    static getQueryValue(t : any) {
        return new URLSearchParams(window.location.search).get(t) || ""
    }
    static setQueryValue(t : any, e : any) {
        return Query.setQueryValues([{
            queryKey: t,
            queryValue: e
        }])
    }
    static setQueryValues(t : any) {
        var e = new URLSearchParams(window.location.search);
        return t.forEach(((t : any) => e.set(t.queryKey, t.queryValue))), e.toString()
    }
    static clearEverythingAndSetQueryValues(t: any) {
        var e = new URLSearchParams;
        return t.forEach(((t : any) => e.set(t.key, t.value))), e.toString()
    }
    static removeQueriesFromUrl(t: any) {
        var e = new URLSearchParams(window.location.search);
        return t.forEach(((t : any) => e.delete(t))), e.toString()
    }
    static getQueryString() {
        return window.location.search
    }
}