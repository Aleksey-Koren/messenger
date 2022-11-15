import React from "react";
import {AppState} from "../../../index";
import {connect, ConnectedProps} from "react-redux";
import {MimeType, TAttachmentFile} from "../../../redux/attachments/attachmentsTypes";

interface IOwnProps {
    file: TAttachmentFile
}

const Attachment: React.FC<TProps> = (props) => {

    const url = URL.createObjectURL(props.file.data!);

    if (props.file.mimeType === MimeType.IMAGE) {
        return <>
            <img style={{margin: "5px"}}
                 //@TODO WARN why image 200x200 and video is 300x300?
                 //also it should not scale images, like 1y and 2x.
                 //check next url: https://stackoverflow.com/questions/11757537/css-image-size-how-to-fill-but-not-stretch
                 src={url} height={200} width={200} alt={"Can not be displayed"}/>
        </>
    } else if (props.file.mimeType === MimeType.VIDEO) {
        return <>
            <video height={"300"} width={"300"} controls style={{margin: "5px"}}>
                {/*@TODO WARN is it work for WEBM?*/}
                <source src={url} type={"video/mp4"}/>
            </video>
        </>
    } else if (props.file.mimeType === MimeType.AUDIO) {
        return <>
            <audio controls src={url} style={{margin: "5px"}}/>
        </>
    } else {
        //todo we need to implement more convenient component. But not simple <span>
        //@TODO WARN yes. Make it "downloadable"
        return <span>Undefined attachment type</span>
    }
}

const mapStateToProps = (state: AppState, ownProps: IOwnProps) => ({
    file: ownProps.file
})

const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(Attachment);