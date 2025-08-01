"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import * as LucideIcons from "lucide-react"
import * as FaIcons from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Eye, Trash2, Search, Code, Settings } from "lucide-react"

interface FormField {
  id: string
  type: "text" | "number" | "email" | "date" | "select" | "button" | "file" | "textarea" | "checkbox" | "radio"
  label: string
  name?: string
  placeholder?: string
  required: boolean
  className?: string
  id_attr?: string
  icon?: string
  options?: string[]
  maxFileSize?: string
  events?: FormFieldEvent[]
  defaultValue?: string
}

interface FormFieldEvent {
  id: string
  trigger: "onClick" | "onChange" | "onFocus" | "onBlur" | "onSubmit"
  action: "alert" | "redirect" | "custom" | "validate" | "show" | "hide"
  value: string
  target?: string
}

interface FormSection {
  id: number
  formName: string
  fieldsConfig: {
    description: string
    fields: FormField[]
  }
  customScript: string
  createdAt: string
  updatedAt: string
}

// Helper to get all Lucide icons
const getLucideIcons = () => {
  return Object.keys(LucideIcons)
    .filter(
      (name) =>
        name !== "default" &&
        name !== "createLucideIcon" &&
        typeof LucideIcons[name as keyof typeof LucideIcons] === "function",
    )
    .map((name) => `lu-${name}`)
    .sort()
}

// Helper to get a subset of Font Awesome icons
const getFaIcons = () => {
  const faIconNames = [
    "FaUser",
    "FaEnvelope",
    "FaPhone",
    "FaCalendarAlt",
    "FaFileAlt",
    "FaCheckCircle",
    "FaTimesCircle",
    "FaInfoCircle",
    "FaQuestionCircle",
    "FaExclamationTriangle",
    "FaHome",
    "FaCog",
    "FaPlus",
    "FaEdit",
    "FaTrash",
    "FaEye",
    "FaSearch",
    "FaCode",
    "FaMapMarkerAlt",
    "FaPlane",
    "FaHotel",
    "FaMoneyBillAlt",
    "FaStar",
    "FaClipboardList",
    "FaComment",
    "FaPaperPlane",
    "FaUpload",
    "FaDownload",
    "FaLink",
    "FaLock",
    "FaUnlock",
    "FaCreditCard",
    "FaShoppingCart",
    "FaHeart",
    "FaThumbsUp",
    "FaThumbsDown",
    "FaBell",
    "FaChartBar",
    "FaChartLine",
    "FaChartPie",
    "FaTable",
    "FaList",
    "FaTh",
    "FaBars",
    "FaTimes",
    "FaArrowLeft",
    "FaArrowRight",
    "FaChevronDown",
    "FaChevronUp",
    "FaChevronLeft",
    "FaChevronRight",
    "FaFacebook",
    "FaTwitter",
    "FaInstagram",
    "FaLinkedin",
    "FaYoutube",
    "FaTiktok",
  ]
  return faIconNames.map((name) => `fa-${name}`)
}

const allIconNames = [...getLucideIcons(), ...getFaIcons()].sort()

const getIconComponent = (iconName: string) => {
  if (!iconName || iconName === "no-icon-selected") {
    return null
  }

  if (iconName.startsWith("lu-")) {
    const name = iconName.substring(3)
    return (LucideIcons as any)[name]
  } else if (iconName.startsWith("fa-")) {
    const name = iconName.substring(3)
    return (FaIcons as any)[name]
  }
  return null
}

const eventTriggers = [
  { value: "onClick", label: "On Click" },
  { value: "onChange", label: "On Change" },
  { value: "onFocus", label: "On Focus" },
  { value: "onBlur", label: "On Blur" },
  { value: "onSubmit", label: "On Submit" },
]

const eventActions = [
  { value: "alert", label: "Show Alert" },
  { value: "redirect", label: "Redirect" },
  { value: "custom", label: "Custom JavaScript" },
  { value: "validate", label: "Validation" },
  { value: "show", label: "Show Element" },
  { value: "hide", label: "Hide Element" },
]

