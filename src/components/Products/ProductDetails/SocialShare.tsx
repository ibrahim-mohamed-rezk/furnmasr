"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ShareIcon,
  Mail,
  Link as LinkIcon,
  Copy,
  Check,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { Product } from "@/lib/api";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

interface SocialShareProps {
  product: Product;
}

export function SocialShare({ product }: SocialShareProps) {
  const { t: tShop } = useTranslation("shop");
  const [copied, setCopied] = React.useState(false);

  const shareData = {
    title: product.name,
    text: product.description || product.name,
    url: typeof window !== "undefined" ? window.location.href : "",
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share(shareData);
        toast.success(tShop("shared_successfully"));
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error(tShop("share_failed"));
        }
      }
    } else {
      // Fallback to copying link
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      toast.success(tShop("link_copied"));

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(tShop("copy_failed"));
    }
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareData.url
    )}`;
    window.open(url, "_blank", "width=600,height=400");
    toast.success(tShop("opening_facebook"));
  };

  const handleTwitterShare = () => {
    const text = `${shareData.title} - ${shareData.text}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(shareData.url)}`;
    window.open(url, "_blank", "width=600,height=400");
    toast.success(tShop("opening_twitter"));
  };

  const handleWhatsAppShare = () => {
    const text = `${shareData.title} - ${shareData.text} ${shareData.url}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    toast.success(tShop("opening_whatsapp"));
  };

  const handleEmailShare = () => {
    const subject = `${tShop("check_out_product")}: ${shareData.title}`;
    const body = `${shareData.text}\n\n${tShop("view_it_here")}: ${
      shareData.url
    }`;
    const url = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    toast.success(tShop("opening_email"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full gap-2 rounded-none">
          <ShareIcon className="w-6 h-6 transition-transform duration-200 hover:scale-110" />
          <span className="text-sm">{tShop("share")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="center">
        <DropdownMenuItem
          onClick={handleNativeShare}
          className="cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <ShareIcon className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
          {typeof navigator !== "undefined" && "share" in navigator
            ? tShop("share")
            : tShop("copy_link")}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleFacebookShare}
          className="cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <FaFacebook className="mr-2 h-4 w-4 text-blue-600 transition-transform duration-200 hover:scale-110" />
          Facebook
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleTwitterShare}
          className="cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-blue-400"
        >
          <FaTwitter className="mr-2 h-4 w-4 text-blue-400 transition-transform duration-200 hover:scale-110" />
          Twitter
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleWhatsAppShare}
          className="cursor-pointer transition-all duration-200 hover:bg-green-50 hover:text-green-600"
        >
          <FaWhatsapp className="mr-2 h-4 w-4 text-green-600 transition-transform duration-200 hover:scale-110" />
          WhatsApp
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleEmailShare}
          className="cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:text-muted-foreground"
        >
          <Mail className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
          {tShop("email")}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleCopyLink}
          className="cursor-pointer transition-all duration-200 hover:bg-purple-50 hover:text-purple-600"
        >
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-600 transition-all duration-200" />
          ) : (
            <Copy className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
          )}
          {copied ? tShop("link_copied") : tShop("copy_link")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
