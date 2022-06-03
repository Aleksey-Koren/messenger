import {Message} from "../model/message";
import {axiosApi} from "../http/axios";
import {MessageDto} from "../dto/messageDto";
import {MessageMapper} from "../mapper/messageMapper";

export class MessageApi {

    static async sendMessages(messages: Message[]) {
        const dto = await Promise.all(messages.map(async message => await MessageMapper.toDto(message)));
        return axiosApi.put<MessageDto[]>('messages', dto);
    }

    static sendSingleMessage(message: Message, publicKey: Uint8Array) {
        const dto = MessageMapper.toDto(message, publicKey);
        return axiosApi.put<MessageDto[]>("messages", [dto]);
    }

    static async getMessages(receiverId: string, chatId?: string, created?: Date) {
        let dto = (await axiosApi.get<MessageDto[]>('messages', {
            params: {
                'receiver': receiverId,
                'created': created,
                'chat': chatId
            }
        })).data
        return await Promise.all(dto.map(async dto => await MessageMapper.toEntity(dto)))
    }
}