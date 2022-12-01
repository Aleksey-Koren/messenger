import React from "react";
import {AppState} from "../../../index";
import {connect, ConnectedProps} from "react-redux";
import {TAttachmentFile} from "../../../model/messenger/file";
import {saveAs} from "file-saver";
import {Button} from "@mui/material";

interface IOwnProps {
    file: TAttachmentFile,
}

const Attachment: React.FC<TProps> = (props) => {

    const url = URL.createObjectURL(props.file.data!);

    const save = (file: TAttachmentFile) => {
        saveAs(new Blob([file.data!], {type: file.type!}), file.name!);
    }

    const style = {
        margin: "5px",
        objectFit: "cover",
        width: "100%",
    } as React.CSSProperties

    if (props.file.type!.match(/^image\//)) {
        return <>
            <img style={style}
                 src={url} alt={"Can not be displayed"}/>
        </>
    } else if (props.file.type!.match(/^video\//)) {
        return <>
            <video style={style} controls>
                <source src={url} type={"video/mp4"}/>
            </video>
        </>
    } else if (props.file.type!.match(/^audio\//)) {
        return <>
            <audio controls src={url} style={{margin: "5px"}}/>
        </>
    } else {
        return <Button onClick={() => save(props.file)}>Download '{props.file.name!}'</Button>
    }
}

const mapStateToProps = (state: AppState, ownProps: IOwnProps) => ({
    file: ownProps.file,
})

const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(Attachment);