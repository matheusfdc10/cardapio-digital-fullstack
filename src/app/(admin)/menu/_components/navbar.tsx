"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

const navItems = [
  { label: "Categorias de pratos", url: "/menu/categories" },
  { label: "Pratos", url: "/menu/dishes" },
  { label: "Categorias de adicionais", url: "/menu/additional-categories" },
  { label: "Adicionais", url: "/menu/additionals" },
];

const Navbar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const currentNav = navItems.find((item) => {
    const itemUrl = item.url.split("/")[2]
    const urlName = pathName.split("/")[2]
    return itemUrl === urlName;
  });

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <div className="w-[250px]">
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <div>
            <Button
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={open}
                aria-label="navegação"
                className="w-[250px] justify-between"
            >
                {currentNav?.label || "Selecione"}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
            </div>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
            <Command>
            <CommandList>
                <CommandGroup>
                {navItems.map((item) => (
                    <CommandItem
                    key={item.label}
                    onSelect={() => handleSelect(item.url)}
                    className="text-sm"
                    >
                    {item.label}
                    <Check
                        className={cn(
                        "ml-auto h-4 w-4",
                        currentNav?.label === item.label ? "opacity-100" : "opacity-0"
                        )}
                    />
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
            </Command>
        </PopoverContent>
        </Popover>
    </div>
  );
};

export default Navbar;
