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
import { motion } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// Add the same animated background from your landing page

const authFormSchema = (type: FormType) =>
  z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  });

const AuthForm = ({ type }: { type: FormType }) => {
  const isSignIn = type === "sign-in";
  const formSchema = authFormSchema(type);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  useEffect(() => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          email,
          name: name!,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully, you can now sign in");
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in failed.");
          return;
        }

        await signIn({ idToken, email });
        toast.success("Sign in successful");

        // Invalidate both authentication-related queries
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["current-user"] }),
          queryClient.invalidateQueries({ queryKey: ["is-authenticated"] }),
        ]);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }
  async function handleGoogleSignin() {
    try {
      setIsGoogleLoading(true);
      setShowAuthOverlay(true);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      toast.loading("Opening Google sign-in...", { id: "google-signin" });

      const result = await signInWithPopup(auth, provider);

      toast.loading("Completing sign-in...", { id: "google-signin" });

      const user = result.user;
      const idToken = await user.getIdToken();

      // Start both operations in parallel for better performance
      const [signInResult] = await Promise.all([
        signIn({ idToken, email: user.email! }),
        // Preemptively invalidate queries while sign-in is happening
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["current-user"] }),
          queryClient.invalidateQueries({ queryKey: ["is-authenticated"] }),
        ]),
      ]);

      if (!signInResult?.success) {
        toast.error(signInResult?.message || "Sign in failed", {
          id: "google-signin",
        });
        return;
      }

      toast.success("Signed in with Google!", { id: "google-signin" });

      // Immediate redirect without delay
      router.push("/");
    } catch (error: any) {
      toast.error(error?.message || "Sign in failed", { id: "google-signin" });
      console.log(error);
    } finally {
      setIsGoogleLoading(false);
      setShowAuthOverlay(false);
    }
  }

  return (
    <div className="min-h-screen bg-black/60 flex items-center justify-center relative overflow-hidden">
      {/* Add the same animated background */}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(rgba(0,0,0,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.7)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="w-full max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Main auth card */}
          <motion.div
            className="bg-white/[0.05] lg:min-w-lg backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Logo and title */}
            <div className="text-center mb-8">
              <motion.div
                className="flex justify-center items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Image
                  src="/logo.png"
                  height={48}
                  width={56}
                  alt="logo of the site"
                  className="mr-3"
                />
                <h2 className="text-white text-2xl font-semibold">OnLevel</h2>
              </motion.div>

              <motion.p
                className="text-white/60 text-sm ml-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                Practice job interviews with AI Agent
              </motion.p>
            </div>

            <Form {...form}>
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {!isSignIn && (
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">
                      Name
                    </label>
                    <FormField
                      control={form.control}
                      name="name"
                      placeholder="Your Name"
                      className="bg-white/[0.05] border-white/20 text-white placeholder:text-white/40 rounded-xl h-12 px-4 focus:border-white/40 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">
                    Email
                  </label>
                  <FormField
                    control={form.control}
                    name="email"
                    placeholder="Your Email address"
                    type="email"
                    className="bg-white/[0.05] border-white/20 text-white placeholder:text-white/40 rounded-xl h-12 px-4 focus:border-white/40 focus:bg-white/[0.08] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">
                    Password
                  </label>
                  <FormField
                    control={form.control}
                    name="password"
                    placeholder="Password"
                    type="password"
                    className="bg-white/[0.05] border-white/20 text-white placeholder:text-white/40 rounded-xl h-12 px-4 focus:border-white/40 focus:bg-white/[0.08] transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold h-12 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  {isSignIn ? "Sign in" : "Create account"}
                </Button>

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex-1 h-px bg-white/20" />
                    <span className="text-white/60 text-sm">
                      or continue with
                    </span>
                    <div className="flex-1 h-px bg-white/20" />
                  </div>

                  <Button
                    type="button"
                    onClick={handleGoogleSignin}
                    disabled={isGoogleLoading}
                    className="w-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/20 text-white font-medium h-12 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGoogleLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <Image
                          src="/google-icon.svg"
                          alt="Google"
                          width={20}
                          height={20}
                        />
                        <span>Google</span>
                      </>
                    )}
                  </Button>
                </div>
              </motion.form>
            </Form>

            <motion.p
              className="text-center text-white/60 text-sm mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {isSignIn ? "No account yet?" : "Have an account already?"}
              <Link
                href={isSignIn ? "/sign-up" : "/sign-in"}
                className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors"
              >
                {isSignIn ? "Sign up" : "Sign in"}
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
        {showAuthOverlay && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <p className="text-white">Completing sign-in...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
