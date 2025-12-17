import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StatusNotificationRequest {
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'cancelled';
  reservationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      guestName, 
      guestEmail, 
      roomName, 
      checkIn, 
      checkOut, 
      status,
      reservationId 
    }: StatusNotificationRequest = await req.json();

    console.log(`Sending ${status} notification to:`, guestEmail);

    const isConfirmed = status === 'confirmed';
    const subject = isConfirmed 
      ? "Your Reservation at Al Qasr Hotel is Confirmed!" 
      : "Your Reservation at Al Qasr Hotel has been Cancelled";
    
    const statusColor = isConfirmed ? '#22C55E' : '#EF4444';
    const statusText = isConfirmed ? 'CONFIRMED' : 'CANCELLED';
    const message = isConfirmed
      ? "Great news! Your reservation has been confirmed. We look forward to welcoming you to Al Qasr."
      : "We regret to inform you that your reservation has been cancelled. If you have any questions, please contact our team.";

    const emailResponse = await resend.emails.send({
      from: "Al Qasr Hotel <onboarding@resend.dev>",
      to: [guestEmail],
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reservation ${statusText}</title>
        </head>
        <body style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #FAF9F7; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #1A1F16 0%, #2A2F26 100%); padding: 40px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #C9A962; margin: 0; font-size: 32px; font-weight: normal;">Al Qasr</h1>
            <p style="color: #FFFFF5; margin: 8px 0 0; font-size: 14px; letter-spacing: 2px;">LUXURY HOTEL & SPA</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="display: inline-block; background: ${statusColor}; color: white; padding: 8px 24px; border-radius: 4px; font-size: 14px; font-weight: bold; letter-spacing: 1px;">
                ${statusText}
              </span>
            </div>
            
            <h2 style="color: #1A1F16; margin: 0 0 24px; font-weight: normal;">Dear ${guestName},</h2>
            
            <p style="color: #4A4A4A; line-height: 1.8;">
              ${message}
            </p>
            
            <div style="background: #FAF9F7; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid ${statusColor};">
              <h3 style="color: #1A1F16; margin: 0 0 16px; font-size: 18px;">Reservation Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6B6B6B;">Confirmation #</td>
                  <td style="padding: 8px 0; color: #1A1F16; text-align: right; font-weight: bold;">${reservationId.slice(0, 8).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B6B6B;">Accommodation</td>
                  <td style="padding: 8px 0; color: #1A1F16; text-align: right;">${roomName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B6B6B;">Check-in</td>
                  <td style="padding: 8px 0; color: #1A1F16; text-align: right;">${checkIn}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B6B6B;">Check-out</td>
                  <td style="padding: 8px 0; color: #1A1F16; text-align: right;">${checkOut}</td>
                </tr>
              </table>
            </div>
            
            ${isConfirmed ? `
            <p style="color: #4A4A4A; line-height: 1.8;">
              Our concierge team will reach out to you shortly to finalize any special arrangements for your stay.
            </p>
            ` : `
            <p style="color: #4A4A4A; line-height: 1.8;">
              If you did not request this cancellation or have any concerns, please contact us immediately.
            </p>
            `}
            
            <p style="color: #1A1F16; margin-top: 32px;">
              ${isConfirmed ? 'We look forward to welcoming you,' : 'We hope to serve you in the future,'}<br>
              <strong>The Al Qasr Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 24px; color: #6B6B6B; font-size: 12px;">
            <p>Al Qasr Hotel & Spa</p>
            <p>The Palm Jumeirah, Dubai, UAE</p>
            <p>+971 4 999 8888 | reservations@alqasr.com</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Status notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-status-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
