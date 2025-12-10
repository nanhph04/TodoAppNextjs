"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/logic/stores/AuthContext";


export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    const router = useRouter();

    if (auth.isLoading) return null; // hoặc loading spinner

    if (!auth.accessToken) return null; // hoặc redirect, nhưng đã có ở logout rồi

    return children;
}