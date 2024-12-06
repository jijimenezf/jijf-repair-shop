/**
 * A template re-renders every time
 */
type TemplateProps = {
    children: React.ReactNode,
}

export default async function Template({ children }: TemplateProps) {
    return (
        <div className="animate-appear">
        {children}
    </div>
    )
}
