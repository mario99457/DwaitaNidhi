import localforage from "localforage";
import Utils from "./Utils";
import Formatter, { D, E, F, TH } from "./Formatter";
import GlobalSearch, { CommentarySearch } from "./Search";
import { json } from "react-router-dom";
import { Buffer } from "buffer";

class ApiEndpoints {

  static FetchTimeoutMs: number = 4e3;
  static gitHubServer: string = "";
  static availableGithubServerUrls: { [key: string]: string } = {
    githubusercontent:
      "https://raw.githubusercontent.com/mario99457/dwaitanidhi_data/main/",
    githubapi:"https://api.github.com/repos/mario99457/dwaitanidhi_data/contents/"
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
    bhashyam: "sutraani/bhashya.txt",
    sutradipika: "sutraani/sutradipika.txt",
    books: "books.txt",
    sutraaniSummary: "sutraani/summary.txt",
    gitaIndex: "gita/index.txt",
    gbhashyam: "gita/bhashya.txt",
    gitaSummary: "gita/summary.txt",
    prameyadipika: "gita/prameyadipika.txt"
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
          .then((t : any) => {
            if (t && 200 == t.status) {
              ApiEndpoints.gitHubServer = i;
              console.log("Successfully contacted GitHub URL: ", i);
              e();
            } else {
              console.log("Unable to contact Github URL: ", i);
              ApiEndpoints.chooseGitHubServer(e, a + 1);
            }
          })
          .catch((t : any) => {
            console.log("Unable to contact GitHub URL: ", t);
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
  static pushToGitHubServer(
    e: string,
    c: string
  ): void {
    let n: string;
    // if (ApiEndpoints.allEndPoints[e]) {
      if (ApiEndpoints.availableGithubServerUrls.githubapi) {
        n = ApiEndpoints.availableGithubServerUrls.githubapi + ApiEndpoints.allEndPoints[e];
        let o: number;
        o = Utils.getTime();

        let request = {
          n, e, c, s:""
        }

        let options = {
          method: 'GET'
        };

        fetch('https://dwaitanidhiapi.netlify.app/api/git/fetch?resource=' + n, options)
          .then(async data => {
            if(data.ok)
            {
              let response = await data.json();
              request["s"] = response.sha;

              fetch('https://dwaitanidhiapi.netlify.app/api/git/update', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
              })
                .then(async data => {
                  if(data.ok)
                  {
                    response = await data.json();
                    localforage.removeItem(e, () => {
                      console.log(`Removed stale key ${e} from Localforage.`);
                    });
                  }
                  else{
                    data.json()
                  }
                })
                .catch(e => { return e })
            }
            else{
              data.json()
            }
          })
          .catch(e => { return e })
       }        
       else {  
        console.log("Error: No github servers are reachable.");
      }
    // } else {
    //   console.log(`Error: The endpoint ${e} is unknown.`);
    //   i("UNKNOWN_ENDPOINT");
    // }
  }
  // static fetchContentFromGit(n, r, i){
  //   const customHeaders = new Headers();
  //   customHeaders.append("Accept", "application/vnd.github+json");
  //   customHeaders.append("Authorization", "Bearer " + ApiEndpoints.gitKey);
  //   customHeaders.append("X-GitHub-Api-Version", "2022-11-28");
  //   customHeaders.append("Content-Type", "application/json");

  //   fetch(n, {  method: "GET", 
  //               headers: customHeaders,
  //               redirect: "follow"
  //            })
  //           .then((response) => r(response))
  //           .then((result) => console.log(result))
  //           .catch((t) => {
  //             console.log(`Error: Server returned error for ${n}:`, t);
  //             i(t);
  //           });
  // }

  // static updateContentToGit(n, e, f, s, i){
  //   const raw = JSON.stringify({
  //     "message": "Updated content of " + e,
  //     "committer": {
  //       "name": "Pramod H B",
  //       "email": "pramod.hb86@gmail.com"
  //     },
  //     "content": f,
  //     "sha": s
  //   });

  //   const customHeaders = new Headers();
  //   customHeaders.append("Accept", "application/vnd.github+json");
  //   customHeaders.append("Authorization", "Bearer " + ApiEndpoints.gitKey);
  //   customHeaders.append("X-GitHub-Api-Version", "2022-11-28");
  //   customHeaders.append("Content-Type", "application/json");

  //   fetch(n, {  method: "PUT", 
  //               headers: customHeaders,
  //               body: raw,
  //               redirect: "follow"
  //            })
  //           .then((response) => response.text())
  //           .then((result) => console.log(result))
  //           .catch((t) => {
  //             console.log(`Error: Server returned error for ${n}:`, t);
  //             i(t);
  //           });
  // }
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
    localforage.getItem(CachedData.CACHE_VERSION_KEY).then(function (t : any) {
      if (t != CachedData.CACHE_VERSION_VALUE) {
        console.log("New User. Welcome !");
        console.log("Localforage is cleared.");
        localforage.clear().then(() => {
          localforage
            .setItem(
              CachedData.CACHE_VERSION_KEY,
              CachedData.CACHE_VERSION_VALUE
            )
            .then(function (t : any) {
              console.log("Localforage is initialized." + t);
              e();
            })
            .catch(function () {});
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
    let r: string[], o: number;
    r = [];
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
      localforage.getItem(e).then(function (t : any) {
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
    s: (t: any, e: any) => void = () => {},
    r: boolean = !1
  ): void {
    let o: number;
    o = Utils.getTime();
    ApiEndpoints.sendRequestToGitHubServer(
      i,
      (t) => {
        let e: number, a: number;
        e = (Utils.getTime() - o) / 1e3;
        a = Utils.getStorageOfObjectMB(t);
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
    a: (t: any, e: any) => void = () => {}
  ): void {
    e = {
      data: e,
      time: Utils.getTime(),
    };
    localforage.setItem(t, e).catch((t) => a(t, e));
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

  static getBookClass(name: any) {
    if (name == "sutraani") {
      return Sutraani;
    }
    else if (name == "gita") {
      return Gita;
    }
    return null;
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

// class Settings {
//   static startTime: number = 0;
//   static endTime: number = 0;
//   static pendingResolve: number = 0;
//   static totalKeyCount: number = 0;
//   static errorsRecorded: any[] = [];
//   static wakeLock: any = null;
//   static enableOfflineMode(): string {
//     Settings.startTime = Utils.getTime();
//     console.log("Enabling offline mode");
//     Settings.errorsRecorded = [];
//     let t: string[] = Object.keys(ApiEndpoints.allEndPoints);
//     Settings.pendingResolve = t.length;
//     Settings.totalKeyCount = t.length;
//     CachedData.fetchDataForKeys(
//       t,
//       () => {},
//       (t) => {
//         Settings.errorsRecorded.push(t);
//       }
//     );
//     return "";
//   }
//   static errorHandler(): void {}
//   static closeDialog(): void {}
//   static clearCache(): void {
//     console.log("clearing the cache.");

//     caches.keys().then((t) => {
//       t.forEach((t) => {
//         caches.delete(t);
//       });
//     });
//     localStorage.clear();
//   }
//   static resetApp(): void {
//     console.log("Resetting the app.");

//     caches.keys().then((t) => {
//       t.forEach((t) => {
//         caches.delete(t);
//       });
//     });
//     localforage.clear();
//     localStorage.clear();
//   }
//   static enableWakelock(): void {
//     if (!("wakeLock" in navigator)) {
//       console.log("Wakelock is not available.");
//     } else {
//       Settings.wakeLock = navigator.wakeLock
//         .request("screen")
//         .then(() => {
//           console.log("Screen Wakelock is activated");
//         })
//         .catch((t) => {
//           console.log(`Screen Wakelock NOT activated` + t);
//         });
//     }
//   }
//   static reEnableWakeLock(): void {
//     if (Settings.wakeLock && "visible" === document.visibilityState) {
//       Settings.enableWakelock();
//     }
//   }
// }
export class Sutraani {
  static allTitles = [];

  static summary = CachedData.data.sutraaniSummary;

  static supportedCommentaries = [
    {
      name: "सूत्रदीपिका",
      key: "sutradipika",
      author: "श्रीजगन्नाथयति विरचिता",
      lang: "s",
      number: "",
      hidden: false,
      audio: false
    },
    {
      name: "भाष्यम्",
      key: "bhashyam",
      author: "श्रीमदानन्दतीर्थ भगवद्पादाचार्य विरचितं",
      lang: "s",
      number: "",
      hidden: true,
      audio: false
    },
  ];
  static init() {
    CachedData.defaultDataToEmpty(["sutraani"]);
  }
  static getCommentaries(e : any) {
    return Sutraani.supportedCommentaries.map((t : any) => {
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
        text: Formatter.formatVyakhya(CachedData.data[t.key][e.i]),
      };
    });
  }
  static getLeftArrow(e : any) {
    const t = Sutraani.allTitles.find((t : any) => t.srno == e.srno - 1);
    return t;
  }
  static getRightArrow(e : any) {
    const t = Sutraani.allTitles.find((t : any) => t.srno == e.srno + 1);
    return t;
  }
  static getIndexList(t?: any): any {
    var e = [...Sutraani.allTitles];
    return "" == t
      ? {
          titles: e,
        }
      : "z" == t
      ? {
          titles: e.sort((t : any, e : any) => t.s.localeCompare(e.s)),
        }
      : {
          titles: e,
        };
  }

  static populateIndexList() {
    0 == Sutraani.allTitles?.length &&
      (Sutraani.allTitles = CachedData.data?.sutraani?.data
        .sort((t : any, e : any) => t.i - e.i)
        .map((e : any, t : any) => ((e.srno = t + 1), e)));
  }

  static getSummary(i: string) {
    return CachedData.data.sutraaniSummary[i];
  }

  static generateScore(t : any, e : any) {
    e = (e = E(e)).replaceAll(" ", "").replaceAll("ऽ", "");
    var a = t.s.trim().replaceAll(" ", "").replaceAll("ऽ", ""), i = 9e4 - t.i;
    
    return Sutraani.partialMatchWithTitleNumber(t, e) ? 81e4 + i : a == e ? 72e4 + i : a.startsWith(e) ? 63e4 + i : 0 <= a.indexOf(e) ? 54e4 + i : 0
  }

  static partialMatchWithTitleNumber(t : any, e : any) {
    return null != (e = e.match(/([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)){0,1}){0,1}){0,1}){0,1}/)) && (void 0 !== e[3] ? t.a == e[1] && t.p == e[2] && (t.n + "").startsWith(e[3] + "") : void 0 !== e[2] ? t.a == e[1] && t.p == e[2] : void 0 !== e[1] && t.a == e[1])
  }

  static searchSutraani(i: string):any[] {
    var a = GlobalSearch.getDevanagariSearchStrings(i);
    Sutraani.populateIndexList();      
    Sutraani.allTitles.forEach(((t : any) => {
        t.searchData = {
            score: 0,
            datanav: "/sutraani/" + t["n"]
      }
    })), 
    Sutraani.allTitles.forEach(((e : any) => a.forEach(((t : any) => e.searchData.score = Math.max(e.searchData.score, Sutraani.generateScore(e, t))))));
      return Sutraani.allTitles.filter(((t : any) => 0 < t.searchData.score)).sort(((t : any, e : any) => e.searchData.score - t.searchData.score)).map(((t : any) => ({
        titlenum: F(`${t.a}.${t.p}.` + t.n, a),
        title: F(t.s, a),
        datanav: t.searchData.datanav,
        i: t.i
      })));
    }
   
    static searchBooks (q : any, b: any) {
        var books = CachedData.getBookClass("sutraani");

        var commentariesToSearch = CachedData.getBookClass("sutraani")?.supportedCommentaries;
        
        var o = GlobalSearch.getDevanagariSearchStrings(q)
          , t : any[] = [];
        return CachedData.data.sutraani.data.forEach((i : any) => {
            var n = i.i
              , s : any[] = [];

            var booksToSearch = b && b !== "all" ? booksToSearch?.filter(c=>c.key == b) : commentariesToSearch;
            commentariesToSearch.forEach((t :any) => {
                var e : any, a;
                e = "",
                a = CachedData.data[t.key][n],
                e = a ? a : e, 
                (a = o.find(t => 0 <= e.indexOf(t))) && s.push({
                    name: t.name,
                    key: t.key,
                    fragment: TH(D(e), o),
                    show: true,
                    author: t.author,
                    datanav: `/sutraani/${n}/${t.key}?highlight=` + a,
                    //datanav: `/sutraani/${t.key}?expand=sutra-commentary-${t.key}-region&focus=sutra-commentary-${t.key}-region&highlight=` + a
                })
            }),
            0 < s.length && t.push({
                name: i.s,
                titlenum: D(`${i.a}.${i.p}.` + i.n),
                commentaries: s,
                visible: !0
            })
        }
        ),
        t          
    }

    static updateContent(key, i, t){
      //TODO: get commentary
      //update text based on i
      //convert to json string
      //convert to base64 string
      //send to server

      CachedData.data[key][i] = t; 
      let updatedContent = JSON.stringify(CachedData.data[key]);
      let encodedData = Buffer.from(updatedContent).toString('base64');
      ApiEndpoints.pushToGitHubServer(key, encodedData);
    }

    static updateSummary(key, lang, i, t){
      //TODO: get commentary
      //update text based on i
      //convert to json string
      //convert to base64 string
      //send to server

      CachedData.data[key][i][lang] = t; 
      let updatedContent = JSON.stringify(CachedData.data[key]);
      let encodedData = Buffer.from(updatedContent).toString('base64');
      ApiEndpoints.pushToGitHubServer(key, encodedData);
    }
}

export class Gita {
  static allTitles = [];

  static summary = CachedData.data.gitaSummary;

  static supportedCommentaries = [
    {
      name: "भाष्यम्",
      key: "gbhashyam",
      author: "श्रीमदानन्दतीर्थ भगवद्पादाचार्य विरचितं",
      lang: "s",
      number: "",
      hidden: true,
    },{
      name: "प्रमोयदीपिका",
      key: "prameyadipika",
      author: "श्रीजयतीर्थंंयति विरचिता",
      lang: "s",
      number: "",
      hidden: true,
    },
  ];
  static init() {
    CachedData.defaultDataToEmpty(["gita"]);
  }
  
  static getCommentaries(e : any) {
    return Gita.supportedCommentaries.map((t : any) => {
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
        text: Formatter.formatVyakhya(CachedData.data[t.key][e.i]),
      };
    });
  }
  static getLeftArrow(e : any) {
    const t = Gita.allTitles.find((t : any) => t.srno == e.srno - 1);
    return t;
  }
  static getRightArrow(e : any) {
    const t = Gita.allTitles.find((t : any) => t.srno == e.srno + 1);
    return t;
  }
  static getIndexList(t?: any): any {
    var e = [...Gita.allTitles];
    return "" == t
      ? {
          titles: e,
        }
      : "z" == t
      ? {
          titles: e.sort((t : any, e : any) => t.s.localeCompare(e.s)),
        }
      : {
          titles: e,
        };
  }

  static populateIndexList() {
    0 == Gita.allTitles?.length &&
      (Gita.allTitles = CachedData.data?.gitaIndex?.data
        .sort((t : any, e : any) => t.i - e.i)
        .map((e : any, t : any) => ((e.srno = t + 1), e)));
  }

  static getSummary(i: string) {
    return CachedData.data.gitaSummary[i];
  }

  static generateScore(t : any, e : any) {
    e = (e = E(e)).replaceAll(" ", "").replaceAll("ऽ", "");
    var a = t.s.trim().replaceAll(" ", "").replaceAll("ऽ", ""), i = 9e4 - t.i;
    
    return Gita.partialMatchWithTitleNumber(t, e) ? 81e4 + i : a == e ? 72e4 + i : a.startsWith(e) ? 63e4 + i : 0 <= a.indexOf(e) ? 54e4 + i : 0
  }

  static partialMatchWithTitleNumber(t : any, e : any) {
    return null != (e = e.match(/([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)(?:[^a-zA-Z0-9](?:([\d]+)){0,1}){0,1}){0,1}){0,1}/)) && (void 0 !== e[3] ? t.a == e[1] && t.p == e[2] && (t.n + "").startsWith(e[3] + "") : void 0 !== e[2] ? t.a == e[1] && t.p == e[2] : void 0 !== e[1] && t.a == e[1])
  }

  static searchBook(i: string):any[] {
    var a = GlobalSearch.getDevanagariSearchStrings(i);
    Gita.populateIndexList();      
    Gita.allTitles.forEach(((t : any) => {
        t.searchData = {
            score: 0,
            datanav: "/gita/" + t["n"]
      }
    })), 
    Gita.allTitles.forEach(((e : any) => a.forEach(((t : any) => e.searchData.score = Math.max(e.searchData.score, Gita.generateScore(e, t))))));
      return Gita.allTitles.filter(((t : any) => 0 < t.searchData.score)).sort(((t : any, e : any) => e.searchData.score - t.searchData.score)).map(((t : any) => ({
          titlenum: F(`${t.a}.${t.p}.` + t.n, a),            
          title: F(t.s, a),
          datanav: t.searchData.datanav,
          i: t.i
      })));
    }
   
    static searchBooks (q : any, b: any) {
        var books = CachedData.getBookClass("gita");

        var commentariesToSearch = CachedData.getBookClass("gita")?.supportedCommentaries;
        
        var o = GlobalSearch.getDevanagariSearchStrings(q)
          , t : any[] = [];
        return CachedData.data.gitaIndex.data.forEach((i : any) => {
            var n = i.i
              , s : any[] = [];

            var booksToSearch = b && b !== "all" ? booksToSearch?.filter(c=>c.key == b) : commentariesToSearch;
            commentariesToSearch.forEach((t :any) => {
                var e : any, a;
                e = "",
                a = CachedData.data[t.key][n],
                e = a ? a : e, 
                (a = o.find(t => 0 <= e.indexOf(t))) && s.push({
                    name: t.name,
                    key: t.key,
                    fragment: TH(D(e), o),
                    show: true,
                    author: t.author,
                    datanav: `/gita/${n}/${t.key}?highlight=` + a,
                    //datanav: `/sutraani/${t.key}?expand=sutra-commentary-${t.key}-region&focus=sutra-commentary-${t.key}-region&highlight=` + a
                })
            }),
            0 < s.length && t.push({
                name: i.s,
                titlenum: D(`${i.a}.${i.p}.` + i.n),
                commentaries: s,
                visible: !0
            })
        }
        ),
        t          
    }      

    static updateContent(i, t){
      ApiEndpoints.pushToGitHubServer(i, t);
    }
}

export class ArrayExtension extends Array {
  constructor(){
    super()
  };
  static intersect(...t  : any[]) {
    return [this, ...t].reduce(((t, e) => t.filter(((t : any) => e.includes(t)))))
  }
  static between = (a : any, t : any) => {
    return a[0] <= t && t <= a[1]
  }
  findFirst = (t : any) => {
    for (var e = 0; e < this.length; ++e)
        if (0 <= t.indexOf(this[e])) return this[e];
    return null
  }
  rotate = (t : any) => {
    return t %= this.length, this.slice(t, this.length).concat(this.slice(0, t))
  }
  getLast = () => {
    return this[this.length - 1]
  }
  setLast = (t : any) => {
    return 0 == this.length ? this.push(t) : this[this.length - 1] = t, this
  }
  getSecondLast = () => {
    return this[this.length - 2]
  }
  setSecondLast = (t : any) => {
    if (0 != this.length) return 1 == this.length ? this.unshift(t) : this[this.length - 2] = t, this
  }
  removeLast = () => {
    for (var t = [], e = 0; e < this.length - 1; ++e) t.push(this[e]);
    return t
  };
}

export class StringExtension extends String {
  constructor(){
    super()
  };
  getLastChar = () => {
    return this[this.length - 1]
  }
  getSecondLastChar = () => {
    return this[this.length - 2]
  }
  removeLastChar = () => {
    return this.slice(0, -1)
  }
  find = (t : any) => {
    return this.split("").find(t)
  }
  clone = () => {
    return this
  }
  replaceAll = (t : any, e : any) => {
    return t = RegExp(t, "ig"), this.replace(t, e)
  }
  toNumber = () => {
    return parseInt(this.toString(), 10) || 0
  }
  firstUpper = () => {
    return this.charAt(0).toUpperCase() + this.slice(1)
  }
  last = () => {
    return this[this.length - 1]
  }
  isAllRoman = () => {
    return /^[a-zA-Z0-9]+$/.test(this.toString())
  }
  levenstein = (t : any) => {
    var e, a, i = t + "",
        n = [],
        s = Math.min;
    if (!this || !i) return (i || this).length;
    for (e = 0; e <= i.length; n[e] = [e++]);
    for (a = 0; a <= this.length; n[0][a] = a++);
    for (e = 1; e <= i.length; e++)
        for (a = 1; a <= this.length; a++) n[e][a] = i.charAt(e - 1) == this.charAt(a - 1) ? n[e - 1][a - 1] : n[e][a] = s(n[e - 1][a - 1] + 1, s(n[e][a - 1] + 1, n[e - 1][a] + 1));
    return n[i.length][this.length]
  }
}
export class NumberExtension extends Number {
  constructor(){
    super()
  };
  toNumber = () => {
    return this.valueOf()
  }
}