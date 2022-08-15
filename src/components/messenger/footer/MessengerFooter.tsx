import {connect, ConnectedProps, useDispatch} from "react-redux";
import * as Yup from "yup";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField/TextField";
import Fab from "@mui/material/Fab/Fab";
import {useFormik} from "formik";
import style from "../Messenger.module.css";
import React, {useEffect, useState} from "react";
import {sendMessage} from "../../../redux/messenger/messengerActions";
import PerfectScrollbar from "react-perfect-scrollbar";
import {MessageType} from "../../../model/messenger/messageType";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import {AttachmentsServiceUpload, IAttachmentsState} from "../../../service/messenger/attachments/attachmentsServiceUpload";
import {VoiceMessagesService} from "../../../service/messenger/voiceMessagesService";
import {AppState} from "../../../index";
import {prepareAudioRecorderTF} from "../../../redux/voiceMessages/voiceMessagesActions";
import {MessageService} from "../../../service/messenger/messageService";
import VoiceMessage from "./VoiceMessage";


interface MessengerFooterProps {
    scroll: (force:boolean) => void;
    currentChat: string|undefined|null;
}

export interface IFormikValues {
    message: string,
    attachments: IAttachmentsState,
    currentChat: string | null | undefined
}

const MessengerFooter: React.FC<TProps> = (props) => {

    function send(text:string, attachments: FileList) {
        if(MessageService.isMessageNotEmpty(text, attachments)) {
            props.sendMessage(text, MessageType.whisper, () => props.scroll(false), attachments);
            formik.setFieldValue('message', '', false);
            formik.setFieldValue('attachments', {attachments: null, fileNames: []})
            setAttachmentsState({attachments: null, fileNames: []});
        }
    }

    const [attachmentsState, setAttachmentsState] = useState<IAttachmentsState>({attachments: null, fileNames: []});
    props.prepareAudioStreamTF();


    const validationSchema = Yup.object().shape({
        currentChat: Yup.string().required("No active chat selected")
    });

    const formik = useFormik<IFormikValues>({
        initialValues: {
            message: '',
            attachments: {attachments: null, fileNames: []},
            currentChat: props.currentChat
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            send(values.message, values.attachments.attachments!)
        },
    });

    useEffect(() => {
        formik.setFieldValue('currentChat', props.currentChat, false);
    }, [props.currentChat])

    return (
        <div style={{display: "flex", height: 110, paddingBottom: 10, flexDirection: "row", alignItems: "center", borderTop: '1px solid#90caf9'}}>
            <div style={{display: "flex", flexDirection: "column", minHeight: '90%', marginRight: "10px"}}>
                <label>
                    <AttachFileIcon style={{color: "white"}}/>
                    <input type={"file"} style={{display: "none"}} accept="image/*,video/*" multiple
                    onChange={e => AttachmentsServiceUpload.processUploading(e, attachmentsState, setAttachmentsState, formik)}
                    />
                </label>

                {props.audioRecorder !== null &&
                    <VoiceMessage audioRecorder={props.audioRecorder} isRecording={props.isRecording}/>
                }
            </div>
            {attachmentsState.fileNames.length !== 0 &&
            <div style={{display: "flex", flexDirection: "column", marginRight: "10px", color: "white", maxHeight: "110"}}>
                {attachmentsState.fileNames.map(filename => <span key={filename} style={{fontSize: "10px"}}>{filename}</span>)}
            </div>
            }
            <PerfectScrollbar style={{height: 110, flex: 1}}>
                <form
                    onSubmit={formik.submitForm}
                >
                    <TextField placeholder="Type your message"
                               fullWidth
                               minRows={4}
                               disabled={!props.currentChat}
                               name={'message'}
                               variant="standard"
                               multiline={true}
                               value={formik.values.message}
                               error={formik.touched.message && Boolean(formik.errors.message)}
                               onKeyUp={e => {
                                   if(e.ctrlKey && e.key === 'Enter') {
                                       formik.submitForm()
                                   }
                               }}
                               onChange={(event) => {
                                   formik.handleChange(event)
                                   //props.setMessageText(event.target.value)
                               }}
                     />

                </form>
            </PerfectScrollbar>

            {<Fab className={style.send_icon} size={"large"} disabled={!props.currentChat}
                  onClick={() => {
                      formik.submitForm().then();
                  }}
            >
                <SendIcon/>
            </Fab>}
        </div>
    );
}

const mapStateToProps = (state: AppState, ownProps: MessengerFooterProps) => ({
    scroll: ownProps.scroll,
    currentChat: ownProps.currentChat,
    audioRecorder: state.voiceMessages.audioRecorder,
    isRecording: state.voiceMessages.isRecording
})

const mapDispatchToProps = {
    sendMessage,
    prepareAudioStreamTF: prepareAudioRecorderTF
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>

export default connector(MessengerFooter);