import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {IAttachmentsBlockState} from "../../components/messenger/attachments/AttachmentsBlock";
import {AttachmentApi} from "../../api/attachmentApi";
import React from "react";
import {Message} from "../../model/messenger/message";

export const x = 5;

export function fetchAttachmentsTF(message: Message,
                                   attachmentBlockState: React.Dispatch<React.SetStateAction<IAttachmentsBlockState>>) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        AttachmentApi.getAttachments(message.id!)
            .then(files => {

            })
    }

}