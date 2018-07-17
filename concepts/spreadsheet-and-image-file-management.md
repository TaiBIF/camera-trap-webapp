# 系統需求條列
1. JavaScript (NodeJS) or PHP (XAMP stack)

## 使用者系統
### 依贊助單位、計畫成員、角色設定及排序針對路徑與檔案的讀寫權限
1. Authentication ORCid 的 OAuth2
2. Permission management system
3. Check with AJA

## 目錄結構與檔案
可參考下圖分為三個層次，彼此間有著我們設計的 mapping 方式。雲端管理我傾向以 logical location 管理，減少需要更動檔案位置的機會，並有 multi-faceted 的支援性。邏輯路徑也可將單次上傳 (unique session) 的單筆資料組織成單一類 Excel 檔案。
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
        - 以上傳 session 為單位的 CSV git control？
- 由上可證其實可以先上傳影像， spreadsheet 用補的也無妨？

## 檔案上傳
#### API
@todo check YouTube API for uploading from any URL, preferred Google Drive.
@todo check GSuite terms
@todo 和大予弄清楚上傳檔案和編輯檔案的圖文字是否有誤

## 資料處理
@todo 上傳資料處理後標記
@todo 檔案層級的標記通報

## 資料異常 API
### 先定義正常 - 資料標準
- 內容標準 Controlled Vocabularies
    - 物種名稱與內容類別的差異 Ex. 明確的物種名而非類別名
    - 照片狀態值的控制詞彙（空拍、無法鑑定...）
- 欄位標準
    - 設計上容許自訂欄位，但希望事先定義可容許擴張的範圍。
### 不合乎標準的就立 flag (cached in field or on-the-fliy)
- 物種資料串時空資料，在相對應的 view 中 highlight 出來
    - group by upload session
    - group by path (logical file location)
    - group by spatial
    - group by temporal
    - group by species
    - group by photo
@todo group consolidation


## 資料讀取 / 寫入 API
- 現有資料結構欄位 long (key-value) => wide (columns)
- 參考範本 / profile 讓 long table 缺 key 時可補欄位名與 NA 值
- 單照片多個體時，以多筆 records 呈現立體結構 （個體數 > 1 時自動拆之類）

### 單筆更新
- 沒啥問題

### 連拍時間
- group by 單台相機
- 依使用者設定 (會有系統預設值，或是 user-based 的預設值)，組織邏輯層的 records 時即先分好連拍區段

### 多張照片更新
- 更新連拍或單照片多個體多 records 但只有部分 records 更新時，一樣以照片為更新單元（如果用的是 document database e.g. mongodb and elasticsearch）
- 決定 iteration 發生的位置，原則上想減少 http requests

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
