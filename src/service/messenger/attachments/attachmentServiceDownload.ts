import {Message} from "../../../model/messenger/message";
import React from "react";
import {IAttachmentsBlockState} from "../../../components/messenger/attachments/AttachmentsBlock";
import {AttachmentApi} from "../../../api/attachmentApi";
import {TAttachmentFile} from "../../../redux/attachments/attachmentsTypes";
import {AttachmentMapper} from "../../../mapper/attachmentMapper";

export class AttachmentServiceDownload {

    static async fetchAttachments(message: Message,
                                  setComponentState: React.Dispatch<React.SetStateAction<IAttachmentsBlockState>>) {
        AttachmentApi.getAttachments(message.id!, message.attachmentsFilenames!)
            .then(async dto => {
                const attachmentFiles: TAttachmentFile[] = []
                await Promise.all(dto.map(arrayBuffer => AttachmentMapper.toAttachmentFile(arrayBuffer, message.sender, message.nonce!)
                    .then(result => {
                        console.log(result)
                        if (result) {
                            attachmentFiles.push(result)
                        }
                    }))
                );
                console.log("setComponentState")
                setComponentState({
                    isPending: false,
                    files: attachmentFiles
                })
            })
    }
}