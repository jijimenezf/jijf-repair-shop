"use client"

import { useState, useEffect, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

type Props = {
    value: string | number,
    onChange: (value : string | number) => void,
    debounce?: number,
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

export function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props} : Props) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => {
            clearTimeout(timer);
        };
    }, [value, debounce]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return <Input value={value} onChange={(e) => setValue(e.target.value)} {...props} />;
};
