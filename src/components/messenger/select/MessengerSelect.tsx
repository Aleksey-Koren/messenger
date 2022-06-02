import AsyncSelect from "react-select/async";
// import {MessageService} from "../../../service/messenger/MessageService";
import React, {useState} from "react";
// import {ChatSearchOption, ChatSearchOptionType} from "../../../model/messenger/chatSearchOptiom/ChatSearchOption";
// import {Room} from "../../../model/messenger/room/Room";
// import {AppState, useAppDispatch} from "../../../index";
import {connect, ConnectedProps} from "react-redux";
// import {openRoomTF, setRoomsToState} from "../../../redux/messenger/messengerActions";


const MessengerSelect: React.FC<TProps> = (props) => {

    // const [selectValue, setSelectValue] = useState<ChatSearchOption>(null);
    // const dispatch = useAppDispatch();

    // const onChange = (option: ChatSearchOption) => {
    //     if (option.type === ChatSearchOptionType.ROOM) {
    //         dispatch(openRoomTF(option.payload as Room));
    //         setSelectValue(null);
    //     } else {
    //
    //         MessageService.createPrivateRoomWith(option.payload.id)
    //             .then(createdRoom => {
    //                 dispatch(setRoomsToState([...props.rooms, createdRoom.data]));
    //                 dispatch(openRoomTF(createdRoom.data))
    //             });
    //         setSelectValue(null);
    //     }
    // }

    return (
        <AsyncSelect styles={{
            control: (base, state) => ({...base, backgroundColor: "grey", height: "50px"}),
            input: (base, state) => ({...base, color: "white"}),
            menu: (base, state) => ({...base, backgroundColor: "grey", color: "white", borderRadius: '20px'}),
            option: (base, state) => ({...base, color: state.isFocused ? "black" : "white", borderRadius: '20px'}),
            placeholder: (base, state) => ({...base, color: "white"})
        }}
                     // loadOptions={MessageService.promiseOptions}
                     getOptionLabel={s => "label"}
                     getOptionValue={s => JSON.stringify(s)}
                     maxMenuHeight={500}
                     onChange={() => {}}
                     // value={selectValue}
                     placeholder={'Search...'}
                     noOptionsMessage={({inputValue}) => inputValue ? "No results found" : ""}
        />
    );
}


const mapStateToProps = () => ({
    // rooms: state.messenger.rooms,
    // roomMembers: state.messenger.roomMembers,
    // selectedRoom: state.messenger.selectedRoom
})

const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(MessengerSelect);