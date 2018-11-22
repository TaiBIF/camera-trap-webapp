# camera-trap-webapp

### Branching strategy
1. **master**: main development branch. No CI workflow connected.
2. **dev**: connedted to dev CI workflow. Will merge into _uat_ when ready for User Acceptance Testing.
2. **dev-[personID]**: personal working branch. **Only the creator can commit to this branch**. Will merge into _dev_ when complete. Should be deleted once merged into _dev_.
3. **feature-[featureID]**: feature working branch. Will merge into _dev_ when complete. Should be deleted once merged into _dev_.
4. **issue-[issueID]**: issue working branch. Will merge into _dev_ when complete. Should be deleted once merged into _dev_.
5. **uat**: user acceptance testing branch. Will merge into _prod_ when ready.
6. **prod**: production version.

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
