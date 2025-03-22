"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

const authformSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(8),
    });
};

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
    const formSchema = authformSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === "sign-in") {
                console.log("Sign in", values);
                toast.success("Signed in successfully");
                router.push("/");
            } else {
                console.log("Sign up", values);
                toast.success("Account created successfully. Please sign in");
                router.push("/sign-in");
            }
        } catch (error) {
            console.error(error);
            toast.error(`there was an error: ${error}`);
        }
    }

    const isSignIn = type === "sign-in";
    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">SmartPrep</h2>
                </div>

                <h3>Practice job interview with AI</h3>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6 mt-4 form"
                    >
                        {!isSignIn && (
                            <FormField
                                name="name"
                                label="Name"
                                placeholder="Your name"
                                control={form.control}
                            />
                        )}

                        <FormField
                                name="email"
                                label="Email"
                                placeholder="example@mail.com"
                                control={form.control}
                                type="email"
                            />

                        <FormField
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                                control={form.control}
                                type="password"
                            />
                        <Button type="submit" className="btn">
                            {isSignIn ? "Sign In" : "Create an Account"}
                        </Button>
                    </form>
                </Form>
                <p className="text-center">
                    {isSignIn ? "No account yet?" : "Already have an account?"}
                    <Link
                        href={isSignIn ? "/sign-up" : "/sign-in"}
                        className="font-bold text-user-primary ml-1"
                    >
                        {isSignIn ? "Sign Up" : "Sign In"}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
