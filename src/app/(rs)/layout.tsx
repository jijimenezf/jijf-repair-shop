/**
 * Layout re-renders when the application loads
 */
import Header from "@/components/Header";

type RSLayoutProps = {
    children: React.ReactNode,
}

export default async function RSLayout({ children }: RSLayoutProps) {
    return (
        <div className="mx-auto w-full max-w-7xl">
            <Header />
            <div className="px-4 py-4">
                {children}
            </div>
        </div>
    )
}
