import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type CustomMenuProps = {
    icon: LucideIcon,
    label: string,
    options: {
        title: string,
        href: string,
    }[],
};

export function CustomMenu({
    icon: Icon, label, options,
}: CustomMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                    <Icon className="h-1[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">{label}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {options.map(option => (
                    <DropdownMenuItem key={option.title} asChild>
                        <Link href={option.href}>{option.title}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
