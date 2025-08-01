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
import { Plus, Edit, Trash2, Copy, Monitor, Tablet, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Snippet {
  id: string
  title: string
  description: string
  snippetCode: string
  html: string
  css: string
  javascript: string
  createdAt: string
  updatedAt: string
}

const initialSnippets: Snippet[] = [
  {
    id: "1",
    title: "Hero Section",
    description: "Main hero section with call-to-action button",
    snippetCode: "hero_section_001",
    html: `<div class="hero-banner">
  <h1>Welcome to Hajj & Umrah Services</h1>
  <p>Your trusted partner for spiritual journeys</p>
  <button class="cta-btn">Book Your Journey</button>
</div>`,
    css: `.hero-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 80px 20px;
  border-radius: 10px;
}

.hero-banner h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.hero-banner p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-btn {
  background: #10b981;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}`,
    javascript: `document.addEventListener('DOMContentLoaded', function() {
  const ctaBtn = document.querySelector('.cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function() {
      // Add your booking logic here
      alert('Redirecting to booking page...');
    });
  }
});`,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    title: "Package Card",
    description: "Reusable package card component",
    snippetCode: "package_card_001",
    html: `<div class="package-card">
  <div class="package-image">
    <img src="/placeholder.svg?height=200&width=300" alt="Package" />
    <div class="rating">★★★★★</div>
  </div>
  <div class="package-content">
    <h3>Executive Umrah Package</h3>
    <p class="nights">7 Nights</p>
    <p class="price">£1,560</p>
    <button class="quote-btn">Get Quote</button>
  </div>
</div>`,
    css: `.package-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.package-card:hover {
  transform: translateY(-5px);
}

.package-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.package-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  padding: 5px 10px;
  border-radius: 20px;
  color: #fbbf24;
}

.package-content {
  padding: 20px;
}

.package-content h3 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.nights {
  color: #6b7280;
  margin-bottom: 10px;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 15px;
}

.quote-btn {
  width: 100%;
  background: #10b981;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.quote-btn:hover {
  background: #059669;
}`,
    javascript: `document.addEventListener('DOMContentLoaded', function() {
  const quoteBtns = document.querySelectorAll('.quote-btn');
  quoteBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Add quote logic here
      console.log('Quote requested for package');
    });
  });
});`,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-18",
  },
]

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>(initialSnippets)
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    snippetCode: "",
    html: "",
    css: "",
    javascript: "",
  })

  const generateSnippetCode = (title: string) => {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "_") +
      "_" +
      Date.now().toString().slice(-3)
    )
  }

  const handleCreateSnippet = () => {
    setFormData({
      title: "",
      description: "",
      snippetCode: "",
      html: "",
      css: "",
      javascript: "",
    })
    setSelectedSnippet(null)
    setIsDialogOpen(true)
  }

  const handleEditSnippet = (snippet: Snippet) => {
    setSelectedSnippet(snippet)
    setFormData({
      title: snippet.title,
      description: snippet.description,
      snippetCode: snippet.snippetCode,
      html: snippet.html,
      css: snippet.css,
      javascript: snippet.javascript,
    })
    setIsDialogOpen(true)
  }

  const handleSaveSnippet = () => {
    const snippetCode = formData.snippetCode || generateSnippetCode(formData.title)

    if (selectedSnippet) {
      // Update existing snippet
      setSnippets(
        snippets.map((snippet) =>
          snippet.id === selectedSnippet.id
            ? { ...snippet, ...formData, snippetCode, updatedAt: new Date().toISOString().split("T")[0] }
            : snippet,
        ),
      )
      toast({
        title: "Snippet Updated",
        description: "Snippet has been successfully updated.",
      })
    } else {
      // Create new snippet
      const newSnippet: Snippet = {
        id: Date.now().toString(),
        ...formData,
        snippetCode,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setSnippets([...snippets, newSnippet])
      toast({
        title: "Snippet Created",
        description: `New snippet created with code: ${snippetCode}`,
      })
    }
    setIsDialogOpen(false)
  }

  const handleDeleteSnippet = (snippetId: string) => {
    setSnippets(snippets.filter((snippet) => snippet.id !== snippetId))
    toast({
      title: "Snippet Deleted",
      description: "Snippet has been successfully deleted.",
    })
  }

  const copySnippetCode = (code: string) => {
    navigator.clipboard.writeText(`{{snippet:${code}}}`)
    toast({
      title: "Code Copied",
      description: `Snippet code {{snippet:${code}}} copied to clipboard`,
    })
  }

  const getPreviewStyles = () => {
    switch (viewMode) {
      case "tablet":
        return { width: "768px", height: "500px" }
      case "mobile":
        return { width: "375px", height: "500px" }
      default:
        return { width: "100%", height: "500px" }
    }
  }

  const renderPreview = (snippet: Snippet) => {
    const combinedCode = `
      <style>${snippet.css}</style>
      ${snippet.html}
      <script>${snippet.javascript}</script>
    `

    return (
      <iframe
        srcDoc={combinedCode}
        style={getPreviewStyles()}
        className="border rounded-lg bg-white"
        title={`Preview of ${snippet.title}`}
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Snippet Editor</h1>
          <p className="text-gray-600">Create and manage reusable code snippets</p>
        </div>
        <Button onClick={handleCreateSnippet} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Snippet
        </Button>
      </div>

      {/* Snippets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.map((snippet) => (
          <Card key={snippet.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{snippet.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{snippet.description}</p>
                </div>
                <Badge
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => copySnippetCode(snippet.snippetCode)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {snippet.snippetCode}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-gray-100 rounded-lg p-4 h-32 overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: snippet.html }}
                    className="text-xs scale-75 origin-top-left"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditSnippet(snippet)} className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSnippet(snippet.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500">Updated: {snippet.updatedAt}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSnippet ? "Edit Snippet" : "Create New Snippet"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor Panel */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Snippet Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter snippet title"
                  />
                </div>
                <div>
                  <Label htmlFor="snippetCode">Snippet Code</Label>
                  <Input
                    id="snippetCode"
                    value={formData.snippetCode}
                    onChange={(e) => setFormData({ ...formData, snippetCode: e.target.value })}
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter snippet description"
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
                    rows={20}
                    className="font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="css">
                  <Textarea
                    value={formData.css}
                    onChange={(e) => setFormData({ ...formData, css: e.target.value })}
                    placeholder="Enter CSS code"
                    rows={20}
                    className="font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="javascript">
                  <Textarea
                    value={formData.javascript}
                    onChange={(e) => setFormData({ ...formData, javascript: e.target.value })}
                    placeholder="Enter JavaScript code"
                    rows={20}
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

              {formData.snippetCode && (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Label className="text-sm font-medium">Usage Code:</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-sm bg-white p-2 rounded border">
                      {`{{snippet:${formData.snippetCode || generateSnippetCode(formData.title)}}}`}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copySnippetCode(formData.snippetCode || generateSnippetCode(formData.title))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSaveSnippet} className="flex-1">
              {selectedSnippet ? "Update Snippet" : "Create Snippet"}
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
