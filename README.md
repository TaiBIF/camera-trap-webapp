# camera-trap-webapp

### Branching strategy

1. **master**: main development branch. No CI workflow connected.
2. **dev**: connedted to dev CI workflow. Will merge into _uat_ when ready for User Acceptance Testing.
3. **dev-[personID]**: personal working branch. **Only the creator can commit to this branch**. Will merge into _dev_ when complete. Should be deleted once merged into _dev_.
4. **feature-[featureID]**: feature working branch. Will merge into _dev_ when complete. Should be deleted once merged into _dev_.
5. **issue-[issueID]**: issue working branch. Will merge into _dev_ when complete. Should be deleted once merged into _dev_.
6. **uat**: user acceptance testing branch. Will merge into _prod_ when ready.
7. **prod**: production version.

## lint 及 autoformat 規則

開發環境為 vscode 基本設定都加入在 `.vscode` 需安裝以下套件

- vetur
- prettier

## Develop

- run `npm run serve`

## Generate icon sprite

- save icon to /assets/icons and /assets/icons-2x
- `compass compile`

## Build

- run `npm run build`

## Setting

### vue.config.js

#### pages

- Split function & routes by page

#### css

- use compass

#### devServer

- set server port 3000

## Folders

### pages

- Add folder by vue.config.js setting

### SASS

- global styles in app.sass
- Use individual sass file by every page
- import bootstrap variables, mixins, functions, utilities and grid

### Vuex

- Store Structure
  - TBD: group by data level or add prefix: account / project / ..
  - TBD: stores/index 中的資料統一移到 module 中

```
// account level -------
  // 帳號資訊
  auth: {
    awsToken: "",
    profile: {}
  },
  // 上傳紀錄
  uploadSession: {
    uploadHistory: [],
  },
  // 篩選及下載
  dataFieldAvailable: {
    dataFieldAvailable: [],
  },
  calcForm: {},
  calcFormCSV: "",
  isCalcFormLoading:true,
  // 通知
  // TBD: message / notifications 是刻意拆成兩類還是 legacy code?
  message: {
    message: [], // announcement/query
    notifications: [], // announcement/notifications
  },

// project level -------
  // 版本紀錄
  annotationRevision: {
    revision: []
  },
  // 林班地範圍
  forestBoundary: {
    forestBoundary: [],
  },
  // 計畫成員
  members: {
    projectMembers: [],
  },
  // 範本下載
  exampleFiles: {
    uploadHistory: [],
  },
  // 相機位置
  cameraLocation: {
    cameraLocked: [],
    cameraUpdatePayload: {},
  },
  // 計畫資料
  project: {
    projects: [], // TBD: 移到 account level?
    cameraLastUpdate: {},
    columnsField: [],
    currentProjectId: "",
    locationCameraAbnormalStatus: [],
    locationIdentifiedStatus: [],
    locationRetrievedStatus: [],
    projectErrorSites: [],
    siteStatusTab: 0,
    speciesGroup: {},
  },
  // Site
  media: {
    dataFields: {},
    rawSiteData: [],
    siteData: {},
  },

// UI level -------
// TBD: 非共用資訊, 移至 component 中?
  // TreeMenu active 樣區
  currentToggle: "",
  // EditCamera active 樣區,子樣區
  currentPoint: "",
  currentSite: "",

// 以下部分待確認
pageLock: false, // TBD: 看不出此 prop 的用途?
fileReady: false, // TBD: 看不出此 prop 的用途?
image_info: { // TBD: un-use prop?
  bookmarklet: true,
  carrier_url: "",
  image_list: [],
  title: "",
},
```

- getter review

```
uploadSession:
- TBD: uploadHistory.reduce 的內容怪怪的, 不確定是否因為功能尚未完成?

project:
- TBD: ProjectMarkers 的計算移至 component 中?
```

- API format adjust
  - TBD: cameraLocation 沒有子樣區時給 subSite: "NULL" 有點怪
  - TBD: `project/related-to-me` 的 project_metadata 資料應該可以減少, 進入 project 個別頁面時再 call API 取得詳細 detail
