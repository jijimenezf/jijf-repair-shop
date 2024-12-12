"use client"

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type SelectProps<TSchema> = {
    fieldTitle: string,
    nameInSchema: keyof TSchema & string,
    className?: string,
    options: {
        id: string,
        description: string,
    }[],
  }

  export function CustomSelect<TSchema>({
    fieldTitle,
    nameInSchema,
    className,
    options
  }: SelectProps<TSchema>) {
    const selectForm = useFormContext();

    return (
        <FormField
            control={selectForm.control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        htmlFor={nameInSchema}
                        className="text-base"
                    >{fieldTitle}</FormLabel>
                    <Select
                        {...field}
                        onValueChange={field.onChange}
                    >
                        <FormControl>
                            <SelectTrigger
                                id={nameInSchema}
                                className={`w-full max-w-xs ${className}`}
                            >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map(option => (
                                <SelectItem
                                    key={`${nameInSchema}_${option.id}`}
                                    value={option.id}
                                >{option.description}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        ></FormField>
    );
  }
