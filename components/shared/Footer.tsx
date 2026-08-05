import Link from "next/link"
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa"
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md"

const navigation = {
  quickLinks: [
    { name: "Services", href: "/services" },
    { name: "Technicians", href: "/technicians" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "AC Repair", href: "/services/ac-repair" },
    { name: "Plumbing", href: "/services/plumbing" },
    { name: "Electrical", href: "/services/electrical" },
    { name: "Home Cleaning", href: "/services/cleaning" },
  ],
  social: [
    { name: "Facebook", icon: FaFacebook, href: "#" },
    { name: "Twitter", icon: FaTwitter, href: "#" },
    { name: "Instagram", icon: FaInstagram, href: "#" },
    { name: "LinkedIn", icon: FaLinkedinIn, href: "#" },
    { name: "YouTube", icon: FaYoutube, href: "#" },
  ],
  contact: {
    email: "support@fixitnow.com",
    phone: "+880 1234 567890",
    address: "House 25, Road 10, Dhanmondi, Dhaka",
  },
}

export function Footer() {
  return (
    <footer className="ml-40 border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-foreground">
              FixItNow
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted home service platform. Connect with skilled
              technicians for AC repair, plumbing, electrical work, and more.
            </p>
            <div className="flex items-center gap-2">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-full bg-muted p-2 transition-colors hover:bg-primary/20"
                  aria-label={item.name}
                >
                  <item.icon className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navigation.quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Services
            </h3>
            <ul className="space-y-2">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MdLocationOn className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>{navigation.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone className="size-5 shrink-0 text-primary" />
                <span>{navigation.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <MdEmail className="size-5 shrink-0 text-primary" />
                <span>{navigation.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} FixItNow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
