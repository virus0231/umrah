
"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Eye, Trash2, Search, Code, Settings, X, Check, AlertTriangle } from "lucide-react"

// Mock toast hook since we don't have access to the actual one
const useToast = () => ({
  toast: ({ title, description, variant }: any) => {
    const toastType = variant === "destructive" ? "error" : "success"
    console.log(`${toastType.toUpperCase()}: ${title} - ${description}`)
    // You could replace this with a proper toast notification
    alert(`${title}: ${description}`)
  }
})

// Simple UI Components (since we can't import the full shadcn/ui library)
const Button = ({ children, onClick, variant = "default", size = "default", className = "", disabled = false, type = "button", ...props }: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-background hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  }
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8"
  }
  
  return (
    <button 
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "", ...props }: any) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "", ...props }: any) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "", ...props }: any) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "", ...props }: any) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const Badge = ({ children, variant = "default", className = "", ...props }: any) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    outline: "border border-gray-300 text-foreground"
  }
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}

const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children, className = "", ...props }: any) => (
  <div className={`flex flex-col ${className}`} {...props}>
    {children}
  </div>
)

const DialogHeader = ({ children, className = "", ...props }: any) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 ${className}`} {...props}>
    {children}
  </div>
)

const DialogTitle = ({ children, className = "", ...props }: any) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h2>
)

const Input = ({ className = "", ...props }: any) => (
  <input 
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Label = ({ children, className = "", ...props }: any) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
    {children}
  </label>
)

const Textarea = ({ className = "", ...props }: any) => (
  <textarea 
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Checkbox = ({ checked, onCheckedChange, className = "", ...props }: any) => (
  <input 
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    className={`h-4 w-4 rounded border border-gray-300 ${className}`}
    {...props}
  />
)

const Select = ({ value, onValueChange, children, className = "", ...props }: any) => (
  <select 
    value={value}
    onChange={(e) => onValueChange?.(e.target.value)}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </select>
)

const SelectItem = ({ value, children, ...props }: any) => (
  <option value={value} {...props}>
    {children}
  </option>
)

const Tabs = ({ value, onValueChange, children, className = "", ...props }: any) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
)

const TabsList = ({ children, className = "", ...props }: any) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`} {...props}>
    {children}
  </div>
)

const TabsTrigger = ({ value, children, className = "", onClick, ...props }: any) => (
  <button 
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
)

