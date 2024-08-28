import localforage from "localforage";
import Utils from "./Utils";
import Formatter, { E, F } from "./Formatter";
import GlobalSearch from "./Search";

class ApiEndpoints {
  static FetchTimeoutMs: number = 4e3;
  static gitHubServer: string = "";
  static availableGithubServerUrls: { [key: string]: string } = {
    githubusercontent:
      "https://raw.githubusercontent.com/mario99457/dwaitanidhi_data/main/",
  };
  static gitHubServerDefaultUrls: string[] = [
    ApiEndpoints.availableGithubServerUrls.githubusercontent,
  ];
  static gitHubServerUrls: string[] = ApiEndpoints.gitHubServerDefaultUrls;
  static audioEndPoints: { [key: string]: string } = (() => {
    let t: { [key: string]: string } = {
      //     audio_0_0: "audio/sutraani/0-0.txt"
    };
    // for (let e = 1; e <= 8; ++e) {
    //     for (let a = 1; a <= 4; ++a) {
    //         t[`audio_${e}_` + a] = `audio/sutraani/${e}-${a}.txt`;
    //     }
    // }
    return t;
  })();

  static prefetchEndPoints: { [key: string]: string } = {
    sutraani: "sutraani/index.txt",
    // sutrartha: "sutraani/sutrartha.txt",
    bhashyam: "sutraani/bhashya.txt",
    sutradipika: "sutraani/sutradipika.txt",
    books: "books.txt",
    sutraaniSummary: "sutraani/summary.txt",
  };
  static allEndPoints: { [key: string]: string } = {
    ...ApiEndpoints.prefetchEndPoints,
    ...ApiEndpoints.audioEndPoints,
  };
  static setAvailableServerList(): void {
    let t: string | "" = localStorage.userSelectedDataSource;
    if (ApiEndpoints.availableGithubServerUrls[t]) {
      ApiEndpoints.gitHubServerUrls = [
        ApiEndpoints.availableGithubServerUrls[t],
      ];
      console.log(
        "Github Server restricted by the user to: ",
        ApiEndpoints.availableGithubServerUrls[t]
      );
    } else {
      ApiEndpoints.gitHubServerUrls = ApiEndpoints.gitHubServerDefaultUrls;
      console.log("Github Server set to ALL.");
    }
  }
  static chooseGitHubServer(e: () => void = () => {}, a: number = 0): void {
    let t: string | null, i: string;
    ApiEndpoints.gitHubServer = "";
    if (navigator.onLine) {
      if (a >= ApiEndpoints.gitHubServerUrls.length) {
        console.log(
          "All Servers tried, none are unreachable. Github url remains empty."
        );
        e();
      } else {
        t = localStorage.userSelectedDataSource;
        if (t && "auto" !== t) {
          console.log(
            "Reminder: Github Server restricted by the user to: ",
            ApiEndpoints.availableGithubServerUrls[t]
          );
        }
        i = ApiEndpoints.gitHubServerUrls[a];
        console.log("Attempting to reach github server: ", i + "README.md");
        fetch(i + "README.md")
          .then((t) => {
            if (t && 200 == t.status) {
              ApiEndpoints.gitHubServer = i;
              console.log("Successfully contacted GitHub URL: ", i);
              e();
            } else {
              console.log("Unable to contact Github URL: ", i);
              ApiEndpoints.chooseGitHubServer(e, a + 1);
            }
          })
          .catch((t) => {
            console.log("Unable to contact GitHub URL: ", i);
            ApiEndpoints.chooseGitHubServer(e, a + 1);
          });
      }
    } else {
      console.log("Device is offline. Github url remains empty.");
      e();
    }
  }
  static sendRequestToGitHubServer(
    e: string,
    a: (t: any) => void = () => {},
    i: (t: any) => void = () => {}
  ): void {
    let n: string;
    if (ApiEndpoints.allEndPoints[e]) {
      if (ApiEndpoints.gitHubServer) {
        n = ApiEndpoints.gitHubServer + ApiEndpoints.allEndPoints[e];
        fetch(n)
          .then((t) => (e.endsWith(".wasm") ? t.arrayBuffer() : t.text()))
          .then((t) => {
            e.endsWith(".tsv") || e.endsWith(".wasm") || (t = JSON.parse(t)),
              a(t);
          })
          .catch((t) => {
            console.log(`Error: Server returned error for ${n}:`, t);
            i(t);
          });
      } else {
        console.log("Error: No github servers are reachable.");
        i("SERVERS_UNAVAILABLE");
      }
    } else {
      console.log(`Error: The endpoint ${e} is unknown.`);
      i("UNKNOWN_ENDPOINT");
    }
  }
}

