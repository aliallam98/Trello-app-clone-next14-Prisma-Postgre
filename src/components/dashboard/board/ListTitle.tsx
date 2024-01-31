"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ListWithCards } from "@/typings";
import { List } from "@prisma/client";
import { MoreHorizontal, Pencil } from "lucide-react";
import React, { ElementRef, useRef, useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useAuth } from "@clerk/nextjs";
import { updateList } from "@/actions/list.actions";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ListActions from "./ListActions";

const formSchema = z.object({
  title: z
    .string({
      required_error: "title is required",
      invalid_type_error: "title is required",
    })
    .min(2, {
      message: "title is too short",
    })
    .max(50),
  boardId: z.string(),
  listId: z.string(),
});

interface IProps {
  data: ListWithCards;
}
const ListTitle = ({ data }: IProps) => {
  const router = useRouter();
  const { orgId, userId } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  useEventListener("keydown", onKeyDown);
  // useOnClickOutside(formRef,disableEditing)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || "",
      boardId: data?.boardId || "",
      listId: data?.id || "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) {
      return redirect("select-org");
    }
    if (values.title === data?.title) {
      return disableEditing();
    }
    try {
      startTransition(async () => {
        const newList = await updateList({
          ...values,
          orgId,
        });
        router.refresh();
        disableEditing();
        toast.success(newList.message);
      });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  }

  if (isEditing)
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 text-black"
          ref={formRef}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                  disabled={isPending}
                    className="py-0 h-6 bg-transparent focus:bg-white transition border-transparent"
                    placeholder="Title"
                    {...field}
                    ref={inputRef}
                    onBlur={onBlur}
                  />
                </FormControl>
                <FormMessage className="absolute !m-0 right-5" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );

  return (
    <div className="w-full flex items-center justify-between h-6  cursor-pointer ">
      <p onClick={enableEditing} className="grow text-sm font-medium">
        {data.title}
      </p>
      <ListActions
      data= {data}
      />
    </div>
  );
};

export default ListTitle;
