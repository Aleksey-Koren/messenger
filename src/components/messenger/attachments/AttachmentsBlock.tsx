import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../../index";
import React, {useEffect, useState} from "react";
import {TAttachmentFile} from "../../../redux/attachments/attachmentsTypes";
import LoadingSpinner from "./LoadingSpinner";
import Attachment from "./Attachment";
import {Message} from "../../../model/messenger/message";
import {AttachmentServiceDownload} from "../../../service/messenger/AttachmentServiceDownload";
import {fetchAttachmentsTF} from "../../../redux/attachments/attachmentsActions";

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
    },[])

    // AttachmentServiceDownload.fetchAttachments(props.message, setState);
    // props.fetchAttachmentsTF(props.message, setState);

    return <>
        <div style={{display: "flex", flexDirection: "column"}}>
            {state.isPending &&
            <div style={{display: "flex", flexDirection: "column"}}>
                {props.message.attachmentsFilenames!.map(() => <LoadingSpinner/>)}
            </div>
            }
            {!state.isPending &&
            <div style={{display: "flex"}}>
                {state.files.map(file => <Attachment file={file}/>)}
            </div>
            }
        </div>
    </>
}

const mapStateTpProps = (state: AppState, ownProps: IOwnProps) => ({
    message: ownProps.message
})

const mapDispatchToProps = {
    fetchAttachmentsTF
}

const connector = connect(mapStateTpProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(AttachmentsBlock);