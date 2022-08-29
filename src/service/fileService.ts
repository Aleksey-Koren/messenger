import {MimeType, TArrayWithMimeType} from "../redux/attachments/attachmentsTypes";

export class FileService {

    static readBytesAndMarkMimeType(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
                const arr = new Uint8Array(e.target!.result as ArrayBuffer);
                if(file.type.match(/^image\//)) {
                    resolve(this.addByteMarker(arr, 1));
                } else if (file.type.match(/^video\//)){
                    resolve(this.addByteMarker(arr, 2));
                } else {
                    throw new Error('Unknown MIME type');
                }
            }

            reader.onerror = e => reject(e.target!.error);

            reader.readAsArrayBuffer(file);
        })
    }

    static identifyMimeTypeAndUnmarkArray(array: Uint8Array): TArrayWithMimeType {
        const mimeType = identifyMimeType(array);
        const unmarkedArray = array.slice(1);
        return {
            mimeType: mimeType,
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

function identifyMimeType(array: Uint8Array) {
    switch (array[0]) {
        case MimeType.IMAGE: return MimeType.IMAGE;
        case MimeType.VIDEO: return MimeType.VIDEO;
        case MimeType.AUDIO: return MimeType.AUDIO;
        default: return MimeType.UNKNOWN;
    }
}