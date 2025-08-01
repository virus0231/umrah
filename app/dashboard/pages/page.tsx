"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye, Trash2, Monitor, Tablet, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Page {
  id: string
  title: string
  description: string
  html: string
  css: string
  javascript: string
  createdAt: string
  updatedAt: string
}

const initialPages: Page[] = [
  {
    id: "1",
    title: "Homepage",
    description: "Main landing page for the website",
    html: `<div class="hero-section">
  <h1>Welcome to Hajj & Umrah Services</h1>
  <p>Your trusted partner for spiritual journeys</p>
  <button class="cta-button">Book Now</button>
</div>`,
    css: `.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-button {
  background: #10b981;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 20px;
}

.cta-button:hover {
  background: #059669;
}`,
    javascript: `document.addEventListener('DOMContentLoaded', function() {
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', function() {
      alert('Booking form will open here');
    });
  }
});`,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    title: "About Us",
    description: "Information about our company and services",
    html: `<div class="about-section">
  <h2>About Our Services</h2>
  <p>We have been providing exceptional Hajj and Umrah services for over 15 years.</p>
</div>`,
    css: `.about-section {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}`,
    javascript: "",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-18",
  },
]

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    html: "",
    css: "",
    javascript: "",
  })

  const handleCreatePage = () => {
    setFormData({
      title: "",
      description: "",
      html: "",
      css: "",
      javascript: "",
    })
    setSelectedPage(null)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleEditPage = (page: Page) => {
    setSelectedPage(page)
    setFormData({
      title: page.title,
      description: page.description,
      html: page.html,
      css: page.css,
      javascript: page.javascript,
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleSavePage = () => {
    if (selectedPage) {
      // Update existing page
      setPages(
        pages.map((page) =>
          page.id === selectedPage.id
            ? { ...page, ...formData, updatedAt: new Date().toISOString().split("T")[0] }
            : page,
        ),
      )
      toast({
        title: "Page Updated",
        description: "Page has been successfully updated.",
      })
    } else {
      // Create new page
      const newPage: Page = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setPages([...pages, newPage])
      toast({
        title: "Page Created",
        description: "New page has been successfully created.",
      })
    }
    setIsDialogOpen(false)
    setIsEditing(false)
  }

  const handleDeletePage = (pageId: string) => {
    setPages(pages.filter((page) => page.id !== pageId))
    toast({
      title: "Page Deleted",
      description: "Page has been successfully deleted.",
    })
  }

  const getPreviewStyles = () => {
    switch (viewMode) {
      case "tablet":
        return { width: "768px", height: "600px" }
      case "mobile":
        return { width: "375px", height: "600px" }
      default:
        return { width: "100%", height: "600px" }
    }
  }

  const renderPreview = (page: Page) => {
    const combinedCode = `
      <style>${page.css}</style>
      ${page.html}
      <script>${page.javascript}</script>
    `

    return (
      <iframe
        srcDoc={combinedCode}
        style={getPreviewStyles()}
        className="border rounded-lg bg-white"
        title={`Preview of ${page.title}`}
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Page Editor</h1>
          <p className="text-gray-600">Create and manage website pages with live preview</p>
        </div>
        <Button onClick={handleCreatePage} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Page
        </Button>
      </div>

      {!isEditing ? (
        // Pages List View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card key={page.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-lg p-4 h-32 overflow-hidden">
                    <div dangerouslySetInnerHTML={{ __html: page.html }} className="text-xs scale-75 origin-top-left" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditPage(page)} className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPage(page)
                        setIsEditing(false)
                      }}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePage(page.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">Updated: {page.updatedAt}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : selectedPage ? (
        // Page Preview View
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{selectedPage.title}</h2>
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
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Back to List
              </Button>
            </div>
          </div>

          <div className="flex justify-center">{renderPreview(selectedPage)}</div>
        </div>
      ) : null}

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPage ? "Edit Page" : "Create New Page"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor Panel */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter page title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter page description"
                  rows={2}
                />
              </div>

              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="html">
                  <Textarea
                    value={formData.html}
                    onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                    placeholder="Enter HTML code"
                    rows={15}
                    className="font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="css">
                  <Textarea
                    value={formData.css}
                    onChange={(e) => setFormData({ ...formData, css: e.target.value })}
                    placeholder="Enter CSS code"
                    rows={15}
                    className="font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="javascript">
                  <Textarea
                    value={formData.javascript}
                    onChange={(e) => setFormData({ ...formData, javascript: e.target.value })}
                    placeholder="Enter JavaScript code"
                    rows={15}
                    className="font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Live Preview Panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Live Preview</Label>
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

              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={`
                    <style>${formData.css}</style>
                    ${formData.html}
                    <script>${formData.javascript}</script>
                  `}
                  style={getPreviewStyles()}
                  className="bg-white"
                  title="Live Preview"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSavePage} className="flex-1">
              {selectedPage ? "Update Page" : "Create Page"}
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
