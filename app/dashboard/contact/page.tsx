"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, MapPin, Phone, Mail, Monitor, Tablet, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContactInfo {
  address: string
  phone: string
  emails: string[]
  activeEmail: string
  mapLocation: string
}

interface FormField {
  id: string
  type: "text" | "email" | "tel" | "textarea"
  label: string
  placeholder: string
  required: boolean
}

const initialContactInfo: ContactInfo = {
  address: "84 Kingsley Road, Hounslow, Middlesex, London TW3 1QA",
  phone: "020 3944 4671",
  emails: ["info@hajiandumrah.co.uk", "sales@hajiandumrah.co.uk", "support@hajiandumrah.co.uk"],
  activeEmail: "info@hajiandumrah.co.uk",
  mapLocation: "84 Kingsley Road, Hounslow, Middlesex, London TW3 1QA",
}

const initialFormFields: FormField[] = [
  {
    id: "1",
    type: "text",
    label: "First Name",
    placeholder: "First Name",
    required: true,
  },
  {
    id: "2",
    type: "text",
    label: "Last Name",
    placeholder: "Last Name",
    required: true,
  },
  {
    id: "3",
    type: "tel",
    label: "Phone Number",
    placeholder: "Phone Number",
    required: true,
  },
  {
    id: "4",
    type: "email",
    label: "Email",
    placeholder: "Email",
    required: true,
  },
  {
    id: "5",
    type: "textarea",
    label: "Message",
    placeholder: "Message",
    required: true,
  },
]

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo)
  const [formFields, setFormFields] = useState<FormField[]>(initialFormFields)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [newEmail, setNewEmail] = useState("")
  const { toast } = useToast()

  const addEmail = () => {
    if (newEmail && !contactInfo.emails.includes(newEmail)) {
      setContactInfo({
        ...contactInfo,
        emails: [...contactInfo.emails, newEmail],
      })
      setNewEmail("")
      toast({
        title: "Email Added",
        description: "New email address has been added.",
      })
    }
  }

  const removeEmail = (email: string) => {
    if (contactInfo.emails.length > 1) {
      const updatedEmails = contactInfo.emails.filter((e) => e !== email)
      setContactInfo({
        ...contactInfo,
        emails: updatedEmails,
        activeEmail: contactInfo.activeEmail === email ? updatedEmails[0] : contactInfo.activeEmail,
      })
      toast({
        title: "Email Removed",
        description: "Email address has been removed.",
      })
    }
  }

  const addFormField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: "text",
      label: "New Field",
      placeholder: "Enter value",
      required: false,
    }
    setFormFields([...formFields, newField])
    toast({
      title: "Field Added",
      description: "New form field has been added.",
    })
  }

  const removeFormField = (fieldId: string) => {
    setFormFields(formFields.filter((field) => field.id !== fieldId))
    toast({
      title: "Field Removed",
      description: "Form field has been removed.",
    })
  }

  const updateFormField = (fieldId: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)))
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

  const renderContactPreview = () => (
    <div className="bg-gray-900 text-white p-8" style={getPreviewStyles()}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2">Office Address</h3>
          <p className="text-sm text-gray-300">{contactInfo.address}</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2">Phone Number</h3>
          <p className="text-sm text-gray-300">{contactInfo.phone}</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2">Email Address</h3>
          <p className="text-sm text-gray-300">{contactInfo.activeEmail}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-600">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p>Google Maps</p>
              <p className="text-sm">{contactInfo.mapLocation}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-green-400">Have Any Questions?</h2>
          <form className="space-y-4">
            {formFields.map((field) => (
              <div key={field.id}>
                <Label className="text-white">{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    placeholder={field.placeholder}
                    required={field.required}
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={4}
                  />
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                )}
              </div>
            ))}
            <Button className="bg-green-600 hover:bg-green-700 w-full">Submit</Button>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Page Management</h1>
          <p className="text-gray-600">Manage contact information, form fields, and page layout</p>
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
          <Tabs defaultValue="contact-info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contact-info">Contact Info</TabsTrigger>
              <TabsTrigger value="form-fields">Form Fields</TabsTrigger>
              <TabsTrigger value="map-settings">Map Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="contact-info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Office Address</Label>
                    <Textarea
                      id="address"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Email Addresses</Label>
                    <div className="space-y-2">
                      {contactInfo.emails.map((email, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={email} readOnly />
                          <Badge
                            variant={email === contactInfo.activeEmail ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setContactInfo({ ...contactInfo, activeEmail: email })}
                          >
                            {email === contactInfo.activeEmail ? "Active" : "Set Active"}
                          </Badge>
                          {contactInfo.emails.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEmail(email)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <Button onClick={addEmail}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="form-fields" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Form Fields</CardTitle>
                    <Button onClick={addFormField} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formFields.map((field) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{field.type}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFormField(field.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Field Type</Label>
                          <select
                            value={field.type}
                            onChange={(e) => updateFormField(field.id, { type: e.target.value as any })}
                            className="w-full h-8 px-2 border rounded text-sm"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="tel">Phone</option>
                            <option value="textarea">Textarea</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-xs">Label</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                            className="h-8"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Placeholder</Label>
                        <Input
                          value={field.placeholder}
                          onChange={(e) => updateFormField(field.id, { placeholder: e.target.value })}
                          className="h-8"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                        />
                        <Label className="text-xs">Required field</Label>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map-settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Map Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="mapLocation">Map Location</Label>
                    <Textarea
                      id="mapLocation"
                      value={contactInfo.mapLocation}
                      onChange={(e) => setContactInfo({ ...contactInfo, mapLocation: e.target.value })}
                      placeholder="Enter address for Google Maps embed"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">This address will be used to embed Google Maps</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">{renderContactPreview()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
