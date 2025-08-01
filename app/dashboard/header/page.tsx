"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical, Monitor, Tablet, Smartphone, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NavigationItem {
  id: string
  type: "link" | "dropdown"
  title: string
  url?: string
  children?: NavigationItem[]
}

interface HeaderConfig {
  logoUrl: string
  logoText: string
  navigation: NavigationItem[]
  mobileMenuStyle: "hamburger" | "drawer" | "overlay"
  contactInfo: {
    phone: string
    showPhone: boolean
  }
}

const initialHeaderConfig: HeaderConfig = {
  logoUrl: "/placeholder.svg?height=60&width=120",
  logoText: "Hajj & Umrah",
  navigation: [
    { id: "1", type: "link", title: "Home", url: "/" },
    { id: "2", type: "link", title: "About Us", url: "/about" },
    { id: "3", type: "link", title: "Services", url: "/services" },
    {
      id: "4",
      type: "dropdown",
      title: "Umrah Packages",
      children: [
        { id: "4-1", type: "link", title: "Economy Package", url: "/packages/economy" },
        { id: "4-2", type: "link", title: "Premium Package", url: "/packages/premium" },
        { id: "4-3", type: "link", title: "Executive Package", url: "/packages/executive" },
      ],
    },
    { id: "5", type: "link", title: "Contact Us", url: "/contact" },
    { id: "6", type: "link", title: "Beat My Quote", url: "/beat-quote" },
  ],
  mobileMenuStyle: "hamburger",
  contactInfo: {
    phone: "020 3944 4671",
    showPhone: true,
  },
}

