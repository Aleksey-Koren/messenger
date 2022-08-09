import {axiosApi} from "../http/axios";
export class AttachmentApi {

    static getAttachments(messageId: string) {
       return  axiosApi.get<string[]>("attachments", {params: {messageId: messageId}})
           .then(response => response.data)
    }
}