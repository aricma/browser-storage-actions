import {
    LocalStorageItem,
    LocalStorageActions,
    LocalStorageActionErrors,
} from './models';
import createLocalStorageActions from './localStorageActions';


const NAME_SPACE = 'name_space';

function setupLocalStorageTestActions(): LocalStorageActions {
    return createLocalStorageActions({
        nameSpace: NAME_SPACE,
        localStorage: localStorage,
    });
}

beforeEach(function setup() {
    localStorage.clear();
    localStorage.setItem(NAME_SPACE + '__string', JSON.stringify({ name: 'string', value: 'abc' }));
    localStorage.setItem(NAME_SPACE + '__number', JSON.stringify({ name: 'number', value: 123 }));
    localStorage.setItem(NAME_SPACE + '__boolean', JSON.stringify({ name: 'boolean', value: true }));
    localStorage.setItem(NAME_SPACE + '__array', JSON.stringify({ name: 'array', value: [1, 2, 3] }));
    localStorage.setItem(NAME_SPACE + '__object', JSON.stringify({ name: 'object', value: { a: '1', b: '2', c: '3' } }));
});

describe('hasItem', () => {

    test('given name: string, when called and successful, then returns true', () => {
        const { hasItem } = setupLocalStorageTestActions();
        expect(hasItem('number')).toBe(true);
    });

    test('given invalid name: string when failed, then return false', () => {
        const { hasItem } = setupLocalStorageTestActions();
        expect(hasItem('other')).toBe(false);
    });

});

describe('addItem', () => {

    test('given item: Item<string>, when successful, then returns item', () => {
        const item: LocalStorageItem = { name: 'a', value: 'a' };
        const { addItem } = setupLocalStorageTestActions();
        expect(addItem(item)).toBe(item);
        expect(localStorage.getItem(NAME_SPACE + '__' + item.name)).toBe(JSON.stringify(item));
    });

    test('given item: Item<boolean>, when successful, then returns item', () => {
        const item: LocalStorageItem<boolean> = { name: 'a', value: true };
        const { addItem } = setupLocalStorageTestActions();
        expect(addItem(item)).toBe(item);
        expect(localStorage.getItem(NAME_SPACE + '__' + item.name)).toBe(JSON.stringify(item));
    });

    test('given item: Item<Array<string>>, when successful, then returns item', () => {
        const item: LocalStorageItem<Array<string>> = { name: 'a', value: ['a', 'b', 'c'] };
        const { addItem } = setupLocalStorageTestActions();
        expect(addItem(item)).toBe(item);
        expect(localStorage.getItem(NAME_SPACE + '__' + item.name)).toBe(JSON.stringify(item));
    });

    test('given item: Item<object>, when successful, then returns item', () => {
        const item: LocalStorageItem<{ some: 'interface' }> = { name: 'a', value: { some: 'interface' } };
        const { addItem } = setupLocalStorageTestActions();
        expect(addItem(item)).toBe(item);
        expect(localStorage.getItem(NAME_SPACE + '__' + item.name)).toBe(JSON.stringify(item));
    });

    test('given item: Item to be added twice, when called second time, then throws', () => {
        const item: LocalStorageItem = { name: 'number', value: '456' };
        const { addItem } = setupLocalStorageTestActions();
        expect(() => addItem(item)).toThrow(Error(LocalStorageActionErrors.ITEM_NOT_ADDABLE_CONFLICTING_ITEM_NAME));
        const expected = [
            NAME_SPACE + '__string',
            NAME_SPACE + '__number',
            NAME_SPACE + '__boolean',
            NAME_SPACE + '__array',
            NAME_SPACE + '__object',
        ];
        expect(Object.keys(localStorage)).toEqual(expected);
    });

});