export default class CachedData {
  static CACHE_VERSION_KEY: string = "dwaitanidhi-cache-version";
  static CACHE_VERSION_VALUE: string = "dwaitanidhi-spa";
  static data: { [key: string]: any } = {};
  static currentTime: number = 0;
  static staleKeys: string[] = [];
  static staleThresholdInMs: number = 2592e5;
  static expireThresholdInMs: number = 2592e6;
  static EMPTY_DATA: { data: any[] } = {
    data: [],
  };
  static fetchDone: { [key: string]: boolean } = {};
  static initializeLocalForage(e: () => void): void {
    localforage.getItem(CachedData.CACHE_VERSION_KEY).then(function (t) {
      if (t != CachedData.CACHE_VERSION_VALUE) {
        console.log("New User. Welcome !");
        console.log("Localforage is cleared.");
        localforage.clear().then(() => {
          localforage
            .setItem(
              CachedData.CACHE_VERSION_KEY,
              CachedData.CACHE_VERSION_VALUE
            )
            .then(function (t) {
              console.log("Localforage is initialized.");
              e();
            })
            .catch(function (t) {});
        });
      } else {
        console.log("Existing User. Welcome back !");
        console.log("Valid localforage found.");
        e();
      }
    });
  }
  static defaultDataToEmpty(t: string[]): void {
    t.forEach((t) => {
      if (!CachedData.data[t] || !CachedData.data[t].data) {
        console.log(
          `Error: CachedData.data.${t}.data is unavailable. Setting to []`
        );
        CachedData.data[t].data = [];
      }
    });
  }
  static fetchDataForKeys(
    t: string[],
    n: () => void = () => {},
    s: (t: string) => void = () => {}
  ): void {
    let r: string[], e: string[], o: number;
    r = [];
    e = [];
    o = t.length;
    t.forEach((e) => {
      if (CachedData.fetchDone[e]) {
        n();
      } else {
        r.push(e);
      }
    });
    if (0 < r.length) {
      o = Utils.getTime();
      CachedData._fetchFromLocalforage(r, n, (t, e) => {
        let a: number;
        a = Utils.getTime();
        if (0 < t.length) {
          t.forEach((t) => (CachedData.fetchDone[t] = !0));
          console.log("Cache Hit for: ", t, " ", a - o + " ms");
        }
        if (0 < e.length) {
          console.log("Cache Miss for: ", e);
          a = e.length;
          ApiEndpoints.chooseGitHubServer(() => {
            e.forEach((t) =>
              CachedData._fetchFromServer(
                t,
                () => {
                  CachedData.fetchDone[t] = !0;
                  n();
                  --a <= 0 && CachedData._refreshStaleData();
                },
                (t, e) => {
                  console.log("Error: Prefetch failed for key: ", e);
                  console.log("Error Details: ", t);
                  console.log(
                    `Warning: Initializing CachedData.data.${e} to empty object.`
                  );
                  if (e) {
                    CachedData.data[e] = CachedData.EMPTY_DATA;
                    CachedData.fetchDone[e] = !1;
                    s(e);
                    --a <= 0 && CachedData._refreshStaleData();
                  }
                },
                !0
              )
            );
          });
        } else if (0 < CachedData.staleKeys.length) {
          console.log("Stale Keys = ", CachedData.staleKeys);
          console.log("Refreshing stale keys from Github server");
          ApiEndpoints.chooseGitHubServer(() => CachedData._refreshStaleData());
        }

        //Sutraani.render()
      });
    }
  }
  static _fetchFromLocalforage(
    t: string[],
    a: () => void,
    i: (t: string[], e: string[]) => void
  ): void {
    let n: string[], s: string[], r: number;
    n = [];
    s = [];
    r = t.length;
    t.forEach((e) => {
      localforage.getItem(e).then(function (t) {
        if (null === t || CachedData.isFetchedDataExpired(e, t)) {
          s.push(e);
        } else {
          a();
          CachedData.data[e] = t.data;
          n.push(e);
          if (CachedData.isFetchedDataStale(e, t)) {
            CachedData.staleKeys.push(e);
          }
        }
        --r <= 0 && i(n, s);
      });
    });
  }
  static _refreshStaleData(): void {
    if (0 < CachedData.staleKeys.length) {
      console.log("Refreshing stale data: ", CachedData.staleKeys);
      CachedData.staleKeys.forEach((t) => CachedData._fetchFromServer(t));
      CachedData.staleKeys = [];
    }
  }
  static _fetchFromServer(
    i: string,
    n: () => void = () => {},
    s: (t: any, e: string) => void = () => {},
    r: boolean = !1
  ): void {
    let o: number;
    o = Utils.getTime();
    ApiEndpoints.sendRequestToGitHubServer(
      i,
      (t) => {
        let e: number, a: number;
        e = (Utils.getTime() - o) / 1e3;
        a = Utils.getStorageOfObjectMB(t, i);
        console.log(`Server Success: ${i} : ${a} MB : ${e} sec`);
        CachedData.setValueInLocalForage(i, t, s);
        if (r) {
          CachedData.data[i] = t;
        }
        n();
      },
      (t) => {
        let e: number;
        e = Utils.getTime();
        console.log(`Server Failed: ${i}  : ${(e - o) / 1e3} sec`);
        if (!i) {
          console.log("Error, key is not available");
        }
        s(t, i);
      }
    );
  }
  static setValueInLocalForage(
    t: string,
    e: any,
    a: () => void = () => {}
  ): void {
    e = {
      data: e,
      time: Utils.getTime(),
    };
    localforage.setItem(t, e).catch((t) => a());
  }
  static getValueFromLocalForage(t: string, e: (t: any) => void): void {
    localforage.getItem(t).then((t) => {
      e(t);
    });
  }
  static isFetchedDataExpired(t: any, e: any): boolean {
    return (
      !t.startsWith("audio") &&
      ((t = e.time || 0), Utils.getTime() - t > CachedData.expireThresholdInMs)
    );
  }
  static isFetchedDataStale(t: any, e: any): boolean {
    return (
      !t.startsWith("audio") &&
      ((t = e.time || 0), Utils.getTime() - t > CachedData.staleThresholdInMs)
    );
  }
  static fetchAudio(
    t: any,
    e: (t: any) => void = () => {},
    a: (t: any) => void = () => {}
  ): void {
    if (navigator.onLine && ApiEndpoints.gitHubServerAvailable) {
      a("Unable to connect to server");
    }
    let url: string = "";
    ApiEndpoints.gitHubServer;
    t.a;
    t.p;
    fetch(url)
      .then((t) => t.text())
      .then((t) => {
        e(t);
      })
      .catch((t) => {
        a(t);
      });
  }
}
export class Prefetch {
  static startTime: number = 0;
  static endTime: number = 0;
  static callback: any;
  static keysToPrefetch: string[] = [];
  static pendingResolve: number = 0;
  static showPrefetchDialog(t: () => void): void {
    t();
    //TODO: Show progress bar
  }
  static hidePrefetchDialog(): void {
    //TODO: Hide progress bar
  }
  static prefetchRequiredServerData(
    t: string[],
    e: () => void
  ): Promise<string> {
    t = (t || []).filter((t) => !0 !== CachedData.fetchDone[t]);
    if (0 == t.length) {
      e();
    } else {
      Prefetch.showPrefetchDialog(() => {
        Prefetch.keysToPrefetch = t;
        Prefetch.callback = e;
        Prefetch.pendingResolve = Prefetch.keysToPrefetch.length;
        Prefetch.startTime = Utils.getTime();
        console.log("Attempting to prefetch: ", Prefetch.keysToPrefetch);
        CachedData.fetchDataForKeys(
          Prefetch.keysToPrefetch,
          Prefetch.prefetchProgressHandler,
          Prefetch.prefetchProgressHandler
        );
      });
    }
    return new Promise((res) => {
      res("Data fetched");
    });
  }
  static prefetchProgressHandler(): void {
    //TODO: Progress bar % based on number of files to be fetched
  }
  static prefetchErrorHandler(): void {
    console.log("Prefetch failed. Showing error page");
    Prefetch.hidePrefetchDialog();
  }
}
class Settings {
  static startTime: number = 0;
  static endTime: number = 0;
  static pendingResolve: number = 0;
  static totalKeyCount: number = 0;
  static errorsRecorded: any[] = [];
  static wakeLock: any = null;
  static enableOfflineMode(): string {
    Settings.startTime = Utils.getTime();
    console.log("Enabling offline mode");
    Settings.errorsRecorded = [];
    let t: string[] = Object.keys(ApiEndpoints.allEndPoints);
    Settings.pendingResolve = t.length;
    Settings.totalKeyCount = t.length;
    CachedData.fetchDataForKeys(
      t,
      () => {},
      (t) => {
        Settings.errorsRecorded.push(t);
      }
    );
    return "";
  }
  static errorHandler(): void {}
  static closeDialog(): void {}
  static clearCache(): void {
    console.log("clearing the cache.");

    caches.keys().then((t) => {
      t.forEach((t) => {
        caches.delete(t);
      });
    });
    localStorage.clear();
  }
  static resetApp(): void {
    console.log("Resetting the app.");

    caches.keys().then((t) => {
      t.forEach((t) => {
        caches.delete(t);
      });
    });
    localforage.clear();
    localStorage.clear();
  }
  static enableWakelock(): void {
    if (!("wakeLock" in navigator)) {
      console.log("Wakelock is not available.");
    } else {
      Settings.wakeLock = navigator.wakeLock
        .request("screen")
        .then(() => {
          console.log("Screen Wakelock is activated");
        })
        .catch((t) => {
          console.log(`Screen Wakelock NOT activated` + t);
        });
    }
  }
  static reEnableWakeLock(): void {
    if (Settings.wakeLock && "visible" === document.visibilityState) {
      Settings.enableWakelock();
    }
  }
}
export class Sutraani {
  static allSutras = [];
  static currentSutra = {};
  static commentaryPrefix = {
    bsb: "कौमुदी",
    sd: "मध्यकौमुदी",
    td: "लघुकौमुदी",
    av: "सारकौमुदी",
    ns: "परमलघुकौमुदी",
    nsp: "लघुपाणिनीयम्",
  };
  static summary = CachedData.data.sutraaniSummary;

