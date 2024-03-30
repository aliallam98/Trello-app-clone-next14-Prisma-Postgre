"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  ElementRef,
  KeyboardEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import ListWrapper from "./ListWrapper";
import { createList } from "@/actions/list.actions";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  boardId: z.string().min(1),
});

interface IProps {
  boardId: string;
  orgId: string;
}

const CreateListForm = ({ boardId, orgId }: IProps) => {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState<boolean>(false);

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

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  //   useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      boardId: boardId || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      startTransition(async () => {
        const newList = await createList({
          boardId: values.boardId,
          orgId,
          title: values.title,
        });
        toast.success("List created successfully");
        disableEditing();
        form.reset();
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  if (isEditing) {
    return (
      <ListWrapper>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-[272px]"
            ref={formRef}
            onKeyDown={onKeyDown}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Enter List Title "
                      {...field}
                      ref={inputRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boardId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter List Title "
                      {...field}
                      className="h-0 absolute hidden"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-1">
              <Button disabled={isPending} type="submit">
                Add list
              </Button>
              <Button
                disabled={isPending}
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </ListWrapper>
    );
  }
  return (
    <ListWrapper>
      <Button
        className="flex items-center text-sm bg-white/80 hover:bg-white/50 transition w-full"
        onClick={enableEditing}
      >
        <Plus /> Add List
      </Button>
    </ListWrapper>
  );
};

export default CreateListForm;