export default function HeaderPage() {
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(initialHeaderConfig)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { toast } = useToast()

  const addNavigationItem = () => {
    const newItem: NavigationItem = {
      id: Date.now().toString(),
      type: "link",
      title: "New Item",
      url: "/new-page",
    }

    setHeaderConfig({
      ...headerConfig,
      navigation: [...headerConfig.navigation, newItem],
    })

    toast({
      title: "Navigation Item Added",
      description: "New navigation item has been added.",
    })
  }

  const removeNavigationItem = (itemId: string) => {
    setHeaderConfig({
      ...headerConfig,
      navigation: headerConfig.navigation.filter((item) => item.id !== itemId),
    })

    toast({
      title: "Navigation Item Removed",
      description: "Navigation item has been removed.",
    })
  }

  const updateNavigationItem = (itemId: string, updates: Partial<NavigationItem>) => {
    setHeaderConfig({
      ...headerConfig,
      navigation: headerConfig.navigation.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    })
  }

  const addDropdownChild = (parentId: string) => {
    const newChild: NavigationItem = {
      id: `${parentId}-${Date.now()}`,
      type: "link",
      title: "New Dropdown Item",
      url: "/new-dropdown-page",
    }

    setHeaderConfig({
      ...headerConfig,
      navigation: headerConfig.navigation.map((item) =>
        item.id === parentId ? { ...item, children: [...(item.children || []), newChild] } : item,
      ),
    })
  }

  const removeDropdownChild = (parentId: string, childId: string) => {
    setHeaderConfig({
      ...headerConfig,
      navigation: headerConfig.navigation.map((item) =>
        item.id === parentId ? { ...item, children: item.children?.filter((child) => child.id !== childId) } : item,
      ),
    })
  }

  const getPreviewStyles = () => {
    switch (viewMode) {
      case "tablet":
        return { maxWidth: "768px", margin: "0 auto" }
      case "mobile":
        return { maxWidth: "375px", margin: "0 auto" }
      default:
        return { maxWidth: "100%", margin: "0 auto" }
    }
  }

  const renderHeaderPreview = () => (
    <div className="bg-white shadow-md" style={getPreviewStyles()}>
      {/* Top Bar */}
      <div className="bg-gray-100 px-4 py-2 text-sm">
        <div className="flex justify-between items-center">
          <div className="text-gray-600">Call Our Travel Experts On</div>
          {headerConfig.contactInfo.showPhone && (
            <div className="font-semibold text-green-600">{headerConfig.contactInfo.phone}</div>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={headerConfig.logoUrl || "/placeholder.svg"} alt="Logo" className="h-12 w-auto" />
            <span className="text-xl font-bold text-green-600">{headerConfig.logoText}</span>
          </div>

          {/* Desktop Navigation */}
          {viewMode === "desktop" && (
            <nav className="hidden md:flex items-center space-x-6">
              {headerConfig.navigation.map((item) => (
                <div key={item.id} className="relative group">
                  {item.type === "dropdown" ? (
                    <div>
                      <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium">
                        <span>{item.title}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {item.children?.map((child) => (
                          <a
                            key={child.id}
                            href={child.url}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                          >
                            {child.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a href={item.url} className="text-gray-700 hover:text-green-600 font-medium">
                      {item.title}
                    </a>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {(viewMode === "tablet" || viewMode === "mobile") && (
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu (when open) */}
      {(viewMode === "tablet" || viewMode === "mobile") && mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            {headerConfig.navigation.map((item) => (
              <div key={item.id}>
                <a href={item.url} className="block py-2 text-gray-700 hover:text-green-600 font-medium">
                  {item.title}
                </a>
                {item.type === "dropdown" && item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <a
                        key={child.id}
                        href={child.url}
                        className="block py-1 text-sm text-gray-600 hover:text-green-600"
                      >
                        {child.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Live Preview Panel - Moved to top and full width */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Live Preview</CardTitle>
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
          </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden bg-white">{renderHeaderPreview()}</div>
        </CardContent>
      </Card>

      {/* Header Management Section */}
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Header Management</h1>
          <p className="text-gray-600">Customize your website header with logo, navigation, and mobile settings</p>
        </div>

        {/* Settings Panel */}
        <Tabs defaultValue="logo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="logo">Logo & Branding</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="logo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="logoUrl"
                      value={headerConfig.logoUrl}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, logoUrl: e.target.value })}
                      placeholder="Enter logo URL"
                    />
                    <Button variant="outline">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="logoText">Logo Text</Label>
                  <Input
                    id="logoText"
                    value={headerConfig.logoText}
                    onChange={(e) => setHeaderConfig({ ...headerConfig, logoText: e.target.value })}
                    placeholder="Enter logo text"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    value={headerConfig.contactInfo.phone}
                    onChange={(e) =>
                      setHeaderConfig({
                        ...headerConfig,
                        contactInfo: { ...headerConfig.contactInfo, phone: e.target.value },
                      })
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showPhone"
                    checked={headerConfig.contactInfo.showPhone}
                    onChange={(e) =>
                      setHeaderConfig({
                        ...headerConfig,
                        contactInfo: { ...headerConfig.contactInfo, showPhone: e.target.checked },
                      })
                    }
                  />
                  <Label htmlFor="showPhone">Show phone number in header</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Navigation Menu</CardTitle>
                  <Button onClick={addNavigationItem} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {headerConfig.navigation.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <Badge variant="outline">{item.type}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeNavigationItem(item.id)}
                        className="ml-auto text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Select
                          value={item.type}
                          onValueChange={(value: "link" | "dropdown") => updateNavigationItem(item.id, { type: value })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="dropdown">Dropdown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => updateNavigationItem(item.id, { title: e.target.value })}
                          className="h-8"
                        />
                      </div>
                    </div>

                    {item.type === "link" && (
                      <div>
                        <Label className="text-xs">URL</Label>
                        <Input
                          value={item.url || ""}
                          onChange={(e) => updateNavigationItem(item.id, { url: e.target.value })}
                          className="h-8"
                          placeholder="/page-url"
                        />
                      </div>
                    )}

                    {item.type === "dropdown" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Dropdown Items</Label>
                          <Button size="sm" variant="outline" onClick={() => addDropdownChild(item.id)}>
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>
                        {item.children?.map((child) => (
                          <div key={child.id} className="flex gap-2 pl-4">
                            <Input
                              value={child.title}
                              onChange={(e) => {
                                const updatedChildren = item.children?.map((c) =>
                                  c.id === child.id ? { ...c, title: e.target.value } : c,
                                )
                                updateNavigationItem(item.id, { children: updatedChildren })
                              }}
                              className="h-8"
                              placeholder="Dropdown title"
                            />
                            <Input
                              value={child.url || ""}
                              onChange={(e) => {
                                const updatedChildren = item.children?.map((c) =>
                                  c.id === child.id ? { ...c, url: e.target.value } : c,
                                )
                                updateNavigationItem(item.id, { children: updatedChildren })
                              }}
                              className="h-8"
                              placeholder="/url"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeDropdownChild(item.id, child.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mobile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mobile Menu Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="mobileStyle">Mobile Menu Style</Label>
                  <Select
                    value={headerConfig.mobileMenuStyle}
                    onValueChange={(value: "hamburger" | "drawer" | "overlay") =>
                      setHeaderConfig({ ...headerConfig, mobileMenuStyle: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hamburger">Hamburger Menu</SelectItem>
                      <SelectItem value="drawer">Side Drawer</SelectItem>
                      <SelectItem value="overlay">Full Screen Overlay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}\
