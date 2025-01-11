"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { z } from "zod"

import { 
    Form,
    FormControl, 
    FormMessage,
    FormField,
    FormItem,
    FormLabel,
 } from "@/components/ui/form.jsx";

import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";

const formSchema = z.object({
    emailAddress: z.string().email(),
    password: z.string().min(5)
  });

export default function Login() {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailAddress: "",
        },
    });

    function onSubmit(values) {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <FormField 
                    control={form.control} 
                    name="emailAddress" 
                    render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Email Address"
                                type="email"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                    }}
                />
                <FormField 
                    control={form.control} 
                    name="password" 
                    render={({ field }) => {
                    return (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Password"
                            type="password"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    );
                    }}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
        
    )
}