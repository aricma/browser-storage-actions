import {BrowserStorageActionsModels} from '../models/domain';
import {BrowserLocalStorage, LocalStorageActionErrors} from './localStorageActions.models';


interface LocalStorageActionsDependencies {
    nameSpace: string,
    localStorage: BrowserLocalStorage
}

export default function createLocalStorageActions(dependencies: LocalStorageActionsDependencies): BrowserStorageActionsModels.BrowserStorageActions {

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

    function tryToParseRawValue<Value>(rawValue: string): BrowserStorageActionsModels.BrowserStorageItem<Value> {
        try {
            return JSON.parse(rawValue) as BrowserStorageActionsModels.BrowserStorageItem<Value>;
        } catch (e) {
            throw new Error(LocalStorageActionErrors.FAILED_TO_PARSE);
        }
    }

    const hasItem: BrowserStorageActionsModels.HasItem = (name) => {
        return checkLocalStorageForName(name);
    };

    const addItem: BrowserStorageActionsModels.AddItem = (item) => {
        if (checkLocalStorageForName(item.name)) {
            throw new Error(LocalStorageActionErrors.ITEM_NOT_ADDABLE_CONFLICTING_ITEM_NAME);
        }
        const key = keyForName(item.name);
        const value = JSON.stringify(item);
        dependencies.localStorage.setItem(key, value);
        return item;
    };

    const getItemByName: BrowserStorageActionsModels.GetItemByName = <Value>(name: string) => {
        if (checkLocalStorageForName(name)) {
            const key = keyForName(name);
            const rawValue: string = dependencies.localStorage.getItem(key);
            return tryToParseRawValue<Value>(rawValue);
        } else {
            throw new Error(LocalStorageActionErrors.ITEM_NOT_FOUND);
        }
    };

    const getAllItemsForNameSpace: BrowserStorageActionsModels.GetAllItemsForNameSpace = () => {
        return Object
            .entries(dependencies.localStorage)
            .filter(([key, _]) => checkLocalStorageKeyForNameSpace(key))
            .reduce((allItems, [_, rawValue]) => {
                return [
                    ...allItems,
                    tryToParseRawValue(rawValue),
                ];
            }, [] as Array<BrowserStorageActionsModels.BrowserStorageItem<any>>);
    };

    const updateItem: BrowserStorageActionsModels.UpdateItem = (item) => {
        if (checkLocalStorageForName(item.name)) {
            const key = keyForName(item.name);
            const value = JSON.stringify(item);
            dependencies.localStorage.setItem(key, value);
            return item;
        } else {
            throw new Error(LocalStorageActionErrors.ITEM_NOT_FOUND);
        }
    };

    const removeItemByName: BrowserStorageActionsModels.RemoveItemByName = (name: string) => {
        if (checkLocalStorageForName(name)) {
            const key = keyForName(name);
            dependencies.localStorage.removeItem(key);
        } else {
            throw new Error(LocalStorageActionErrors.ITEM_NOT_REMOVABLE);
        }
    };

    const removeAllItemsForNameSpace: BrowserStorageActionsModels.RemoveAllItemsForNameSpace = () => {
        Object
            .keys(dependencies.localStorage)
            .filter((key) => checkLocalStorageKeyForNameSpace(key))
            .forEach((key) => {
                dependencies.localStorage.removeItem(key);
            });
    };

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
