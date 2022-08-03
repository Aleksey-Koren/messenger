import React from "react";
import {FieldHelperProps, FieldInputProps, FieldMetaProps, FormikErrors, FormikState, FormikTouched} from "formik";
import {IFormikValues} from "../../components/messenger/footer/MessengerFooter";
import {FileService} from "../fileService";

export interface IAttachmentValidation {
    isValid: boolean,
    description?: string
}

export interface IAttachmentsState {
    attachments: FileList | null,
    fileNames: string []
}

export class AttachmentsService {

    static validateAttachments(files: FileList | null): IAttachmentValidation {
        if(!files) {
            return {
                isValid: true
            }
        }

        if(files.length > 6) {
            return {
                isValid: false,
                description: 'You can upload not more than 10 files'
            }
        }

        let totalMemory = 0;
        for(let i = 0; i < files.length; i++) {
            totalMemory += files.item(i)!.size;
        }

        if(totalMemory > 10000000) {
            return {
                isValid: false,
                description: 'You can upload not more than 10 MB of attachments'
            }
        }

        return {
            isValid: true
        }
    }

    static retrieveFilenames(files: FileList) {
        const filenames = []
        for(let i = 0; i < files.length; i++) {
            filenames.push(files.item(i)!.name);
        }
        return filenames;
    }

    static processUploading(e: React.ChangeEvent<HTMLInputElement>,
                            attachmentsState: IAttachmentsState,
                            setAttachmentsState: (value: (((prevState: IAttachmentsState) => IAttachmentsState) | IAttachmentsState)) => void,
                            formik: { initialValues: IFormikValues; initialErrors: FormikErrors<unknown>; initialTouched: FormikTouched<unknown>; initialStatus: any; handleBlur: { (e: React.FocusEvent<any>): void; <T = any>(fieldOrEvent: T): T extends string ? ((e: any) => void) : void }; handleChange: { (e: React.ChangeEvent<any>): void; <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : ((e: (string | React.ChangeEvent<any>)) => void) }; handleReset: (e: any) => void; handleSubmit: (e?: (React.FormEvent<HTMLFormElement> | undefined)) => void; resetForm: (nextState?: (Partial<FormikState<IFormikValues>> | undefined)) => void; setErrors: (errors: FormikErrors<IFormikValues>) => void; setFormikState: (stateOrCb: (FormikState<IFormikValues> | ((state: FormikState<IFormikValues>) => FormikState<IFormikValues>))) => void; setFieldTouched: (field: string, touched?: boolean, shouldValidate?: (boolean | undefined)) => (Promise<FormikErrors<IFormikValues>> | Promise<void>); setFieldValue: (field: string, value: any, shouldValidate?: (boolean | undefined)) => (Promise<FormikErrors<IFormikValues>> | Promise<void>); setFieldError: (field: string, value: (string | undefined)) => void; setStatus: (status: any) => void; setSubmitting: (isSubmitting: boolean) => void; setTouched: (touched: FormikTouched<IFormikValues>, shouldValidate?: (boolean | undefined)) => (Promise<FormikErrors<IFormikValues>> | Promise<void>); setValues: (values: React.SetStateAction<IFormikValues>, shouldValidate?: (boolean | undefined)) => (Promise<FormikErrors<IFormikValues>> | Promise<void>); submitForm: () => Promise<any>; validateForm: (values?: IFormikValues) => Promise<FormikErrors<IFormikValues>>; validateField: (name: string) => (Promise<void> | Promise<string | undefined>); isValid: boolean; dirty: boolean; unregisterField: (name: string) => void; registerField: (name: string, {validate}: any) => void; getFieldProps: (nameOrOptions: any) => FieldInputProps<any>; getFieldMeta: (name: string) => FieldMetaProps<any>; getFieldHelpers: (name: string) => FieldHelperProps<any>; validateOnBlur: boolean; validateOnChange: boolean; validateOnMount: boolean; values: IFormikValues; errors: FormikErrors<IFormikValues>; touched: FormikTouched<IFormikValues>; isSubmitting: boolean; isValidating: boolean; status?: any; submitCount: number })
    {
        const files = e.target.files;
        let attachments;
        if (files) {
            const validation = AttachmentsService.validateAttachments(files);
            if(validation.isValid) {
                console.log('setAttachments: ');
                attachments = {attachments: files, fileNames: AttachmentsService.retrieveFilenames(files)}
            } else {
                // toDo modal window with error description needed
                console.log('Validation error: ' + validation.description);
                attachments = {attachments: null, fileNames: []}
            }
        } else {
            attachments = {attachments: null, fileNames: []}
        }
        setAttachmentsState(attachments);
        formik.values.attachments = attachments;
    }

    static prepareByteArrays(fileList: FileList) {
        const promises: Promise<Uint8Array>[] = []
        for (let i = 0; i < fileList.length; i++ ) {
            promises.push(FileService.readBytesAndMarkMimeType(fileList.item(i)!));
        }
        return Promise.all(promises);
    }
}

function areReady(readers: FileReader[]): boolean {
    return readers.every(s => s.readyState === 2);
}