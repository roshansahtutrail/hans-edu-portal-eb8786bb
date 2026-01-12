import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryData {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const inquiry: InquiryData = await req.json();
    console.log("Received inquiry:", inquiry);

    // Insert the inquiry into the database
    const { data: insertedInquiry, error: insertError } = await supabaseAdmin
      .from("inquiries")
      .insert({
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        subject: inquiry.subject,
        message: inquiry.message,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting inquiry:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save inquiry" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Inquiry saved:", insertedInquiry);

    // Fetch all admin and super_admin emails
    const { data: adminRoles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["admin", "super_admin"]);

    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
    }

    const adminEmails: string[] = [];

    if (adminRoles && adminRoles.length > 0) {
      // Fetch profiles for admin users
      const userIds = adminRoles.map((r) => r.user_id);
      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from("profiles")
        .select("user_id, email")
        .in("user_id", userIds)
        .eq("is_active", true);

      if (profilesError) {
        console.error("Error fetching admin profiles:", profilesError);
      } else if (profiles) {
        adminEmails.push(...profiles.map((p) => p.email));
      }
    }

    console.log("Admin emails to notify:", adminEmails);

    // Send email notification to admins
    if (adminEmails.length > 0) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Inquiry Received</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${inquiry.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
                  <a href="mailto:${inquiry.email}" style="color: #667eea;">${inquiry.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
                  ${inquiry.phone ? `<a href="tel:${inquiry.phone}" style="color: #667eea;">${inquiry.phone}</a>` : "Not provided"}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Subject:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${inquiry.subject}</td>
              </tr>
            </table>
            <div style="margin-top: 20px;">
              <h3 style="color: #374151; margin-bottom: 10px;">Message:</h3>
              <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; color: #6b7280; line-height: 1.6;">
                ${inquiry.message.replace(/\n/g, "<br>")}
              </div>
            </div>
          </div>
          <div style="padding: 20px; background: #1f2937; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              Hans Educational Institute - Admin Notification
            </p>
          </div>
        </div>
      `;

      try {
        const emailResponse = await resend.emails.send({
          from: "Hans Educational <onboarding@resend.dev>",
          to: adminEmails,
          subject: `New Inquiry from ${inquiry.name}`,
          html: emailHtml,
        });
        console.log("Email sent successfully:", emailResponse);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the request if email fails - inquiry is already saved
      }
    }

    return new Response(
      JSON.stringify({ success: true, inquiry: insertedInquiry }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-inquiry-alert:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
