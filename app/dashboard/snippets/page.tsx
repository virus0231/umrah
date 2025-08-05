"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Copy, Monitor, Tablet, Smartphone, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Snippet {
  id: number
  title: string
  description: string
  snippetCode: string
  htmlContent: string
  cssContent: string
  javascriptContent: string
  createdAt: string
  updatedAt: string
}

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    snippetCode: "",
    htmlContent: "",
    cssContent: "",
    javascriptContent: "",
  })

  // Fetch snippets from API
  const fetchSnippets = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/snippets")
      if (!response.ok) {
        throw new Error("Failed to fetch snippets")
      }
      const data = await response.json()
      setSnippets(data)
    } catch (error) {
      console.error("Error fetching snippets:", error)
      toast({
        title: "Error",
        description: "Failed to fetch snippets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSnippets()
  }, [])

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
      htmlContent: "",
      cssContent: "",
      javascriptContent: "",
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
      htmlContent: snippet.htmlContent,
      cssContent: snippet.cssContent,
      javascriptContent: snippet.javascriptContent,
    })
    setIsDialogOpen(true)
  }

  const handleSaveSnippet = async () => {
    try {
      setSaving(true)
      const snippetCode = formData.snippetCode || generateSnippetCode(formData.title)

      const payload = {
        title: formData.title,
        description: formData.description,
        snippetCode,
        htmlContent: formData.htmlContent,
        cssContent: formData.cssContent,
        javascriptContent: formData.javascriptContent,
      }

      let response
      if (selectedSnippet) {
        // Update existing snippet
        response = await fetch(`/api/snippets/${selectedSnippet.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
      } else {
        // Create new snippet
        response = await fetch("/api/snippets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save snippet")
      }

      toast({
        title: selectedSnippet ? "Snippet Updated" : "Snippet Created",
        description: selectedSnippet
          ? "Snippet has been successfully updated."
          : `New snippet created with code: ${snippetCode}`,
      })

      setIsDialogOpen(false)
      fetchSnippets() // Refresh the list
    } catch (error) {
      console.error("Error saving snippet:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save snippet",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSnippet = async (snippetId: number) => {
    if (!confirm("Are you sure you want to delete this snippet?")) {
      return
    }

    try {
      const response = await fetch(`/api/snippets/${snippetId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete snippet")
      }

      toast({
        title: "Snippet Deleted",
        description: "Snippet has been successfully deleted.",
      })

      fetchSnippets() // Refresh the list
    } catch (error) {
      console.error("Error deleting snippet:", error)
      toast({
        title: "Error",
        description: "Failed to delete snippet",
        variant: "destructive",
      })
    }
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
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
      {snippets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No snippets found</p>
          <Button onClick={handleCreateSnippet} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Snippet
          </Button>
        </div>
      ) : (
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
                      dangerouslySetInnerHTML={{ __html: snippet.htmlContent }}
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
                  <div className="text-xs text-gray-500">
                    Updated: {new Date(snippet.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
                    required
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
                    value={formData.htmlContent}
                    onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                    placeholder="Enter HTML code"
                    rows={20}
                    className="font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="css">
                  <Textarea
                    value={formData.cssContent}
                    onChange={(e) => setFormData({ ...formData, cssContent: e.target.value })}
                    placeholder="Enter CSS code"
                    rows={20}
                    className="font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="javascript">
                  <Textarea
                    value={formData.javascriptContent}
                    onChange={(e) => setFormData({ ...formData, javascriptContent: e.target.value })}
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
                    <style>${formData.cssContent}</style>
                    ${formData.htmlContent}
                    <script>${formData.javascriptContent}</script>
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
            <Button onClick={handleSaveSnippet} className="flex-1" disabled={saving || !formData.title}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {selectedSnippet ? "Updating..." : "Creating..."}
                </>
              ) : selectedSnippet ? (
                "Update Snippet"
              ) : (
                "Create Snippet"
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
