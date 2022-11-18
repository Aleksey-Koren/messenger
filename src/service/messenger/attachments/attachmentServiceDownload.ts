import {Message} from "../../../model/messenger/message";
import React from "react";
import {IAttachmentsBlockState} from "../../../components/messenger/attachments/AttachmentsBlock";
import {AttachmentApi} from "../../../api/attachmentApi";
import {TAttachmentFile} from "../../../redux/attachments/attachmentsTypes";
import {AttachmentMapper} from "../../../mapper/attachmentMapper";

export class AttachmentServiceDownload {

    static fetchAttachments(message: Message,
                            setComponentState: React.Dispatch<React.SetStateAction<IAttachmentsBlockState>>) {

        //@TODO WARN no catch clause
        AttachmentApi.getAttachments(message.id!, message.attachmentsFilenames!)
            .then(dto => {
                const attachmentFiles: TAttachmentFile[] =
                    dto.map(arrayBuffer =>
                        AttachmentMapper.toAttachmentFile(arrayBuffer, message.sender, message.nonce!));

                setComponentState({
                    isPending: false,
                    files: attachmentFiles
                })
            })
    }
}