interface FooterProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

}

export function Footer({ className, ...rest }: FooterProps) {
    return (
        <p>Footer</p>
    );
}