"use client";
import * as React from "react";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useCategoryMapping } from "@/hooks/useCategoryMapping";

export function Menu() {
  const { getCategoryUrl } = useCategoryMapping();

  const components: { title: string; href: string }[] = [
    {
      title: "All",
      href: "/shop",
    },
    {
      title: "Living Room",
      href: getCategoryUrl("living-room"),
    },
    {
      title: "Bedroom",
      href: getCategoryUrl("bedroom"),
    },
  ];

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "Shop", href: "/shop" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex justify-center items-center gap-6">
        {navigation.map((item) => (
          <NavigationMenuItem key={item.name}>
            {item.name === "Categories" ? (
              <>
                <NavigationMenuTrigger className="h-auto py-1 px-2 ">
                  {item.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[400px] gap-2 md:w-[500px] lg:w-[600px] p-10">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      ></ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink>
                <Link href={item.href}>{item.name}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
