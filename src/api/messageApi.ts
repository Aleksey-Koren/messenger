import {Message} from "../model/message";
import {axiosApi} from "../http/axios";
import {MessageDto} from "../dto/messageDto";
import {MessageMapper} from "../mapper/messageMapper";

export class MessageApi {

    static async sendMessages(messages: Message[]) {
        const dto = await Promise.all(messages.map(async message => await MessageMapper.toDto(message)));
        await axiosApi.put<MessageDto[]>('messages', dto)
    }

    static async sendSingleMessage(message: Message, publicKey: Uint8Array) {
        const dto = await MessageMapper.toDto(message, publicKey);
        await axiosApi.put<MessageDto[]>("messages", [dto]);
    }

    static async sendMessageToMyself(message: Message, publicKey: Uint8Array) {
        const dto = (await axiosApi.put<MessageDto[]>("messages", [await MessageMapper.toDto(message, publicKey)])).data[0];
        return MessageMapper.toEntity(dto);
    }

    static async getMessages(receiverId: string, chatId?: string, created?: Date) {
        let dto = (await axiosApi.get<MessageDto[]>('messages', {
            params: {
                'receiver': receiverId,
                'created': created,
                'chat': chatId
            }
        })).data
        return Promise.all(dto.map(async dto => await MessageMapper.toEntity(dto)))
    }

    static async updateUserTitle(messages: Message[]) {
        const dto = await Promise.all(messages.map(async message => await MessageMapper.toDto(message)));

        await axiosApi.put('messages/title', dto)
    }
}