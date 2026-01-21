interface HeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

}

export function Header({ className, ...rest }: HeaderProps) {
    return (
        <p>Header</p>
    );
}