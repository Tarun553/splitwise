"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from '@/@/components/ui/card'
import { Input } from '@/@/components/ui/input'
import { Label } from '@/@/components/ui/label'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { useForm } from 'react-hook-form'
import { Copy, Check } from 'lucide-react'


function SignUpPage() {
  const { register, handleSubmit, reset } = useForm();
  const [registeredUser, setRegisteredUser] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSignUp = async (data) => {
    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }
      
      // Store the registered user data
      setRegisteredUser(result);
      reset();
      toast.success("Registration successful!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registeredUser.id);
    setCopied(true);
    toast.success("User ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (registeredUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Registration Successful! 🎉</CardTitle>
            <CardDescription>
              Your account has been created successfully. Here's your User ID:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
              <code className="font-mono text-sm break-all">
                {registeredUser.id}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="ml-2"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <h4 className="font-medium mb-2">Important:</h4>
              <p className="text-sm text-muted-foreground">
                Please save this User ID. You'll need it to be added to households.
                Share it with household admins to get added to their groups.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
