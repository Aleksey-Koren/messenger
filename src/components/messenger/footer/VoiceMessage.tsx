import {AppState} from "../../../index";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import MicIcon from "@mui/icons-material/Mic";
import {VoiceMessagesService} from "../../../service/messenger/voiceMessagesService";
import VoiceMessageTimer from "./VoiceMessageTimer";



interface IOwnProps {
    audioRecorder: MediaRecorder,
    isRecording: boolean
}

const VoiceMessage: React.FC<TProps> = (props) => {
    return <>
        <MicIcon id={"mic"} style={{color: "white"}}
                 onMouseDown={() => VoiceMessagesService.startRecording(props.audioRecorder!)}
                 onMouseUp={() => VoiceMessagesService.stopRecording(props.audioRecorder!)}
                 onMouseLeave={() => VoiceMessagesService.stopRecording(props.audioRecorder!)}
        />
        {props.isRecording && <VoiceMessageTimer/>}
    </>
}

const mapStateToProps = (state: AppState, ownProps: IOwnProps) => {
    return {
        audioRecorder: ownProps.audioRecorder,
        isRecording: ownProps.isRecording
    }
}

const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(VoiceMessage);