  static supportedCommentaries = [
    {
      name: "सूत्रदीपिका",
      key: "sutradipika",
      author: "श्रीजगन्नाथयति विरचिता",
      lang: "s",
      number: "",
      hidden: false,
    },
    {
      name: "भाष्यम्",
      key: "bhashyam",
      author: "श्रीमदानन्दतीर्थ भगवद्पादाचार्य विरचितं",
      lang: "s",
      number: "",
      hidden: true,
    },
  ];
  static requiredServerData = () => [
    "sutraani",
    "sutrartha",
    "bhashyam",
    "sutradipika",
  ]; /*, "vartikas", "sutrartha", "sutrartha_english", ...Sutraani.supportedCommentaries.map((t => t.key))];*/
  static init() {
    CachedData.defaultDataToEmpty(["sutraani"]);
  }
  static render() {
    Sutraani.populateAllSutras();
  }
  static renderSutraList(t) {
    var e, a, i, n, s, r, o;
    Sutraani.currentSutra = {};
    (t = Sutraani.getSutraList(t)) &&
      ((e = t.sutras),
      (a = t.title),
      (n = t.commKey),
      (document.title = t.title));
    /*TODO:
                A title for every content dynamically
                End title
            
            
            */
    var data = {
      title: "श्रीमद् ब्रह्मसूत्राणि",
      endTitle: "॥ इति श्रीमद् ब्रह्मसूत्राणि ॥",
      rowData: e.map((e) => {
        sutranum: `${e.a}.${e.p}.` + e.n;
        sutra: e.s;
      }),
    };
  }
  static renderSingleSutra(t) {
    Sutraani.currentSutra = {};
    document.title = "";
    var a = CachedData.data.sutrartha[t.i]
        ? CachedData.data.sutrartha[t.i].sa
        : "",
      n = Formatter.formatSutraVyakhya(
        CachedData.data.sutrartha[t.i] ? CachedData.data.sutrartha[t.i].sd : "",
        {
          includeAnchor: !0,
        }
      );

    var sutraData = {
      mobileView: Utils.isMobileView(),
      title: "" + t.s,
      apnNumber: Formatter.toDevanagariNumeral(`${t.a}.${t.p}.` + t.n),
      sampurnaSutram: t.ss,
      oneLineMeaningSanskrit: a,
      //oneLineMeaningEnglish: i,
      sutrartha: n,
      commentaries: Sutraani.getCommentaries(t),
      leftArrow: Sutraani.getLeftArrow(t),
      rightArrow: Sutraani.getRightArrow(t),
    };

    Sutraani.renderSutraListInLeftNav(t, e);
    //AudioProcessor.setupSutraAudio(t)
  }

