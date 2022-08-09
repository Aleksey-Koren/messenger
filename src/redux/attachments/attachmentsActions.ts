import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {IAttachmentsBlockState} from "../../components/messenger/attachments/AttachmentsBlock";
import {AttachmentApi} from "../../api/attachmentApi";
import React from "react";
import {Message} from "../../model/messenger/message";
import {AttachmentMapper} from "../../mapper/attachmentMapper";
import {TAttachmentFile} from "./attachmentsTypes";

export function fetchAttachmentsTF(message: Message,
                                   setComponentState: React.Dispatch<React.SetStateAction<IAttachmentsBlockState>>) {
    return (dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) => {
        AttachmentApi.getAttachments(message.id!)
            .then(dto => {
                const attachmentFiles: TAttachmentFile[] =
                    dto.files!.map(string => AttachmentMapper.toAttachmentFile(string, message.sender, message.nonce!));
                    setComponentState({
                        isPending: false,
                        files: attachmentFiles
                    })
            })
    }
}