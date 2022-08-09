import React from "react";
import {AppState} from "../../../index";
import {connect, ConnectedProps} from "react-redux";
import {TAttachmentFile} from "../../../redux/attachments/attachmentsTypes";

interface IOwnProps {
    file: TAttachmentFile
}

const Attachment: React.FC<TProps> = (props) => {

    return <>

    </>
}

const mapStateToProps = (state: AppState, ownProps: IOwnProps) => ({
    file: ownProps.file
})

const mapDispatchToProps = {

}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(Attachment);