import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
// import {useAppDispatch, useAppSelector} from "../../../index";
// import {setIsTitleAlreadyExistsModalOpened} from "../../../redux/messenger/messengerActions";
import style from "../../../global-styles/ModalWindow.module.css";

interface IProps {
    title: string
}
//@TODO WARN unused component. Rooms with non-unique title are allowed
function TitleAlreadyExistsModal(props: IProps) {

    // const isOpened = useAppSelector(state => state.messenger.isTitleAlreadyExistsModalOpened);
    // const dispatch = useAppDispatch();

    // function handleClose() {
    //     dispatch(setIsTitleAlreadyExistsModalOpened(false));
    // }

    return (
        <div>
            <Dialog
                open={false}
                onClose={() => {
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle className={style.dialog__title}>
                    {`Room with title "${props.title}" already exists`}
                </DialogTitle>
                <DialogActions className={style.dialog__actions}>
                    <Button onClick={() => {
                    }}>Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TitleAlreadyExistsModal;