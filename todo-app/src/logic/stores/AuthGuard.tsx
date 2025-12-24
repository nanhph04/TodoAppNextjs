"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";


export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    const router = useRouter();

    if (auth.isLoading) return null;

    if (!auth.accessToken) return null;

    return children;
}