const TabsContent = ({ value, children, className = "", ...props }: any) => (
  <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`} {...props}>
    {children}
  </div>
)

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
  description: string
  fieldsConfig?: {
    fields: FormField[]
  }
  customScript?: string
  createdAt: string
  updatedAt: string
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
  const [activeTab, setActiveTab] = useState("basic")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
      setLoading(true)
      const response = await fetch("/api/forms")
      if (response.ok) {
        const data = await response.json()
        console.log("Fetched forms:", data) 
        setForms(data)
      } else {
        throw new Error('Failed to fetch forms')
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
    let parsedFieldsConfig = { fields: [] }

    try {
      parsedFieldsConfig = JSON.parse(form.fieldsConfig)
    } catch (error) {
      console.error("Failed to parse fieldsConfig:", error)
    }

    setSelectedForm(form)
    setFormData({
      name: form.formName,
      description: form.description,
      fields: parsedFieldsConfig.fields || [],
      customScript: form.customScript || "",
    })
    setActiveTab("basic")
    setIsDialogOpen(true)
  }


  const handleSaveForm = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Form name is required",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
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
        } else {
          throw new Error('Failed to update form')
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
        } else {
          throw new Error('Failed to create form')
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
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteForm = async (formId: number) => {
    if (!confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      return
    }

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
      } else {
        throw new Error('Failed to delete form')
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
    let parsedFieldsConfig = { fields: [] }

    try {
      parsedFieldsConfig = JSON.parse(form.fieldsConfig)
    } catch (error) {
      console.error("Failed to parse fieldsConfig:", error)
    }

    setPreviewForm({
      ...form,
      fieldsConfig: parsedFieldsConfig
    })

    setIsPreviewOpen(true)
  }


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
        return <Input type="file" {...commonProps} {...eventHandlers} />
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
                  <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                </div>
                <Badge variant="outline">
                  {(() => {
                    let count = 0
                    try {
                      const parsed = JSON.parse(form.fieldsConfig)
                      count = parsed.fields?.length || 0
                    } catch {
                      count = 0
                    }
                    return `${count} fields`
                  })()}
              </Badge>

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
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {forms.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Settings className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first form</p>
          <Button onClick={handleCreateForm}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Form
          </Button>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Form Preview: {previewForm?.formName}</DialogTitle>
              <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          {previewForm && (
            <div className="space-y-6 p-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">{previewForm.formName}</h3>
                <p className="text-gray-600 mb-6">{previewForm.description}</p>
                <form className="space-y-4" id={`${previewForm.id}-form`}>
                  {(previewForm.fieldsConfig?.fields || []).map((field) => (
                    <div key={field.id}>
                      {field.type !== "checkbox" && field.type !== "button" && (
                        <div className="flex items-center gap-2 mb-2">
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
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedForm ? "Edit Form" : "Create New Form"}</DialogTitle>
              <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="flex-shrink-0 border-b bg-white sticky top-0 z-10 p-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger 
                    value="basic" 
                    onClick={() => setActiveTab("basic")}
                    className={activeTab === "basic" ? "bg-blue-100 text-blue-700" : ""}
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="fields" 
                    onClick={() => setActiveTab("fields")}
                    className={activeTab === "fields" ? "bg-blue-100 text-blue-700" : ""}
                  >
                    Form Fields ({formData.fields.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="script" 
                    onClick={() => setActiveTab("script")}
                    className={activeTab === "script" ? "bg-blue-100 text-blue-700" : ""}
                  >
                    Script Injection
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === "basic" && (
                  <TabsContent value="basic" className="space-y-4 p-4">
                    <div>
                      <Label htmlFor="formName">Form Name *</Label>
                      <Input
                        id="formName"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter form name"
                        className="mt-1"
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
                        className="mt-1"
                      />
                    </div>
                  </TabsContent>
                )}

                {activeTab === "fields" && (
                  <TabsContent value="fields" className="space-y-4 p-4">
                    <div className="flex items-center justify-between sticky top-0 bg-white py-2 border-b z-10">
                      <Label className="text-lg font-semibold">Form Fields</Label>
                      <Button onClick={addField} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Field
                      </Button>
                    </div>

                    {formData.fields.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No fields added yet. Click "Add Field" to get started.</p>
                      </div>
                    )}

                    <div className="space-y-6">
                      {formData.fields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{field.type}</Badge>
                                <span className="text-sm text-gray-500">Field #{index + 1}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeField(field.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm">Field Type</Label>
                                <Select
                                  value={field.type}
                                  onValueChange={(value) => updateField(field.id, { type: value as any })}
                                  className="mt-1"
                                >
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
                                </Select>
                              </div>

                              <div>
                                <Label className="text-sm">Label</Label>
                                <Input
                                  value={field.label}
                                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm">Name Attribute</Label>
                                <Input
                                  value={field.name || ""}
                                  onChange={(e) => updateField(field.id, { name: e.target.value })}
                                  placeholder="field_name"
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label className="text-sm">Placeholder</Label>
                                <Input
                                  value={field.placeholder || ""}
                                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            {field.type === "select" && (
                              <div className="space-y-2">
                                <Label className="text-sm">Options</Label>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Type and press Enter"
                                    value={field.newOption || ""}
                                    onChange={(e) => updateField(field.id, { newOption: e.target.value })}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && field.newOption?.trim()) {
                                        e.preventDefault()
                                        const updatedOptions = [...(field.options || []), field.newOption.trim()]
                                        updateField(field.id, { options: updatedOptions, newOption: "" })
                                      }
                                    }}
                                  />
                                </div>

                                {field.options && field.options.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {field.options.map((opt, index) => (
                                      <div
                                        key={index}
                                        className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                                      >
                                        {opt}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            updateField(field.id, {
                                              options: field.options!.filter((_, i) => i !== index),
                                            })
                                          }
                                          className="text-red-500 text-xs hover:text-red-700"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}



                            {field.type !== "checkbox" && field.type !== "button" && (
                              <div>
                                <Label className="text-sm">Default Value</Label>
                                {field.type === "select" ? (
                                  <Select
                                    value={field.defaultValue || ""}
                                    onValueChange={(value) =>
                                      updateField(field.id, { defaultValue: value })
                                    }
                                    className="mt-1"
                                  >
                                    <SelectItem value="">No default</SelectItem>
                                    {field.options?.map((option, optIndex) => (
                                      <SelectItem key={optIndex} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </Select>
                                ) : (
                                  <Input
                                    value={field.defaultValue || ""}
                                    onChange={(e) =>
                                      updateField(field.id, { defaultValue: e.target.value })
                                    }
                                    placeholder="Enter default value"
                                    className="mt-1"
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
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label className="text-sm">ID Attribute</Label>
                                <Input
                                  value={field.id_attr || ""}
                                  onChange={(e) => updateField(field.id, { id_attr: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.required}
                                onCheckedChange={(checked) => updateField(field.id, { required: checked as boolean })}
                              />
                              <Label className="text-sm">Required field</Label>
                            </div>

                            {field.type === "file" && (
                              <div>
                                <Label className="text-sm">Max File Size</Label>
                                <Input
                                  value={field.maxFileSize || ""}
                                  onChange={(e) => updateField(field.id, { maxFileSize: e.target.value })}
                                  placeholder="e.g., 5MB"
                                  className="mt-1"
                                />
                              </div>
                            )}

                            <div className="border-t pt-4">
                              <div className="flex items-center justify-between mb-3">
                                <Label className="text-sm font-semibold">Events & Actions</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => addFieldEvent(field.id)}>
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add Event
                                </Button>
                              </div>

                              {field.events?.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No events configured</p>
                              )}

                              {field.events?.map((event) => (
                                <div key={event.id} className="bg-gray-50 p-3 rounded mb-2">
                                  <div className="grid grid-cols-3 gap-2 mb-2">
                                    <div>
                                      <Label className="text-xs">Trigger</Label>
                                      <Select
                                        value={event.trigger}
                                        onValueChange={(value) =>
                                          updateFieldEvent(field.id, event.id, { trigger: value as any })
                                        }
                                        className="h-8 mt-1"
                                      >
                                        {eventTriggers.map((trigger) => (
                                          <SelectItem key={trigger.value} value={trigger.value}>
                                            {trigger.label}
                                          </SelectItem>
                                        ))}
                                      </Select>
                                    </div>

                                    <div>
                                      <Label className="text-xs">Action</Label>
                                      <Select
                                        value={event.action}
                                        onValueChange={(value) =>
                                          updateFieldEvent(field.id, event.id, { action: value as any })
                                        }
                                        className="h-8 mt-1"
                                      >
                                        {eventActions.map((action) => (
                                          <SelectItem key={action.value} value={action.value}>
                                            {action.label}
                                          </SelectItem>
                                        ))}
                                      </Select>
                                    </div>

                                    <div className="flex items-end">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeFieldEvent(field.id, event.id)}
                                        className="text-red-600 h-8 mt-1"
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
                                      className="font-mono text-sm mt-1"
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
                )}

                {activeTab === "script" && (
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
});`}
                        rows={15}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">Script Injection Guidelines</h4>
                          <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                            <li>• Scripts are executed after the DOM is loaded</li>
                            <li>• Use proper error handling in your custom code</li>
                            <li>• Access form elements using their ID attributes</li>
                            <li>• Test thoroughly before deploying to production</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>

          <div className="flex-shrink-0 border-t bg-white p-4">
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveForm} 
                className="flex-1" 
                disabled={saving || !formData.name.trim()}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {selectedForm ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {selectedForm ? "Update Form" : "Create Form"}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}