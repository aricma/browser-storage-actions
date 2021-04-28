# browser storage actions
*this is a typescript project*

A functional approach to create common actions for all your browser storage options.
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
and
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


## LocalStorageActions

```typescript
interface createLocalStorageActions {
    (depenedncies: LocalStorageActionsDependencies): LocalStorageActions
}

interface LocalStorageActionsDependencies {
    nameSpace: string,
    localStorage: BrowserLocalStorage
}

export interface LocalStorageActions {
    hasItem: (name: string) => boolean,
    addItem: <Value>(item: LocalStorageItem<Value>) => LocalStorageItem<Value>,
    getItemByName: <Value>(name: string) => LocalStorageItem<Value>,
    getAllItemsForNameSpace: () => Array<LocalStorageItem<any>>,
    updateItem: <Value>(item: LocalStorageItem<Value>) => LocalStorageItem<Value>,
    removeItemByName: (name: string) => void,
    removeAllItemsForNameSpace: () => void,
}
```
