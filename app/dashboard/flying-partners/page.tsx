"use client"

import { useState, useEffect, useRef } from "react"
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
  id?: number
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

const defaultConfig: FlyingPartnersConfig = {
  title: "Our Flying partners",
  images: [],
  displaySettings: {
    desktop: 4,
    tablet: 3,
    mobile: 2,
    autoplay: true,
    speed: 3000,
  },
}

export default function FlyingPartnersPage() {
  const [config, setConfig] = useState<FlyingPartnersConfig>(defaultConfig)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set())
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const { toast } = useToast()

  // Load configuration from database
  useEffect(() => {
  loadConfig()
}, [])

const loadConfig = async () => {
  try {
    setLoading(true)
    console.log("Loading flying partners config...")

    const response = await fetch("/api/flying-partners", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("Response status:", response.status)

    if (response.ok) {
      const data = await response.json()
      console.log("Loaded data:", data)

      // Parse the JSON strings into objects
      const parsedImages = JSON.parse(data.images)
      const parsedDisplaySettings = JSON.parse(data.displaySettings)

      const loadedConfig: FlyingPartnersConfig = {
        id: data.id,
        title: data.title || defaultConfig.title,
        images: Array.isArray(parsedImages) ? parsedImages : defaultConfig.images,
        displaySettings: {
          desktop: parsedDisplaySettings?.desktop ?? defaultConfig.displaySettings.desktop,
          tablet: parsedDisplaySettings?.tablet ?? defaultConfig.displaySettings.tablet,
          mobile: parsedDisplaySettings?.mobile ?? defaultConfig.displaySettings.mobile,
          autoplay: parsedDisplaySettings?.autoplay ?? defaultConfig.displaySettings.autoplay,
          speed: parsedDisplaySettings?.speed ?? defaultConfig.displaySettings.speed,
        },
      }

      setConfig(loadedConfig)
      console.log("Config set:", loadedConfig)
    } else {
      const errorData = await response.json()
      console.error("API Error:", errorData)
      throw new Error(errorData.error || "Failed to load configuration")
    }
  } catch (error) {
    console.error("Error loading config:", error)
    toast({
      title: "Error",
      description: "Failed to load flying partners configuration. Using default settings.",
      variant: "destructive",
    })
    setConfig(defaultConfig)
  } finally {
    setLoading(false)
  }
}

const saveUpdatedTitle = async (title: string) => {
  if (!title) return;
  setSaving(true);

  try {
    const updatedConfig = { ...config, title };
    await saveConfig(updatedConfig);
    toast({
      title: "Success",
      description: "Section title updated successfully",
    });
  } catch (error) {
    console.error("Error updating section title:", error);
    toast({
      title: "Error",
      description: "Failed to update section title",
      variant: "destructive",
    });
  } finally {
    setSaving(false);
  }
};


  const saveConfig = async (updatedConfig: FlyingPartnersConfig) => {
    try {
      setSaving(true)
      console.log("Saving config:", updatedConfig)

      const response = await fetch("/api/flying-partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedConfig),
      })

      if (response.ok) {
        const savedConfig = await response.json()
        console.log("Saved config:", savedConfig)

        // Ensure saved config has proper structure
        const normalizedConfig: FlyingPartnersConfig = {
          id: savedConfig.id,
          title: savedConfig.title || defaultConfig.title,
          images: Array.isArray(savedConfig.images) ? savedConfig.images : defaultConfig.images,
          displaySettings: {
            desktop: savedConfig.displaySettings?.desktop ?? defaultConfig.displaySettings.desktop,
            tablet: savedConfig.displaySettings?.tablet ?? defaultConfig.displaySettings.tablet,
            mobile: savedConfig.displaySettings?.mobile ?? defaultConfig.displaySettings.mobile,
            autoplay: savedConfig.displaySettings?.autoplay ?? defaultConfig.displaySettings.autoplay,
            speed: savedConfig.displaySettings?.speed ?? defaultConfig.displaySettings.speed,
          },
        }
        setConfig(normalizedConfig)
        toast({
          title: "Success",
          description: "Configuration saved successfully",
        })
      } else {
        const errorData = await response.json()
        console.error("Save error:", errorData)
        throw new Error(errorData.error || "Failed to save configuration")
      }
    } catch (error) {
      console.error("Error saving config:", error)
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Upload failed")
    }

    const result = await response.json()
    return result.url
  }

  const handleImageUpload = async (imageId: string, file: File) => {
    try {
      setUploadingImages((prev) => new Set(prev).add(imageId))

      const imageUrl = await uploadImage(file)

      const updatedConfig = {
        ...config,
        images: config.images.map((img) => (img.id === imageId ? { ...img, url: imageUrl } : img)),
      }

      setConfig(updatedConfig)
      await saveConfig(updatedConfig)

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImages((prev) => {
        const newSet = new Set(prev)
        newSet.delete(imageId)
        return newSet
      })
    }
  }

  const addImage = async () => {
    const newImage: PartnerImage = {
      id: Date.now().toString(),
      name: "New Partner",
      url: "/placeholder.svg?height=80&width=120&text=New+Partner",
      alt: "New Partner",
    }

    const updatedConfig = {
      ...config,
      images: [...config.images, newImage],
    }

    setConfig(updatedConfig)
    await saveConfig(updatedConfig)

    toast({
      title: "Partner Added",
      description: "New flying partner has been added.",
    })
  }

  const removeImage = async (imageId: string) => {
    const updatedConfig = {
      ...config,
      images: config.images.filter((img) => img.id !== imageId),
    }

    setConfig(updatedConfig)
    await saveConfig(updatedConfig)

    toast({
      title: "Partner Removed",
      description: "Flying partner has been removed.",
    })
  }

  const updateImage = async (imageId: string, updates: Partial<PartnerImage>) => {
    const updatedConfig = {
      ...config,
      images: config.images.map((img) => (img.id === imageId ? { ...img, ...updates } : img)),
    }

    setConfig(updatedConfig)
    await saveConfig(updatedConfig)
  }

  const updateDisplaySettings = async (updates: Partial<typeof config.displaySettings>) => {
    const updatedConfig = {
      ...config,
      displaySettings: { ...config.displaySettings, ...updates },
    }

    setConfig(updatedConfig)
    await saveConfig(updatedConfig)
  }

  const updateTitle = async (title: string) => {
    const updatedConfig = { ...config, title }
    setConfig(updatedConfig)
    // await saveConfig(updatedConfig)
  }

  const getVisibleImages = () => {
    if (!config.images || config.images.length === 0) return []

    const itemsPerView = config.displaySettings[viewMode] || 1
    const totalSlides = Math.ceil(config.images.length / itemsPerView)
    const startIndex = (currentSlide % totalSlides) * itemsPerView
    return config.images.slice(startIndex, startIndex + itemsPerView)
  }

  const nextSlide = () => {
    if (!config.images || config.images.length === 0) return

    const itemsPerView = config.displaySettings[viewMode] || 1
    const totalSlides = Math.ceil(config.images.length / itemsPerView)
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    if (!config.images || config.images.length === 0) return

    const itemsPerView = config.displaySettings[viewMode] || 1
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
              {visibleImages.length > 0 ? (
                visibleImages.map((image) => (
                  <div
                    key={image.id}
                    className="flex-shrink-0 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border"
                    style={{
                      width: `${100 / (config.displaySettings[viewMode] || 1)}%`,
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No partners to display. Add some partners to see the preview.</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          {config.images && config.images.length > (config.displaySettings[viewMode] || 1) && (
            <>
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
                {Array.from({ length: Math.ceil(config.images.length / (config.displaySettings[viewMode] || 1)) }).map(
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index ===
                        currentSlide % Math.ceil(config.images.length / (config.displaySettings[viewMode] || 1))
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    />
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading flying partners configuration...</p>
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
                  value={config.title || ""}
                  onChange={(e) => updateTitle(e.target.value)}
                  placeholder="Enter section title"
                  disabled={saving}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="default"
                  onClick={() => saveUpdatedTitle(config.title)}
                  disabled={saving}
                >
                  Update
                </Button>
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
                    value={(config.displaySettings?.desktop || defaultConfig.displaySettings.desktop).toString()}
                    onValueChange={(value) => updateDisplaySettings({ desktop: Number.parseInt(value) })}
                    disabled={saving}
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
                    value={(config.displaySettings?.tablet || defaultConfig.displaySettings.tablet).toString()}
                    onValueChange={(value) => updateDisplaySettings({ tablet: Number.parseInt(value) })}
                    disabled={saving}
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
                    value={(config.displaySettings?.mobile || defaultConfig.displaySettings.mobile).toString()}
                    onValueChange={(value) => updateDisplaySettings({ mobile: Number.parseInt(value) })}
                    disabled={saving}
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
                  checked={config.displaySettings?.autoplay ?? defaultConfig.displaySettings.autoplay}
                  onChange={(e) => updateDisplaySettings({ autoplay: e.target.checked })}
                  disabled={saving}
                />
                <Label htmlFor="autoplay">Enable autoplay</Label>
              </div>

              {(config.displaySettings?.autoplay ?? defaultConfig.displaySettings.autoplay) && (
                <div>
                  <Label htmlFor="speed">Autoplay Speed (ms)</Label>
                  <Input
                    id="speed"
                    type="number"
                    value={config.displaySettings?.speed || defaultConfig.displaySettings.speed}
                    onChange={(e) => updateDisplaySettings({ speed: Number.parseInt(e.target.value) })}
                    min="1000"
                    max="10000"
                    step="500"
                    disabled={saving}
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
                <Button onClick={addImage} size="sm" disabled={saving}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.images && config.images.length > 0 ? (
                config.images.map((image) => (
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        className="text-red-600"
                        disabled={saving}
                      >
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
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Alt Text</Label>
                        <Input
                          value={image.alt}
                          onChange={(e) => updateImage(image.id, { alt: e.target.value })}
                          className="h-8"
                          placeholder="Alt text"
                          disabled={saving}
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
                          disabled={saving}
                        />
                        <input
                          type="file"
                          ref={(el) => (fileInputRefs.current[image.id] = el)}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageUpload(image.id, file)
                            }
                          }}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRefs.current[image.id]?.click()}
                          disabled={uploadingImages.has(image.id) || saving}
                        >
                          {uploadingImages.has(image.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No partners added yet. Click "Add Partner" to get started.</p>
                </div>
              )}
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

      {saving && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Saving changes...</span>
          </div>
        </div>
      )}
    </div>
  )
}
