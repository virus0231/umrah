"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Star, Upload, X, FileText, Building, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Package {
  id: string
  title: string
  image: string
  uploadedImage?: string
  gallery: string[]
  stars: number
  nights: number
  hotels: {
    makkah: string[]
    medina: string[]
  }
  price: number
  category: string
  packageIncludes: string[]
  hotelMakkahDetails: string
  hotelMedinaDetails: string
  createdAt: string
}

const predefinedCategories = [
  "Umrah Offers 2025",
  "December Offers 2025",
  "February Offers 2026",
  "Ramadan Offers 2026",
  "Economy Package",
  "Premium Package",
  "Executive Package",
  "Ramadan Economy Package",
  "Ramadan Premium Package",
  "Ramadan Executive Package",
]

const defaultPackageIncludes = [
  "Visa",
  "Return Flights",
  "4 Nights in Makkah 5 Star Hotel",
  "3 Nights in Medina 5 Star Hotel",
  "All Packages Are Based On Quad Sharing",
  "Ground Transfers Can Be Included On Extra Cost",
  "Direct Flights Can Be Arranged On Special Request",
]

const initialPackages: Package[] = [
  {
    id: "1",
    title: "Executive Umrah Package for 07 Nights",
    image: "/placeholder.svg?height=200&width=300",
    gallery: [],
    stars: 5,
    nights: 7,
    hotels: {
      makkah: ["Hilton Makkah"],
      medina: ["Madinah Hilton"],
    },
    price: 1560,
    category: "Executive Package",
    packageIncludes: [...defaultPackageIncludes],
    hotelMakkahDetails:
      "Located in Mecca, offering modern accommodation with views of the Masjid Al Haram. Free Wi-Fi access is available throughout the entire property.",
    hotelMedinaDetails:
      "Offering luxuriously decorated rooms with a balcony, strategically located 200 m from Haram. The King Abdul Aziz historical library is a 10-minute walk away.",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Economy Umrah Package for 07 Nights",
    image: "/placeholder.svg?height=200&width=300",
    gallery: [],
    stars: 3,
    nights: 7,
    hotels: {
      makkah: ["Al Safwa Hotel"],
      medina: ["Madinah Palace"],
    },
    price: 750,
    category: "Economy Package",
    packageIncludes: [...defaultPackageIncludes],
    hotelMakkahDetails:
      "Budget-friendly accommodation with essential amenities and close proximity to Masjid Al Haram.",
    hotelMedinaDetails: "Comfortable rooms with basic facilities, walking distance to the Prophet's Mosque.",
    createdAt: "2024-01-16",
  },
]

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>(initialPackages)
  const [categories, setCategories] = useState<string[]>(predefinedCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    uploadedImage: "",
    gallery: [] as string[],
    stars: 1,
    nights: 7,
    hotels: {
      makkah: [""],
      medina: [""],
    },
    price: 0,
    category: "",
    packageIncludes: [...defaultPackageIncludes],
    hotelMakkahDetails: "",
    hotelMedinaDetails: "",
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setFormData({ ...formData, uploadedImage: imageUrl })
      toast({
        title: "Image Uploaded",
        description: "Main image has been successfully uploaded.",
      })
    }
  }

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages: string[] = []
      Array.from(files).forEach((file) => {
        const imageUrl = URL.createObjectURL(file)
        newImages.push(imageUrl)
      })
      setFormData({
        ...formData,
        gallery: [...formData.gallery, ...newImages],
      })
      toast({
        title: "Gallery Images Added",
        description: `${newImages.length} image(s) added to gallery.`,
      })
    }
  }

  const removeGalleryImage = (index: number) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index)
    setFormData({ ...formData, gallery: newGallery })
  }

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setFormData({ ...formData, category: newCategory.trim() })
      setNewCategory("")
      setShowNewCategoryInput(false)
      toast({
        title: "Category Added",
        description: "New category has been added successfully.",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPackage) {
      setPackages(packages.map((pkg) => (pkg.id === editingPackage.id ? { ...pkg, ...formData } : pkg)))
      toast({
        title: "Package Updated",
        description: "Package has been successfully updated.",
      })
    } else {
      const newPackage: Package = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setPackages([...packages, newPackage])
      toast({
        title: "Package Created",
        description: "New package has been successfully created.",
      })
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      image: "",
      uploadedImage: "",
      gallery: [],
      stars: 1,
      nights: 7,
      hotels: {
        makkah: [""],
        medina: [""],
      },
      price: 0,
      category: "",
      packageIncludes: [...defaultPackageIncludes],
      hotelMakkahDetails: "",
      hotelMedinaDetails: "",
    })
    setEditingPackage(null)
    setIsDialogOpen(false)
    setShowNewCategoryInput(false)
    setNewCategory("")
  }

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg)
    setFormData({
      title: pkg.title,
      image: pkg.image,
      uploadedImage: pkg.uploadedImage || "",
      gallery: pkg.gallery || [],
      stars: pkg.stars,
      nights: pkg.nights,
      hotels: pkg.hotels,
      price: pkg.price,
      category: pkg.category,
      packageIncludes: pkg.packageIncludes,
      hotelMakkahDetails: pkg.hotelMakkahDetails,
      hotelMedinaDetails: pkg.hotelMedinaDetails,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (packageId: string) => {
    setPackages(packages.filter((pkg) => pkg.id !== packageId))
    toast({
      title: "Package Deleted",
      description: "Package has been successfully removed.",
    })
  }

  const addHotel = (location: "makkah" | "medina") => {
    setFormData({
      ...formData,
      hotels: {
        ...formData.hotels,
        [location]: [...formData.hotels[location], ""],
      },
    })
  }

  const removeHotel = (location: "makkah" | "medina", index: number) => {
    setFormData({
      ...formData,
      hotels: {
        ...formData.hotels,
        [location]: formData.hotels[location].filter((_, i) => i !== index),
      },
    })
  }

  const updateHotel = (location: "makkah" | "medina", index: number, value: string) => {
    const newHotels = [...formData.hotels[location]]
    newHotels[index] = value
    setFormData({
      ...formData,
      hotels: {
        ...formData.hotels,
        [location]: newHotels,
      },
    })
  }

  const addPackageInclude = () => {
    setFormData({
      ...formData,
      packageIncludes: [...formData.packageIncludes, ""],
    })
  }

  const removePackageInclude = (index: number) => {
    setFormData({
      ...formData,
      packageIncludes: formData.packageIncludes.filter((_, i) => i !== index),
    })
  }

  const updatePackageInclude = (index: number, value: string) => {
    const newIncludes = [...formData.packageIncludes]
    newIncludes[index] = value
    setFormData({
      ...formData,
      packageIncludes: newIncludes,
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getDisplayImage = (pkg: Package) => {
    return pkg.uploadedImage || pkg.image || "/placeholder.svg"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packages Management</h1>
          <p className="text-gray-600">Create and manage Umrah packages with detailed information and gallery</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPackage ? "Edit Package" : "Create New Package"}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="includes">
                  <FileText className="w-4 h-4 mr-2" />
                  Package Includes
                </TabsTrigger>
                <TabsTrigger value="makkah">
                  <Building className="w-4 h-4 mr-2" />
                  Hotel In Makkah
                </TabsTrigger>
                <TabsTrigger value="medina">
                  <MapPin className="w-4 h-4 mr-2" />
                  Hotel In Medina
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label htmlFor="title">Package Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Executive Umrah Package for 07 Nights"
                      required
                    />
                  </div>

                  <div>
                    <Label>Package Category</Label>
                    <div className="space-y-2">
                      <Select
                        value={formData.category}
                        onValueChange={(value) => {
                          if (value === "add-new") {
                            setShowNewCategoryInput(true)
                          } else {
                            setFormData({ ...formData, category: value })
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="add-new">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Category
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {showNewCategoryInput && (
                        <div className="flex gap-2">
                          <Input
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Enter new category name"
                          />
                          <Button type="button" onClick={addNewCategory}>
                            Add
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setShowNewCategoryInput(false)}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Main Package Image</Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Main Image
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        {formData.uploadedImage && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Image Uploaded ✓
                          </Badge>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="imageUrl" className="text-sm text-gray-600">
                          Or enter image URL
                        </Label>
                        <Input
                          id="imageUrl"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="Enter image URL"
                          disabled={!!formData.uploadedImage}
                        />
                      </div>

                      {(formData.uploadedImage || formData.image) && (
                        <div className="mt-2">
                          <Label className="text-sm text-gray-600">Preview:</Label>
                          <div className="mt-1 border rounded-lg overflow-hidden w-32 h-24">
                            <img
                              src={formData.uploadedImage || formData.image}
                              alt="Package preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Gallery Images</Label>
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => galleryInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Gallery Images
                      </Button>
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />

                      {formData.gallery.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {formData.gallery.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                onClick={() => removeGalleryImage(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stars">Star Rating (1-5)</Label>
                      <Select
                        value={formData.stars.toString()}
                        onValueChange={(value) => setFormData({ ...formData, stars: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Star</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="nights">Number of Nights</Label>
                      <Input
                        id="nights"
                        type="number"
                        value={formData.nights}
                        onChange={(e) => setFormData({ ...formData, nights: Number.parseInt(e.target.value) })}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="price">Price (£)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="includes" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Package Includes</Label>
                    <Button type="button" variant="outline" onClick={addPackageInclude}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.packageIncludes.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => updatePackageInclude(index, e.target.value)}
                          placeholder="Package include item"
                        />
                        <Button type="button" variant="outline" onClick={() => removePackageInclude(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="makkah" className="space-y-4">
                  <div>
                    <Label>Hotel Names in Makkah</Label>
                    <div className="space-y-2">
                      {formData.hotels.makkah.map((hotel, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={hotel}
                            onChange={(e) => updateHotel("makkah", index, e.target.value)}
                            placeholder={`Makkah Hotel ${index + 1} name`}
                            required
                          />
                          {formData.hotels.makkah.length > 1 && (
                            <Button type="button" variant="outline" onClick={() => removeHotel("makkah", index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={() => addHotel("makkah")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Makkah Hotel
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hotelMakkahDetails">Hotel Details in Makkah</Label>
                    <Textarea
                      id="hotelMakkahDetails"
                      value={formData.hotelMakkahDetails}
                      onChange={(e) => setFormData({ ...formData, hotelMakkahDetails: e.target.value })}
                      placeholder="Describe the hotel facilities, location, and amenities in Makkah..."
                      rows={6}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="medina" className="space-y-4">
                  <div>
                    <Label>Hotel Names in Medina</Label>
                    <div className="space-y-2">
                      {formData.hotels.medina.map((hotel, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={hotel}
                            onChange={(e) => updateHotel("medina", index, e.target.value)}
                            placeholder={`Medina Hotel ${index + 1} name`}
                            required
                          />
                          {formData.hotels.medina.length > 1 && (
                            <Button type="button" variant="outline" onClick={() => removeHotel("medina", index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={() => addHotel("medina")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Medina Hotel
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hotelMedinaDetails">Hotel Details in Medina</Label>
                    <Textarea
                      id="hotelMedinaDetails"
                      value={formData.hotelMedinaDetails}
                      onChange={(e) => setFormData({ ...formData, hotelMedinaDetails: e.target.value })}
                      placeholder="Describe the hotel facilities, location, and amenities in Medina..."
                      rows={6}
                    />
                  </div>
                </TabsContent>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingPackage ? "Update Package" : "Create Package"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image src={getDisplayImage(pkg) || "/placeholder.svg"} alt={pkg.title} fill className="object-cover" />
              <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1">
                {renderStars(pkg.stars)}
              </div>
              {pkg.uploadedImage && (
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    Uploaded ✓
                  </Badge>
                </div>
              )}
              {pkg.gallery && pkg.gallery.length > 0 && (
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    +{pkg.gallery.length} Gallery
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="text-lg">{pkg.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{pkg.nights} Nights</span>
                <Badge variant="outline">£{pkg.price}</Badge>
              </div>
              <Badge variant="outline" className="w-fit">
                {pkg.category}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Makkah Hotels:</Label>
                <div className="text-sm text-gray-600">{pkg.hotels.makkah.join(", ")}</div>
              </div>

              <div>
                <Label className="text-sm font-medium">Medina Hotels:</Label>
                <div className="text-sm text-gray-600">{pkg.hotels.medina.join(", ")}</div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(pkg)} className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(pkg.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">Get a Quote</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
