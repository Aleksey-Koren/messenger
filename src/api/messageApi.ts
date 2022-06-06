import {Message} from "../model/message";
import {axiosApi} from "../http/axios";
import {MessageDto} from "../dto/messageDto";
import {MessageMapper} from "../mapper/messageMapper";

export class MessageApi {

    static async sendMessages(messages: Message[]) {
        const dto = await Promise.all(messages.map(async message => await MessageMapper.toDto(message)));
        const respDtos = (await axiosApi.put<MessageDto[]>('messages', dto)).data;
        return await Promise.all(respDtos.map(async dto => await MessageMapper.toEntity(dto)));
    }

    static async sendSingleMessage(message: Message, publicKey: Uint8Array) {
        const dto = await MessageMapper.toDto(message, publicKey);
        const dtos: MessageDto[] = (await axiosApi.put<MessageDto[]>("messages", [dto])).data;
        return (await Promise.all(dtos.map(async dto => await MessageMapper.toEntity(dto))))[0];
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