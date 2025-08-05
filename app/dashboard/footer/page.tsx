"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Monitor, Tablet, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SocialMediaLink {
  id: string
  platform: string
  url: string
  icon: string
}

interface FooterLink {
  id: string
  title: string
  url: string
}

interface FooterSection {
  id: string
  title: string
  links: FooterLink[]
}

interface FooterConfig {
  logoUrl: string
  logoText: string
  description: string
  socialMedia: SocialMediaLink[]
  sections: FooterSection[]
  contactInfo: {
    address: string
    phone: string
    email: string
  }
  newsletter: {
    enabled: boolean
    title: string
    description: string
  }
  copyright: string
  paymentMethods: string[]
}

const initialFooterConfig: FooterConfig = {
  logoUrl: "/placeholder.svg?height=60&width=120",
  logoText: "Hajj & Umrah",
  description: "Sign up with your email address to receive news and updates",
  socialMedia: [
    { id: "1", platform: "Facebook", url: "https://facebook.com", icon: "facebook" },
    { id: "2", platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
    { id: "3", platform: "Instagram", url: "https://instagram.com", icon: "instagram" },
  ],
  sections: [
    {
      id: "1",
      title: "Quick Link",
      links: [
        { id: "1-1", title: "About Us", url: "/about" },
        { id: "1-2", title: "Services", url: "/services" },
        { id: "1-3", title: "Umrah Packages", url: "/packages" },
        { id: "1-4", title: "Privacy & Cookies Policy", url: "/privacy" },
        { id: "1-5", title: "Our Terms and Conditions", url: "/terms" },
        { id: "1-6", title: "FAQ", url: "/faq" },
        { id: "1-7", title: "Contact Us", url: "/contact" },
      ],
    },
  ],
  contactInfo: {
    address: "84 Kingsley Road, Hounslow, Middlesex, London TW3 1QA",
    phone: "020 3944 4671",
    email: "info@hajiandumrah.co.uk",
  },
  newsletter: {
    enabled: true,
    title: "Newsletter Signup",
    description: "Stay updated with our latest offers",
  },
  copyright: "Copyright © 2025. Hajj and Umrah",
  paymentMethods: ["visa", "mastercard", "discover"],
}

const socialPlatforms = [
  { value: "facebook", label: "Facebook", icon: "📘" },
  { value: "twitter", label: "Twitter", icon: "🐦" },
  { value: "instagram", label: "Instagram", icon: "📷" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "youtube", label: "YouTube", icon: "📺" },
  { value: "tiktok", label: "TikTok", icon: "🎵" },
]

export default function FooterPage() {
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(initialFooterConfig)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const { toast } = useToast()

  const addSocialMedia = () => {
    const newSocial: SocialMediaLink = {
      id: Date.now().toString(),
      platform: "Facebook",
      url: "",
      icon: "facebook",
    }

    setFooterConfig({
      ...footerConfig,
      socialMedia: [...footerConfig.socialMedia, newSocial],
    })

    toast({
      title: "Social Media Added",
      description: "New social media link has been added.",
    })
  }

  const removeSocialMedia = (socialId: string) => {
    setFooterConfig({
      ...footerConfig,
      socialMedia: footerConfig.socialMedia.filter((social) => social.id !== socialId),
    })

    toast({
      title: "Social Media Removed",
      description: "Social media link has been removed.",
    })
  }

  const updateSocialMedia = (socialId: string, updates: Partial<SocialMediaLink>) => {
    setFooterConfig({
      ...footerConfig,
      socialMedia: footerConfig.socialMedia.map((social) =>
        social.id === socialId ? { ...social, ...updates } : social,
      ),
    })
  }

  const addFooterSection = () => {
    const newSection: FooterSection = {
      id: Date.now().toString(),
      title: "New Section",
      links: [],
    }

    setFooterConfig({
      ...footerConfig,
      sections: [...footerConfig.sections, newSection],
    })

    toast({
      title: "Footer Section Added",
      description: "New footer section has been added.",
    })
  }

  const removeFooterSection = (sectionId: string) => {
    setFooterConfig({
      ...footerConfig,
      sections: footerConfig.sections.filter((section) => section.id !== sectionId),
    })

    toast({
      title: "Footer Section Removed",
      description: "Footer section has been removed.",
    })
  }

  const updateFooterSection = (sectionId: string, updates: Partial<FooterSection>) => {
    setFooterConfig({
      ...footerConfig,
      sections: footerConfig.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section,
      ),
    })
  }

  const addFooterLink = (sectionId: string) => {
    const newLink: FooterLink = {
      id: `${sectionId}-${Date.now()}`,
      title: "New Link",
      url: "/new-page",
    }

    setFooterConfig({
      ...footerConfig,
      sections: footerConfig.sections.map((section) =>
        section.id === sectionId ? { ...section, links: [...section.links, newLink] } : section,
      ),
    })
  }

  const removeFooterLink = (sectionId: string, linkId: string) => {
    setFooterConfig({
      ...footerConfig,
      sections: footerConfig.sections.map((section) =>
        section.id === sectionId ? { ...section, links: section.links.filter((link) => link.id !== linkId) } : section,
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

  const renderFooterPreview = () => (
    <div className="bg-green-800 text-white" style={getPreviewStyles()}>
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Newsletter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={footerConfig.logoUrl || "/placeholder.svg"} alt="Logo" className="h-10 w-auto" />
              <span className="font-bold text-lg">{footerConfig.logoText}</span>
            </div>

            {footerConfig.newsletter.enabled && (
              <div>
                <p className="text-sm mb-3">{footerConfig.description}</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Email Address *"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Button className="bg-green-600 hover:bg-green-700">SUBSCRIBE!</Button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <span>📞</span>
              <span>{footerConfig.contactInfo.phone}</span>
            </div>
          </div>

          {/* Footer Sections */}
          {footerConfig.sections.map((section) => (
            <div key={section.id}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} className="text-sm text-gray-300 hover:text-white">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Trading Address */}
          <div>
            <h3 className="font-semibold mb-4">Trading Address:</h3>
            <p className="text-sm text-gray-300 mb-4">{footerConfig.contactInfo.address}</p>

            <h4 className="font-semibold mb-2">Registered Address:</h4>
            <p className="text-sm text-gray-300">241 Mitcham Road, Tooting, London, SW17 9JQ.</p>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-semibold mb-4">We accept the following mode of Payment</h3>
            <div className="flex gap-2 mb-4">
              <div className="bg-white p-2 rounded">💳</div>
              <div className="bg-white p-2 rounded">💳</div>
              <div className="bg-white p-2 rounded">💳</div>
            </div>

            <p className="text-sm text-gray-300 mb-4">If you already have a booking with us</p>
            <Button className="bg-green-600 hover:bg-green-700">PAY HERE</Button>

            {/* Social Media */}
            <div className="flex gap-2 mt-4">
              {footerConfig.socialMedia.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600"
                  title={social.platform}
                >
                  {socialPlatforms.find((p) => p.value === social.icon)?.icon || "🔗"}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-green-900 px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>{footerConfig.copyright}</p>
          <p>Site by YOC</p>
        </div>
      </div>

      {/* Legal Text */}
      <div className="bg-green-700 px-6 py-4 text-xs text-gray-300">
        <p>
          Many of the flights and flight-inclusive holidays on this website are financially protected by the ATOL
          scheme. But ATOL protection does not apply to all holiday and travel services listed in this brochure/on this
          website. Please ask us to confirm what protection may apply to your booking. If you do not receive an ATOL
          Certificate but all the parts of your trip are not listed on it, those parts will not be ATOL protected. If
          you do receive an ATOL Certificate but all the parts of your trip are not listed on it, those parts will not
          be ATOL protected. Please see our booking conditions for information, or for more information about financial
          protection and the ATOL Certificate go to: www.atol.org.uk/ATOLCertificate.
        </p>
      </div>
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
          </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">{renderFooterPreview()}</div>
          </CardContent>
        </Card>

        {/* Footer Management Section */}
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Footer Management</h1>
            <p className="text-gray-600">
              Customize your website footer with links, social media, and contact information
            </p>
          </div>

          {/* Settings Panel */}
          <Tabs defaultValue="branding" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="branding" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Branding & Newsletter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="footerLogoUrl">Logo URL</Label>
                    <Input
                      id="footerLogoUrl"
                      value={footerConfig.logoUrl}
                      onChange={(e) => setFooterConfig({ ...footerConfig, logoUrl: e.target.value })}
                      placeholder="Enter logo URL"
                    />
                  </div>

                  <div>
                    <Label htmlFor="footerLogoText">Logo Text</Label>
                    <Input
                      id="footerLogoText"
                      value={footerConfig.logoText}
                      onChange={(e) => setFooterConfig({ ...footerConfig, logoText: e.target.value })}
                      placeholder="Enter logo text"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={footerConfig.description}
                      onChange={(e) => setFooterConfig({ ...footerConfig, description: e.target.value })}
                      placeholder="Enter footer description"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="newsletterEnabled"
                      checked={footerConfig.newsletter.enabled}
                      onChange={(e) =>
                        setFooterConfig({
                          ...footerConfig,
                          newsletter: { ...footerConfig.newsletter, enabled: e.target.checked },
                        })
                      }
                    />
                    <Label htmlFor="newsletterEnabled">Enable newsletter signup</Label>
                  </div>

                  <div>
                    <Label htmlFor="copyright">Copyright Text</Label>
                    <Input
                      id="copyright"
                      value={footerConfig.copyright}
                      onChange={(e) => setFooterConfig({ ...footerConfig, copyright: e.target.value })}
                      placeholder="Enter copyright text"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="links" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Footer Sections</CardTitle>
                    <Button onClick={addFooterSection} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {footerConfig.sections.map((section) => (
                    <div key={section.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Input
                          value={section.title}
                          onChange={(e) => updateFooterSection(section.id, { title: e.target.value })}
                          className="font-medium"
                          placeholder="Section title"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFooterSection(section.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Links</Label>
                          <Button size="sm" variant="outline" onClick={() => addFooterLink(section.id)}>
                            <Plus className="w-3 h-3 mr-1" />
                            Add Link
                          </Button>
                        </div>
                        {section.links.map((link) => (
                          <div key={link.id} className="flex gap-2">
                            <Input
                              value={link.title}
                              onChange={(e) => {
                                const updatedLinks = section.links.map((l) =>
                                  l.id === link.id ? { ...l, title: e.target.value } : l,
                                )
                                updateFooterSection(section.id, { links: updatedLinks })
                              }}
                              className="h-8"
                              placeholder="Link title"
                            />
                            <Input
                              value={link.url}
                              onChange={(e) => {
                                const updatedLinks = section.links.map((l) =>
                                  l.id === link.id ? { ...l, url: e.target.value } : l,
                                )
                                updateFooterSection(section.id, { links: updatedLinks })
                              }}
                              className="h-8"
                              placeholder="/url"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFooterLink(section.id, link.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Social Media Links</CardTitle>
                    <Button onClick={addSocialMedia} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Social
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {footerConfig.socialMedia.map((social) => (
                    <div key={social.id} className="flex gap-2 items-center">
                      <Select
                        value={social.icon}
                        onValueChange={(value) =>
                          updateSocialMedia(social.id, {
                            icon: value,
                            platform: socialPlatforms.find((p) => p.value === value)?.label || value,
                          })
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {socialPlatforms.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value}>
                              {platform.icon} {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={social.url}
                        onChange={(e) => updateSocialMedia(social.id, { url: e.target.value })}
                        placeholder="Enter social media URL"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSocialMedia(social.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contactAddress">Address</Label>
                    <Textarea
                      id="contactAddress"
                      value={footerConfig.contactInfo.address}
                      onChange={(e) =>
                        setFooterConfig({
                          ...footerConfig,
                          contactInfo: { ...footerConfig.contactInfo, address: e.target.value },
                        })
                      }
                      placeholder="Enter business address"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      value={footerConfig.contactInfo.phone}
                      onChange={(e) =>
                        setFooterConfig({
                          ...footerConfig,
                          contactInfo: { ...footerConfig.contactInfo, phone: e.target.value },
                        })
                      }
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input
                      id="contactEmail"
                      value={footerConfig.contactInfo.email}
                      onChange={(e) =>
                        setFooterConfig({
                          ...footerConfig,
                          contactInfo: { ...footerConfig.contactInfo, email: e.target.value },
                        })
                      }
                      placeholder="Enter email address"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}
