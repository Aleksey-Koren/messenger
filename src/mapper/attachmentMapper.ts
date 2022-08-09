import {CryptService} from "../service/cryptService";
import {GlobalUser} from "../model/local-storage/localStorageTypes";
import {store} from "../index";
import {IAttachmentsBlockState} from "../components/messenger/attachments/AttachmentsBlock";
import {TAttachmentFile} from "../redux/attachments/attachmentsTypes";

export class AttachmentMapper {

    static toAttachmentFile(fileAsString: string, senderId: string, nonce: Uint8Array): TAttachmentFile {
        const cryptedFile = CryptService.base64ToUint8(fileAsString);
        const state = store.getState();
        const senderPublicKeys = state.messenger.globalUsers[senderId]?.certificates;
        const privateKey = state.messenger.user?.privateKey;

        let encryptedFile: Uint8Array | null = null;

        for (let pKey of senderPublicKeys) {
            encryptedFile = CryptService.decrypt(cryptedFile, CryptService.base64ToUint8(pKey), nonce, privateKey!);
            if(encryptedFile !== null) {
                break;
            }
        }

        if(encryptedFile === null) {
            return {
                isDecrypted: false
            }
        }


    }
}