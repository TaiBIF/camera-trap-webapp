# 後端系統需求條列
1. JavaScript (NodeJS) or PHP (XAMP stack)

## 使用者系統
### 依贊助單位、計畫成員、角色設定及排序針對路徑與檔案的讀寫權限
1. Authentication ORCid 的 OAuth2
2. Permission management system
3. Check with AJA

## 目錄結構與檔案

![](https://i.imgur.com/Ds2fHwE.jpg)

可參考下圖分為三個層次，彼此間有著我們設計的 mapping 方式。雲端管理我傾向以 logical location 管理，減少需要更動檔案位置的機會，並有 multi-faceted 的支援性。邏輯路徑也可將單次上傳 (unique upload session) 的單筆資料組織成單一類 Excel 檔案。
- physical location （S3的 http 實體位置）
- logical location (虛擬邏輯層路徑)
    - 有自己的建立、修改時間
    - 類 Excel 檔有版本歷程
    - by project, by site, by plot (or camera) summary
    - 個人認為權限針對邏輯路徑就好，其下子目錄或檔案的權限就用繼承的
- source of the upload（上傳資料檔時，上傳者在檔案中描述的相對檔案路徑）
![](https://i.imgur.com/oEaxUSB.jpg)

### API
1. document list
2. document detail


## 資料上傳與管理

![](https://i.imgur.com/FQTrlim.jpg)


使用者把 spreadsheet 與影像資料壓成一個檔上傳是很理想的做法，但需要做些限制，並有些問題待解決．

1. 產生 spreadsheet 檔
- 來源
    - LS.exe
    - 下載範本
- 問題
    - 確定相對路徑與影像位置（有無可能在上傳前就確認好？或如下的其他解？）
    - 範本裡沒有相對檔案路徑
    - 上傳的方式
- 解法？
    - LS.exe 參考範本產生 spreadsheet ？
    - Excel 複製貼上？
    - 帳號密碼遠端路徑設定皆處理好的 portable ftp tool，只要打開、拖拉檔案、關閉三步驟即可完成上傳。
- 應該要有的限制
    - Spreadsheet 中要存在 entry ，同時檔案也要存在
    - 任一不符者皆發出警告，並且無法正確匯入
        - 但如果匯入失敗又要整組刪除重傳，會是極糟的體驗
        - 時間金錢空間都是成本
- 基於上述前提，必須要有線上LS的功能，或資料更新的機制
    - 線上 LS (簡單)
    - 或部分筆數各自更新
        - 各自更新的基礎在於上傳時的相對路徑產生實體路徑的方法或原則
        - 新增或更新資料是依照實體路徑是否存在 duplication 而定
        - 計算 hash 也是一種可能性 (考慮運算資源)
        - 影像與資料的版本控制（怕竄改或刪圖）
        - 以 upload session 為單位的 CSV git control？
- 由上可證其實可以先上傳影像， spreadsheet 用補的也無妨？

#### 重複資料管理原則 UPDATED 2018-07-18
- *** ***重要*** *** 即使實質意義上的同一張照片，在不同 Upload Session 都會被視為不同的照片檔案。這是檔案管理上必須設定的前提。
    - 從研究資料的角度來說，de-duplicate 也是必要的。系統可從計畫、地點、時間、檔名等資訊過濾出潛在的重複清單，而後仰賴 image content hash 確認內容是否重複，再由使用者決定應保留或刪除。
    - 如何避免兩張或多張一起被使用者刪除？(至少保留一張)
    - 介面上限制使用者的選擇，後端也要 counting 重複照片清單中的剩餘物件
    - 應該是介面上唯一允許使用者移除檔案，並**完全移除**與單一檔案相關資料的地方。
    - *** ***每張存在於系統上的照片，至少要跟著一筆相對應的資料(範疇：所有以檔案實體位置為 primary key 的資料類別)*** ***
    - 舉例，通常的刪資料情境是，假設一張照片只拍到單一個體，卻不小心替該照片建了兩筆資料，使用者可刪除其中任一筆，但不能兩筆都刪除。

### 檔案實體位置規則 (UPDATED 2018-07-17)
- Physical Location = SomeHashAlgo(Upload Session + relative location)
- 也許再參一些計畫相關的 metadata
- 流程上傾向照片上傳與資料上傳是可分開的。資料綁定照片的流程是：
    1. 初次上傳照片，系統產生一個 Upload Session 與對應的 Session ID
    2. 如果沒有並存於 Archive 的資料檔，視解壓縮後的照片檔案路徑為 relative location
    3. 如果有並存於 Archive 的資料檔，試著存檔案中讀出 relative location
    4. 配對資料與檔案
        1. 檢查 relative location 與 Archive 中的檔案路徑是否相符。符合則繼續流程。
        2. 不符合則試圖配對檔名，重新產生 relative location，並回報是否有矛盾。
        3. 使用者檢查無誤或修正後繼續流程。
        4. 若有誤，讓使用者修正影像路徑檔名後重新上傳資料檔。
    7. 依規則產生實體路徑，並將檔案 PUT 上 S3 (照 PUT 算錢所以這樣寫)
    8. 如果 Archive 中沒有資料檔，後續上傳新的或更新用的資料檔，要先選定之前的 Upload Session，然後試著去走 4.X 的流程。這可能意味著 physical location 不要跟 relative location 有過大的目錄結構差異較好。譬如像是：
       Physical Location = {UUID}/{Resolution}/{RelativeLocation}
    10. 可以做個雲端 LS 功能，讓使用者下載後填資料較保險。
    11. 若有重傳照片的必要（留一個可能性）... 先不想這塊。


## 檔案批次上傳（UPDATED 2018-07-17）

![](https://i.imgur.com/skvV0SE.jpg)

重新回顧後發現近代瀏覽器對 HTML5 的支援讓此功能變可行了，然而有非常多細節要處理。關鍵在於**使用者要主動先選取一個待處理資料夾**，剩餘的檔案管理操作要以純邏輯進行。上傳後，後端依前端的檔案組織方式建立對應的檔案邏輯層位置。
- 選取要上傳的資料夾，自動展開底下的大小檔案（保有路徑資訊）
  http://jsfiddle.net/z73f0cbd/1/
- 上傳進度條語法 https://www.sitepoint.com/html5-javascript-file-upload-progress-bar/
- 續傳 https://tus.io/demo.html
  官方 Demo 的關閉重啟頁面就會續傳的效果似乎不 work (HTTP 是 stateless 的，要看前後端如何配合) 覺得可以把系統設計成允許單檔重新上傳覆蓋就好。
  
#### API
@todo check YouTube API for uploading from any URL, preferred Google Drive.
@todo check GSuite terms
@todo 和大予弄清楚上傳檔案和編輯檔案的圖文字是否有誤


## 資料處理
@todo 上傳資料處理後標記
@todo 檔案層級的標記通報

## 資料異常 API

![](https://i.imgur.com/93nCHRA.jpg)


### 「正常」即符合資料標準
- 內容標準 Controlled Vocabularies
    - 物種名稱與內容類別的差異 Ex. 明確的物種名而非類別名
    - 照片狀態值的控制詞彙（空拍、無法鑑定...）
- 欄位標準
    - 設計上容許自訂欄位，但希望事先定義可容許擴張的範圍。
- 不合乎標準的就立 flag (cached in field or on-the-fly)

![](https://i.imgur.com/mHUkTkN.jpg)

- 物種資料串時空資料，在相對應的 view 中 highlight 出來
    - group by upload session
    - group by file path
    - group by spatial
    - group by temporal
    - group by species
    - **group by photo** (cjk: How to?)

## 資料檢核



## 資料讀取 / 寫入 API
- 現有資料結構欄位 long (key-value) => wide (columns)
- 參考範本 / profile 讓 long table 缺 key 時可補欄位名與 NA 值
- 單照片多個體時，以多筆 records 呈現立體結構 （個體數 > 1 時自動拆之類）

### Write lock (UPDATED 2018-07-18)
- 區分 編輯中 / 非編輯中 兩個狀態
- 被 @使用者1 編輯中的資料，結束編輯狀態前，@使用者{2:N} 皆無權寫入
- 資料寫入前要用強一致性且有寫入 lock 的資料庫擋在前面，先假設叫 RDB
    - 前端介面編輯單一檔案前，送 req 確認 RDB 內對應檔案沒有 lock flag
    - ***後端所有資料寫入前都要在 RDB 中確認檔案沒有 lock flag***
- 以管理尺度來說，針對 Upload Session 上 write lock 可能是相對理想的。
    - ＃有人在編輯單一個邏輯檔案時，其他人就只能在旁邊看
    - *** ***任意條件搜尋的結果不允許批次編輯*** ***

### 單筆更新
- 沒啥問題

### 連拍時間
- group by 單台相機
- 依使用者設定 (會有系統預設值，或是 user-based 的預設值)，組織邏輯層的 records 時即先分好連拍區段

### 多張照片更新
- 更新連拍或單照片多個體多 records 但只有部分 records 更新時，一樣以照片為更新單元（如果用的是 document database e.g. mongodb and elasticsearch）
- 決定 iteration 發生的位置，原則上想減少 http requests
- 要設法避開非強一致性的問題

### 資料標準 / profiles 有那些欄位、其值定義、編輯（未討論到），與讀取
- 某些欄位是有相關性的，定義欄位值組的標準會更符合使用需求，如
    - [{key: sciname, value: 'Pica pica'}, {key: vernacularName, value: '喜鵲'}]
@todo 使用者控制詞彙的編輯單元

## 影像的多段解析度設定
- 先參考一下之前這份討論，會需要更多的需求分析
  https://github.com/TaiBIF/camera-trap/blob/master/backend-things.md
  
## Query API 底層
- 一樣先參考之前的討論，任務確定後會做更細緻的設計與分類。尚未討論資料寫入的部分。同時要在此層次規劃權限管控。
  https://github.com/TaiBIF/camera-trap/blob/master/backend-things.md

## Data analysis
- 所謂的常用篩選搜尋設定
    - Query results being converted, cached for analysis
- R steps in
- Trending

# 問題與建議
- 資料呈現與編輯 （Slide 74 的切換狀態，狀態是什麼？）
- 圖的縮放將如何設計
