import { UserButton, SignedIn, SignedOut } from "@clerk/react-router";
import { Link } from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>
            <div className="flex items-center gap-4">
                <Link to="/upload" className="primary-button w-fit">
                    Upload Resume
                </Link>
                <SignedIn>
                    <UserButton afterSignOutUrl="/auth" />
                </SignedIn>
                <SignedOut>
                    <Link to="/auth" className="text-sm font-semibold text-gray-700 hover:text-gray-900">
                        Sign In
                    </Link>
                </SignedOut>
            </div>
        </nav>
    )
}

export default Navbar
