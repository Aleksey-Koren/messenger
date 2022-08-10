import React from "react";
import {AppState} from "../../../index";
import {connect, ConnectedProps} from "react-redux";
import {MimeType, TAttachmentFile} from "../../../redux/attachments/attachmentsTypes";

interface IOwnProps {
    file: TAttachmentFile
}

const Attachment: React.FC<TProps> = (props) => {

    const url = URL.createObjectURL(props.file.data!);
    console.log("URL: " + url);

    if (props.file.mimeType === MimeType.IMAGE) {
        return <>
            <img style={{margin: "5px"}}
                 src={url} height={200} width={200} alt={"Can not be displayed"}/>
        </>
    } else if (props.file.mimeType === MimeType.VIDEO) {
        return <>
            <video height={"300"} width={"300"} controls style={{margin: "5px"}}>
                <source src={url} type={"video/mp4"}/>
                </video>
        </>
    } else {
        return <></>
    }
    

}

const mapStateToProps = (state: AppState, ownProps: IOwnProps) => ({
    file: ownProps.file
})

const mapDispatchToProps = {

}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(Attachment);