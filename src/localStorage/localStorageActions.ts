import {
    LocalStorageActions,
    BrowserLocalStorage,
    LocalStorageItem,
    LocalStorageActionErrors,
    AddItem, GetItemByName, UpdateItem, RemoveItemByName, RemoveAllItemsForNameSpace, GetAllItemsForNameSpace, HasItem,
} from './models';


interface LocalStorageActionsDependencies {
    nameSpace: string,
    localStorage: BrowserLocalStorage
}

export default function createLocalStorageActions(dependencies: LocalStorageActionsDependencies): LocalStorageActions {

    function checkLocalStorageKeyForNameSpace(localStorageKey: string): boolean {
        return localStorageKey.slice(0, dependencies.nameSpace.length) === dependencies.nameSpace;
    }

    function keyForName(name: string): string {
        return dependencies.nameSpace + '__' + name;
    }

    function checkLocalStorageForName(name: string): boolean {
        const key = keyForName(name);
        return Object.keys(dependencies.localStorage).includes(key);
    }

    function tryToParseRawValue<Value>(rawValue: string): LocalStorageItem<Value> {
        try {
            return JSON.parse(rawValue) as LocalStorageItem<Value>;
        } catch(e) {
            throw new Error(LocalStorageActionErrors.FAILED_TO_PARSE);
        }
    }

    const hasItem: HasItem = (name) => {
        return checkLocalStorageForName(name);
    }

    const addItem: AddItem = (item) => {
        if (checkLocalStorageForName(item.name)) {
            throw new Error(LocalStorageActionErrors.ITEM_NOT_ADDABLE_CONFLICTING_ITEM_NAME);
        }
        const key = keyForName(item.name);
        const value = JSON.stringify(item);
        dependencies.localStorage.setItem(key, value);
        return item;
    }

    const getItemByName: GetItemByName = <Value>(name: string) => {
        if (checkLocalStorageForName(name)) {
            const key = keyForName(name);
            const rawValue: string = dependencies.localStorage.getItem(key);
            return tryToParseRawValue<Value>(rawValue);
        } else {
            throw new Error(LocalStorageActionErrors.ITEM_NOT_FOUND);
        }
    }

    const getAllItemsForNameSpace: GetAllItemsForNameSpace = () => {
        return Object
            .entries(dependencies.localStorage)
            .filter(([key, _]) => checkLocalStorageKeyForNameSpace(key))
            .reduce((allItems, [_, rawValue]) => {
                return [
                    ...allItems,
                    tryToParseRawValue(rawValue),
                ];
            }, [] as Array<LocalStorageItem<any>>);
    }

    const updateItem: UpdateItem = (item) => {
        if (checkLocalStorageForName(item.name)) {
            const key = keyForName(item.name);
            const value = JSON.stringify(item);
            dependencies.localStorage.setItem(key, value);
            return item;
        } else {
            throw new Error(LocalStorageActionErrors.ITEM_NOT_FOUND);
        }
    }

    const removeItemByName: RemoveItemByName = (name: string) => {
        if (checkLocalStorageForName(name)) {
            const key = keyForName(name);
            dependencies.localStorage.removeItem(key);
        } else {
            throw new Error(LocalStorageActionErrors.ITEM_NOT_REMOVABLE);
        }
    }

    const removeAllItemsForNameSpace: RemoveAllItemsForNameSpace = () => {
        Object
            .keys(dependencies.localStorage)
            .filter((key) => checkLocalStorageKeyForNameSpace(key))
            .forEach((key) => {
                dependencies.localStorage.removeItem(key);
            });
    }

    return {
        hasItem: hasItem,
        addItem: addItem,
        getItemByName: getItemByName,
        getAllItemsForNameSpace: getAllItemsForNameSpace,
        updateItem: updateItem,
        removeItemByName: removeItemByName,
        removeAllItemsForNameSpace: removeAllItemsForNameSpace,
    };
}
