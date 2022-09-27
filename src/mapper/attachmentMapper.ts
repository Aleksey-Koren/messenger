import {CryptService} from "../service/cryptService";
import {store} from "../index";
import {MimeType, TAttachmentFile} from "../redux/attachments/attachmentsTypes";
import {FileService} from "../service/fileService";

export class AttachmentMapper {

    static async toAttachmentFile(array: ArrayBuffer, senderId: string, nonce: Uint8Array):
        Promise<TAttachmentFile | undefined> {
        const cryptFile = new Uint8Array(array);
        const state = store.getState();
        const senderPublicKeys = state.messenger.globalUsers[senderId]?.certificates;
        const privateKey = state.messenger.user?.privateKey;
        let file: TAttachmentFile = {isDecrypted: false}

        let encryptedFile: Uint8Array | null = null;

        for (let pKey of senderPublicKeys) {
            encryptedFile = CryptService.decrypt(cryptFile, CryptService.base64ToUint8(pKey), nonce, privateKey!);
            if (encryptedFile !== null) {
                break;
            }
        }

        if (encryptedFile === null) {
            return file
        }

        const arrayAndType = FileService.identifyMimeTypeAndUnmarkArray(encryptedFile);


        file.data = new Blob([arrayAndType.unmarkedArray]);
        file.mimeType = arrayAndType.mimeType;

        const img = new Image();
        img.src = URL.createObjectURL(file.data);

        if (file.mimeType === MimeType.AUDIO) {
            return file;
        }
        await new Promise((resolve, reject) => {
            img.onload = () => {
                resolve(img)
                console.log(img.width, img.height)
            }
            img.onerror = e => {
                reject(e)
            }
        })

        file.height = img.height;
        file.width = img.width;

        return file
    }

    static loadImage = (path: string) => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                resolve(img)
            }
            img.onerror = e => {
                reject(e)
            }
        })
    }
}