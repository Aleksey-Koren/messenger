import {Message} from "../model/messenger/message";
import {axiosApi} from "../http/axios";
import {MessageDto} from "../dto/messageDto";
import {MessageMapper} from "../mapper/messageMapper";
import {MessageType} from "../model/messenger/messageType";
import {User} from "../model/messenger/user";
import {StringIndexArray} from "../model/stringIndexArray";
import {GlobalUser} from "../model/local-storage/localStorageTypes";

export class MessageApi {

    static async sendMessages(messages: Message[], users: StringIndexArray<GlobalUser>) {

        return Promise.all(messages.map(message => MessageMapper.toDto(message, users[message.receiver]))).then(dto => {
            return axiosApi.post<MessageDto[]>('messages?iam=' + messages[0].sender, dto);
        }).then(response => {
            return response.data.map(dto => MessageMapper.toEntity(dto, users[dto.sender].userId));
        })
    }

    static async getMessages(request: {
        receiver?: string,
        chat?: string,
        created?: Date,
        before?: Date,
        type?: MessageType,
        page?: number,
        size?: number
    }) {
        let dto = (await axiosApi.get<{ content: MessageDto[] }>('messages', {params: request})).data;

        return await dto.content.map(dto => {
            const decryptedMessage = MessageMapper.toEntity(dto, dto.sender);

            console.log('GET MESSAGES. DECRYPTED MESSAGE --- ' + JSON.stringify(decryptedMessage))

            return decryptedMessage
        });
    }

    static async updateUserTitle(messages: Message[], users: StringIndexArray<GlobalUser>): Promise<Message[]> {
        const dto = await Promise.all(messages.map(async message => await MessageMapper.toDto(message, users[message.receiver])));
        return await axiosApi.put<MessageDto[]>('messages/title?iam=' + messages[0].sender, dto).then(response => {
            return response.data.map(dto => MessageMapper.toEntity(dto, users[dto.sender].userId));
        })
    }
}
