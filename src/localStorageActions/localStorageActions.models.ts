export enum LocalStorageActionErrors {
    FAILED_TO_PARSE = 'Parsing Error: The local storage item is not json serializable.',
    ITEM_NOT_FOUND = 'Item Not Found: The local storage item name you provode is not in local storage and can so not be found.',
    ITEM_NOT_ADDABLE_CONFLICTING_ITEM_NAME = 'Item Can Not Be Added: The local storage item name you provode is already in local storage and not be added again. Try to update it.',
    ITEM_NOT_REMOVABLE = 'Item Not Removable: The local storage item you provode is not removable.',
}

export interface BrowserLocalStorage {
    setItem: (key: string, value: any) => void,
    getItem: (key: string) => any,
    removeItem: (key: string) => void,
    clear: () => void,
}
