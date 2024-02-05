"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { ElementRef, useRef, useState, useTransition } from "react";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { List } from "@prisma/client";
import { createCard } from "@/actions/card.actions";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const formSchema = z.object({
  title: z
    .string({
      required_error: "Title required",
      invalid_type_error: "Title Required",
    })
    .min(2, {
      message: "Title is too short",
    })
    .max(50),
  description: z.string().max(50).optional(),
  listId: z.string().min(1),
  boardId: z.string().min(1),
});

interface IProps {
  data: List;
}
const CreateCardFrom = ({ data }: IProps) => {
    const {orgId} = useAuth()
  const [isPending, startTransition] = useTransition();
  const [isEditing, setItEditing] = useState<boolean>(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setItEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };
  const disableEditing = () => {
    setItEditing(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      listId: data.id || "",
      boardId: data.boardId || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(!orgId){
        return redirect("select-org")
    }
    try {
      startTransition(async () => {
        const card = await createCard({
          listId: values.listId,
          title: values.title,
          description:values.description,
          orgId,
          boardId : values.boardId
        });
        toast.success(card.message);
      });
    } catch (error: any) {
      toast.success(error.message);
    }
  }

  if (!isEditing) {
    return (
      <Button
        onClick={enableEditing}
        className="w-full mt-2 flex justify-start items-center gap-2"
        variant={"ghost"}
      >
        <Plus size={16} />
        Add Card
      </Button>
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mt-4 bg-white p-2  rounded-md"
        ref={formRef}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter Title"
                  {...field}
                  disabled={isPending}
                  ref={inputRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  disabled={isPending}
                  placeholder="Description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-start gap-2">
          <Button
          disabled={isPending}
          type="submit">Add</Button>
          <Button
            disabled={isPending}
            className="h-auto w-auto p-2 "
            variant={"ghost"}
            onClick={disableEditing}
          >
            <X size={16} />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCardFrom;
