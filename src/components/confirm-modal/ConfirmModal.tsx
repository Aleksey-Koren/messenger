import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import ReportIcon from '@mui/icons-material/Report';
import style from './ConfirmModal.module.css';

interface IOwnProps {
    confirmFunction: () => void,
    text: string,
    closeFunction: () => void
}
//@TODO INFO make sense to accept additional optional properties, such as TEXT, YES_BUTTON and NO_BUTTON
const ConfirmModal: React.FC<Props> = (props) => {

    return (
        <Dialog open={true}>
            <DialogTitle className={style.dialog__title}>
                <ReportIcon fontSize={'medium'} className={style.dialog__title_icon}/>
                {/*@TODO WARN check GLobalUserConfigurationModal, it pass
                Are you sure to ...
                As result user will see 'Are you sure' two times. Better replace it with something like
                "Please confirm following action"*/}
                Are you sure?
            </DialogTitle>

            <DialogContent className={style.dialog__content}>
                <span className={style.dialog__content_text}>{props.text}</span>
            </DialogContent>

            <DialogActions className={style.dialog__actions}>
                <Button onClick={() => props.closeFunction()} className={style.dialog__disagree_button}>
                    No
                </Button>
                <Button className={style.dialog__agree_button} onClick={() => {
                    {/*@TODO WARN sometimes 'closeFunction' may perform 'no-operation' which will
                    make conflict with 'confirmFunction'*/}
                    props.confirmFunction();
                    {/*@TODO ERROR press esc button, and check did it call for closeFunction.
                     Add property onClose to <Dialog> component */}
                    props.closeFunction();
                }}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: any, ownProps: IOwnProps) => ({
    confirmFunction: ownProps.confirmFunction,
    text: ownProps.text,
    closeFunction: ownProps.closeFunction
})

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(ConfirmModal);

