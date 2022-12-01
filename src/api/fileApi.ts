import {axiosApi} from "../http/axios";

export class FileApi {

    static getFiles(messageId: string, attachmentFilenames: string[]) {
        const attachments = attachmentFilenames.map(attachmentFilename => FileApi.getFile(messageId, attachmentFilename));
        return Promise.all(attachments);
    }

    static getFile(messageId: string, attachment: string) {
        return axiosApi.get<any>("files", {
            params: {
                messageId: messageId,
                attachment: attachment
            }
        }).then(response => response.data)
    }
}