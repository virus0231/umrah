"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const router = useRouter()
  const { login, user } = useAuth()
  const { toast } = useToast()

  // Initialize database on component mount
  useEffect(() => {
    const initializeDatabase = async () => {
      setIsInitializing(true)
      try {
        const response = await fetch("/api/init-db", {
          method: "POST",
        })
        if (!response.ok) {
          throw new Error("Failed to initialize database")
        }
        console.log("Database initialized successfully")
      } catch (error) {
        console.error("Database initialization error:", error)
        toast({
          title: "Database Error",
          description: "Failed to initialize database. Please check your MySQL connection.",
          variant: "destructive",
        })
      } finally {
        setIsInitializing(false)
      }
    }

    initializeDatabase()
  }, [toast])

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        login(data.user)
        toast({
          title: "Login Successful",
          description: "Welcome to the CMS Dashboard!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render login form if user is already logged in
  if (user) {
    return null
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Panel - Teal Background */}
        <div className="bg-teal-600 p-8 flex flex-col justify-between text-white relative">
          <div>
            <h1 className="text-4xl font-bold mb-8">LOGIN</h1>
          </div>

          {/* Logo Section */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Image
                src="/images/hajj-umrah-logo.png"
                alt="Hajj Umrah Logo"
                width={200}
                height={120}
                className="mx-auto mb-4"
                priority
              />
            </div>
          </div>

          {/* Powered By Section */}
          <div className="text-center">
            <p className="text-teal-100">
              Powered By{" "}
              <span className="font-bold text-white">
                Y<span className="text-red-400">O</span>C
              </span>
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="p-8 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Let's Get Started</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                  USERNAME
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 h-12 border-gray-300 rounded-lg"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                  PASSWORD
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-gray-300 rounded-lg pr-12"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600 uppercase tracking-wide">
                    REMEMBER ME
                  </Label>
                </div>
                <Button
                  variant="link"
                  className="text-teal-600 p-0 h-auto text-sm uppercase tracking-wide hover:text-teal-700"
                  disabled={isLoading}
                  type="button"
                >
                  FORGOT PASSWORD?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 h-12 rounded-lg font-bold text-sm uppercase tracking-widest"
                disabled={isLoading}
              >
                {isLoading ? "LOGGING IN..." : "L O G I N"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-600 mb-2 font-medium">Demo Credentials:</p>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">
                  Username: <span className="font-mono">admin@hajiandumrah.co.uk</span>
                </p>
                <p className="text-xs text-gray-500">
                  Password: <span className="font-mono">admin123</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
