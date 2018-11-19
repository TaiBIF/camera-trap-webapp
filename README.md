# camera-trap-webapp

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

### Branching strategy

1. **master**: main development branch. Will merge into _uat_ when ready for public testing.
2. **dev-[personID]**: personal working branch. **Only the creator can commit to this branch**. Will merge into _master_ when complete. Should be deleted once merged into _master_.
3. **feature-[featureID]**: feature working branch. Will merge into _master_ when complete. Should be deleted once merged into _master_.
4. **uat**: user acceptance testing branch. Will merge into _production_ when ready.
5. **production**: public version.