  static getCommentaries(e) {
    return Sutraani.supportedCommentaries.map((t) => {
      return {
        key: t.key,
        commname: t.name,
        author: t.author,
        hidden: t.hidden,
        editHref: "", //Sutraani.getEditCommentaryTag(t.key, e),
        show: true,
        lang: t.lang,
        //extLink: Sutraani.getExternalPageForCommentary(e, t),
        number:
          t.number && 0 < e[t.number]
            ? Formatter.toDevanagariNumeral(e[t.number])
            : "",
        text: Formatter.formatSutraVyakhya(CachedData.data[t.key][e.i]),
      };
    });
  }
  static getLeftArrow(e) {
    const t = Sutraani.allSutras.find((t) => t.srno == e.srno - 1);
    return t;
  }
  static getRightArrow(e) {
    const t = Sutraani.allSutras.find((t) => t.srno == e.srno + 1);
    return t;
  }
  static getSutraList(t?: any): any {
    var e = [...Sutraani.allSutras];
    return "" == t
      ? {
          sutras: e,
        }
      : "z" == t
      ? {
          sutras: e.sort((t, e) => t.s.localeCompare(e.s)),
        }
      : {
          sutras: e,
        };
  }
  static renderSutraListInLeftNav(e) {}

  static populateAllSutras() {
    0 == Sutraani.allSutras?.length &&
      (Sutraani.allSutras = CachedData.data?.sutraani?.data
        .sort((t, e) => t.i - e.i)
        .map((e, t) => ((e.srno = t + 1), e)));
  }

