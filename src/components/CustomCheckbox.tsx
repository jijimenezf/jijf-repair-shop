"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

type CheckboxProps<TSchema> = {
    fieldTitle: string,
    nameInSchema: keyof TSchema & string,
    message: string,
};

export function CustomCheckbox<TSchema>({
    fieldTitle,
    nameInSchema,
    message
  }: CheckboxProps<TSchema>) {
    const checkBoxForm = useFormContext();

    return (
        <FormField
            control={checkBoxForm.control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem className="w-full flex items-center gap-2">
                    <FormLabel
                        htmlFor={nameInSchema}
                        className="text-base w-1/3 mt-2">
                            {fieldTitle}
                        </FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl>
                                <Checkbox
                                    id={nameInSchema}
                                    {...field}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                 />
                            </FormControl>
                            {message}
                        </div>
                        <FormMessage />
                </FormItem>
            )}
        ></FormField>
    );
  }
