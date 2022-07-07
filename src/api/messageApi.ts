import {Message} from "../model/messenger/message";
import {axiosApi} from "../http/axios";
import {MessageDto} from "../dto/messageDto";
import {MessageMapper} from "../mapper/messageMapper";
import {MessageType} from "../model/messenger/messageType";
import {User} from "../model/messenger/user";

export class MessageApi {

    static async sendMessages(messages: Message[], users: { [key: string]: User }) {
        return Promise.all(messages.map(message => MessageMapper.toDto(message, users[message.receiver]))).then(dto => {
            return axiosApi.post<MessageDto[]>('messages?iam=' + messages[0].sender, dto);
        }).then(response => {
            return response.data.map(dto => MessageMapper.toEntity(dto, users[dto.sender]));
        })
    }

    static async getMessages(request: {
                                 receiver?: string,
                                 chat?: string,
                                 created?: Date,
                                 before?: Date,
                                 type?: MessageType}) {
        let dto = (await axiosApi.get<MessageDto[]>('messages',{params: request})).data;
        return dto.map(dto => MessageMapper.toEntity(dto, dto.sender);
    }



    static async updateUserTitle(messages: Message[], users: { [key: string]: User }): Promise<Message[]> {
        const dto = messages.map(message => MessageMapper.toDto(message, users[message.receiver]));
        return await axiosApi.put<MessageDto[]>('messages/title?iam=' + messages[0].sender, dto).then(response => {
            return response.data.map(dto => MessageMapper.toEntity(dto, users[dto.sender]));
        })
    }
}
