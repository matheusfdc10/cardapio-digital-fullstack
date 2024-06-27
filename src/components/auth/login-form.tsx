"use client"

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useState, useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas/login";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FormError } from "@/components/form-error";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


export const LoginForm = () => {
    // const searchParams = useSearchParams()
    // const callbackUrl = searchParams.get("callbackUrl")?.toString()
    // const urlError = searchParams.get('error') === 'OAuthAccountNotLinked'
    //     ? "Email already in use with diferent provider!"
    //     : "";
    const [error, setError] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")

        startTransition(() => {
            login(values)
                .then((data) => {
                    if (data?.error) {
                        form.reset();
                        setError(data?.error)
                    }
                })
                .catch(() => {
                    setError("Algo deu errado")
                })
        })
    }

    return ( 
        <CardWrapper
            headerTitle="Login"
            // headerDescription="Bem vindo"
            backButtonLabel="Ainda não possui cadastro?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="john.silva@exemple.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="******"
                                            type="password"
                                            autoComplete="password"
                                        />
                                    </FormControl>
                                    <Button
                                        size="sm"
                                        variant="link"
                                        asChild
                                        className="px-0 font-normal"
                                    >
                                        <Link href="/">
                                            Esqueceu sua senha?
                                        </Link>
                                    </Button>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error}/>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : 
                            'Login'
                        }
                    </Button>
                </form>
            </Form>
        </CardWrapper>
     );
}