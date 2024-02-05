"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { redirect, useParams } from "next/navigation";
import { Layout } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { updateCard } from "@/actions/card.actions";
import { CardWithList } from "@/typings";
import { useQueryClient } from "@tanstack/react-query";

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
  boardId: z.string().min(1),
  id: z.string().min(1),
  orgId: z.string().min(1),
});

interface IProps {
  data: CardWithList;
}
const Title = ({ data }: IProps) => {
  const { boardId } = useParams();
  const { orgId } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const useQuery = useQueryClient();

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
      disableEditing();
    }
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title || "",
      boardId: (boardId as string) || "",
      id: data.id || "",
      orgId: orgId || "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) {
      return redirect("select-org");
    }
    if (values.title === data.title) {
      return disableEditing();
    }
    console.log(values);

    try {
      startTransition(async () => {
        const newList = await updateCard({
          ...values,
        });
        await useQuery.invalidateQueries({
          queryKey: ["card", data.id],
        });
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
          className=" text-black "
          ref={formRef}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="pt-2 px-2  text-sm font-semibold flex justify-between items-center gap-x-2 ">
                  <Layout size={16} />
                  <FormControl>
                    <Input
                      disabled={isPending}
                      className="h-10 bg-transparent focus:bg-white transition border-transparent grow focus-visible:bg-white focus-visible:border-input"
                      placeholder="Title"
                      {...field}
                      ref={inputRef}
                      onBlur={onBlur}
                    />
                  </FormControl>
                </div>

                <FormMessage className="absolute !m-0 right-5" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );

  return (
    <div className="pt-2 px-2 h-10 text-sm  flex flex-col   gap-x-2 ">
      <div className="flex items-center gap-x-2 font-semibold">
        <Layout size={16} />
        <p onClick={enableEditing} className="px-2 grow">
          {data.title}
        </p>
      </div>
      <p>
        In List: <span className="underline">{data.list.title}</span>
      </p>
    </div>
  );
};

export default Title;

Title.Skeleton = function TitleSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};
