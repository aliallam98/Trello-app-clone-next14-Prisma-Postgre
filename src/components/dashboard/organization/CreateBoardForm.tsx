"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useEffect, useState, useTransition } from "react";
import unsplash from "@/lib/unsplash";
import { defaultImages } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { createBoard } from "@/actions/board.actions";
import { auth, useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner";
import { redirect } from "next/navigation";
import useProCardModel from "@/hooks/useProCardModel";

const formSchema = z.object({
  title: z.string().min(2, { message: "Cannot Be Empty" }).max(50),
  image: z.string(),
});

const CreateBoardForm = ({ children }: { children: React.ReactNode }) => {
  const { orgId } = useAuth();
  const proModel = useProCardModel();

  const [images, setImages] =
    useState<Array<Record<string, any>>>(defaultImages);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchRandomImages = async () => {
      try {
        const results = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });
        if (results && results.response) {
          const randomImages = results.response as Array<Record<string, any>>;
          setImages(randomImages);
        } else {
          console.error("Failed to get images from Unsplash");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomImages();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.image) return console.error("Select An Image");
    const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
      values.image.split("|");
    try {
      startTransition(async () => {
        const { success, message } = await createBoard({
          title: values.title,
          orgId,
          imageId,
          imageThumbUrl,
          imageFullUrl,
          imageLinkHTML,
          imageUserName,
        });
        if (success) {
          toast.success("Board Created .");
        } else {
          toast.error(message);
          proModel.onOpen();
        }
      });
    } catch (error) {
      toast.error("Something Went Wrong .");
    }
  }

  // To Do Close model once its done

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="mb-4 text-center">
            Create New Board
          </DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 max-w-[400px] mx-auto"
            >
              {isLoading && (
                <div className="flex items-center justify-center mt-8">
                  <Spinner />
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((image) => (
                  <div
                    key={image.id}
                    role="button"
                    className={cn(
                      "relative group aspect-video bg-muted hover:opacity-75 transition overflow-hidden"
                    )}
                    onClick={() => {
                      setSelectedImageId(image.id);
                      form.setValue(
                        "image",
                        `${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`
                      );
                    }}
                  >
                    {/* <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <Input 
                    {...field}
                    type="radio"
                    className="hidden"
                    checked={selectedImageId === image.id}
                    value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
                    onChange={field.onChange}
                  />
                )}
              /> */}

                    <Image
                      width={128}
                      height={72}
                      alt="unsplash image"
                      src={image.urls.thumb}
                      className="object-cover"
                    />
                    {image.id === selectedImageId && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center ">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                    <Link
                      href={image.links.html}
                      target="_blank"
                      className="opacity-0 group-hover:opacity-100 absolute z-10 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
                    >
                      {image.user.name}
                    </Link>
                  </div>
                ))}
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter Board Name"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Creating" : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardForm;
