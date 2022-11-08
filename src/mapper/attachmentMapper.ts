import {CryptService} from "../service/cryptService";
import {store} from "../index";
import {TAttachmentFile} from "../redux/attachments/attachmentsTypes";
import {FileService} from "../service/fileService";

export class AttachmentMapper {

    static toAttachmentFile(array: ArrayBuffer, senderId: string, nonce: string): TAttachmentFile {
        const chat = store.getState().messenger.chats[store.getState().messenger.currentChat!];

        const encryptedFile = new Uint8Array(array);
        const encryptedBase64 = CryptService.uint8ToBase64(encryptedFile);

        const decryptedBytes = CryptService.decryptAES(encryptedBase64, chat.keyAES, nonce)
        const decryptedBase64 = CryptService.BytesToBase64(decryptedBytes);
        const decryptedFile = CryptService.base64ToUint8(decryptedBase64);

        if (decryptedFile === null) {
            return {
                isDecrypted: false
            }
        }

        const arrayAndType = FileService.identifyMimeTypeAndUnmarkArray(decryptedFile);

        return {
            isDecrypted: true,
            data: new Blob([arrayAndType.unmarkedArray]),
            mimeType: arrayAndType.mimeType
        }
    }
}