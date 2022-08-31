import React from "react";
import {Message} from "../../model/messenger/message";

export class MessagesListService {
    //TODO maybe we don't need it
    static onScroll(e: React.UIEvent<HTMLUListElement, UIEvent>) {
        const scrollRef = e.currentTarget;
        if(scrollRef.scrollTop < 20) {

        }
    }

    static calculateAimCoordinates(scrollRef:  EventTarget & HTMLUListElement) {
        const boundingClientRect = scrollRef.getBoundingClientRect();
        const y = boundingClientRect.bottom - 40;
        const x = (boundingClientRect.right - boundingClientRect.left) / 2
        return {x,y}
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

    static mapMessageToLastReadString(message: Message) {
        return message.id! + ':' + message.created!.getTime();
    }

    static isMessageLastRead(id: string, lastReadUuid: string | null) {
        return id === lastReadUuid;
    }

    static isUnreadMessagesExist(lastReadUuid: string | null, messages: Message []) {
        if(messages.length === 0) {
            return false;
        }
        return lastReadUuid !== messages[0].id!;
    }
}