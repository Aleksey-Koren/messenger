export interface StringIndexArray<T> {
    [key: string]: T
}

export interface StringIndexArrayEntry<T> {
    key: string,
    value: T
}

export function stringIndexArrayToArray<T>(indexArray: StringIndexArray<T>): Array<T> {
    const result = new Array<T>();
    for (let i in indexArray) {
        result.push(indexArray[i]);
    }
    return result;
}

export function stringIndexArrayToEntryArray<T>(indexArray: StringIndexArray<T>): Array<StringIndexArrayEntry<T>> {
    const result = new Array<StringIndexArrayEntry<T>>();

    for (let i in indexArray) {
        result.push({key: i, value: indexArray[i]});
    }
    return result;
}

export function stringIndexArrayToEntrySet<T>(indexArray: StringIndexArray<T>): Set<StringIndexArrayEntry<T>> {

    const result = new Set<StringIndexArrayEntry<T>>();

    for (let i in indexArray) {
        result.add({key: i, value: indexArray[i]});
    }
    return result;
}

