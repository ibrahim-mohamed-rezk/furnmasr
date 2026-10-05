"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useMutate } from "@/hooks/useMutate";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface DeleteConfirmationProps {
  addressId: number;
  addressName: string;
  onSuccess: () => void;
}

export function DeleteConfirmation({
  addressId,
  addressName,
  onSuccess,
}: DeleteConfirmationProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const deleteAddress = useMutate<any, any>({
    endpoint: `/addresses/${addressId}`,
    method: "DELETE",
    successMessage: "Address deleted",
    errorMessage: "Failed to delete address",
  });
  const handleDelete = () => {
    deleteAddress.mutate(undefined as any, {
      onSuccess: () => {
        setOpen(false);
        onSuccess();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 text-white hover:bg-red-700">
          <Trash2 className="w-6 h-6" />
          {t("account.delete_address")}
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[60vh] max-w-xl md:max-w-2xl lg:max-w-3xl overflow-hidden overflow-y-auto md:overflow-y-hidden p-0">
        <div className="p-5 md:px-10 lg:px-20 relative w-full h-full flex flex-col justify-center items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.04] z-[-1]"></div>
          <div className="head flex items-center justify-center mb-10">
            <div className="title text-center">
              <h2 className="md:text-4xl text-2xl font-[900] mb-4">
                {t("account.delete_address")}
              </h2>
              <div className="icon flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-10 h-10 text-red-600" />
                </div>
              </div>
              <p className="text-lg text-foreground mb-2">
                {t("account.are_you_sure_you_want_to_delete_this_address")}
              </p>
              <p className="text-md text-muted-foreground mb-8">
                <strong>{addressName}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                {t("account.this_action_cannot_be_undone")}
              </p>
            </div>
          </div>

          <div className="actions flex justify-center gap-5 w-full">
            <Button
              onClick={handleDelete}
              className="bg-red-600 text-white py-3 px-8 rounded-none hover:bg-red-700 transition-colors h-11"
              disabled={deleteAddress.isPending}
            >
              {deleteAddress.isPending ? (
                <LoadingSpinner
                  text={t("common.deleting")}
                  color="white"
                  size="sm"
                  className="text-white"
                />
              ) : (
                t("account.yes_delete")
              )}
            </Button>
            <DialogClose>
              <Button
                variant="outline"
                className="h-11 hover:bg-accent rounded-none hover:text-foreground py-3 px-8 border-black"
              >
                {t("common.cancel")}
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
