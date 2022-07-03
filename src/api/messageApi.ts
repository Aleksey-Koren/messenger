import {Message} from "../model/message";
import {axiosApi} from "../http/axios";
import {MessageDto} from "../dto/messageDto";
import {MessageMapper} from "../mapper/messageMapper";
import {MessageType} from "../model/messageType";
import {User} from "../model/user";

export class MessageApi {

    static async sendMessages(messages: Message[], users:{[key:string]:User}) {
        return Promise.all(messages.map(message => MessageMapper.toDto(message, users[message.receiver]))).then(dto => {
            return axiosApi.post<MessageDto[]>('messages?iam=' + messages[0].sender, dto);
        }).then(response => {
            return response.data.map(dto => MessageMapper.toEntity(dto, users[dto.sender]));
        })
    }

    static async getMessages(request:{receiver?: string, chat: string, created?: Date, type?:MessageType}, users:{[key:string]:User}) {
        let dto = (await axiosApi.get<{content: MessageDto[]}>('messages', {
            params: request
        })).data
        return dto.content.map(dto => MessageMapper.toEntity(dto, users[dto.sender]))
    }

    static async updateUserTitle(messages: Message[], users:{[key:string]:User}):Promise<Message[]> {
        const dto = messages.map(message => MessageMapper.toDto(message, users[message.receiver]));
        return await axiosApi.put<MessageDto[]>('messages/title?iam=' + messages[0].sender, dto).then(response => {
            return response.data.map(dto => MessageMapper.toEntity(dto, users[dto.sender]));
        })
    }
}
