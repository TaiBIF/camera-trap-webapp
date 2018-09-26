取得 refresh token 的方式
===

## 一開始沒有 refresh token 的原因
- 認證方式不能用 implicit grant，要用 authorization code grant (app client settings)
- https://forums.aws.amazon.com/thread.jspa?threadID=263745

## 關鍵設定
- 在 Cognito User Pool 建立不產生 client secret 的 client app，參見：
- https://github.com/aws/amazon-cognito-auth-js/issues/52
- 解釋：一般來說 authorization code grant 發生於伺服器端與認證提供者之間，需要在 header 傳遞 client secret (前端因為都是明碼，有暴露風險)。不知怎的 AWS 就乾脆只讓 no secret 的 app 使用這種登入法。
![](https://i.imgur.com/fr6xopS.png)

- 別忘了 identity pool 裡的設定（就是個提醒，設定跟之前一樣）
![](https://i.imgur.com/i72qYMO.png)

## 其他東西
- 範例程式裡面的 auth.useCodeGrantFlow();
- 一般來說 AWS SDK 應該會自動幫 refresh，但萬一因不明原因沒做，手動的方式：
- https://stackoverflow.com/questions/48887594/how-can-i-restore-an-expired-token