export default function FormsPage() {
  const [forms, setForms] = useState<FormSection[]>([])
  const [selectedForm, setSelectedForm] = useState<FormSection | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewForm, setPreviewForm] = useState<FormSection | null>(null)
  const [iconSearch, setIconSearch] = useState("")
  const [activeTab, setActiveTab] = useState("basic")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fields: [] as FormField[],
    customScript: "",
  })

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await fetch("/api/forms")
      if (response.ok) {
        const data = await response.json()
        setForms(data)
      }
    } catch (error) {
      console.error("Error fetching forms:", error)
      toast({
        title: "Error",
        description: "Failed to fetch forms",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateForm = () => {
    setFormData({
      name: "",
      description: "",
      fields: [],
      customScript: "",
    })
    setSelectedForm(null)
    setActiveTab("basic")
    setIsDialogOpen(true)
  }

  const handleEditForm = (form: FormSection) => {
    setSelectedForm(form)
    setFormData({
      name: form.formName,
      description: form.fieldsConfig.description,
      fields: form.fieldsConfig.fields,
      customScript: form.customScript,
    })
    setActiveTab("basic")
    setIsDialogOpen(true)
  }

  const handleSaveForm = async () => {
    try {
      if (selectedForm) {
        const response = await fetch(`/api/forms/${selectedForm.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const updatedForm = await response.json()
          setForms(forms.map((form) => (form.id === selectedForm.id ? updatedForm : form)))
          toast({
            title: "Form Updated",
            description: "Form has been successfully updated.",
          })
        }
      } else {
        const response = await fetch("/api/forms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const newForm = await response.json()
          setForms([newForm, ...forms])
          toast({
            title: "Form Created",
            description: "New form has been successfully created.",
          })
        }
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving form:", error)
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive",
      })
    }
  }

  const handleDeleteForm = async (formId: number) => {
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setForms(forms.filter((form) => form.id !== formId))
        toast({
          title: "Form Deleted",
          description: "Form has been successfully deleted.",
        })
      }
    } catch (error) {
      console.error("Error deleting form:", error)
      toast({
        title: "Error",
        description: "Failed to delete form",
        variant: "destructive",
      })
    }
  }

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: "text",
      label: "New Field",
      name: `field_${Date.now()}`,
      placeholder: "Enter value",
      required: false,
      className: "form-control",
      id_attr: `field_${Date.now()}`,
      icon: "",
      defaultValue: "",
      events: [],
    }

    setFormData({
      ...formData,
      fields: [...formData.fields, newField],
    })
  }

  const removeField = (fieldId: string) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((field) => field.id !== fieldId),
    })
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData({
      ...formData,
      fields: formData.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)),
    })
  }

  const addFieldEvent = (fieldId: string) => {
    const newEvent: FormFieldEvent = {
      id: Date.now().toString(),
      trigger: "onClick",
      action: "alert",
      value: "Hello World!",
    }

    updateField(fieldId, {
      events: [...(formData.fields.find((f) => f.id === fieldId)?.events || []), newEvent],
    })
  }

  const removeFieldEvent = (fieldId: string, eventId: string) => {
    const field = formData.fields.find((f) => f.id === fieldId)
    if (field) {
      updateField(fieldId, {
        events: field.events?.filter((e) => e.id !== eventId) || [],
      })
    }
  }

  const updateFieldEvent = (fieldId: string, eventId: string, updates: Partial<FormFieldEvent>) => {
    const field = formData.fields.find((f) => f.id === fieldId)
    if (field) {
      updateField(fieldId, {
        events: field.events?.map((e) => (e.id === eventId ? { ...e, ...updates } : e)) || [],
      })
    }
  }

  const handlePreview = (form: FormSection) => {
    setPreviewForm(form)
    setIsPreviewOpen(true)
  }

  const renderIconComponent = (iconName: string | undefined) => {
    const IconComponent = getIconComponent(iconName || "")
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null
  }

  const filteredIcons = allIconNames.filter((icon) => icon.toLowerCase().includes(iconSearch.toLowerCase()))

  const renderFieldPreview = (field: FormField) => {
    const commonProps = {
      id: field.id_attr,
      name: field.name,
      className: `${field.className || ""} border rounded px-3 py-2 w-full`,
      placeholder: field.placeholder,
      required: field.required,
    }

    const eventHandlers: any = {}
    field.events?.forEach((event) => {
      eventHandlers[event.trigger] = (e: any) => {
        try {
          switch (event.action) {
            case "alert":
              alert(event.value)
              break
            case "redirect":
              window.open(event.value, "_blank")
              break
            case "custom":
              const func = new Function("event", event.value)
              func.call(e.target, e)
              break
            case "validate":
              const validateFunc = new Function("event", event.value)
              validateFunc.call(e.target, e)
              break
            default:
              console.log(`${event.action}: ${event.value}`)
          }
        } catch (error) {
          console.error("Event execution error:", error)
        }
      }
    })

    switch (field.type) {
      case "text":
        return <Input type="text" {...commonProps} defaultValue={field.defaultValue} {...eventHandlers} />
      case "number":
        return <Input type="number" {...commonProps} defaultValue={field.defaultValue} {...eventHandlers} />
      case "email":
        return <Input type="email" {...commonProps} defaultValue={field.defaultValue} {...eventHandlers} />
      case "date":
        return <Input type="date" {...commonProps} defaultValue={field.defaultValue} {...eventHandlers} />
      case "file":
        return <Input type="file" {...commonProps} defaultValue={field.defaultValue} {...eventHandlers} />
      case "textarea":
        return <Textarea {...commonProps} defaultValue={field.defaultValue} {...eventHandlers} rows={4} />
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={field.id_attr} name={field.name} {...eventHandlers} />
            <Label htmlFor={field.id_attr}>{field.label}</Label>
          </div>
        )
      case "select":
        return (
          <select {...commonProps} {...eventHandlers} defaultValue={field.defaultValue}>
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case "button":
        return (
          <Button
            type="button"
            className={`${field.className || ""} bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700`}
            {...eventHandlers}
          >
            {field.label}
          </Button>
        )
      default:
        return <Input {...commonProps} {...eventHandlers} />
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms Management</h1>
          <p className="text-gray-600">Create and manage dynamic forms with advanced functionality</p>
        </div>
        <Button onClick={handleCreateForm} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <Card key={form.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{form.formName}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{form.fieldsConfig.description}</p>
                </div>
                <Badge variant="outline">{form.fieldsConfig.fields.length} fields</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-500">
                  <p>Created: {new Date(form.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(form.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditForm(form)} className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePreview(form)} className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteForm(form.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Preview: {previewForm?.formName}</DialogTitle>
          </DialogHeader>
          {previewForm && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">{previewForm.formName}</h3>
                <p className="text-gray-600 mb-6">{previewForm.fieldsConfig.description}</p>
                <form className="space-y-4" id={`${previewForm.id}-form`}>
                  {previewForm.fieldsConfig.fields.map((field) => (
                    <div key={field.id}>
                      {field.type !== "checkbox" && field.type !== "button" && (
                        <div className="flex items-center gap-2 mb-2">
                          {renderIconComponent(field.icon)}
                          <Label htmlFor={field.id_attr}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                        </div>
                      )}
                      {renderFieldPreview(field)}
                      {field.type === "file" && field.maxFileSize && (
                        <p className="text-xs text-gray-500 mt-1">Maximum file size: {field.maxFileSize}</p>
                      )}
                    </div>
                  ))}
                </form>
              </div>

              {previewForm.customScript && (
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">Custom Script:</h4>
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{previewForm.customScript}</pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit/Create Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{selectedForm ? "Edit Form" : "Create New Form"}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="flex-shrink-0 border-b bg-white sticky top-0 z-10">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="fields">Form Fields</TabsTrigger>
                  <TabsTrigger value="script">Script Injection</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="basic" className="space-y-4 p-4">
                  <div>
                    <Label htmlFor="formName">Form Name</Label>
                    <Input
                      id="formName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter form name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="formDescription">Description</Label>
                    <Textarea
                      id="formDescription"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter form description"
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="fields" className="space-y-4 p-4">
                  <div className="flex items-center justify-between sticky top-0 bg-white py-2 border-b z-10">
                    <Label className="text-lg font-semibold">Form Fields</Label>
                    <Button onClick={addField} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {formData.fields.map((field) => (
                      <Card key={field.id} className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{field.type}</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeField(field.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm">Field Type</Label>
                              <Select
                                value={field.type}
                                onValueChange={(value: any) => updateField(field.id, { type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                  <SelectItem value="select">Select</SelectItem>
                                  <SelectItem value="button">Button</SelectItem>
                                  <SelectItem value="file">File</SelectItem>
                                  <SelectItem value="textarea">Textarea</SelectItem>
                                  <SelectItem value="checkbox">Checkbox</SelectItem>
                                  <SelectItem value="radio">Radio</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-sm">Icon</Label>
                              <Select
                                value={field.icon || "no-icon-selected"}
                                onValueChange={(value) =>
                                  updateField(field.id, { icon: value === "no-icon-selected" ? "" : value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select icon" />
                                </SelectTrigger>
                                <SelectContent className="p-0">
                                  <div className="relative p-2">
                                    <Search className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder="Search icons..."
                                      value={iconSearch}
                                      onChange={(e) => setIconSearch(e.target.value)}
                                      className="pl-8"
                                    />
                                  </div>
                                  <div className="max-h-64 overflow-y-auto">
                                    <SelectItem value="no-icon-selected">
                                      <div className="flex items-center gap-2">
                                        <span className="w-4 h-4" />
                                        <span>No Icon</span>
                                      </div>
                                    </SelectItem>
                                    {filteredIcons.map((iconName) => (
                                      <SelectItem key={iconName} value={iconName}>
                                        <div className="flex items-center gap-2">
                                          {renderIconComponent(iconName)}
                                          <span>{iconName}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </div>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm">Label</Label>
                              <Input
                                value={field.label}
                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                              />
                            </div>

                            <div>
                              <Label className="text-sm">Placeholder</Label>
                              <Input
                                value={field.placeholder || ""}
                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                              />
                            </div>
                          </div>

                          {field.type !== "checkbox" && field.type !== "button" && (
                            <div>
                              <Label className="text-sm">Default Value</Label>
                              {field.type === "select" ? (
                                <Select
                                  value={field.defaultValue || ""}
                                  onValueChange={(value) => updateField(field.id, { defaultValue: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select default option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((option, optIndex) => (
                                      <SelectItem key={optIndex} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={field.defaultValue || ""}
                                  onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
                                  placeholder="Enter default value"
                                />
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm">CSS Class</Label>
                              <Input
                                value={field.className || ""}
                                onChange={(e) => updateField(field.id, { className: e.target.value })}
                              />
                            </div>

                            <div>
                              <Label className="text-sm">ID Attribute</Label>
                              <Input
                                value={field.id_attr || ""}
                                onChange={(e) => updateField(field.id, { id_attr: e.target.value })}
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm">Name Attribute</Label>
                            <Input
                              value={field.name || ""}
                              onChange={(e) => updateField(field.id, { name: e.target.value })}
                              placeholder="field_name"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.required}
                              onCheckedChange={(checked) => updateField(field.id, { required: checked as boolean })}
                            />
                            <Label className="text-sm">Required field</Label>
                          </div>

                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <Label className="text-sm font-semibold">Events & Actions</Label>
                              <Button type="button" variant="outline" size="sm" onClick={() => addFieldEvent(field.id)}>
                                <Plus className="w-3 h-3 mr-1" />
                                Add Event
                              </Button>
                            </div>

                            {field.events?.map((event) => (
                              <div key={event.id} className="bg-gray-50 p-3 rounded mb-2">
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                  <div>
                                    <Label className="text-xs">Trigger</Label>
                                    <Select
                                      value={event.trigger}
                                      onValueChange={(value: any) =>
                                        updateFieldEvent(field.id, event.id, { trigger: value })
                                      }
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {eventTriggers.map((trigger) => (
                                          <SelectItem key={trigger.value} value={trigger.value}>
                                            {trigger.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label className="text-xs">Action</Label>
                                    <Select
                                      value={event.action}
                                      onValueChange={(value: any) =>
                                        updateFieldEvent(field.id, event.id, { action: value })
                                      }
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {eventActions.map((action) => (
                                          <SelectItem key={action.value} value={action.value}>
                                            {action.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="flex items-end">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeFieldEvent(field.id, event.id)}
                                      className="text-red-600 h-8"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-xs">Value/Code</Label>
                                  <Textarea
                                    value={event.value}
                                    onChange={(e) => updateFieldEvent(field.id, event.id, { value: e.target.value })}
                                    placeholder={
                                      event.action === "alert"
                                        ? "Alert message"
                                        : event.action === "redirect"
                                          ? "URL to redirect"
                                          : event.action === "custom"
                                            ? "JavaScript code"
                                            : event.action === "validate"
                                              ? "Validation code"
                                              : "Value or code"
                                    }
                                    rows={2}
                                    className="font-mono text-sm"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="script" className="space-y-4 p-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4" />
                      <Label className="text-lg font-semibold">Custom Script Injection</Label>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Add custom JavaScript that will be executed when the form loads. This script will be injected into
                      the page.
                    </p>

                    <Textarea
                      value={formData.customScript}
                      onChange={(e) => setFormData({ ...formData, customScript: e.target.value })}
                      placeholder={`// Example custom script
document.addEventListener('DOMContentLoaded', function() {
// Your custom form logic here
console.log('Form loaded');

// Example: Add custom validation
const form = document.querySelector('#your-form');
if (form) {
  form.addEventListener('submit', function(e) {
    // Custom submission logic
  });
}
});
`}
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Settings className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Script Injection Guidelines</h4>
                        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                          <li>Scripts are executed after the DOM is loaded</li>
                          <li>Use proper error handling in your custom code</li>
                          <li>Access form elements using their ID attributes</li>
                          <li>Test thoroughly before deploying to production</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="flex-shrink-0 border-t bg-white p-4">
            <div className="flex gap-2">
              <Button onClick={handleSaveForm} className="flex-1">
                {selectedForm ? "Update Form" : "Create Form"}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
