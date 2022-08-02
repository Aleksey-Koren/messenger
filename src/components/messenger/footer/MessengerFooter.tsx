import {useDispatch} from "react-redux";
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
import {AttachmentsService, IAttachmentsState} from "../../../service/messenger/attachmentsService";


interface MessengerFooterProps {
    scroll: (force:boolean) => void;
    currentChat: string|undefined|null;
}

export interface IFormikValues {
    message: string,
    attachments: IAttachmentsState,
    currentChat: string | null | undefined
}

function MessengerFooter(props: MessengerFooterProps) {
    const dispatch = useDispatch();
    function send(text:string) {
        return dispatch(sendMessage(text, MessageType.whisper, () => props.scroll(false)));
    }

    const validationSchema = Yup.object().shape({
        message: Yup.string().required("Can't be empty"),
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
            //@ts-ignore
            send(values.message).then(e => {
                formik.setFieldValue('message', '', false);
            });
        },
    });

    const [attachmentsState, setAttachmentsState] = useState<IAttachmentsState>({attachments: null, fileNames: []})

    useEffect(() => {
        formik.setFieldValue('currentChat', props.currentChat, false);
    }, [props.currentChat])

    return (
        <div style={{display: "flex", height: 110, paddingBottom: 10, flexDirection: "row", alignItems: "center", borderTop: '1px solid#90caf9'}}>
            <div style={{display: "flex", flexDirection: "column", minHeight: '90%', marginRight: "10px"}}>
                <label style={{color: "white"}}>
                    <AttachFileIcon style={{color: "white"}}/>
                    <input type={"file"} style={{display: "none"}} accept="image/*" multiple
                    onChange={e => AttachmentsService.processUploading(e, attachmentsState, setAttachmentsState, formik)}
                    />
                </label>
            </div>
            {attachmentsState.fileNames.length !== 0 &&
            <div style={{display: "flex", flexDirection: "column", marginRight: "10px", color: "white", maxHeight: "110"}}>
                {attachmentsState.fileNames.map(filename => <span style={{fontSize: "10px"}}>{filename}</span>)}
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
                      formik.submitForm()
                  }}
            >
                <SendIcon/>
            </Fab>}
        </div>
    );
}

export default MessengerFooter;