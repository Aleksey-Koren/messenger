import {FileType, TArrayWithMimeType} from "../model/messenger/file";

export class FileService {

    static readBytesAndMarkMimeType(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
                const arr = new Uint8Array(e.target!.result as ArrayBuffer);
                if (file.type.match(/^image\//)) {
                    resolve(this.addByteMarker(arr, 1));
                } else if (file.type.match(/^video\//)) {
                    resolve(this.addByteMarker(arr, 2));
                } else if (file.type.match(/^audio\//)) {
                    resolve(this.addByteMarker(arr, 3));
                } else {
                    resolve(this.addByteMarker(arr, 4));
                    // throw new Error('Unknown MIME type');
                }
            }

            reader.onerror = e => reject(e.target!.error);

            reader.readAsArrayBuffer(file);
        })
    }


    static readBytesOfFile(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
                const arr = new Uint8Array(e.target!.result as ArrayBuffer);
                resolve(arr);
            }

            reader.onerror = e => reject(e.target!.error);

            reader.readAsArrayBuffer(file);
        })
    }

    static identifyFileTypeAndUnmarkArray(array: Uint8Array): TArrayWithMimeType {
        const fileType = identifyFileType(array);
        const unmarkedArray = array.slice(1);
        return {
            fileType: fileType,
            unmarkedArray: unmarkedArray
        }
    }

    static addByteMarker(input: Uint8Array, marker: number): Uint8Array {
        const result = new Uint8Array(input.length + 1);
        result.set([marker], 0);
        result.set(input, 1);
        return result;
    }
}

function identifyFileType(array: Uint8Array) {
    let name = FileType[array[0]];
    const type = name as keyof typeof FileType;
    return FileType[type]
}