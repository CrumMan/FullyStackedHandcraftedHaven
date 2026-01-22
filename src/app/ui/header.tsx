import { Navigation } from "./nav"
interface HeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

}

export function Header({ className, ...rest }: HeaderProps) {
    return (
        <>
        <div className="border">
        <h1>HandCrafted Haven</h1>
        <Navigation />
        </div>
        </>
    );
}