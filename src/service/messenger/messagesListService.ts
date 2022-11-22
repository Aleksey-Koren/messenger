import {Message} from "../../model/messenger/message";
import {ICoordinates} from "../../model/commonInterfaces";

export class MessagesListService {

    static calculateAimCoordinates(scrollRef: EventTarget & HTMLUListElement): ICoordinates {
        const boundingClientRect = scrollRef.getBoundingClientRect();
        const y = boundingClientRect.bottom - 50;
        const x = (boundingClientRect.right - boundingClientRect.left) / 2
        return {x, y}
    }

    static calculateScrollButtonCoordinates(scrollRef: HTMLUListElement): ICoordinates {
        const boundingClientRect = scrollRef.getBoundingClientRect();
        const y = boundingClientRect.bottom - 80;
        const x = boundingClientRect.right - 50;
        return {x, y};
    }

    static isAfter(current: string, lastRead: string | null) {
        if (lastRead === null) {
            return true;
        } else {
            const currentTime: number = Number(current.split(':')[1]);
            const lastReadTime: number = Number(lastRead.split(':')[1]);
            return currentTime > lastReadTime;
        }
    }

    static mapMessageToHTMLId(message: Message) {
        return message.id! + ':' + message.created!.getTime();
    }

    static isMessageLastRead(id: string, lastReadUuid: string | null) {
        return id === lastReadUuid;
    }

    static areUnreadMessagesExist(lastReadUuid: string | null, messages: Message []) {
        if (messages.length === 0) {
            return false;
        }
        return lastReadUuid !== messages[0].id!;
    }

}