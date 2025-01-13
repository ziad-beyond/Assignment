"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setValidationErrors((prev) => ({ ...prev, [id]: "" }));
  };
  
  const validateForm = () => {
    const errors: { email: string; password: string } = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    setValidationErrors(errors);

    return !errors.email  && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/signin", formData);
      const { token, email, name } = response.data;
  
      Cookies.set("token", token, {
        expires: 1, 
        secure: process.env.NODE_ENV !== "development", 
        sameSite: "strict", 
      });
  
      Cookies.set("email", email, {
        expires: 1, 
        secure: process.env.NODE_ENV !== "development", 
        sameSite: "strict", 
      });
  
      Cookies.set("name", name, {
        expires: 1, 
        secure: process.env.NODE_ENV !== "development", 
        sameSite: "strict", 
      });
  
      window.location.href = "/dashboard";
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };
  

  return (
    <Card className="overflow-hidden">
      <CardContent className="grid p-0 md:grid-cols-2">
        <form className="p-6 md:p-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Sign In</h1>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {validationErrors.email && (
                  <p className="text-sm text-red-600">{validationErrors.email}</p>
                )}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Password at least 8 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {validationErrors.password && (
                  <p className="text-sm text-red-600">
                    {validationErrors.password}
                  </p>
                )}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            {errorMessage && (
                <div>
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                className="underline underline-offset-4 text-blue-800"
                href={"/signup"}
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
        <div className="relative hidden bg-muted md:block">
          <img
            src="/brand.png"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </CardContent>
    </Card>
  );
}
