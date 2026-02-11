
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Type, Link as LinkIcon, Users, Image as ImageIcon, Loader2, Sparkles, Send, Upload } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    content: z.string().optional(),
    imageUrl: z.string().optional(),
    communityId: z.string().min(1, "Please select a community."),
})

export function SubmitPostForm({ communities }: { communities: { id: string; name: string }[] }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imageMode, setImageMode] = useState("url") // "url" or "upload"

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            imageUrl: "",
        },
    })

    const imageUrlValue = form.watch("imageUrl");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                form.setValue("imageUrl", base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const response = await fetch("/api/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error("Failed to submit post")
            }

            const data = await response.json()

            if (data.status === "FLAGGED") {
                toast.warning("Post marked as flagged and violates policies", {
                    description: "Your post is under manual review.",
                    duration: 6000,
                })
            } else {
                toast.success("Post successfully submitted!")
            }

            router.push("/")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="communityId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-indigo-500" />
                                    Choose Community
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-11">
                                            <SelectValue placeholder="Select a community" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {communities.map((community) => (
                                            <SelectItem key={community.id} value={community.id}>
                                                {community.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Type className="h-4 w-4 text-indigo-500" />
                                    Title
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Give your post a catchy title"
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-11"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-500" />
                                Content (Optional)
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Share your thoughts..."
                                    className="min-h-[150px] resize-none bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-base"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Our AI will automatically scan your text for safety.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <FormLabel className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-indigo-500" />
                        Add an Image (Optional)
                    </FormLabel>

                    <Tabs defaultValue="url" onValueChange={setImageMode} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="url">Image Link</TabsTrigger>
                            <TabsTrigger value="upload">Upload File</TabsTrigger>
                        </TabsList>

                        <TabsContent value="url">
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="https://example.com/image.png"
                                                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-11 pl-10"
                                                    {...field}
                                                    onChange={(e) => {
                                                        // Ensure we are in "url" mode logic transparency if needed
                                                        field.onChange(e);
                                                    }}
                                                />
                                                <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>

                        <TabsContent value="upload">
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:hover:bg-bray-800 dark:bg-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-slate-400" />
                                        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">Click to upload</span></p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG or GIF</p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Live Image Preview */}
                {imageUrlValue && (
                    <div className="mt-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <p className="text-sm font-medium text-slate-500 mb-2">Image Preview</p>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
                            <img
                                src={imageUrlValue}
                                alt="Preview"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Scanning Content...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-5 w-5" />
                            Post to Community
                        </>
                    )}
                </Button>
            </form>
        </Form>
    )
}
