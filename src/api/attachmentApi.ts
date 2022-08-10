import {axiosApi} from "../http/axios";
export class AttachmentApi {

    static getAttachments(messageId: string, attachmentFilenames: string[]) {
        const attachments = attachmentFilenames.map(attachmentFilename => AttachmentApi.getAttachment(messageId, attachmentFilename));
        return Promise.all(attachments);
    }

    static getAttachment(messageId: string, attachment: string) {
        const requestParams = {
            messageId: messageId,
            attachment: attachment
        }
        return  axiosApi.get<ArrayBuffer>("attachments", {params: requestParams, responseType: 'arraybuffer'})
            .then(response => response.data)
    }
}