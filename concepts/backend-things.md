# 自動相機平台後端的東西

## 詞彙
- Camera Trap Platform 暫時簡稱 CTP
- 使用者瀏覽器簡稱 Client 端
- 所有 AWS 服務省略 AWS

## 檔案管理
不同用途可丟不同 buckets 或目錄，使用上（bandwidth、LB、HA等）這兩者不知有無明顯差別？管理上呢？
用解析度當目錄名稱適用性可能更廣，但：
用解析度當目錄名稱，相機原生的解析度與長寬比如果有異，如何處理？
### RAW 檔 (寬邊 2XXX ~ )
- 因自動相機的運作模式，RAW 檔通常也不會太大（黑白每張 500 KBytes 左右，極大值估  1MBytes 應該足夠？）
- 一段時間後（例如以下的縮圖建立完成後）丟進 Glacier
- 同時進行批次 & on demand （使用者要求瀏覽某張照片時建立縮圖，然後搬進 Glacier；要確認是否能單張進 Glacier，還是一定要批次？）
- 一開始的 RAW 檔放哪？縮圖在哪進行？
    - S3，縮圖用 Lambda 或類似的可快速啟動與停止的小型 EC2，走 HTTP 從 S3 抓回資料同步運作
    - EBS，只要消化（轉檔）速度大於上傳速度，空間就不需要太大。縮圖用多台 EC2 加掛唯讀同一顆 EBS 當作在本地轉檔。Overhead會比走 S3 輕不少。但能否多台 EC2 掛同一顆 EBS？
    - 如果上傳 glacier 是批次的，可能就得測試與定義合適的批次轉檔量？
- 看瓶頸是在1.轉檔速度或 2.網路速度或 3.荷包深度？

### 仔細檢視/鑑定用的大檔
- S3
- 解析度由翁老師團隊建議（之前是直接用 RAW 檔）

### 一般檢視/鑑定用的檔
- S3

### 快速檢視用的圖檔
- S3 / 使用者檢視指定的計畫資料時，快取到 CTP 本地，或直接存放到一顆夠大的 EBS （會需要額外的備份跟$$$），或是某類的記憶體儲存裝置

## CTP 的使用者角色與權限管理
- 平台上的角色對應 IAM 的 access 控制？譬如路人只能看到低解析度的S3影像（高解析度丟在權限分離的 bucket、或是可照 directory 分權之類）、或是只有專家可以標註資料（存取平台的寫入點？）

## 現有的 mongodb 上的資料結構
- Images collection
    - base url
    - relative path
    - url (unique) or local file location
    - project
    - spatial level
    - created date time
- Annotations collection
    - url (equals to images collection url)
    - carrier
    - copyright / license
    - mime type
    - Tokens（這是 Array）
        - token id
        - description level 描述層級，例如個體，或部位（植物特別需要）
        - meta (壓平好像也沒關係)
            - virtual individual id (用來識別單一影像中的不同個體，必要時 [如個體id沒制式規範時] 也能用來連結多張不同影像中拍到的相同個體)
            - part id（用來區分或識別同個體的身體部位）
        - Bounding Box (原數值都是 pixel)
            - 原點（例如0,0）
            - 方向（例如左上往右下）
            - x
                - min
                - max
            - x-dimension（如果是聲音頻譜圖，x 會是 time domain）
            - x-translation-factor
            - y
                - min
                - max
            - y-dimension
            - y-translation-factor
            - z
                - min
                - max
            - z-dimension（如果是錄影，z 就是 time domain）
            - z-translation-factor
        - Data (這是 Array)
            - Label (human readable field name)
            - key (field id for machine)
            - value
            - unit (using some publicly accessible standards)
        - Relations（這是 Array）
            - namespace (some publicly accessible location)
            - relationName
            - object token (convention: {url}#{token_id})

## 哪些查詢？ API怎麼設計？
- 檔名／路徑撈資料
- 計畫、時空資訊撈資料
- 複雜問題：懷孕中、左臉有顆痣的母鹿正在欺負野豬寶寶的照片
    - 情境解讀：
        1. 單一影像記錄到這麼多事（特徵與互動）
        2. 一段影像（連拍或 video）記錄到這些事，但特徵、互動可能分別在不同時空或照片中發生。例如欺負行為發生前拍到鹿的左臉特寫，但欺負過程都是右臉對著鏡頭，並無記錄到這個特徵
    - 原則都是 key-value 查詢，伴隨集合操作
    - NoSQL 肯定無法用單一 query 完成
    - 先找出符合以上述條件的鹿的照片（設計 API，這階段傾向完全能在資料庫中完成），結果可能 match 到一個以上的 tokens：
        - Token-X1 （個體）
            - Data
                - 物種：鹿
                - 性別：雌性
                - 狀態：懷孕中
            - Relations
                - relationName：欺負
                - {object tokens}
        - Token-X2 （頭部）
            - 部位：左側
            - 特徵：像痣一樣的斑點

    - 找出 tokens 交集的照片（一般操作）
    - 或是找出分別符合特徵的 tokens ，生出個體特徵矩陣讓查詢者參考）

    - 找出野豬寶寶的 tokens（同前，基本查詢型態）
        - Token-Y1（個體）
            - Data
                - 物種：野豬
                - 生命階段：所有非成體

    - 交集 {object tokens} 與 Token-Y（平台內部工作，可釋出為服務的一部份？暫存多個查詢結果，然後可做之間的集合運算）
    - 用交集結果 tokens 找出照片（API）

- 分析用資料輸出
    - 選定特定的 token 層級（例如個體）與特定的 data 欄位，投影成 table
    - 投影看要在平台端完成，或輸出相對 raw 的資料讓使用者在 R 上完成

## 哪一種資料庫？
考量布署、HA、scaling、monitoring等DevOps的難度？
資料庫特性、是否足以支援上述的 query？
一致性？
### DynamoDB
- Response Time 可能是最理想的
- 雷好像有點多
    - 不支援複雜查詢（且只能用 primary key 與 index 的欄位查詢，甚至 index 綁 PK，也就是完全仰賴 PK 查詢。）
    - 似乎不支援 nested structure（多層 json）
    - 目前建立自動相機資料的操作模式用 DynamoDB 不划算？（快速且大規模的小資料）
    - 程式針對上述的資料與操作模式要做相當的特殊設計

### MongoDB
- 目前的做法，各方面來說好像都還行
- 可自訂回傳的 aggregation function 與 projection（performance略差）
- AWS 上看起來需要自行校調 HA （雖說以我們的資料量，基本架構應已足夠）

### ElasticSearch
- 應該會比 MongoDB 快，查詢彈性更為理想
- 無法自訂回傳的 aggregation function 與 projection
- AWS 全面接管服務，包括後端 log 分析
- 要特別注意 nested data 的 index 法
- 純走 HTTP，query overhead 相對大，但可由其速度、支援的複雜查詢與 AWS 的服務所彌補
- 讀了關於一致性的描述，懷疑會有資料寫入效能的瓶頸
