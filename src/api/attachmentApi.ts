import {axiosApi} from "../http/axios";
import {AttachmentDto} from "../dto/AttachmentDto";
export class AttachmentApi {

    static getAttachments(messageId: string) {
       return  axiosApi.get<AttachmentDto>("attachments", {params: {messageId: messageId}})
           .then(response => response.data)
    }
}