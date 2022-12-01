import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../../index";
import React, {useEffect, useState} from "react";
import Attachment from "./Attachment";
import {Message} from "../../../model/messenger/message";
import {AttachmentServiceDownload} from "../../../service/messenger/attachments/attachmentServiceDownload";
import {TAttachmentFile} from "../../../model/messenger/file";
import {CircularProgress} from "@mui/material";

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
                    {props.message.attachmentsFilenames!.map((name, index) => <CircularProgress key={index}/>)}
                </div>
            }
            {!state.isPending &&
                <div style={{display: "flex", flexDirection: "column"}}>
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