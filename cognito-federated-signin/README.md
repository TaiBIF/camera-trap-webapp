# 參考文件

### 設定 Identity Providers for Your User Pool (Cognito)
- https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-identity-provider.html#cognito-user-pools-oidc-providers

### 各家設定實例
- https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-identity-federation.html

### 官方 js example
- https://github.com/aws/amazon-cognito-auth-js/tree/master/sample

### 拿到 access token 後取得 credential 以使用 AWS services 的大致樣貌 (Step 7)
- https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-integrating-user-pools-javascript.html
- 這篇 blog 在講類似的事 https://aws.amazon.com/tw/blogs/mobile/accessing-your-user-pools-using-the-amazon-cognito-identity-sdk-for-javascript/

### User Pool 串連 Identity Pool，讓使用者登入後能使用 AWS services 的必要設定與程式寫法 (前後端做法相同，極重要！！)
- https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html

### Pre Sign-up Lambda Trigger
- https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html

### 把來自不同 Identity Providers 但相同 email 的使用者帳號合併 (包含很像 bug 的行為)
- https://forums.aws.amazon.com/thread.jspa?threadID=261470
- https://forums.aws.amazon.com/thread.jspa?threadID=267154&tstart=0

### 啟用 User Pool Group 權限
- 先在 IAM 建一個 for Identity Provider 的 Role，該給的權限給一給
- User Pool 建 Group 並指定 Role
- Identity Pool 底下依 Provider 設定 Authenticated role selection，要選 Choose Role from Token
- https://aws.amazon.com/blogs/aws/new-amazon-cognito-groups-and-fine-grained-role-based-access-control-2/
