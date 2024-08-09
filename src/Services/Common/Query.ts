export default class Query {
    static getQueryValue(t : any) {
        return new URLSearchParams(window.location.search).get(t) || ""
    }
    static setQueryValue(t, e) {
        return Query.setQueryValues([{
            queryKey: t,
            queryValue: e
        }])
    }
    static setQueryValues(t) {
        var e = new URLSearchParams(window.location.search);
        return t.forEach((t => e.set(t.queryKey, t.queryValue))), e.toString()
    }
    static clearEverythingAndSetQueryValues(t) {
        var e = new URLSearchParams;
        return t.forEach((t => e.set(t.key, t.value))), e.toString()
    }
    static removeQueriesFromUrl(t) {
        var e = new URLSearchParams(window.location.search);
        return t.forEach((t => e.delete(t))), e.toString()
    }
    static getQueryString() {
        return window.location.search
    }
}