"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const addressFormSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required." }),
  last_name: z.string().min(1, { message: "Last name is required." }),
  city: z.string().min(1, { message: "City is required." }),
  region: z.string().min(1, { message: "Region is required." }),
  address: z.string().min(1, { message: "Address is required." }),
});

export function AddNewAddress() {
  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      city: "",
      region: "",
      address: "",
    },
  });

  function onSubmit(values: z.infer<typeof addressFormSchema>) {
    console.log("New address:", values);
    // Here you would typically save the address to your backend
    form.reset();
  }

  function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit(onSubmit)(e);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="mt-4">
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto hover:no-underline"
          >
            <div className="icon border border-primary rounded-md p-1 mr-2">
              <PlusIcon className="w-4 h-4" />
            </div>
            Add New Address
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="h-[80vh] max-w-xl md:max-w-4xl lg:max-w-5xl overflow-hidden overflow-y-auto md:overflow-y-hidden p-0">
        <div className="p-5 md:px-10 lg:px-40 relative w-full h-full flex flex-col justify-center items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.04] z-[-1]"></div>
          <div className="head flex items-center justify-center mb-10">
            <div className="title">
              <h2 className="md:text-5xl text-3xl font-[900]">
                Add New Address
              </h2>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={handleSaveAddress} className="space-y-8 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="name-fields">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="name-fields">
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0">
                              <SelectValue placeholder="Select a city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cairo">Cairo</SelectItem>
                            <SelectItem value="alexandria">
                              Alexandria
                            </SelectItem>
                            <SelectItem value="giza">Giza</SelectItem>
                            <SelectItem value="sharm-el-sheikh">
                              Sharm El Sheikh
                            </SelectItem>
                            <SelectItem value="luxor">Luxor</SelectItem>
                            <SelectItem value="aswan">Aswan</SelectItem>
                            <SelectItem value="hurghada">Hurghada</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0">
                              <SelectValue placeholder="Select a region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="downtown">Downtown</SelectItem>
                            <SelectItem value="heliopolis">
                              Heliopolis
                            </SelectItem>
                            <SelectItem value="maadi">Maadi</SelectItem>
                            <SelectItem value="zamalek">Zamalek</SelectItem>
                            <SelectItem value="nasr-city">Nasr City</SelectItem>
                            <SelectItem value="6th-october">
                              6th October
                            </SelectItem>
                            <SelectItem value="new-cairo">New Cairo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="address-fields">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter your address"
                            className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="submit-btn flex justify-center gap-5">
                  <Button
                    type="submit"
                    className="bg-black text-white py-3 px-6 rounded-none hover:bg-primary transition-colors h-11"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Save Address
                  </Button>
                  <div className="close">
                    <DialogClose>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 hover:bg-accent rounded-none hover:text-foreground py-3 px-6 border-black"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