  static getSummary(i: string) {
    return CachedData.data.sutraaniSummary[i];
  }

  static generateScore(t, e) {
    e = (e = E(e)).replaceAll(" ", "").replaceAll("ऽ", "");
    var a = t.s.trim().replaceAll(" ", "").replaceAll("ऽ", ""), i = 9e4 - t.i;
    
    return Sutraani.partialMatchWithSutraNumber(t, e) ? 81e4 + i : a == e ? 72e4 + i : a.startsWith(e) ? 63e4 + i : 0 <= a.indexOf(e) ? 54e4 + i : 0
  }

  static partialMatchWithSutraNumber(t, e) {
    return null != (e = e.match(/([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)){0,1}){0,1}){0,1}){0,1}/)) && (void 0 !== e[3] ? t.a == e[1] && t.p == e[2] && (t.n + "").startsWith(e[3] + "") : void 0 !== e[2] ? t.a == e[1] && t.p == e[2] : void 0 !== e[1] && t.a == e[1])
  }

  static searchSutraani(i: string):any[] {
    var a = GlobalSearch.getDevanagariSearchStrings(i);
    Sutraani.populateAllSutras();        
    Sutraani.allSutras.forEach((t => {
        t.searchData = {
            score: 0,
            datanav: "/sutraani/" + t["n"]
      }
    })), 
    Sutraani.allSutras.forEach((e => a.forEach((t => e.searchData.score = Math.max(e.searchData.score, Sutraani.generateScore(e, t))))));
      var i = Sutraani.allSutras.filter((t => 0 < t.searchData.score)).sort(((t, e) => e.searchData.score - t.searchData.score)).map((t => ({
          sutranum: F(`${t.a}.${t.p}.` + t.n, a),            
          sutra: F(t.s, a),
          datanav: t.searchData.datanav,
          i: t.i
      })));
      
      return i;
  }
}

