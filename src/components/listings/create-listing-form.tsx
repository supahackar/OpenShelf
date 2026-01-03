"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createListing } from "@/lib/actions/listings"
import { Condition } from "@prisma/client"

const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    author: z.string().min(2, "Author must be at least 2 characters"),
    edition: z.string().optional(),
    courseCode: z.string().optional(),
    condition: z.nativeEnum(Condition),
    description: z.string().min(10, "Description must be at least 10 characters"),
    categoryId: z.string().min(1, "Category is required"),
    locationId: z.string().min(1, "Location is required"),
    images: z.array(z.string()).max(5, "Maximum 5 images"),
})

interface CreateListingFormProps {
    categories: { id: string; name: string }[]
    locations: { id: string; name: string }[]
}

export function CreateListingForm({ categories, locations }: CreateListingFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [uploading, setUploading] = React.useState(false)
    const [images, setImages] = React.useState<string[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            author: "",
            edition: "",
            courseCode: "",
            condition: Condition.GOOD,
            description: "",
            categoryId: "",
            locationId: "",
            images: [],
        },
    })

    async function onImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return

        if (images.length + files.length > 5) {
            alert("Maximum 5 images allowed")
            return
        }

        setUploading(true)
        const newImages = [...images]

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData()
            formData.append("file", files[i])

            try {
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                })
                const data = await res.json()
                if (data.url) {
                    newImages.push(data.url)
                }
            } catch (error) {
                console.error("Upload failed", error)
            }
        }

        setImages(newImages)
        form.setValue("images", newImages)
        setUploading(false)
    }

    function removeImage(index: number) {
        const newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)
        form.setValue("images", newImages)
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        const res = await createListing(values)
        setIsLoading(false)

        if (res.error) {
            alert(res.error)
        } else {
            router.push("/dashboard/listings")
            router.refresh()
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="title">Book Title</Label>
                    <Input id="title" {...form.register("title")} placeholder="e.g. Introduction to Algorithms" />
                    {form.formState.errors.title && (
                        <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" {...form.register("author")} placeholder="e.g. Cormen" />
                    {form.formState.errors.author && (
                        <p className="text-sm text-red-500">{form.formState.errors.author.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edition">Edition (Optional)</Label>
                    <Input id="edition" {...form.register("edition")} placeholder="e.g. 3rd" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="courseCode">Course Code (Optional)</Label>
                    <Input id="courseCode" {...form.register("courseCode")} placeholder="e.g. CS101" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(val) => form.setValue("categoryId", val)} defaultValue={form.getValues("categoryId")}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.categoryId && (
                        <p className="text-sm text-red-500">{form.formState.errors.categoryId.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select onValueChange={(val) => form.setValue("condition", val as Condition)} defaultValue={Condition.GOOD}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(Condition).map((c) => (
                                <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Campus Location</Label>
                    <Select onValueChange={(val) => form.setValue("locationId", val)} defaultValue={form.getValues("locationId")}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((l) => (
                                <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.locationId && (
                        <p className="text-sm text-red-500">{form.formState.errors.locationId.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} placeholder="Describe the book condition and any other details..." />
                {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Images (Max 5)</Label>
                <div className="flex flex-wrap gap-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative h-24 w-24 overflow-hidden rounded-md border">
                            <Image src={url} alt="Uploaded" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    {images.length < 5 && (
                        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed hover:bg-muted/50">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Upload</span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={onImageUpload} disabled={uploading} />
                        </label>
                    )}
                </div>
                {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
            </div>

            <Button type="submit" disabled={isLoading || uploading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Listing
            </Button>
        </form>
    )
}
