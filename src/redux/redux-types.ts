import {AxiosResponse} from "axios";

/** ACTIONS POSTFIX */
export const PENDING_POSTFIX = '_PENDING'
export const FULFILLED_POSTFIX = '_FULFILLED'
export const REJECTED_POSTFIX = '_REJECTED'


/** DEFAULT STATE */
export interface IPaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
}

export interface IDefaultStateField {
    isLoading: boolean;
    isError: boolean;
}

/** REDUX-PROMISE TYPES */
export interface IFulfilledAction<T> {
    type: String,
    payload: AxiosResponse<T>
}

export interface IPendingAction<T> {
    type: String,
    payload: Promise<AxiosResponse<T>>
}

export interface IRejectedAction {
    type: String,
    payload: null
}

export interface IPlainDataAction<T> {
    type: String,
    payload: T
}

export type IReduxPromiseAction<T> = IPendingAction<T> | IFulfilledAction<T> | IRejectedAction;

export type ActionType<T> = IReduxPromiseAction<T> | IPlainDataAction<T>;