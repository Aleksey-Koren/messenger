import React from "react";

export class MessagesListService {
    //TODO maybe we don't need it
    static onScroll(e: React.UIEvent<HTMLUListElement, UIEvent>) {
        const scrollRef = e.currentTarget;
        if(scrollRef.scrollTop < 20) {

        }
    }
}