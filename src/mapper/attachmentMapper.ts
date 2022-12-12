import {CryptService} from "../service/cryptService";
import {store} from "../index";
import {TAttachmentFile} from "../model/messenger/file";
import {MyFile} from "../model/messenger/MyFile";

export class AttachmentMapper {

    static toAttachmentFile(array: ArrayBuffer, file: MyFile, senderId: string, nonce: string): TAttachmentFile {
        const keyAES = store.getState().messenger.chats[store.getState().messenger.currentChat!].keyAES;
        const encryptedFile = new Uint8Array(array);

        const decryptedName = CryptService.decryptAES(file.name, keyAES, nonce)
        const decryptedType = CryptService.decryptAES(file.type, keyAES, nonce)

        const fileInBase64 = CryptService.Uint8ToBase64(encryptedFile)
        const decryptedFileData = CryptService.decryptAES(fileInBase64, keyAES, nonce)

        const decryptedFileInBase64 = CryptService.textToBase64(decryptedFileData);
        const decryptedFile = CryptService.base64ToUint8(decryptedFileInBase64);

        if (decryptedFile === null) {
            return {
                isDecrypted: false
            }
        }

        return {
            isDecrypted: true,
            data: new Blob([decryptedFile]),
            name: decryptedName,
            type: decryptedType
        }
    }
}