describe('updateItem', () => {

    test('given item: Item when successful, then return item: Item', () => {
        const { updateItem } = setupLocalStorageTestActions();
        const item: LocalStorageItem<number> = { name: 'number', value: 456 };
        expect(updateItem(item)).toEqual(item);
        expect(localStorage.getItem(NAME_SPACE + '__number'))
            .toBe(JSON.stringify(item));
    });

    test('given invalid item name when failed, then throws', () => {
        const { updateItem } = setupLocalStorageTestActions();
        const item: LocalStorageItem<number> = { name: 'other', value: 456 };
        expect(() => updateItem(item)).toThrow(Error(LocalStorageActionErrors.ITEM_NOT_FOUND));
        const expected = [
            NAME_SPACE + '__string',
            NAME_SPACE + '__number',
            NAME_SPACE + '__boolean',
            NAME_SPACE + '__array',
            NAME_SPACE + '__object',
        ];
        expect(Object.keys(localStorage)).toEqual(expected);
    });

});

describe('getItemByName', () => {

    test('when given name: string, when called, then return value: any', () => {
        const name = 'array';
        const { getItemByName } = setupLocalStorageTestActions();
        expect(getItemByName(name)).toEqual({ name, value: [1, 2, 3] });
    });

    test('when given invalid name, when called, then throws', () => {
        const name = 'other';
        const { getItemByName } = setupLocalStorageTestActions();
        expect(() => getItemByName(name)).toThrow(Error(LocalStorageActionErrors.ITEM_NOT_FOUND));
    });

});

describe('getAllItemsForNameSpace', () => {

    test('when called, then return all Array[Item] for nameSpace', () => {
        const OTHER_NAME_SPACE = 'other_name_space';
        localStorage.setItem(OTHER_NAME_SPACE + '__string', JSON.stringify({ name: 'string', value: 'abc' }));
        const { getAllItemsForNameSpace } = setupLocalStorageTestActions();
        const expected = [
            { name: 'string', value: 'abc' },
            { name: 'number', value: 123 },
            { name: 'boolean', value: true },
            { name: 'array', value: [1, 2, 3] },
            { name: 'object', value: { a: '1', b: '2', c: '3' } },
        ];
        expect(getAllItemsForNameSpace()).toEqual(expected);
    });

    test('given empty localStorage when called, then return []', () => {
        localStorage.clear();
        const { getAllItemsForNameSpace } = setupLocalStorageTestActions();
        expect(getAllItemsForNameSpace()).toEqual([]);
    });

    test('given localStorage with corruption items, when called, then throw', () => {
        localStorage.clear();
        localStorage.setItem(NAME_SPACE + '__string', '{ this item will no be parsed }');
        const { getAllItemsForNameSpace } = setupLocalStorageTestActions();
        expect(() => getAllItemsForNameSpace()).toThrow(Error(LocalStorageActionErrors.FAILED_TO_PARSE));
    });

});

describe('removeItemByName', () => {

    test('given valid name, when successful, then return name: string', () => {
        const { removeItemByName } = setupLocalStorageTestActions();

        expect(() => removeItemByName('number')).not.toThrow();
        const expected = [
            NAME_SPACE + '__string',
            NAME_SPACE + '__boolean',
            NAME_SPACE + '__array',
            NAME_SPACE + '__object',
        ];
        expect(Object.keys(localStorage)).toEqual(expected);
    });

    test('given invalid name, when failed, then throws', () => {
        const { removeItemByName } = setupLocalStorageTestActions();
        expect(() => removeItemByName('other')).toThrow(Error(LocalStorageActionErrors.ITEM_NOT_REMOVABLE));
    });

});

describe('removeAllItemsForNameSpace', () => {

    const OTHER_NAME_SPACE = 'other_name_space';

    beforeEach(function setup() {
        localStorage.setItem(OTHER_NAME_SPACE + '__string', JSON.stringify({ name: 'string', value: 'abc' }));
    });

    test('when called, then localStorage has no key from depended nameSpace', () => {
        const { removeAllItemsForNameSpace } = setupLocalStorageTestActions();
        removeAllItemsForNameSpace();
        expect(Object.keys(localStorage)).toEqual([OTHER_NAME_SPACE + '__string']);
    });


});
