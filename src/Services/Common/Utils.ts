import Formatter from "./Formatter";

export default class Utils {
    static openedInApp: boolean = false;
    
    static showSuccessAlert(t: string): void {
       //TODO: 
       console.log(t);
    }
    static showFailureAlert(t: string): void {
       //TODO: 
       console.log(t);
    }
    static getKeyByValue(e: any, a: any): string | undefined {
        return Object.keys(e).find((t: string) => e[t] === a);
    }
    static printStorage(): void {
        // if (navigator && navigator.storage && navigator.storage.estimate) {
        //     navigator.storage.estimate().then((t: StorageEstimate) => {
        //         var e = Math.round(t.usage / 1000 / 1000);
        //         t = (100 * t.usage / t.quota).toFixed(2);
        //         console.log("Total storage used so far: " + e + "MB (" + t + "% of available limit)");
        //     });
        // }
    }
    static showLoader(t: () => void): void {
       //TODO: 
       console.log(t);
    }       
    static getStorageOfObjectMB(t: any) {
        return t = JSON.stringify(t), t = (new TextEncoder).encode(t).length, Math.ceil(t / 1e3 / 1e3)
    }
    static getTime(): number {
        return Date.now();
    }
    static getTimestamp(): string {
        return (new Date).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZoneName: "short"
        });
    }
    static getPathName(): string {
        var t = decodeURI(window.location.pathname);
        return Formatter.toEnglishNumeral(t);
    }
    static getViewportRange(): string {
        var t = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        return t <= 576 ? "xs" : t <= 768 ? "sm" : t <= 992 ? "md" : t <= 1200 ? "lg" : "xl";
    }
    static isMobileView(): boolean {
        return ["xs", "sm"].includes(Utils.getViewportRange());
    }
    static logDebugInfoInConsole(): void {
        console.log("Mobile view: ", Utils.isMobileView());
        console.log("User Agent: ", navigator.userAgent);
        console.log("Dwaita Nidhi Version: ", "");
        console.log("Chrome Version: ", Utils.getChromeVersion());
        console.log("Date: ", "");
        console.log("DateTime: ", new Date(Utils.getTime()));
        console.log("Last Access: ", Utils.fetchAndupdateLastAccessTime());
        Utils.openedInApp = window.matchMedia("(display-mode: standalone)").matches;
        console.log("Opened In: ", Utils.openedInApp ? "App" : "Browser");
    }
    static fetchAndupdateLastAccessTime(): Date | string {
        var t = localStorage.lastAccessTime;
        localStorage.lastAccessTime = Utils.getTime().toString();
        if (t) {
            return new Date(parseInt(t));
        } else {
            return "Not available";
        }
    }
    static getChromeVersion(): number {
        var t = navigator.userAgent.split(" ");
        for (var e = 0; e < t.length; ++e) {
            var a = t[e];
            if (a.startsWith("Chrome/") && (a = a.split("/")[1])) {
                return parseInt(a.split(".")[0]);
            }
        }
        return -1;
    }
}