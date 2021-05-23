export namespace BrowserStorageActionsModels {

    export interface BrowserStorageActions {
        hasItem: HasItem,
        addItem: AddItem,
        getItemByName: GetItemByName,
        getAllItemsForNameSpace: GetAllItemsForNameSpace,
        updateItem: UpdateItem,
        removeItemByName: RemoveItemByName,
        removeAllItemsForNameSpace: RemoveAllItemsForNameSpace,
    }

    export interface HasItem {
        (name: string): boolean
    }

    export interface AddItem {
        <Value>(item: BrowserStorageItem<Value>): BrowserStorageItem<Value>
    }

    export interface GetItemByName {
        <Value>(name: string): BrowserStorageItem<Value>
    }

    export interface GetAllItemsForNameSpace {
        (): Array<BrowserStorageItem<any>>
    }

    export interface UpdateItem {
        <Value>(item: BrowserStorageItem<Value>): BrowserStorageItem<Value>,
    }

    export interface RemoveItemByName {
        (name: string): void,
    }

    export interface RemoveAllItemsForNameSpace {
        (): void,
    }

    export interface BrowserStorageItem<Value = string> {
        name: string,
        value: Value,
    }

}