export function getBookClass(name: string) {
  if (name == "sutraani") {
    return Sutraani;
  }
  return null;
}

Array.prototype.intersect = function(...t) {
  return [this, ...t].reduce(((t, e) => t.filter((t => e.includes(t)))))
}, Array.prototype.between = function(t) {
  return this[0] <= t && t <= this[1]
}, Array.prototype.findFirst = function(t) {
  for (var e = 0; e < this.length; ++e)
      if (0 <= t.indexOf(this[e])) return this[e];
  return null
}, Array.prototype.rotate = function(t) {
  return t %= this.length, this.slice(t, this.length).concat(this.slice(0, t))
}, Array.prototype.getLast = function() {
  return this[this.length - 1]
}, Array.prototype.setLast = function(t) {
  return 0 == this.length ? this.push(t) : this[this.length - 1] = t, this
}, Array.prototype.getSecondLast = function() {
  return this[this.length - 2]
}, Array.prototype.setSecondLast = function(t) {
  if (0 != this.length) return 1 == this.length ? this.unshift(t) : this[this.length - 2] = t, this
}, Array.prototype.removeLast = function() {
  for (var t = [], e = 0; e < this.length - 1; ++e) t.push(this[e]);
  return t
};

String.prototype.getLastChar = function() {
  return this[this.length - 1]
}, String.prototype.getSecondLastChar = function() {
  return this[this.length - 2]
}, String.prototype.removeLastChar = function() {
  return this.slice(0, -1)
}, String.prototype.find = function(t) {
  return this.split("").find(t)
}, String.prototype.clone = function() {
  return this
}, String.prototype.replaceAll = function(t, e) {
  return t = RegExp(t, "ig"), this.replace(t, e)
}, String.prototype.toNumber = function() {
  return parseInt(this, 10) || 0
}, String.prototype.firstUpper = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}, String.prototype.last = function() {
  return this[this.length - 1]
}, String.prototype.isAllRoman = function() {
  return /^[a-zA-Z0-9]+$/.test(this)
}, String.prototype.levenstein = function(t) {
  var e, a, i = t + "",
      n = [],
      s = Math.min;
  if (!this || !i) return (i || this).length;
  for (e = 0; e <= i.length; n[e] = [e++]);
  for (a = 0; a <= this.length; n[0][a] = a++);
  for (e = 1; e <= i.length; e++)
      for (a = 1; a <= this.length; a++) n[e][a] = i.charAt(e - 1) == this.charAt(a - 1) ? n[e - 1][a - 1] : n[e][a] = s(n[e - 1][a - 1] + 1, s(n[e][a - 1] + 1, n[e - 1][a] + 1));
  return n[i.length][this.length]
}, Number.prototype.toNumber = function() {
  return this.valueOf()
};