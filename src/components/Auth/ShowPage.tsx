"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { Button } from "../ui/button";

export function ShowPage({
  setForgotPasswordOpen,
  side,
}: {
  setForgotPasswordOpen: (open: boolean) => void;
  side?: boolean;
  isAuth?: boolean;
}) {
  const [currentForm, setCurrentForm] = useState("login");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showAuthOpen, setShowAuthOpen] = useState(false);

  // Handle hydration - ALWAYS call this hook
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFormChange = (newForm: string) => {
    if (newForm === currentForm || isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentForm(newForm);
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 200);
  };

  // Render content based on client state
  const renderContent = () => {
    if (!isClient) {
      return (
        <div>
          <UserIcon className="h-6 w-6" />
        </div>
      );
    }

    return (
      <Dialog open={showAuthOpen} onOpenChange={setShowAuthOpen}>
        <DialogTrigger asChild>
          {side ? (
            <Button className="flex items-center justify-center gap-2 h-11 hover:bg-black hover:text-white transition-all duration-300">
              <UserIcon className="h-6 w-6" />
              <span className="text-sm font-medium">Login</span>
            </Button>
          ) : (
            <button className="flex items-center justify-center">
              <UserIcon className="h-6 w-6" />
            </button>
          )}
        </DialogTrigger>
        <DialogContent className="h-[90vh] max-w-xl md:max-w-4xl lg:max-w-5xl overflow-hidden p-0">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.04] z-[-1]"></div>
            <div
              className={`absolute inset-0 transition-all duration-300 ease-in-out p-10 ${
                currentForm === "login"
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0"
              }`}
            >
              <Login
                setCurrentForm={handleFormChange}
                setForgotPasswordOpen={setForgotPasswordOpen}
                setShowAuthOpen={setShowAuthOpen}
              />
            </div>

            <div
              className={`absolute inset-0 transition-all duration-300 ease-in-out p-10 ${
                currentForm === "signup"
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            >
              <Signup setCurrentForm={handleFormChange} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return renderContent();
}
