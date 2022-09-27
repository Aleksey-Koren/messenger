import {
    IVoiceMessagesState,
    SET_AUDIO_RECORDER,
    SET_DURATION,
    SET_IS_RECORDING,
    TVoiceMessengerAction
} from "./voiceMessagesTypes";

const initialState: IVoiceMessagesState = {
    isRecording: false,
    audioRecorder: null,
    chunks: [],
    timerId: null,
    start: null,
    duration: null,
}

export function voiceMessagesReducer(state: IVoiceMessagesState = initialState, action: TVoiceMessengerAction): IVoiceMessagesState {

    switch (action.type) {

        case SET_IS_RECORDING:
            return {...state, isRecording: action.payload.isRecording};

        case SET_AUDIO_RECORDER:
            return {...state, audioRecorder: action.payload.audioRecorder}

        case SET_DURATION:
            return {...state, duration: action.payload.duration}

        default:
            return state;
    }
}