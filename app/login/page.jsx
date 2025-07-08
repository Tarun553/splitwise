"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/@/components/ui/card"
import { Input } from "@/@/components/ui/input"
import { Label } from "@/@/components/ui/label"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const handleLogin = async (data) => {
    console.log("Form Data:", data)

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log(result);

      if (!res.ok) {
        alert(result.error || "Something went wrong");
      } else {
        alert("Logged in successfully!");
        reset();
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      alert("Request failed");
    }
  };
  return (
    <>
    <div className='flex justify-center items-center h-screen'>

    <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
      <CardAction>
        <Link href="/signup">
        <Button variant="link">Sign Up</Button>
        </Link>
      </CardAction>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              {...register("email")}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" required {...register("password")}/>
          </div>
         
      <Link href="/dashboard">
      <Button type="submit" className="w-full">
        Login
      </Button>
      </Link>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex-col gap-2">
     
      <Button variant="outline" className="w-full">
        Login with Google
      </Button>
    </CardFooter>
  </Card>
              </div>
    </>
  )
}

export default LoginPage