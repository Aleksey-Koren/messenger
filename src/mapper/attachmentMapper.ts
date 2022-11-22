import {CryptService} from "../service/cryptService";
import {store} from "../index";
import {FileService} from "../service/fileService";
import {TAttachmentFile} from "../model/messenger/file";

export class AttachmentMapper {

    static toAttachmentFile(array: ArrayBuffer, senderId: string, nonce: string): TAttachmentFile {
        const chat = store.getState().messenger.chats[store.getState().messenger.currentChat!];

        const encryptedFile = new Uint8Array(array);

        const decryptedBytes = CryptService.decryptAES(encryptedFile, chat.keyAES, nonce)
        const decryptedBase64 = CryptService.BytesToBase64(decryptedBytes);
        const decryptedFile = CryptService.base64ToUint8(decryptedBase64);

        if (decryptedFile === null) {
            return {
                isDecrypted: false
            }
        }

        const arrayAndType = FileService.identifyFileTypeAndUnmarkArray(decryptedFile);

        // let filename = new Blob([arrayAndType.unmarkedArray]).filename;
        // console.log()


        return {
            isDecrypted: true,
            data: new Blob([arrayAndType.unmarkedArray]),
            fileType: arrayAndType.fileType
        }
    }
}