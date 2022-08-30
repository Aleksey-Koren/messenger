import React from "react";

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
}