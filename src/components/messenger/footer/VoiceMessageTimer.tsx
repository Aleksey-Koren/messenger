import {Timer} from "@mui/icons-material";
import React from "react";
import TimerString from "./TimerString";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../../../index";
import {VoiceMessagesService} from "../../../service/messenger/voiceMessagesService";
import Notification from "../../../Notification";

const VoiceMessageTimer: React.FC<TProps> = (props) => {

    const maxDuration = 30; //todo value should be taken from properties;
    if (props.duration > maxDuration) {
        VoiceMessagesService.stopRecording(props.recorder);
        Notification.add({
            //@TODO WARN message looks not serious :-(
            message: `Max voice message duration is ${maxDuration} seconds :-(   But you can send several one by one :-)`,
            severity: "info"
        });
    }

    return <>
        {props.duration % 2 === 0
            ? <Timer style={{color: "white"}}/>
            : <Timer style={{color: "red"}}/>
        }
        <TimerString duration={props.duration}/>
    </>
}

const mapStateToProps = (state: AppState) => ({
    recorder: state.voiceMessages.audioRecorder!,
    isRecording: state.voiceMessages.isRecording,
    duration: state.voiceMessages.duration!
})

const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(VoiceMessageTimer);