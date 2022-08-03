
export class FileService {

    static readBytesAndMarkMimeType(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
                const arr = new Uint8Array(e.target!.result as ArrayBuffer);
                if(file.type.match(/^image\//)) {
                    resolve(addByteMarker(arr, 1));
                } else {
                    throw new Error('Unknown MIME type');
                }
            }

            reader.onerror = e => reject(e.target!.error);

            reader.readAsArrayBuffer(file);
        })
    }
}

function addByteMarker(input: Uint8Array, marker: number): Uint8Array {
    const result = new Uint8Array(input.length + 1);
    result.set([marker], 0);
    result.set(input, 1);
    return result;
}