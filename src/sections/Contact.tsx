import { useState, useRef } from "react";
import {
  Phone,
  Mail,
  Paperclip,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { SectionHeader, useInView } from "../components/Shared";
import emailjs from "@emailjs/browser";

// Initialize EmailJS with your public key
emailjs.init("zznc0p7oCdQffPuGn"); // Your EmailJS public key

interface FormState {
  fullName: string;
  email: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [fileName, setFileName] = useState<string>("");
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const fileRef = useRef<HTMLInputElement>(null);
  const mapView = useInView();
  const detailsView = useInView();
  const formView = useInView();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.fullName || form.fullName.length < 2)
      newErrors.fullName = "Name must be at least 2 characters";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Please enter a valid email";
    if (!form.message || form.message.length < 10)
      newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof FormState) => {
    const newErrors = { ...errors };
    if (field === "fullName" && form.fullName && form.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    } else if (field === "fullName") {
      delete newErrors.fullName;
    }
    if (
      field === "email" &&
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Please enter a valid email";
    } else if (field === "email") {
      delete newErrors.email;
    }
    if (field === "message" && form.message && form.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (field === "message") {
      delete newErrors.message;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitState("loading");

    try {
      console.log("Sending emails...", {
        name: form.fullName,
        email: form.email,
        message: form.message,
        subject: `New Contact Form Submission from ${form.fullName}`,
        reply_to: form.email,
        file_attachment: fileName || "No attachment",
      });

      // Send email to you with the actual message
      const emailToYou = await emailjs.send(
        "service_r6cl3va", // Your EmailJS service ID
        "template_o1c7a2h", // Template for sending to you
        {
          name: form.fullName,
          email: form.email,
          message: form.message,
          subject: `New Contact Form Submission from ${form.fullName}`,
          reply_to: form.email,
          file_attachment: fileName || "No attachment",
        },
      );

      console.log("Email to you response:", emailToYou);

      // Send auto-reply to sender
      const autoReply = await emailjs.send(
        "service_r6cl3va", // Same EmailJS service ID
        "template_a74vlpm", // Template for auto-reply to sender
        {
          name: form.fullName,
          email: form.email,
          message: form.message,
          subject: `Re: Your message to Khushal Malhotra`,
          reply_to: "khushalmalhotra775@gmail.com",
        },
      );

      console.log("Auto-reply response:", autoReply);

      // Check if both emails were sent successfully
      const bothSuccessful =
        (emailToYou.status === 200 || emailToYou.text === "OK") &&
        (autoReply.status === 200 || autoReply.text === "OK");

      if (bothSuccessful) {
        setSubmitState("success");
        setForm({ fullName: "", email: "", message: "" });
        setFileName("");
        setTimeout(() => setSubmitState("idle"), 3000);
      } else {
        // Handle different error scenarios
        let errorMessage = "Failed to send email. Please try again.";

        if (emailToYou.status !== 200 && emailToYou.text !== "OK") {
          errorMessage =
            "Failed to send message to recipient. Please try again.";
        } else if (autoReply.status !== 200 && autoReply.text !== "OK") {
          errorMessage = "Message sent successfully, but auto-reply failed.";
        }

        setSubmitState("error");
        console.error("EmailJS Error Details:", {
          emailToYou: emailToYou,
          autoReply: autoReply,
          error: errorMessage,
        });
        setTimeout(() => setSubmitState("idle"), 3000);
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      setSubmitState("error");
      setTimeout(() => setSubmitState("idle"), 3000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed");
        return;
      }
      if (file.size > 1024 * 1024) {
        alert("File must be under 1 MB");
        return;
      }
      setFileName(file.name);
    }
  };

  const isFormValid =
    form.fullName.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.message.length >= 10;

  return (
    <section
      id="contact"
      className="space-y-6"
      aria-label="Contact information and form"
    >
      <SectionHeader title="Let's Connect" isH1 icon={null} />

      {/* Google Map */}
      <div
        ref={mapView.ref}
        className={`rounded-card overflow-hidden border border-border-default/40 transition-all duration-500
          ${mapView.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <iframe
          title="Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923425576!2d77.06889725832961!3d28.527280343354425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1708269584766!5m2!1sen!2sin&style=element:geometry|color:0x1d2c4d&style=element:labels.text.fill|color:0x8ec3b9"
          className="w-full h-[220px] sm:h-[260px] border-0 grayscale-[30%] contrast-[1.1]"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Contact Details Card */}
      <div
        ref={detailsView.ref}
        className={`bg-bg-secondary rounded-card border border-border-default/40 p-5 sm:p-6 transition-all duration-500 delay-100
          ${detailsView.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-text-primary mb-4">
              Contact Details
            </h3>
            <div className="space-y-4">
              {/* Mobile */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-btn bg-bg-elevated flex items-center justify-center flex-shrink-0">
                  <Phone size={15} className="text-accent-primary" />
                </div>
                <div>
                  <span className="text-[12px] font-bold text-text-primary block">
                    Mobile
                  </span>
                  <a
                    href="tel:+919990633775"
                    className="text-[14px] text-text-secondary hover:text-accent-primary transition-colors"
                  >
                    +91 99906 33775
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-btn bg-bg-elevated flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-accent-primary" />
                </div>
                <div>
                  <span className="text-[12px] font-bold text-text-primary block">
                    Email
                  </span>
                  <a
                    href="mailto:khushalmalhotra775@gmail.com"
                    className="text-[14px] text-text-secondary hover:text-accent-primary transition-colors break-all"
                  >
                    khushalmalhotra775@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="hidden sm:block w-[100px] h-[100px] rounded-btn overflow-hidden bg-white p-1 flex-shrink-0">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MECARD:N:Malhotra,Khushal;TEL:+919990633775;EMAIL:khushalmalhotra775@gmail.com;;"
              alt="Contact QR Code"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Contact Form Card */}
      <div
        ref={formView.ref}
        className={`bg-bg-secondary rounded-card border border-border-default/40 p-5 sm:p-6 transition-all duration-500 delay-200
          ${formView.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <h3 className="text-[18px] font-bold text-text-primary mb-5">
          Contact Form
        </h3>

        {submitState === "success" && (
          <div className="flex items-center gap-2 bg-success/10 border border-success/30 rounded-btn p-3 mb-4">
            <CheckCircle size={18} className="text-success" />
            <span className="text-[14px] text-success">
              Message sent successfully! I'll get back to you soon.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="sr-only">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
                onBlur={() => handleBlur("fullName")}
                className={`w-full bg-bg-elevated border rounded-btn px-4 py-3 text-[14px] text-text-primary
                  placeholder:text-text-muted outline-none transition-all duration-200
                  ${errors.fullName ? "border-danger" : "border-border-default focus:border-accent-primary focus:shadow-input-focus"}`}
              />
              {errors.fullName && (
                <p className="flex items-center gap-1 mt-1 text-[12px] text-danger">
                  <AlertCircle size={12} /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                onBlur={() => handleBlur("email")}
                className={`w-full bg-bg-elevated border rounded-btn px-4 py-3 text-[14px] text-text-primary
                  placeholder:text-text-muted outline-none transition-all duration-200
                  ${errors.email ? "border-danger" : "border-border-default focus:border-accent-primary focus:shadow-input-focus"}`}
              />
              {errors.email && (
                <p className="flex items-center gap-1 mt-1 text-[12px] text-danger">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="sr-only">
              Your Message
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Your Message"
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              onBlur={() => handleBlur("message")}
              className={`w-full bg-bg-elevated border rounded-btn px-4 py-3 text-[14px] text-text-primary
                placeholder:text-text-muted outline-none transition-all duration-200 resize-none
                ${errors.message ? "border-danger" : "border-border-default focus:border-accent-primary focus:shadow-input-focus"}`}
            />
            {errors.message && (
              <p className="flex items-center gap-1 mt-1 text-[12px] text-danger">
                <AlertCircle size={12} /> {errors.message}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdfAttach"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full bg-bg-elevated border border-border-default rounded-btn px-4 py-3 text-[14px]
                text-accent-primary hover:border-accent-primary/50 transition-all duration-200 
                flex items-center justify-center gap-2"
            >
              <Paperclip size={15} />
              {fileName || "Attach PDF (Optional)"}
            </button>
            <p className="text-[11px] text-text-muted mt-1.5 text-center">
              Only PDF files up to 1 MB
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || submitState === "loading"}
            className="w-full bg-accent-primary hover:bg-accent-light text-bg-primary font-semibold
              rounded-btn py-3 text-[14px] transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent-primary
              flex items-center justify-center gap-2"
          >
            {submitState === "loading" ? (
              <>
                <div className="w-4 h-4 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={15} />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
