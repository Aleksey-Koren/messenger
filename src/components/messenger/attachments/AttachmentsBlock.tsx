import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../../index";
import React from "react";

interface IOwnProps {
    messageId: string
}

const AttachmentsBlock: React.FC<TProps> =  (props) => {



    return <></>
}

const mapStateTpProps = (state: AppState, ownProps: IOwnProps) =>  ({
    messageId: ownProps.messageId
})

const mapDispatchToProps = {

}

const connector = connect(mapStateTpProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(AttachmentsBlock);