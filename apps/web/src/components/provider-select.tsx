"use client";

import { Check, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { Providers } from "@/lib/providers";
import { FormControl } from "./ui/form";
import { Button } from "./ui/button";
import CustomLLM from "./custom-llm";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

export default function ProviderSelect({
  value,
  onChange,
  providers,
  custom = false,
  rootForm,
}: {
  value: string;
  onChange: (value: string) => void;
  providers: Providers;
  custom?: boolean;
  rootForm?: UseFormReturn<any>;
}) {
  const provider = providers[value];
  const customProvider = value && !provider;
  const [openCustom, setOpenCustom] = useState(false);

  return (
    <Select.Root
      onValueChange={(value) => {
        if (value === "none") value = "";
        onChange(value);
      }}
      defaultValue={value}
    >
      {custom && rootForm && (
        <CustomLLM
          rootForm={rootForm}
          open={openCustom}
          setOpen={setOpenCustom}
        />
      )}
      <FormControl>
        <Select.Trigger asChild>
          <button className="flex h-16 min-w-[236px] items-center justify-between space-x-16 rounded-md p-2 hover:bg-muted">
            {customProvider ? (
              <>abc</>
            ) : provider ? (
              <div className="inline-flex items-center">
                <Select.Icon className="h-6 w-6" asChild>
                  {provider.icon}
                </Select.Icon>
                <div className="ml-3 text-start">
                  <p className="text-lg font-medium">{provider.model}</p>
                  <p className="text-sm text-muted-foreground">
                    {provider.company}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                no provider selected
              </p>
            )}

            <ChevronDown className="h-5 w-5 stroke-muted-foreground" />
          </button>
        </Select.Trigger>
      </FormControl>
      <Select.Portal>
        <Select.Content
          sideOffset={8}
          position="popper"
          align="center"
          className="z-50 max-h-[--radix-select-content-available-height] w-72 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        >
          <Select.ScrollUpButton asChild>
            <Button variant="ghost" className="w-full border-b py-2">
              <ChevronUp className="h-4 w-4" />
            </Button>
          </Select.ScrollUpButton>
          <Select.Viewport className="p-2">
            <Select.Group className="space-y-1">
              {Object.entries(providers).map(
                ([id, { model, company, icon }]) => (
                  <Select.Item
                    key={id}
                    value={id}
                    className="rounded-md outline-none data-[state=checked]:bg-accent"
                  >
                    <div className="group flex w-full items-center justify-between rounded-md p-2 text-start hover:bg-accent">
                      <div className="flex items-center">
                        {icon}
                        <div className="ml-4">
                          <h2>{model}</h2>
                          <p className="text-sm text-muted-foreground">
                            {company}
                          </p>
                        </div>
                      </div>
                      <Select.ItemIndicator>
                        <Check className="mr-1 h-4 w-4" strokeWidth={3} />
                      </Select.ItemIndicator>
                    </div>
                  </Select.Item>
                ),
              )}
              {custom && (
                <button
                  className="flex w-full items-center rounded-md p-2 text-muted-foreground outline-none hover:bg-accent"
                  onClick={() => setOpenCustom(true)}
                >
                  <Plus className="mr-2 h-6 w-6 stroke-muted-foreground" />
                  custom model
                </button>
              )}

              {provider && (
                <Select.Item
                  value="none"
                  className="flex justify-center rounded-md p-2 outline-none hover:bg-accent"
                >
                  <X className="h-6 w-6 stroke-muted-foreground" />
                </Select.Item>
              )}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton asChild>
            <Button variant="ghost" className="w-full border-t py-2">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
