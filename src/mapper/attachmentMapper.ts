import {CryptService} from "../service/cryptService";
import {store} from "../index";
import {TAttachmentFile} from "../redux/attachments/attachmentsTypes";
import {FileService} from "../service/fileService";

export class AttachmentMapper {

    static toAttachmentFile(fileAsString: string, senderId: string, nonce: Uint8Array): TAttachmentFile {
        const cryptFile = CryptService.base64ToUint8(fileAsString);
        const state = store.getState();
        const senderPublicKeys = state.messenger.globalUsers[senderId]?.certificates;
        const privateKey = state.messenger.user?.privateKey;

        let encryptedFile: Uint8Array | null = null;

        for (let pKey of senderPublicKeys) {
            encryptedFile = CryptService.decrypt(cryptFile, CryptService.base64ToUint8(pKey), nonce, privateKey!);
            if(encryptedFile !== null) {
                break;
            }
        }

        if(encryptedFile === null) {
            return {
                isDecrypted: false
            }
        }

        const arrayAndType = FileService.identifyMimeTypeAndUnmarkArray(encryptedFile);

        return {
            isDecrypted: true,
            data: new Blob([arrayAndType.unmarkedArray]),
            mimeType: arrayAndType.mimeType
        }
    }
}