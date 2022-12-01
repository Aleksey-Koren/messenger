import {Message} from "../../../model/messenger/message";
import React from "react";
import {IAttachmentsBlockState} from "../../../components/messenger/attachments/AttachmentsBlock";
import {AttachmentApi} from "../../../api/attachmentApi";
import {AttachmentMapper} from "../../../mapper/attachmentMapper";
import {TAttachmentFile} from "../../../model/messenger/file";
import Notification from "../../../Notification";
import {FileApi} from "../../../api/fileApi";

export class AttachmentServiceDownload {

    static fetchAttachments(message: Message, setComponentState: React.Dispatch<React.SetStateAction<IAttachmentsBlockState>>) {
        FileApi.getFiles(message.id!, message.attachmentsFilenames!)
            .then(files => {
                AttachmentApi.getAttachments(message.id!, message.attachmentsFilenames!)
                    .then(attachments => {
                        const attachmentFiles: TAttachmentFile[] =
                            attachments.map((arrayBuffer, index) =>
                                AttachmentMapper.toAttachmentFile(arrayBuffer, files[index], message.sender, message.nonce!));

                        setComponentState({
                            isPending: false,
                            files: attachmentFiles
                        })
                    })
                    .catch(e => {
                        Notification.add({message: 'Something went wrong. ', severity: 'error', error: e})
                    })
            })
    }
}