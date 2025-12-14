import { SignIn, SignedIn, SignedOut } from "@clerk/react-router";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

export const meta = () => ([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const RedirectEffect = ({ next, navigate }: { next: string; navigate: (path: string) => Promise<void> | void }) => {
    useEffect(() => {
        void navigate(next);
    }, [next, navigate]);
    return null;
};

const Auth = () => {
    const location = useLocation();
    const next = location.search.split('next=')[1] || '/';
    const navigate = useNavigate();

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <SignedOut>
                <div className="gradient-border shadow-lg">
                    <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h1>Welcome</h1>
                            <h2>Log In to Continue Your Job Journey</h2>
                        </div>
                        <SignIn 
                            routing="path" 
                            path="/auth"
                            signUpUrl="/auth"
                            afterSignInUrl={next}
                            appearance={{
                                elements: {
                                    rootBox: "mx-auto",
                                    card: "shadow-none bg-transparent"
                                }
                            }}
                        />
                    </section>
                </div>
            </SignedOut>
            <SignedIn>
                <RedirectEffect next={next} navigate={navigate} />
            </SignedIn>
        </main>
    )
}

export default Auth
