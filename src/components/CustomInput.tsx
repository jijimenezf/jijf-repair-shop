"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";

type InputProps<TSchema> = {
  fieldTitle: string;
  nameInSchema: keyof TSchema & string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function CustomInput<TSchema>({
  fieldTitle,
  nameInSchema,
  className,
  ...props
}: InputProps<TSchema>) {
  const inputForm = useFormContext();

  return (
    <FormField
      control={inputForm.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={nameInSchema} className="text-base">
            {fieldTitle}
          </FormLabel>
          <FormControl>
            <Input
              id={nameInSchema}
              className={`w-full max-w-xs disabled:text-blue-500 dark:disabled:text-gray-400 disabled:opacity-75 ${className}`}
              {...props}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
}
