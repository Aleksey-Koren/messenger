import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../../index";
import React, {useEffect, useState} from "react";
import {TAttachmentFile} from "../../../redux/attachments/attachmentsTypes";
import LoadingSpinner from "./LoadingSpinner";
import Attachment from "./Attachment";
import {Message} from "../../../model/messenger/message";
import {AttachmentServiceDownload} from "../../../service/messenger/attachments/attachmentServiceDownload";

interface IOwnProps {
    message: Message
}

export interface IAttachmentsBlockState {
    isPending: boolean;
    files: TAttachmentFile[]
}

const AttachmentsBlock: React.FC<TProps> = (props) => {

    const [state, setState] = useState<IAttachmentsBlockState>({isPending: true, files: []});

    useEffect(() => {
        AttachmentServiceDownload.fetchAttachments(props.message, setState);
    }, [])

    return <>
        <div style={{display: "flex", flexDirection: "column"}}>
            {state.isPending &&
                <div style={{display: "flex", flexDirection: "column"}}>
                    {props.message.attachmentsFilenames!.map(() => <LoadingSpinner key={props.message.id}/>)}
                </div>
            }
            {!state.isPending &&
                <div style={{display: "flex"}}>
                    {state.files.map((file, index) => <Attachment file={file} key={index}/>)}
                </div>
            }
        </div>
    </>
}

const mapStateTpProps = (state: AppState, ownProps: IOwnProps) => ({
    message: ownProps.message
})

const connector = connect(mapStateTpProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(AttachmentsBlock);