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
import { AlignLeft, Layout } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { updateCard } from "@/actions/card.actions";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardWithList } from "@/typings";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  description: z
    .string({
      required_error: "description is required",
      invalid_type_error: "description is required",
    })
    .min(3, {
      message: "description is too short",
    })
    .max(50),
  boardId: z.string().min(1),
  id: z.string().min(1),
  orgId: z.string().min(1),
});

interface IProps {
  data: CardWithList;
}
const Description = ({ data }: IProps) => {
  const { boardId } = useParams();
  const { orgId } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<ElementRef<"form">>(null);
  // const textareaRef = useRef<ElementRef<"textarea">>(null);

  const useQuery = useQueryClient();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      form.setFocus("description");
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
      description: data.description || "",
      boardId: (boardId as string) || "",
      id: data.id || "",
      orgId: orgId || "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) {
      return redirect("select-org");
    }
    if (values.description === data.description) {
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="pt-2 px-2 text-sm flex flex-col  items-start gap-2 w-full  min-h-[80px]  ">
                  <div className=" flex items-center gap-x-2 font-semibold">
                    <AlignLeft size={16} />
                    <Label className="font-semibold">Description</Label>
                  </div>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      placeholder="Description"
                      className="resize-none"
                      {...field}
                      // onBlur={onBlur}
                    />
                  </FormControl>
                </div>
                <FormMessage className="absolute !m-0 right-5" />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-2 px-4 mt-2">
            <Button
              disabled={isPending}
              type="submit"
              className="h-auto w-auto p-2 "
              onClick={() => formRef.current?.requestSubmit()}
            >
              Save
            </Button>
            <Button
              disabled={isPending}
              className="h-auto w-auto p-2 "
              variant={"ghost"}
              onClick={disableEditing}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    );

  return (
    <div className="pt-2 px-2 text-sm  flex flex-col  items-start gap-2 w-full  min-h-[80px]  ">
      <div className=" flex items-center gap-x-2 font-semibold">
        <AlignLeft size={16} />
        <p>Description</p>
      </div>
      <div
        onClick={enableEditing}
        className="min-h-[80px] p-2 gap-x-2 grow border w-full rounded-md "
      >
        {" "}
        {data.description}
      </div>
    </div>
  );
};

export default Description;

Description.Skeleton = function TitleSkeleton() {
  return (
    <div className="pt-2 px-2 text-sm  flex flex-col  items-start gap-2 w-full   ">
      <div className=" flex items-center gap-x-2">
        <Skeleton className="h-4 w-4 mt-1 bg-neutral-200" />
        <Skeleton className="h-6 w-20 mt-1 bg-neutral-200" />
      </div>
      <div className="min-h-[80px] p-2 grow   rounded-md ">
        <Skeleton className="min-h-[80px] w-[400px] bg-neutral-200" />
      </div>
    </div>
  );
};
