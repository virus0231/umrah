"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Upload, Monitor, Tablet, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface PartnerImage {
  id: string
  name: string
  url: string
  alt: string
}

interface FlyingPartnersConfig {
  title: string
  images: PartnerImage[]
  displaySettings: {
    desktop: number
    tablet: number
    mobile: number
    autoplay: boolean
    speed: number
  }
}

const initialConfig: FlyingPartnersConfig = {
  title: "Our Flying partners",
  images: [
    {
      id: "1",
      name: "Pegasus Airlines",
      url: "/placeholder.svg?height=80&width=120&text=Pegasus",
      alt: "Pegasus Airlines",
    },
    {
      id: "2",
      name: "Saudia",
      url: "/placeholder.svg?height=80&width=120&text=Saudia",
      alt: "Saudia Airlines",
    },
    {
      id: "3",
      name: "Gulf Air",
      url: "/placeholder.svg?height=80&width=120&text=Gulf+Air",
      alt: "Gulf Air",
    },
    {
      id: "4",
      name: "EgyptAir",
      url: "/placeholder.svg?height=80&width=120&text=EgyptAir",
      alt: "EgyptAir",
    },
    {
      id: "5",
      name: "Turkish Airlines",
      url: "/placeholder.svg?height=80&width=120&text=Turkish",
      alt: "Turkish Airlines",
    },
    {
      id: "6",
      name: "Emirates",
      url: "/placeholder.svg?height=80&width=120&text=Emirates",
      alt: "Emirates Airlines",
    },
  ],
  displaySettings: {
    desktop: 4,
    tablet: 3,
    mobile: 2,
    autoplay: true,
    speed: 3000,
  },
}

export default function FlyingPartnersPage() {
  const [config, setConfig] = useState<FlyingPartnersConfig>(initialConfig)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [currentSlide, setCurrentSlide] = useState(0)
  const { toast } = useToast()

  const addImage = () => {
    const newImage: PartnerImage = {
      id: Date.now().toString(),
      name: "New Partner",
      url: "/placeholder.svg?height=80&width=120&text=New+Partner",
      alt: "New Partner",
    }

    setConfig({
      ...config,
      images: [...config.images, newImage],
    })

    toast({
      title: "Partner Added",
      description: "New flying partner has been added.",
    })
  }

  const removeImage = (imageId: string) => {
    setConfig({
      ...config,
      images: config.images.filter((img) => img.id !== imageId),
    })

    toast({
      title: "Partner Removed",
      description: "Flying partner has been removed.",
    })
  }

  const updateImage = (imageId: string, updates: Partial<PartnerImage>) => {
    setConfig({
      ...config,
      images: config.images.map((img) => (img.id === imageId ? { ...img, ...updates } : img)),
    })
  }

  const updateDisplaySettings = (updates: Partial<typeof config.displaySettings>) => {
    setConfig({
      ...config,
      displaySettings: { ...config.displaySettings, ...updates },
    })
  }

  const getVisibleImages = () => {
    const itemsPerView = config.displaySettings[viewMode]
    const totalSlides = Math.ceil(config.images.length / itemsPerView)
    const startIndex = (currentSlide % totalSlides) * itemsPerView
    return config.images.slice(startIndex, startIndex + itemsPerView)
  }

  const nextSlide = () => {
    const itemsPerView = config.displaySettings[viewMode]
    const totalSlides = Math.ceil(config.images.length / itemsPerView)
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    const itemsPerView = config.displaySettings[viewMode]
    const totalSlides = Math.ceil(config.images.length / itemsPerView)
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getPreviewStyles = () => {
    switch (viewMode) {
      case "tablet":
        return { maxWidth: "768px" }
      case "mobile":
        return { maxWidth: "375px" }
      default:
        return { maxWidth: "100%" }
    }
  }

  const renderSliderPreview = () => {
    const visibleImages = getVisibleImages()

    return (
      <div className="bg-white py-12" style={getPreviewStyles()}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 mb-4">{config.title}</h2>
        </div>

        <div className="relative px-8">
          {/* Slider Container */}
          <div className="overflow-hidden">
            <div className="flex items-center justify-center gap-8">
              {visibleImages.map((image) => (
                <div
                  key={image.id}
                  className="flex-shrink-0 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border"
                  style={{
                    width: `${100 / config.displaySettings[viewMode]}%`,
                    minWidth: "120px",
                  }}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    width={120}
                    height={80}
                    className="max-w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(config.images.length / config.displaySettings[viewMode]) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide % Math.ceil(config.images.length / config.displaySettings[viewMode])
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
              ),
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flying Partners Management</h1>
          <p className="text-gray-600">Manage airline partner logos and slider settings</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("desktop")}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("tablet")}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("mobile")}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Title Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Section Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sectionTitle">Section Title</Label>
                <Input
                  id="sectionTitle"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Enter section title"
                />
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="desktopCount">Desktop View</Label>
                  <Select
                    value={config.displaySettings.desktop.toString()}
                    onValueChange={(value) => updateDisplaySettings({ desktop: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 items</SelectItem>
                      <SelectItem value="3">3 items</SelectItem>
                      <SelectItem value="4">4 items</SelectItem>
                      <SelectItem value="5">5 items</SelectItem>
                      <SelectItem value="6">6 items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tabletCount">Tablet View</Label>
                  <Select
                    value={config.displaySettings.tablet.toString()}
                    onValueChange={(value) => updateDisplaySettings({ tablet: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 items</SelectItem>
                      <SelectItem value="3">3 items</SelectItem>
                      <SelectItem value="4">4 items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mobileCount">Mobile View</Label>
                  <Select
                    value={config.displaySettings.mobile.toString()}
                    onValueChange={(value) => updateDisplaySettings({ mobile: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 item</SelectItem>
                      <SelectItem value="2">2 items</SelectItem>
                      <SelectItem value="3">3 items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoplay"
                  checked={config.displaySettings.autoplay}
                  onChange={(e) => updateDisplaySettings({ autoplay: e.target.checked })}
                />
                <Label htmlFor="autoplay">Enable autoplay</Label>
              </div>

              {config.displaySettings.autoplay && (
                <div>
                  <Label htmlFor="speed">Autoplay Speed (ms)</Label>
                  <Input
                    id="speed"
                    type="number"
                    value={config.displaySettings.speed}
                    onChange={(e) => updateDisplaySettings({ speed: Number.parseInt(e.target.value) })}
                    min="1000"
                    max="10000"
                    step="500"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Partner Images */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Partner Images</CardTitle>
                <Button onClick={addImage} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.images.map((image) => (
                <div key={image.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.alt}
                        width={60}
                        height={40}
                        className="object-contain border rounded"
                      />
                      <div>
                        <p className="font-medium">{image.name}</p>
                        <p className="text-xs text-gray-500">{image.alt}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeImage(image.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Partner Name</Label>
                      <Input
                        value={image.name}
                        onChange={(e) => updateImage(image.id, { name: e.target.value })}
                        className="h-8"
                        placeholder="Partner name"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Alt Text</Label>
                      <Input
                        value={image.alt}
                        onChange={(e) => updateImage(image.id, { alt: e.target.value })}
                        className="h-8"
                        placeholder="Alt text"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={image.url}
                        onChange={(e) => updateImage(image.id, { url: e.target.value })}
                        className="h-8"
                        placeholder="Enter image URL"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-gray-50">{renderSliderPreview()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
