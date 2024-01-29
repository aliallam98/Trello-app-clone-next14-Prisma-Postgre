"use client";

import { ElementRef, useRef, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Board } from "@prisma/client";
import { toast } from "sonner";
import { updateBoardById } from "@/actions/board.actions";

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
});

interface IProps {
  data: Board | null;
  orgId: string;
}

const BoardTitleForm = ({ data, orgId }: IProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  };
  const disableEditing = () => {
    setIsEditing(false);
  };

  const onBlur = () => {
    // if(form.getValues("title") === "") {
    //     toast.error("Title Cannot Be Empty")
    //     form.setValue("title",title)
    // }
    formRef.current?.requestSubmit();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(values.title === data?.title) {
        return disableEditing()
    }
    try {
      const board = await updateBoardById({ boardId: data?.id!, orgId, title: values.title });
      toast.success(`Board "${board?.results.title}" Updated`)
      disableEditing();
    } catch (error) {
      console.log(error);
      toast.error("Failed To Update")
    }
  }

  if (!isEditing)
    return (
      <Button variant={"transparent"} onClick={enableEditing}>
        {data?.title}
      </Button>
    );

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
            <FormItem className="relative flex items-center ">
              <FormControl>
                <Input
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
};

export default BoardTitleForm;
