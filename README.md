# browser storage actions
*this is a typescript project*

[![lint](https://github.com/aricma/browser-storage-actions/actions/workflows/lint.yml/badge.svg)](https://github.com/aricma/browser-storage-actions/actions/workflows/lint.yml)
[![compile](https://github.com/aricma/browser-storage-actions/actions/workflows/compile.yml/badge.svg)](https://github.com/aricma/browser-storage-actions/actions/workflows/compile.yml)
[![test](https://github.com/aricma/browser-storage-actions/actions/workflows/test.yml/badge.svg)](https://github.com/aricma/browser-storage-actions/actions/workflows/test.yml)
[![coverage](https://github.com/aricma/browser-storage-actions/actions/workflows/coverage.yml/badge.svg)](https://github.com/aricma/browser-storage-actions/actions/workflows/coverage.yml)

A functional approach to creating common actions for all your browser storage options.
Using the browser storage options is always a pain. Let's make this as easy and secure as we can.


**We currently support:**
- LocalStorage

**We will support:**
- Cookies
- Session Storage
- ... what do you need?


## setup
```bash
yarn add @aricma/browser-storage-actions
```
or
```bash
npm install @aricma/browser-storage-actions
```


## usage

```typescript
import { createLocalStorageActions } from '@aricma/browser-storage-actions';

const localStorageActions = createLocalStorageActions({
    nameSpace: "YOU_NAME_SPACE",
    localStorage: window.localStorage,
})

interface SomeFeatureState {
    value: string,
    counter: numbre,
    selection: string,
}

const item: SomeFeatureState = localStorageActions.addItem<SomeFeatureState>({
    name: 'my-feature-state',
    value: {
        value: 'hello world!',
        counter: 3,
        selection: 'some value from selection',
    },
}).value;
```


## domain models

```typescript
export interface BrowserStorageActions {
    hasItem: (name: string) => boolean,
    addItem: <Value>(item: BrowserStorageItem<Value>) => BrowserStorageItem<Value>,
    getItemByName: <Value>(name: string) => BrowserStorageItem<Value>,
    getAllItemsForNameSpace: () => Array<BrowserStorageItem<any>>,
    updateItem: <Value>(item: BrowserStorageItem<Value>) => BrowserStorageItem<Value>,
    removeItemByName: (name: string) => void,
    removeAllItemsForNameSpace: () => void,
}

export interface BrowserStorageItem<Value = string> {
    name: string,
    value: Value,
}
```


## createLocalStorageActions

```typescript
interface createLocalStorageActions {
    (depenedncies: LocalStorageActionsDependencies): BrowserStorageActions
}

interface LocalStorageActionsDependencies {
    nameSpace: string,
    localStorage: BrowserLocalStorage
}
```


## Feedback

- [https://github.com/aricma/browser-storage-actions/issues](https://github.com/aricma/browser-storage-actions/issues)
