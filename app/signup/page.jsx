"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from '@/@/components/ui/card'
import { Input } from '@/@/components/ui/input'
import { Label } from '@/@/components/ui/label'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { useForm } from 'react-hook-form'

function SignUpPage() {
  const { register, handleSubmit, reset } = useForm();

  const handleSignUp = async (data) => {
    console.log("Form Data:", data)

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log(result);

      if (!res.ok) {
        alert(result.error || "Something went wrong");
      } else {
        alert("Registered successfully!");
        reset();
      }
    } catch (error) {
      console.error(error);
      alert("Request failed");
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign up to your account</CardTitle>
          <CardDescription>
            Enter your email below to sign up to your account
          </CardDescription>
          <CardAction>
            <Link href="/login">
              <Button variant="link">Login</Button>
            </Link>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                required
                {...register("name")}
              />

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
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
              />
            </div>

            {/* ✅ Submit inside the form */}
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button variant="outline" className="w-full">
            Sign up with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUpPage;
