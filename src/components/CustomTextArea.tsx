"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { TextareaHTMLAttributes } from "react";

type TextAreaProps<TSchema> = {
  fieldTitle: string,
  nameInSchema: keyof TSchema & string,
  className?: string,
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function CustomTextArea<TSchema>({
  fieldTitle,
  nameInSchema,
  className,
  ...props
}: TextAreaProps<TSchema>) {
  const textAreaForm = useFormContext();

  return (
    <FormField
      control={textAreaForm.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={nameInSchema} className="text-base mb-2">
            {fieldTitle}
          </FormLabel>
          <FormControl>
            <Textarea
              id={nameInSchema}
              className={className}
              {...props}
              {...field}
            ></Textarea>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
}
