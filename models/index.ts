import sequelize from "@/lib/database"
import User from "./User"
import Page from "./Page"
import Snippet from "./Snippet"
import Form from "./Form"
import FormSubmission from "./FormSubmission"
import Package from "./Package"
import ContactInfo from "./ContactInfo"
import HeaderConfig from "./HeaderConfig"
import FooterConfig from "./FooterConfig"
import FlyingPartner from "./FlyingPartner"
import Analytics from "./Analytics"

// Define associations
Form.hasMany(FormSubmission, { foreignKey: "formId", as: "submissions" })
FormSubmission.belongsTo(Form, { foreignKey: "formId", as: "form" })

// Initialize database and create tables
export const initDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connection established successfully.")

    // Sync all models - this will create tables and columns automatically
    // { force: false } means don't drop existing tables
    // { alter: true } means modify existing tables to match models
    await sequelize.sync({ alter: true, force: false })
    console.log("Database synchronized successfully. All tables and columns created/updated.")

    // Create default admin user if not exists
    const adminExists = await User.findOne({ where: { email: "admin@hajiandumrah.co.uk" } })
    if (!adminExists) {
      const bcrypt = require("bcryptjs")
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await User.create({
        firstName: "Usman",
        lastName: "Admin",
        email: "admin@hajiandumrah.co.uk",
        passwordHash: hashedPassword,
        role: "superadmin",
      })
      console.log("Default admin user created.")
    }

    // Create default contact info if not exists
    const contactExists = await ContactInfo.findOne()
    if (!contactExists) {
      await ContactInfo.create({
        address: "84 Kingsley Road, Hounslow, Middlesex, London TW3 1QA",
        phone: "020 3944 4671",
        emails: ["info@hajiandumrah.co.uk", "sales@hajiandumrah.co.uk", "support@hajiandumrah.co.uk"],
        activeEmail: "info@hajiandumrah.co.uk",
        mapLocation: "84 Kingsley Road, Hounslow, Middlesex, London TW3 1QA",
        formFields: [{ id: "1", type: "text", label: "First Name", placeholder: "First Name", required: true }],
      })
      console.log("Default contact info created.")
    }

    // Create default header config if not exists
    const headerExists = await HeaderConfig.findOne()
    if (!headerExists) {
      await HeaderConfig.create({
        logoUrl: "/placeholder.svg?height=60&width=120",
        logoText: "Hajj & Umrah",
        navigationItems: [
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
        mobileConfig: { style: "hamburger" },
        contactInfo: { phone: "020 3944 4671", showPhone: true },
      })
      console.log("Default header config created.")
    }

    // Create default footer config if not exists
    const footerExists = await FooterConfig.findOne()
    if (!footerExists) {
      await FooterConfig.create({
        logoUrl: "/placeholder.svg?height=60&width=120",
        logoText: "Hajj & Umrah",
        description: "Sign up with your email address to receive news and updates",
        socialMediaLinks: [
          { id: "1", platform: "Facebook", url: "https://facebook.com", icon: "facebook" },
          { id: "2", platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
          { id: "3", platform: "Instagram", url: "https://instagram.com", icon: "instagram" },
        ],
        footerLinks: [
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
        copyrightText: "Copyright © 2025. Hajj and Umrah",
        paymentMethods: ["visa", "mastercard", "discover"],
      })
      console.log("Default footer config created.")
    }

    // Create default flying partners if not exists
    const flyingPartnersExists = await FlyingPartner.findOne()
    if (!flyingPartnersExists) {
      await FlyingPartner.create({
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
      })
      console.log("Default flying partners created.")
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error)
    throw error
  }
}

export {
  sequelize,
  User,
  Page,
  Snippet,
  Form,
  FormSubmission,
  Package,
  ContactInfo,
  HeaderConfig,
  FooterConfig,
  FlyingPartner,
  Analytics,
}
