"use client";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useLogout } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import React from "react";

function Tabs({ tabs, activeTab }: { tabs: any; activeTab: string }) {
  const { t } = useTranslation();
  const logoutMutation = useLogout();

  return (
    <section className="space-y-5 flex flex-col justify-start md:items-start  border  border-border p-4 rounded-lg">
      {tabs.map((tab: any) => (
        <Link
          href={`/account?tab=${tab.value}`}
          key={tab.value}
          className={`cursor-pointer text-md md:text-lg font-[600] bg-muted md:bg-transparent p-3 md:p-0 md:border-b-2 md:border-b-transparent rounded-sm ${
            activeTab === tab.value ? "text-primary" : "text-foreground"
          }`}
        >
          {tab.label}
        </Link>
      ))}

      <div className="logout">
        <Button
          variant="link"
          disabled={logoutMutation.isPending}
          className="p-0 h-auto hover:no-underline text-red-500 font-[600] text-md md:text-lg"
          onClick={() => {
            logoutMutation.mutate();
          }}
        >
          {logoutMutation.isPending ? (
            <LoadingSpinner
              text={t("auth.logging_out")}
              color="red"
              size="md"
            />
          ) : (
            t("account.logout")
          )}
        </Button>
      </div>
    </section>
  );
}

export default Tabs;
