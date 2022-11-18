import React from "react";
import {FieldHelperProps, FieldInputProps, FieldMetaProps, FormikErrors, FormikState, FormikTouched} from "formik";
import {IFormikValues} from "../../../components/messenger/footer/MessengerFooter";
import {FileService} from "../../fileService";
import Notification from "../../../Notification";

export interface IAttachmentValidation {
    isValid: boolean,
    description?: string
}

export interface IAttachmentsState {
    attachments: FileList | null,
    fileNames: string []
}

export class AttachmentsServiceUpload {

    static processUploading(e: React.ChangeEvent<HTMLInputElement>,
                            attachmentsState: IAttachmentsState,
                            setAttachmentsState: (value: (((prevState: IAttachmentsState) => IAttachmentsState) | IAttachmentsState)) => void,
                            formik: {
                                initialValues: IFormikValues; initialErrors: FormikErrors<unknown>; initialTouched: FormikTouched<unknown>; initialStatus: any; handleBlur: { (e: React.FocusEvent<any>): void; <T = any>(fieldOrEvent: T): T extends string ? ((e: any) => void) : void }; handleChange: { (e: React.ChangeEvent<any>): void; <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : ((e: (string | React.ChangeEvent<any>)) => void) }; handleReset: (e: any) => void; handleSubmit: (e?: (React.FormEvent<HTMLFormElement> | undefined)) => void; resetForm: (nextState?: (Partial<FormikState<IFormikValues>> | undefined)) => void; setErrors: (errors: FormikErrors<IFormikValues>) => void; setFormikState: (stateOrCb: (FormikState<IFormikValues> | ((state: FormikState<IFormikValues>) => FormikState<IFormikValues>))) => void; setFieldTouched: (field: string, touched?: boolean, shouldValidate?: (boolean | undefined)) => (Promise<FormikErrors<IFormikValues>> | Promise<void>); setFieldValue: (field: string, value: any, shouldValidate?: (boolean | undefined)) => (Promise<FormikErrors<IFormikValues>> | Promise<void>); setFieldError: (field: string, value: (string | undefined)) => void; setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void; setTouched: (touched: FormikTouched<IFormikValues>, shouldValidate?: (boolean | undefined)) => (Promise<FormikErrors<IFormikValues>> | Promise<void>); setValues: (values: React.SetStateAction<IFormikValues>, shouldValidate?: (boolean | undefined)) => (Promise<FormikErrors<IFormikValues>> | Promise<void>); submitForm: () => Promise<any>; validateForm: (values?: IFormikValues) => Promise<FormikErrors<IFormikValues>>; validateField: (name: string) => (Promise<void> | Promise<string | undefined>); isValid: boolean; dirty: boolean; unregisterField: (name: string) => void; registerField: (name: string, {validate}: any) => void; getFieldProps: (nameOrOptions: any) => FieldInputProps<any>; getFieldMeta: (name: string) => FieldMetaProps<any>; getFieldHelpers: (name: string) => FieldHelperProps<any>; validateOnBlur: boolean; validateOnChange: boolean; validateOnMount: boolean; values: IFormikValues; errors: FormikErrors<IFormikValues>; touched: FormikTouched<IFormikValues>; isSubmitting: boolean; isValidating: boolean; status?: any; submitCount: number
                            }) {
        const files = e.target.files;
        let attachments:IAttachmentsState = {attachments: null, fileNames: []};
        if (files) {
            const validation = validateAttachments(files);
            if (validation.isValid) {
                attachments = {attachments: files, fileNames: retrieveFilenames(files)}
            } else {
                Notification.add({message: validation.description, severity: "error"});
            }
        }
        setAttachmentsState(attachments);
        formik.values.attachments = attachments;
    }

    static prepareByteArrays(fileList: FileList) {
        const promises: Promise<Uint8Array>[] = []
        for (let i = 0; i < fileList.length; i++) {
            promises.push(FileService.readBytesAndMarkMimeType(fileList.item(i)!));
        }
        //@TODO WARN no catch clause
        return Promise.all(promises);
    }
}

function retrieveFilenames(files: FileList) {
    const filenames = []
    for (let i = 0; i < files.length; i++) {
        filenames.push(files.item(i)!.name);
    }
    return filenames;
}

function validateAttachments(files: FileList | null): IAttachmentValidation {
    if (!files) {
        return {
            isValid: true
        }
    }

    if (files.length > 6) {
        return {
            isValid: false,
            description: 'No more then 6 files could be uploaded at a time'
        }
    }

    let totalMemory = 0;
    for (let i = 0; i < files.length; i++) {
        totalMemory += files.item(i)!.size;
    }

    if (totalMemory > 10000000) {
        return {
            isValid: false,
            description: '10 MB limit exceeded'
        }
    }

    return {
        isValid: true
    }
}