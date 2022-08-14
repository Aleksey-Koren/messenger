import {IVoiceMessagesStateOpt, SET_AUDIO_RECORDER, SET_CHUNKS, SET_IS_RECORDING} from "./voiceMessagesTypes";
import {IPlainDataAction} from "../redux-types";
import {AppDispatch, AppState, store} from "../../index";
import {Message} from "../../model/messenger/message";
import {MessageType} from "../../model/messenger/messageType";
import {MessageApi} from "../../api/messageApi";
import {FileService} from "../../service/fileService";


export function setIsRecording(isRecording: boolean): IPlainDataAction<IVoiceMessagesStateOpt> {
    return {
        type: SET_IS_RECORDING,
        payload: {
            isRecording
        }
    }
}

export function setAudioRecorder(audioRecorder: MediaRecorder): IPlainDataAction<IVoiceMessagesStateOpt> {
    return {
        type: SET_AUDIO_RECORDER,
        payload: {
            audioRecorder
        }
    }
}

export function setChunks(chunks: ArrayBuffer[]): IPlainDataAction<IVoiceMessagesStateOpt> {
    return {
        type: SET_CHUNKS,
        payload : {
            chunks
        }
    }
}

export function addChunkTF(chunk: ArrayBuffer) {
    return (dispatch: AppDispatch, getState: () => AppState) => {
        const state = getState();
        const chunksSerialized = {...state.voiceMessages.chunks}
        chunksSerialized.push(chunk);
        dispatch(setChunks(chunksSerialized));
    }
}

export function prepareAudioRecorderTF() {
    return (dispatch: AppDispatch, getState: () => AppState) => {
        const state = getState();
        if(!state.voiceMessages.audioRecorder) {
            navigator.mediaDevices.getUserMedia({audio: true, video: false})
                .then(mediaStream => {
                    const recorder = new MediaRecorder(mediaStream);

                    recorder.onstart = () => {
                        document.getElementById("mic")!.style.color = "red";
                        dispatch(setIsRecording(true));
                    }

                    recorder.onstop = () => {
                        document.getElementById("mic")!.style.color = "white";
                        dispatch(setIsRecording(false));
                    }

                    recorder.ondataavailable = event => {
                        event.data.arrayBuffer()
                            .then(arrayBuffer => sendVoiceMessage(new Uint8Array(arrayBuffer)));
                    }

                    dispatch(setAudioRecorder(recorder));
                });
        }
    }
}

export function sendVoiceMessage(attachment: Uint8Array) {
    const state = store.getState();
    const currentChat = state.messenger.currentChat;
    const user = state.messenger.user;
    const globalUsers = state.messenger.globalUsers;
    const users = state.messenger.users;
    const messagesToSend: Message[] = []
    const attachArrays = [FileService.addByteMarker(attachment, 3)]

    for (let id in users) {
        const member = users[id];
        const message = {
            chat: currentChat!,
            data: '',
            attachments: attachArrays,
            type: MessageType.whisper,
            sender: user?.id!,
            receiver: member.id!
        } as Message;

        messagesToSend.push(message);
    }
    MessageApi.sendMessages(messagesToSend, globalUsers).then();
}