import * as React from "react";
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Label } from "./label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

interface FormItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function FormItem({ children, style }: FormItemProps) {
  const id = React.useId();

  const formItemStyle: ViewStyle = {
    gap: 8,
  };

  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={[formItemStyle, style]}>
        {children}
      </View>
    </FormItemContext.Provider>
  );
}

interface FormLabelProps {
  children: React.ReactNode;
}

function FormLabel({ children }: FormLabelProps) {
  const { error } = useFormField();

  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    color: error ? '#dc2626' : '#374151',
  };

  return (
    <Label style={labelStyle}>
      {children}
    </Label>
  );
}

interface FormControlProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function FormControl({ children, style }: FormControlProps) {
  return (
    <View style={style}>
      {children}
    </View>
  );
}

interface FormDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

function FormDescription({ children, style }: FormDescriptionProps) {
  const descriptionStyle: TextStyle = {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  };

  return (
    <Text style={[descriptionStyle, style]}>
      {children}
    </Text>
  );
}

interface FormMessageProps {
  children?: React.ReactNode;
  style?: TextStyle;
}

function FormMessage({ children, style }: FormMessageProps) {
  const { error } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) {
    return null;
  }

  const messageStyle: TextStyle = {
    fontSize: 13,
    color: '#dc2626',
    lineHeight: 18,
  };

  return (
    <Text style={[messageStyle, style]}>
      {body}
    </Text>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
