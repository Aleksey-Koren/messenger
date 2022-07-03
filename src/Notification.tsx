import React from 'react'
import {Alert, IconButton, Snackbar, SnackbarCloseReason} from "@mui/material";
import {AlertColor} from "@mui/material/Alert/Alert";
import CloseIcon from '@mui/icons-material/Close';
import {setIn} from "formik";

interface NotificationProps {

}
interface Message {
    severity?:AlertColor,
    message:any,
    error?: any,
    id:number,
    createdAt:number
}
interface NotificationState {
    messages: Message[]
}

export default class Notification extends React.Component<NotificationProps, NotificationState> {

    static instance:Notification;
    counter: number;
    interval?: NodeJS.Timer;

    constructor(props:NotificationProps) {
        super(props);
        this.state = {
            messages: []
        }
        this.counter = 0;
        if(Notification.instance) {
            throw new Error("Notification already instantiated");
        }
        Notification.instance = this;
    }

    static add(message: {message:any, severity?:AlertColor, error?:any}) {
        const result = {
            id: Notification.instance.counter++,
            message: message.message,
            severity: message.severity,
            error: message.error ? message.error.toString() : undefined,
            createdAt: new Date().getTime()
        };
        Notification.instance.setState({
            messages: [...Notification.instance.state.messages, result]
        });
    }

    remove(message:Message) {
        const messages = [...this.state.messages];
        let length = messages.length;
        while(length) {
            length--;
            if(messages[length] === message) {
                messages.splice(length, 1);
            }
        }
        this.setState({messages});
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            const now = new Date().getTime();
            let length = this.state.messages.length;
            while(length) {
                length--;
                const message = this.state.messages[length];
                if(now > message.createdAt + 600000) {
                    this.remove(message);
                }
            }
        }, 500)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return <div style={{position: 'fixed', left: 20, bottom: 60, zIndex: 500}}>{this.state.messages.map(message => (
            <Alert key={message.id} severity={message.severity || "info"} sx={{ width: '100%' }}>
                {message.message}
                {message.error ? message.error.toString() : null}
                <IconButton size={"small"} onClick={() => this.remove(message)}>
                    <CloseIcon />
                </IconButton>
            </Alert>)
        )}</div>
    }
}