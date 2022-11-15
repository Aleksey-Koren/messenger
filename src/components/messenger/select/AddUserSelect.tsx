import React, {useState} from "react";
// import {AppState} from "../../../index";
import AsyncSelect from "react-select/async";
import {connect, ConnectedProps} from "react-redux";
// import {User} from "../../../model/User";
// import {findUsersPerPage} from "../../../service/userService";

const AddUserSelect: React.FC<TProps> = (props: TProps) => {

    const [isSearchable, setIsSearchable] = useState<boolean>(true)

    return (
        //@TODO WARN check theme colors
        <AsyncSelect styles={{
            control: (base, state) => ({...base, borderRadius: '20px', backgroundColor: "grey"}),
            input: (base, state) => ({...base, color: "white"}),
            menu: (base, state) => ({...base, backgroundColor: "grey", color: "white", borderRadius: '20px'}),
            option: (base, state) => ({...base, color: state.isFocused ? "black" : "white", borderRadius: '20px'}),
            placeholder: (base, state) => ({...base, color: "white"})
        }}
            // loadOptions={promiseOptions(props.selectedRoom.id)}
                     isMulti
                     getOptionLabel={s => "label"}
                     getOptionValue={s => JSON.stringify(s)}
                     maxMenuHeight={300}
                     onChange={() => {
                     }}
                     placeholder={'Search...'}
                     noOptionsMessage={({inputValue}) => inputValue ? "No results found" : ""}
                     isSearchable={isSearchable}
        />
    );
}

function promiseOptions(roomId: number) {
    return new Promise(resolve => null);
    // return (inputValue: string): Promise<User[]> => {
    //     return findUsersPerPage(0, 20, {title: inputValue, notInRoom: roomId}).then(s => s.data.content)
    // }
}

// interface OwnProps {
//     setSelectedUsers:  Dispatch<SetStateAction<User[]>>;
//     selectedUsers: User[];
//     isDisabled: boolean;
// }

const mapStateToProps = () => ({
    // selectedRoom: state.messenger.selectedRoom,
    // selectedUsers: ownProps.selectedUsers,
    // setSelectedUsers: ownProps.setSelectedUsers,
    // isDisabled: ownProps.isDisabled,
})

const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(AddUserSelect);