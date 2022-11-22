import React from "react";
import {AppState} from "../../../index";
import {connect, ConnectedProps} from "react-redux";
import {FileType, TAttachmentFile} from "../../../model/messenger/file";
import {Button} from "@mui/material";
import {saveAs} from "file-saver";

interface IOwnProps {
    file: TAttachmentFile
}

const Attachment: React.FC<TProps> = (props) => {

    const url = URL.createObjectURL(props.file.data!);
    const name = URL.createObjectURL(props.file.data!).split('/').pop()


    const save = () => {
        saveAs(props.file.data!);
    }

    const style = {
        margin: "5px",
        objectFit: "cover",
        width: "100%",
    } as React.CSSProperties

    if (props.file.fileType === FileType.IMAGE) {
        return <>
            <img style={style}
                 src={url} alt={"Can not be displayed"}/>
            <Button onClick={() => save()}>Download {name}</Button>
        </>
    } else if (props.file.fileType === FileType.VIDEO) {
        return <>
            <video style={style} controls>
                <source src={url} type={"video/mp4"}/>
            </video>
        </>
    } else if (props.file.fileType === FileType.AUDIO) {
        return <>
            <audio controls src={url} style={{margin: "5px"}}/>
        </>
    } else {
        //todo we need to implement more convenient component. But not simple <span>
        //@TODO WARN yes. Make it "downloadable"
        return <Button onClick={() => save()}>Download {name}</Button>
    }
}

const mapStateToProps = (state: AppState, ownProps: IOwnProps) => ({
    file: ownProps.file
})

const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(Attachment);