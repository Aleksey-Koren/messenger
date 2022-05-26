import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import style from "../../../global-styles/ModalWindow.module.css";

interface IProps {
    title: string
}

function TitleAlreadyExistsModal(props: IProps) {

    return (
            <div>
                <Dialog
                    open={false}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle className={style.dialog__title}>
                        {`Room with title "${props.title}" already exists`}
                    </DialogTitle>
                    <DialogActions className={style.dialog__actions}>
                        <Button onClick={() => {}}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
    );
}

export default TitleAlreadyExistsModal;