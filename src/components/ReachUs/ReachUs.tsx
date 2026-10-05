import React from "react";
import { MapPinIcon, PhoneIcon, MailIcon } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";

function ReachUs({ title, description, t }: { title: string; description: string, t: any }) {
  return (
    <section className="reach-us">
      <div className="reach-us max-w-7xl mx-auto px-6 py-16 space-y-10">
        <div className="head space-y-2">
          <div className="title">
            <h3 className="text-xl md:text-2xl font-[800] font-title">
              {title}
            </h3>
          </div>

          <div className="desc">
            <p className=" text-lg font-semibold">{description}</p>
          </div>
        </div>

        <div className="content">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: (
                  <MapPinIcon className="w-14 h-14 px-3 fill-white text-foreground bg-black rounded-sm" />
                ),
                title: t("address"),
                description:
                  "Middle of Commercial Street, behind Al-Kahki Clothes, Damiette, Egypt, 34511",
                href: "https://maps.app.goo.gl/1mUgKzqGcJD6ExGJ6",
              },
              {
                icon: (
                  <PhoneIcon className="w-14 h-14 px-3 fill-white text-foreground bg-black rounded-sm" />
                ),
                title: t("phone"),
                description: "01221661733",
              },
              {
                icon: (
                  <MailIcon className="w-14 h-14 px-3 fill-white text-foreground bg-black rounded-sm" />
                ),
                title: t("email"),
                description: "sales@furnmasr.com",
              },
            ].map((item, index) => {
              const content = (
                <>
                  {item.icon}
                  <div className="content space-y-2">
                    <p className="font-bold text-md capitalize">{item.title}</p>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </>
              );

              return (
                <li
                  key={index}
                  className="address flex items-center gap-4 border border-border p-4 rounded-sm"
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 w-full hover:text-primary transition-colors"
                    >
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </li>
              );
            })}

            <li className="socail flex justify-between items-center gap-4 border border-border p-4 rounded-sm">
              <p className="text-lg font-bold capitalize">
                {t("or_on_our_social_media")}
              </p>
              <ul className="flex items-center gap-2">
                <li>
                  <Link
                    href="https://www.facebook.com/furnmasr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook className="w-8 h-8 text-foreground hover:text-primary transition-colors" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.instagram.com/furnmasr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon className="w-8 h-8 text-foreground hover:text-primary transition-colors" />
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ReachUs;
